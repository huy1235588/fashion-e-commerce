package repositories

import (
	"github.com/huy1235588/fashion-e-commerce/internal/models"
	"gorm.io/gorm"
)

type PaymentRepository interface {
	Create(payment *models.Payment) error
	FindByID(id uint) (*models.Payment, error)
	FindByOrderID(orderID uint) (*models.Payment, error)
	FindByTransactionID(transactionID string) (*models.Payment, error)
	UpdateStatus(id uint, status models.PaymentStatus) error
	Update(payment *models.Payment) error
}

type paymentRepository struct {
	db *gorm.DB
}

func NewPaymentRepository(db *gorm.DB) PaymentRepository {
	return &paymentRepository{db: db}
}

func (r *paymentRepository) Create(payment *models.Payment) error {
	return r.db.Create(payment).Error
}

func (r *paymentRepository) FindByID(id uint) (*models.Payment, error) {
	var payment models.Payment
	err := r.db.Preload("Order").First(&payment, id).Error
	if err != nil {
		return nil, err
	}
	return &payment, nil
}

func (r *paymentRepository) FindByOrderID(orderID uint) (*models.Payment, error) {
	var payment models.Payment
	err := r.db.Where("order_id = ?", orderID).Preload("Order").First(&payment).Error
	if err != nil {
		return nil, err
	}
	return &payment, nil
}

func (r *paymentRepository) FindByTransactionID(transactionID string) (*models.Payment, error) {
	var payment models.Payment
	err := r.db.Where("transaction_id = ?", transactionID).Preload("Order").First(&payment).Error
	if err != nil {
		return nil, err
	}
	return &payment, nil
}

func (r *paymentRepository) UpdateStatus(id uint, status models.PaymentStatus) error {
	return r.db.Model(&models.Payment{}).Where("id = ?", id).Update("payment_status", status).Error
}

func (r *paymentRepository) Update(payment *models.Payment) error {
	return r.db.Save(payment).Error
}
