package repositories

import (
	"github.com/huy1235588/fashion-e-commerce/internal/models"
	"gorm.io/gorm"
)

type OrderRepository interface {
	Create(order *models.Order) error
	FindByID(id uint) (*models.Order, error)
	FindByOrderCode(orderCode string) (*models.Order, error)
	FindByUserID(userID uint, limit, offset int) ([]models.Order, int64, error)
	List(filters map[string]interface{}, limit, offset int) ([]models.Order, int64, error)
	UpdateStatus(id uint, status models.OrderStatus) error
	UpdatePaymentStatus(id uint, paymentStatus models.PaymentStatus) error
	Update(order *models.Order) error
	Delete(id uint) error
}

type orderRepository struct {
	db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) OrderRepository {
	return &orderRepository{db: db}
}

func (r *orderRepository) Create(order *models.Order) error {
	return r.db.Create(order).Error
}

func (r *orderRepository) FindByID(id uint) (*models.Order, error) {
	var order models.Order
	err := r.db.Preload("OrderItems.Product").
		Preload("OrderItems.Variant").
		Preload("User").
		First(&order, id).Error
	if err != nil {
		return nil, err
	}
	return &order, nil
}

func (r *orderRepository) FindByOrderCode(orderCode string) (*models.Order, error) {
	var order models.Order
	err := r.db.Preload("OrderItems.Product").
		Preload("OrderItems.Variant").
		Preload("User").
		Where("order_code = ?", orderCode).
		First(&order).Error
	if err != nil {
		return nil, err
	}
	return &order, nil
}

func (r *orderRepository) FindByUserID(userID uint, limit, offset int) ([]models.Order, int64, error) {
	var orders []models.Order
	var total int64

	query := r.db.Model(&models.Order{}).Where("user_id = ?", userID)

	// Count total
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results
	err := query.
		Preload("OrderItems.Product").
		Preload("OrderItems.Variant").
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&orders).Error

	return orders, total, err
}

func (r *orderRepository) List(filters map[string]interface{}, limit, offset int) ([]models.Order, int64, error) {
	var orders []models.Order
	var total int64

	query := r.db.Model(&models.Order{})

	// Apply filters
	if status, ok := filters["status"].(string); ok && status != "" {
		query = query.Where("status = ?", status)
	}
	if paymentStatus, ok := filters["payment_status"].(string); ok && paymentStatus != "" {
		query = query.Where("payment_status = ?", paymentStatus)
	}
	if paymentMethod, ok := filters["payment_method"].(string); ok && paymentMethod != "" {
		query = query.Where("payment_method = ?", paymentMethod)
	}
	if userID, ok := filters["user_id"].(uint); ok && userID > 0 {
		query = query.Where("user_id = ?", userID)
	}

	// Count total
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results
	err := query.
		Preload("OrderItems.Product").
		Preload("OrderItems.Variant").
		Preload("User").
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&orders).Error

	return orders, total, err
}

func (r *orderRepository) UpdateStatus(id uint, status models.OrderStatus) error {
	return r.db.Model(&models.Order{}).Where("id = ?", id).Update("status", status).Error
}

func (r *orderRepository) UpdatePaymentStatus(id uint, paymentStatus models.PaymentStatus) error {
	return r.db.Model(&models.Order{}).Where("id = ?", id).Update("payment_status", paymentStatus).Error
}

func (r *orderRepository) Update(order *models.Order) error {
	return r.db.Save(order).Error
}

func (r *orderRepository) Delete(id uint) error {
	return r.db.Delete(&models.Order{}, id).Error
}
