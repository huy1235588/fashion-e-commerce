package services

import (
	"time"

	"github.com/huy1235588/fashion-e-commerce/internal/models"
	"github.com/huy1235588/fashion-e-commerce/internal/repositories"
	"gorm.io/gorm"
)

// AdminService handles business logic for admin operations
type AdminService struct {
	db          *gorm.DB
	userRepo    repositories.UserRepository
	productRepo repositories.ProductRepository
	orderRepo   repositories.OrderRepository
}

// NewAdminService creates a new AdminService
func NewAdminService(
	db *gorm.DB,
	userRepo repositories.UserRepository,
	productRepo repositories.ProductRepository,
	orderRepo repositories.OrderRepository,
) *AdminService {
	return &AdminService{
		db:          db,
		userRepo:    userRepo,
		productRepo: productRepo,
		orderRepo:   orderRepo,
	}
}

// DashboardStats represents dashboard statistics
type DashboardStats struct {
	TotalUsers          int64   `json:"total_users"`
	TotalProducts       int64   `json:"total_products"`
	TotalOrders         int64   `json:"total_orders"`
	TotalRevenue        float64 `json:"total_revenue"`
	PendingOrders       int64   `json:"pending_orders"`
	ProcessingOrders    int64   `json:"processing_orders"`
	ShippingOrders      int64   `json:"shipping_orders"`
	DeliveredOrders     int64   `json:"delivered_orders"`
	CancelledOrders     int64   `json:"cancelled_orders"`
	RevenueThisMonth    float64 `json:"revenue_this_month"`
	RevenueLastMonth    float64 `json:"revenue_last_month"`
	OrdersThisMonth     int64   `json:"orders_this_month"`
	OrdersLastMonth     int64   `json:"orders_last_month"`
	NewUsersThisMonth   int64   `json:"new_users_this_month"`
	NewUsersLastMonth   int64   `json:"new_users_last_month"`
	LowStockProducts    int64   `json:"low_stock_products"`
	OutOfStockProducts  int64   `json:"out_of_stock_products"`
}

