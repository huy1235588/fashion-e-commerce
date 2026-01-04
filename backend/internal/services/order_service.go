package services

import (
	"errors"
	"fmt"

	"github.com/huy1235588/fashion-e-commerce/internal/models"
	"github.com/huy1235588/fashion-e-commerce/internal/repositories"
	"github.com/huy1235588/fashion-e-commerce/internal/utils"
	"gorm.io/gorm"
)

type CreateOrderRequest struct {
	AddressID     uint                  `json:"address_id" binding:"required"`
	PaymentMethod models.PaymentMethod  `json:"payment_method" binding:"required"`
	Note          string                `json:"note"`
}

type OrderService interface {
	CreateFromCart(userID uint, req CreateOrderRequest) (*models.Order, error)
	GetOrderByID(id uint, userID uint) (*models.Order, error)
	GetOrderByCode(orderCode string, userID uint) (*models.Order, error)
	GetUserOrders(userID uint, limit, offset int) ([]models.Order, int64, error)
	GetAllOrders(filters map[string]interface{}, limit, offset int) ([]models.Order, int64, error)
	UpdateOrderStatus(id uint, status models.OrderStatus) error
	CancelOrder(id uint, userID uint, reason string) error
	ValidateStatusTransition(currentStatus, newStatus models.OrderStatus) error
}

type orderService struct {
	orderRepo    repositories.OrderRepository
	cartRepo     repositories.CartRepository
	addressRepo  repositories.AddressRepository
	productRepo  repositories.ProductRepository
	db           *gorm.DB
	emailService *utils.EmailService
}

func NewOrderService(
	orderRepo repositories.OrderRepository,
	cartRepo repositories.CartRepository,
	addressRepo repositories.AddressRepository,
	productRepo repositories.ProductRepository,
	db *gorm.DB,
	emailService *utils.EmailService,
) OrderService {
	return &orderService{
		orderRepo:    orderRepo,
		cartRepo:     cartRepo,
		addressRepo:  addressRepo,
		productRepo:  productRepo,
		db:           db,
		emailService: emailService,
	}
}

