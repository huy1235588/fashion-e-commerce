package repositories

import (
	"time"

	"gorm.io/gorm"
)

// StatisticsRepository defines the interface for statistics data access
type StatisticsRepository interface {
	GetTotalRevenue() (float64, error)
	GetTotalOrders() (int64, error)
	GetTotalCustomers() (int64, error)
	GetTotalProducts() (int64, error)
	GetRevenueByPeriod(startDate, endDate time.Time) ([]RevenueData, error)
	GetRevenueToday() (float64, error)
	GetOrdersToday() (int64, error)
	GetPendingOrders() (int64, error)
	GetTopSellingProducts(limit int) ([]ProductSales, error)
	GetOrderStatsByStatus() ([]OrderStatusStats, error)
	GetCustomerGrowthByPeriod(period string, limit int) ([]CustomerGrowth, error)
	GetRevenueByCategory() ([]CategoryRevenue, error)
}

type statisticsRepository struct {
	db *gorm.DB
}

// NewStatisticsRepository creates a new statistics repository
func NewStatisticsRepository(db *gorm.DB) StatisticsRepository {
	return &statisticsRepository{db: db}
}

// RevenueData represents revenue data for a specific period
type RevenueData struct {
	Date    time.Time `json:"date"`
	Revenue float64   `json:"revenue"`
	Orders  int64     `json:"orders"`
}

// ProductSales represents product sales statistics
type ProductSales struct {
	ProductID    uint    `json:"product_id"`
	ProductName  string  `json:"product_name"`
	TotalSold    int64   `json:"total_sold"`
	TotalRevenue float64 `json:"total_revenue"`
}

// OrderStatusStats represents order statistics by status
type OrderStatusStats struct {
	Status string `json:"status"`
	Count  int64  `json:"count"`
}

// CustomerGrowth represents customer growth data
type CustomerGrowth struct {
	Date  time.Time `json:"date"`
	Count int64     `json:"count"`
}

// CategoryRevenue represents revenue by category
type CategoryRevenue struct {
	CategoryID   uint    `json:"category_id"`
	CategoryName string  `json:"category_name"`
	Revenue      float64 `json:"revenue"`
	OrderCount   int64   `json:"order_count"`
}

// GetTotalRevenue calculates total revenue from all delivered orders
func (r *statisticsRepository) GetTotalRevenue() (float64, error) {
	var total float64
	err := r.db.Table("orders").
		Where("status = ?", "delivered").
		Select("COALESCE(SUM(total_amount), 0)").
		Scan(&total).Error
	return total, err
}

// GetTotalOrders returns the total number of orders
func (r *statisticsRepository) GetTotalOrders() (int64, error) {
	var count int64
	err := r.db.Table("orders").
		Where("deleted_at IS NULL").
		Count(&count).Error
	return count, err
}

// GetTotalCustomers returns the total number of customers
func (r *statisticsRepository) GetTotalCustomers() (int64, error) {
	var count int64
	err := r.db.Table("users").
		Where("role = ? AND deleted_at IS NULL", "customer").
		Count(&count).Error
	return count, err
}

// GetTotalProducts returns the total number of active products
func (r *statisticsRepository) GetTotalProducts() (int64, error) {
	var count int64
	err := r.db.Table("products").
		Where("is_active = ?", true).
		Count(&count).Error
	return count, err
}

// GetRevenueByPeriod returns revenue data for a specific period
func (r *statisticsRepository) GetRevenueByPeriod(startDate, endDate time.Time) ([]RevenueData, error) {
	var results []RevenueData
	err := r.db.Table("orders").
		Select("DATE(created_at) as date, SUM(total_amount) as revenue, COUNT(*) as orders").
		Where("created_at BETWEEN ? AND ? AND status = ? AND deleted_at IS NULL", startDate, endDate, "delivered").
		Group("DATE(created_at)").
		Order("date ASC").
		Scan(&results).Error
	return results, err
}

