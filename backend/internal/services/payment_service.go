package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/huy1235588/fashion-e-commerce/internal/models"
	"github.com/huy1235588/fashion-e-commerce/internal/repositories"
	"github.com/huy1235588/fashion-e-commerce/internal/utils"
	"gorm.io/gorm"
)

type InitiatePaymentRequest struct {
	OrderID uint   `json:"order_id" binding:"required"`
	IPAddr  string `json:"ip_addr"`
}

type PaymentService interface {
	InitiatePayment(userID uint, req InitiatePaymentRequest) (string, error)
	ProcessVNPayCallback(queryParams map[string]string) error
	ProcessMoMoCallback(params map[string]interface{}) error
	ConfirmCODPayment(orderID uint) error
	GetPaymentByOrderID(orderID uint) (*models.Payment, error)
}

type paymentService struct {
	paymentRepo repositories.PaymentRepository
	orderRepo   repositories.OrderRepository
	vnpayHelper *utils.VNPayHelper
	momoHelper  *utils.MoMoHelper
	db          *gorm.DB
}

func NewPaymentService(
	paymentRepo repositories.PaymentRepository,
	orderRepo repositories.OrderRepository,
	vnpayHelper *utils.VNPayHelper,
	momoHelper *utils.MoMoHelper,
	db *gorm.DB,
) PaymentService {
	return &paymentService{
		paymentRepo: paymentRepo,
		orderRepo:   orderRepo,
		vnpayHelper: vnpayHelper,
		momoHelper:  momoHelper,
		db:          db,
	}
}

func (s *paymentService) InitiatePayment(userID uint, req InitiatePaymentRequest) (string, error) {
	// Get order
	order, err := s.orderRepo.FindByID(req.OrderID)
	if err != nil {
		return "", errors.New("order not found")
	}

	// Verify ownership
	if order.UserID != userID {
		return "", errors.New("unauthorized access to order")
	}

	// Check if order is already paid
	if order.PaymentStatus == models.PaymentStatusPaid {
		return "", errors.New("order is already paid")
	}

	// Check if order is cancelled
	if order.Status == models.OrderStatusCancelled {
		return "", errors.New("cannot pay for cancelled order")
	}

	// Create or update payment record
	payment, err := s.paymentRepo.FindByOrderID(order.ID)
	if err != nil {
		// Create new payment
		payment = &models.Payment{
			OrderID:       order.ID,
			PaymentMethod: order.PaymentMethod,
			PaymentStatus: models.PaymentStatusPending,
			Amount:        order.TotalAmount,
		}
		if err := s.paymentRepo.Create(payment); err != nil {
			return "", err
		}
	}

	// Generate payment URL based on method
	switch order.PaymentMethod {
	case models.PaymentMethodVNPay:
		return s.generateVNPayURL(order, req.IPAddr)
	case models.PaymentMethodMoMo:
		return s.generateMoMoURL(order)
	case models.PaymentMethodCOD:
		// COD doesn't need payment URL
		return "", nil
	default:
		return "", errors.New("invalid payment method")
	}
}

func (s *paymentService) generateVNPayURL(order *models.Order, ipAddr string) (string, error) {
	orderInfo := fmt.Sprintf("Thanh toán đơn hàng %s", order.OrderCode)
	amount := int64(order.TotalAmount)

	return s.vnpayHelper.GeneratePaymentURL(order.OrderCode, amount, orderInfo, ipAddr)
}

func (s *paymentService) generateMoMoURL(order *models.Order) (string, error) {
	// MoMo requires API call to generate payment URL
	// For now, return placeholder
	return "", errors.New("MoMo integration not fully implemented")
}