func (s *orderService) CreateFromCart(userID uint, req CreateOrderRequest) (*models.Order, error) {
	// Validate payment method
	validPaymentMethods := map[models.PaymentMethod]bool{
		models.PaymentMethodCOD:   true,
		models.PaymentMethodVNPay: true,
		models.PaymentMethodMoMo:  true,
	}
	if !validPaymentMethods[req.PaymentMethod] {
		return nil, errors.New("invalid payment method")
	}

	// Get user's cart
	cart, err := s.cartRepo.GetByUserID(userID)
	if err != nil {
		return nil, errors.New("cart not found")
	}

	if len(cart.Items) == 0 {
		return nil, errors.New("cart is empty")
	}

	// Get shipping address
	address, err := s.addressRepo.FindByID(req.AddressID)
	if err != nil {
		return nil, errors.New("address not found")
	}

	// Verify address belongs to user
	if address.UserID != userID {
		return nil, errors.New("unauthorized access to address")
	}

	// Start transaction
	var order *models.Order
	err = s.db.Transaction(func(tx *gorm.DB) error {
		// Validate stock and prepare order items
		orderItems := make([]models.OrderItem, 0, len(cart.Items))
		var subtotal float64

		for _, cartItem := range cart.Items {
			// Get product with variant
			product, err := s.productRepo.FindByID(cartItem.ProductID)
			if err != nil {
				return fmt.Errorf("product %d not found", cartItem.ProductID)
			}

			// Check stock
			var availableStock int
			var price float64
			variantName := ""

			// Find variant (always required)
			var variant *models.ProductVariant
			for i := range product.Variants {
				if product.Variants[i].ID == cartItem.VariantID {
					variant = &product.Variants[i]
					break
				}
			}

			if variant == nil {
				return fmt.Errorf("variant %d not found for product %s", cartItem.VariantID, product.Name)
			}

			availableStock = variant.StockQuantity
			price = product.Price
			variantName = variant.Size

			// Check if enough stock
			if availableStock < cartItem.Quantity {
				return fmt.Errorf("insufficient stock for product %s", product.Name)
			}

			// Deduct stock from variant
			err = tx.Model(&models.ProductVariant{}).
				Where("id = ?", cartItem.VariantID).
				UpdateColumn("stock_quantity", gorm.Expr("stock_quantity - ?", cartItem.Quantity)).
				Error

			if err != nil {
				return fmt.Errorf("failed to update stock for product %s", product.Name)
			}

			// Create order item
			itemSubtotal := price * float64(cartItem.Quantity)
			variantIDPtr := &cartItem.VariantID
			orderItem := models.OrderItem{
				ProductID:   cartItem.ProductID,
				VariantID:   variantIDPtr,
				ProductName: product.Name,
				VariantName: variantName,
				Price:       price,
				Quantity:    cartItem.Quantity,
				Subtotal:    itemSubtotal,
			}

			orderItems = append(orderItems, orderItem)
			subtotal += itemSubtotal
		}

		// Calculate shipping fee (simple fixed rate for now)
		shippingFee := 30000.0 // 30,000 VND
		totalAmount := subtotal + shippingFee

		// Generate order code
		orderCode := utils.GenerateOrderCode()

		// Create order
		order = &models.Order{
			OrderCode:             orderCode,
			UserID:                userID,
			Status:                models.OrderStatusPending,
			PaymentMethod:         req.PaymentMethod,
			PaymentStatus:         models.PaymentStatusPending,
			SubtotalAmount:        subtotal,
			ShippingFee:           shippingFee,
			TotalAmount:           totalAmount,
			Note:                  req.Note,
			ShippingFullName:      address.FullName,
			ShippingPhone:         address.Phone,
			ShippingProvince:      address.Province,
			ShippingDistrict:      address.District,
			ShippingWard:          address.Ward,
			ShippingDetailAddress: address.DetailAddress,
			OrderItems:            orderItems,
		}

		if err := tx.Create(order).Error; err != nil {
			return err
		}

		// Clear cart
		if err := tx.Where("cart_id = ?", cart.ID).Delete(&models.CartItem{}).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	// Reload order with relations
	createdOrder, err := s.orderRepo.FindByID(order.ID)
	if err != nil {
		return nil, err
	}

	// Send confirmation email (best-effort)
	if s.emailService != nil {
		if err := s.emailService.SendOrderConfirmationEmail(createdOrder); err != nil {
			fmt.Printf("Failed to send order confirmation email for order %s: %v\n", createdOrder.OrderCode, err)
		}
	}

	return createdOrder, nil
}

func (s *orderService) GetOrderByID(id uint, userID uint) (*models.Order, error) {
	order, err := s.orderRepo.FindByID(id)
	if err != nil {
		return nil, err
	}

	// Verify ownership (unless admin - will be handled by handler)
	if order.UserID != userID {
		return nil, errors.New("unauthorized access to order")
	}

	return order, nil
}

func (s *orderService) GetOrderByCode(orderCode string, userID uint) (*models.Order, error) {
	order, err := s.orderRepo.FindByOrderCode(orderCode)
	if err != nil {
		return nil, err
	}

	// Verify ownership
	if order.UserID != userID {
		return nil, errors.New("unauthorized access to order")
	}

	return order, nil
}

func (s *orderService) GetUserOrders(userID uint, limit, offset int) ([]models.Order, int64, error) {
	return s.orderRepo.FindByUserID(userID, limit, offset)
}

func (s *orderService) GetAllOrders(filters map[string]interface{}, limit, offset int) ([]models.Order, int64, error) {
	return s.orderRepo.List(filters, limit, offset)
}

func (s *orderService) UpdateOrderStatus(id uint, status models.OrderStatus) error {
	// Get current order
	order, err := s.orderRepo.FindByID(id)
	if err != nil {
		return err
	}

	// Validate status transition
	if err := s.ValidateStatusTransition(order.Status, status); err != nil {
		return err
	}

	return s.orderRepo.UpdateStatus(id, status)
}

func (s *orderService) CancelOrder(id uint, userID uint, reason string) error {
	// Get order
	order, err := s.orderRepo.FindByID(id)
	if err != nil {
		return err
	}

	// Verify ownership
	if order.UserID != userID {
		return errors.New("unauthorized access to order")
	}

	// Check if order can be cancelled (only pending and processing orders)
	if order.Status != models.OrderStatusPending && order.Status != models.OrderStatusProcessing {
		return errors.New("order cannot be cancelled")
	}

	// Transaction to restore stock and update order
	err = s.db.Transaction(func(tx *gorm.DB) error {
		// Restore stock for each order item
		for _, item := range order.OrderItems {
			if item.VariantID != nil {
				// Restore variant stock
				err := tx.Model(&models.ProductVariant{}).
					Where("id = ?", *item.VariantID).
					UpdateColumn("stock", gorm.Expr("stock + ?", item.Quantity)).
					Error
				if err != nil {
					return err
				}
			} else {
				// Restore product stock
				err := tx.Model(&models.Product{}).
					Where("id = ?", item.ProductID).
					UpdateColumn("stock", gorm.Expr("stock + ?", item.Quantity)).
					Error
				if err != nil {
					return err
				}
			}
		}

		// Update order status
		return tx.Model(order).Updates(map[string]interface{}{
			"status":        models.OrderStatusCancelled,
			"cancel_reason": reason,
		}).Error
	})

	return err
}

func (s *orderService) ValidateStatusTransition(currentStatus, newStatus models.OrderStatus) error {
	// Define valid status transitions
	validTransitions := map[models.OrderStatus][]models.OrderStatus{
		models.OrderStatusPending: {
			models.OrderStatusProcessing,
			models.OrderStatusCancelled,
		},
		models.OrderStatusProcessing: {
			models.OrderStatusShipping,
			models.OrderStatusCancelled,
		},
		models.OrderStatusShipping: {
			models.OrderStatusDelivered,
		},
		models.OrderStatusDelivered:  {},
		models.OrderStatusCancelled:  {},
	}

	allowedStatuses, ok := validTransitions[currentStatus]
	if !ok {
		return fmt.Errorf("invalid current status: %s", currentStatus)
	}

	for _, allowed := range allowedStatuses {
		if allowed == newStatus {
			return nil
		}
	}

	return fmt.Errorf("invalid status transition from %s to %s", currentStatus, newStatus)
}