// GetRevenueToday returns today's revenue
func (r *statisticsRepository) GetRevenueToday() (float64, error) {
	var total float64
	today := time.Now().Truncate(24 * time.Hour)
	tomorrow := today.Add(24 * time.Hour)

	err := r.db.Table("orders").
		Where("created_at >= ? AND created_at < ? AND status = ? AND deleted_at IS NULL", today, tomorrow, "delivered").
		Select("COALESCE(SUM(total_amount), 0)").
		Scan(&total).Error
	return total, err
}

// GetOrdersToday returns the number of orders created today
func (r *statisticsRepository) GetOrdersToday() (int64, error) {
	var count int64
	today := time.Now().Truncate(24 * time.Hour)
	tomorrow := today.Add(24 * time.Hour)

	err := r.db.Table("orders").
		Where("created_at >= ? AND created_at < ? AND deleted_at IS NULL", today, tomorrow).
		Count(&count).Error
	return count, err
}

// GetPendingOrders returns the number of pending orders
func (r *statisticsRepository) GetPendingOrders() (int64, error) {
	var count int64
	err := r.db.Table("orders").
		Where("status = ? AND deleted_at IS NULL", "pending").
		Count(&count).Error
	return count, err
}

// GetTopSellingProducts returns the top selling products
func (r *statisticsRepository) GetTopSellingProducts(limit int) ([]ProductSales, error) {
	var results []ProductSales
	err := r.db.Table("order_items").
		Select("order_items.product_id, order_items.product_name, SUM(order_items.quantity) as total_sold, SUM(order_items.subtotal) as total_revenue").
		Joins("JOIN orders ON orders.id = order_items.order_id").
		Where("orders.status = ? AND orders.deleted_at IS NULL AND order_items.deleted_at IS NULL", "delivered").
		Group("order_items.product_id, order_items.product_name").
		Order("total_sold DESC").
		Limit(limit).
		Scan(&results).Error
	return results, err
}

// GetOrderStatsByStatus returns order count by status
func (r *statisticsRepository) GetOrderStatsByStatus() ([]OrderStatusStats, error) {
	var results []OrderStatusStats
	err := r.db.Table("orders").
		Select("status, COUNT(*) as count").
		Where("deleted_at IS NULL").
		Group("status").
		Scan(&results).Error
	return results, err
}

// GetCustomerGrowthByPeriod returns customer growth data
func (r *statisticsRepository) GetCustomerGrowthByPeriod(period string, limit int) ([]CustomerGrowth, error) {
	var results []CustomerGrowth
	var dateFormat string

	switch period {
	case "daily":
		dateFormat = "DATE(created_at)"
	case "monthly":
		dateFormat = "DATE_TRUNC('month', created_at)"
	case "yearly":
		dateFormat = "DATE_TRUNC('year', created_at)"
	default:
		dateFormat = "DATE(created_at)"
	}

	err := r.db.Table("users").
		Select(dateFormat+" as date, COUNT(*) as count").
		Where("role = ? AND deleted_at IS NULL", "customer").
		Group(dateFormat).
		Order("date DESC").
		Limit(limit).
		Scan(&results).Error
	return results, err
}

// GetRevenueByCategory returns revenue grouped by category
func (r *statisticsRepository) GetRevenueByCategory() ([]CategoryRevenue, error) {
	var results []CategoryRevenue
	err := r.db.Table("order_items").
		Select("products.category_id, categories.name as category_name, SUM(order_items.subtotal) as revenue, COUNT(DISTINCT order_items.order_id) as order_count").
		Joins("JOIN products ON products.id = order_items.product_id").
		Joins("JOIN categories ON categories.id = products.category_id").
		Joins("JOIN orders ON orders.id = order_items.order_id").
		Where("orders.status = ? AND orders.deleted_at IS NULL AND order_items.deleted_at IS NULL", "delivered").
		Group("products.category_id, categories.name").
		Order("revenue DESC").
		Scan(&results).Error
	return results, err
}