func (s *paymentService) ProcessVNPayCallback(queryParams map[string]string) error {
	// Convert to url.Values for verification
	values := make(map[string][]string)
	for k, v := range queryParams {
		values[k] = []string{v}
	}

	// Verify signature
	if !s.vnpayHelper.VerifyCallback(values) {
		return errors.New("invalid signature")
	}

	// Get transaction info
	orderCode := queryParams["vnp_TxnRef"]
	responseCode := queryParams["vnp_ResponseCode"]
	transactionID := queryParams["vnp_TransactionNo"]

	// Find order by code
	order, err := s.orderRepo.FindByOrderCode(orderCode)
	if err != nil {
		return errors.New("order not found")
	}

	// Get payment
	payment, err := s.paymentRepo.FindByOrderID(order.ID)
	if err != nil {
		return errors.New("payment not found")
	}

	// Transaction to update payment and order
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Update payment
		now := time.Now()
		payment.TransactionID = transactionID
		responseJSON, _ := json.Marshal(queryParams)
		payment.GatewayResponse = string(responseJSON)

		if responseCode == "00" {
			// Payment successful
			payment.PaymentStatus = models.PaymentStatusPaid
			payment.PaidAt = &now

			// Update order
			if err := s.orderRepo.UpdatePaymentStatus(order.ID, models.PaymentStatusPaid); err != nil {
				return err
			}

			// Update order status to processing
			if order.Status == models.OrderStatusPending {
				if err := s.orderRepo.UpdateStatus(order.ID, models.OrderStatusProcessing); err != nil {
					return err
				}
			}
		} else {
			// Payment failed
			payment.PaymentStatus = models.PaymentStatusFailed
		}

		return s.paymentRepo.Update(payment)
	})
}

func (s *paymentService) ProcessMoMoCallback(params map[string]interface{}) error {
	signature, ok := params["signature"].(string)
	if !ok {
		return errors.New("missing signature")
	}

	// Verify signature
	if !s.momoHelper.VerifyIPNSignature(params, signature) {
		return errors.New("invalid signature")
	}

	// Get transaction info
	orderID, _ := params["orderId"].(string)
	resultCode, _ := params["resultCode"].(float64)
	transID, _ := params["transId"].(string)

	// Find order by code
	order, err := s.orderRepo.FindByOrderCode(orderID)
	if err != nil {
		return errors.New("order not found")
	}

	// Get payment
	payment, err := s.paymentRepo.FindByOrderID(order.ID)
	if err != nil {
		return errors.New("payment not found")
	}

	// Transaction to update payment and order
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Update payment
		now := time.Now()
		payment.TransactionID = fmt.Sprintf("%v", transID)
		responseJSON, _ := json.Marshal(params)
		payment.GatewayResponse = string(responseJSON)

		if resultCode == 0 {
			// Payment successful
			payment.PaymentStatus = models.PaymentStatusPaid
			payment.PaidAt = &now

			// Update order
			if err := s.orderRepo.UpdatePaymentStatus(order.ID, models.PaymentStatusPaid); err != nil {
				return err
			}

			// Update order status to processing
			if order.Status == models.OrderStatusPending {
				if err := s.orderRepo.UpdateStatus(order.ID, models.OrderStatusProcessing); err != nil {
					return err
				}
			}
		} else {
			// Payment failed
			payment.PaymentStatus = models.PaymentStatusFailed
		}

		return s.paymentRepo.Update(payment)
	})
}

func (s *paymentService) ConfirmCODPayment(orderID uint) error {
	// Get order
	order, err := s.orderRepo.FindByID(orderID)
	if err != nil {
		return errors.New("order not found")
	}

	// Verify COD payment method
	if order.PaymentMethod != models.PaymentMethodCOD {
		return errors.New("order is not COD payment")
	}

	// Get or create payment
	payment, err := s.paymentRepo.FindByOrderID(orderID)
	if err != nil {
		// Create payment record
		payment = &models.Payment{
			OrderID:       orderID,
			PaymentMethod: models.PaymentMethodCOD,
			PaymentStatus: models.PaymentStatusPending,
			Amount:        order.TotalAmount,
			TransactionID: uuid.New().String(),
		}
		return s.paymentRepo.Create(payment)
	}

	// COD payment is confirmed when order is delivered
	if order.Status == models.OrderStatusDelivered && payment.PaymentStatus == models.PaymentStatusPending {
		now := time.Now()
		payment.PaymentStatus = models.PaymentStatusPaid
		payment.PaidAt = &now

		// Update both payment and order
		return s.db.Transaction(func(tx *gorm.DB) error {
			if err := s.paymentRepo.Update(payment); err != nil {
				return err
			}
			return s.orderRepo.UpdatePaymentStatus(orderID, models.PaymentStatusPaid)
		})
	}

	return nil
}

func (s *paymentService) GetPaymentByOrderID(orderID uint) (*models.Payment, error) {
	return s.paymentRepo.FindByOrderID(orderID)
}