// GetDashboardStats returns statistics for admin dashboard
func (s *AdminService) GetDashboardStats() (*DashboardStats, error) {
	stats := &DashboardStats{}

	// Total users
	if err := s.db.Model(&models.User{}).Count(&stats.TotalUsers).Error; err != nil {
		return nil, err
	}

	// Total products
	if err := s.db.Model(&models.Product{}).Count(&stats.TotalProducts).Error; err != nil {
		return nil, err
	}

	// Total orders and revenue
	if err := s.db.Model(&models.Order{}).
		Where("status NOT IN (?)", []string{"cancelled"}).
		Count(&stats.TotalOrders).Error; err != nil {
		return nil, err
	}

	var totalRevenue float64
	if err := s.db.Model(&models.Order{}).
		Where("status IN (?)", []string{"delivered", "completed"}).
		Select("COALESCE(SUM(total_amount), 0)").
		Scan(&totalRevenue).Error; err != nil {
		return nil, err
	}
	stats.TotalRevenue = totalRevenue

	// Order counts by status
	s.db.Model(&models.Order{}).Where("status = ?", "pending").Count(&stats.PendingOrders)
	s.db.Model(&models.Order{}).Where("status = ?", "processing").Count(&stats.ProcessingOrders)
	s.db.Model(&models.Order{}).Where("status = ?", "shipping").Count(&stats.ShippingOrders)
	s.db.Model(&models.Order{}).Where("status = ?", "delivered").Count(&stats.DeliveredOrders)
	s.db.Model(&models.Order{}).Where("status = ?", "cancelled").Count(&stats.CancelledOrders)

	// This month stats
	now := time.Now()
	firstDayThisMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	firstDayNextMonth := firstDayThisMonth.AddDate(0, 1, 0)

	// Revenue this month
	var revenueThisMonth float64
	s.db.Model(&models.Order{}).
		Where("status IN (?) AND created_at >= ? AND created_at < ?",
			[]string{"delivered", "completed"}, firstDayThisMonth, firstDayNextMonth).
		Select("COALESCE(SUM(total_amount), 0)").
		Scan(&revenueThisMonth)
	stats.RevenueThisMonth = revenueThisMonth

	// Orders this month
	s.db.Model(&models.Order{}).
		Where("created_at >= ? AND created_at < ?", firstDayThisMonth, firstDayNextMonth).
		Count(&stats.OrdersThisMonth)

	// New users this month
	s.db.Model(&models.User{}).
		Where("created_at >= ? AND created_at < ?", firstDayThisMonth, firstDayNextMonth).
		Count(&stats.NewUsersThisMonth)

	// Last month stats
	firstDayLastMonth := firstDayThisMonth.AddDate(0, -1, 0)

	// Revenue last month
	var revenueLastMonth float64
	s.db.Model(&models.Order{}).
		Where("status IN (?) AND created_at >= ? AND created_at < ?",
			[]string{"delivered", "completed"}, firstDayLastMonth, firstDayThisMonth).
		Select("COALESCE(SUM(total_amount), 0)").
		Scan(&revenueLastMonth)
	stats.RevenueLastMonth = revenueLastMonth

	// Orders last month
	s.db.Model(&models.Order{}).
		Where("created_at >= ? AND created_at < ?", firstDayLastMonth, firstDayThisMonth).
		Count(&stats.OrdersLastMonth)

	// New users last month
	s.db.Model(&models.User{}).
		Where("created_at >= ? AND created_at < ?", firstDayLastMonth, firstDayThisMonth).
		Count(&stats.NewUsersLastMonth)

	// Low stock products (stock < 10)
	s.db.Model(&models.ProductVariant{}).
		Where("stock_quantity > 0 AND stock_quantity < ?", 10).
		Count(&stats.LowStockProducts)

	// Out of stock products
	s.db.Model(&models.ProductVariant{}).
		Where("stock_quantity = ?", 0).
		Count(&stats.OutOfStockProducts)

	return stats, nil
}

// UpdateOrderStatus updates order status (admin only)
func (s *AdminService) UpdateOrderStatus(orderID uint, status string) error {
	// Validate status
	validStatuses := []string{"pending", "processing", "shipping", "delivered", "cancelled"}
	isValid := false
	for _, v := range validStatuses {
		if status == v {
			isValid = true
			break
		}
	}
	if !isValid {
		return gorm.ErrInvalidData
	}

	return s.db.Model(&models.Order{}).
		Where("id = ?", orderID).
		Update("status", status).Error
}

// ListAllUsers returns all users with pagination
func (s *AdminService) ListAllUsers(page, limit int) ([]models.User, int64, error) {
	var users []models.User
	var total int64

	offset := (page - 1) * limit

	// Count total
	if err := s.db.Model(&models.User{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get users
	if err := s.db.Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&users).Error; err != nil {
		return nil, 0, err
	}

	return users, total, nil
}

// UpdateUserRole updates user role (admin only)
func (s *AdminService) UpdateUserRole(userID uint, role string) error {
	if role != "user" && role != "admin" {
		return gorm.ErrInvalidData
	}

	return s.db.Model(&models.User{}).
		Where("id = ?", userID).
		Update("role", role).Error
}

// ListAllOrders returns all orders with pagination and optional status filter
func (s *AdminService) ListAllOrders(page, limit int, status string) ([]models.Order, int64, error) {
	var orders []models.Order
	var total int64

	offset := (page - 1) * limit

	query := s.db.Model(&models.Order{})
	if status != "" {
		query = query.Where("status = ?", status)
	}

	// Count total
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get orders
	if err := query.Preload("OrderItems").
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&orders).Error; err != nil {
		return nil, 0, err
	}

	return orders, total, nil
}
