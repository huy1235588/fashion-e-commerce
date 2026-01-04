package services

import (
	"time"

	"github.com/huy1235588/fashion-e-commerce/internal/repositories"
)

// StatisticsService handles statistics business logic
type StatisticsService interface {
	GetDashboardStats() (*StatsDashboard, error)
	GetRevenueByPeriod(startDate, endDate time.Time) ([]repositories.RevenueData, error)
	GetTopSellingProducts(limit int) ([]repositories.ProductSales, error)
	GetOrderStatsByStatus() ([]repositories.OrderStatusStats, error)
	GetCustomerGrowth(period string, limit int) ([]repositories.CustomerGrowth, error)
	GetRevenueByCategory() ([]repositories.CategoryRevenue, error)
}

type statisticsService struct {
	statsRepo repositories.StatisticsRepository
}

// NewStatisticsService creates a new statistics service
func NewStatisticsService(statsRepo repositories.StatisticsRepository) StatisticsService {
	return &statisticsService{
		statsRepo: statsRepo,
	}
}

// StatsDashboard represents overview metrics for the admin dashboard
type StatsDashboard struct {
	TotalRevenue  float64 `json:"total_revenue"`
	TotalOrders   int64   `json:"total_orders"`
	TotalUsers    int64   `json:"total_users"`
	TotalProducts int64   `json:"total_products"`
	RevenueToday  float64 `json:"revenue_today"`
	OrdersToday   int64   `json:"orders_today"`
	PendingOrders int64   `json:"pending_orders"`
}

// GetDashboardStats retrieves overview statistics for the dashboard
func (s *statisticsService) GetDashboardStats() (*StatsDashboard, error) {
	stats := &StatsDashboard{}
	
	// Get all metrics in parallel for better performance
	var err error
	
	stats.TotalRevenue, err = s.statsRepo.GetTotalRevenue()
	if err != nil {
		return nil, err
	}
	
	stats.TotalOrders, err = s.statsRepo.GetTotalOrders()
	if err != nil {
		return nil, err
	}
	
	stats.TotalUsers, err = s.statsRepo.GetTotalCustomers()
	if err != nil {
		return nil, err
	}
	
	stats.TotalProducts, err = s.statsRepo.GetTotalProducts()
	if err != nil {
		return nil, err
	}
	
	stats.RevenueToday, err = s.statsRepo.GetRevenueToday()
	if err != nil {
		return nil, err
	}
	
	stats.OrdersToday, err = s.statsRepo.GetOrdersToday()
	if err != nil {
		return nil, err
	}
	
	stats.PendingOrders, err = s.statsRepo.GetPendingOrders()
	if err != nil {
		return nil, err
	}
	
	return stats, nil
}

// GetRevenueByPeriod retrieves revenue data for a specific period
func (s *statisticsService) GetRevenueByPeriod(startDate, endDate time.Time) ([]repositories.RevenueData, error) {
	return s.statsRepo.GetRevenueByPeriod(startDate, endDate)
}

// GetTopSellingProducts retrieves the top selling products
func (s *statisticsService) GetTopSellingProducts(limit int) ([]repositories.ProductSales, error) {
	if limit <= 0 {
		limit = 10
	}
	if limit > 100 {
		limit = 100
	}
	return s.statsRepo.GetTopSellingProducts(limit)
}

// GetOrderStatsByStatus retrieves order statistics grouped by status
func (s *statisticsService) GetOrderStatsByStatus() ([]repositories.OrderStatusStats, error) {
	return s.statsRepo.GetOrderStatsByStatus()
}

// GetCustomerGrowth retrieves customer growth data
func (s *statisticsService) GetCustomerGrowth(period string, limit int) ([]repositories.CustomerGrowth, error) {
	validPeriods := map[string]bool{
		"daily":   true,
		"monthly": true,
		"yearly":  true,
	}
	
	if !validPeriods[period] {
		period = "daily"
	}
	
	if limit <= 0 {
		limit = 30
	}
	if limit > 365 {
		limit = 365
	}
	
	return s.statsRepo.GetCustomerGrowthByPeriod(period, limit)
}

// GetRevenueByCategory retrieves revenue grouped by category
func (s *statisticsService) GetRevenueByCategory() ([]repositories.CategoryRevenue, error) {
	return s.statsRepo.GetRevenueByCategory()
}
