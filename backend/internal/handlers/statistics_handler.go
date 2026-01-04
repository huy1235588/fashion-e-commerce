package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/huy1235588/fashion-e-commerce/internal/services"
)

// StatisticsHandler handles statistics HTTP requests
type StatisticsHandler struct {
	service services.StatisticsService
}

// NewStatisticsHandler creates a new statistics handler
func NewStatisticsHandler(service services.StatisticsService) *StatisticsHandler {
	return &StatisticsHandler{service: service}
}

// GetDashboardStats handles retrieving dashboard overview statistics
// GET /api/admin/statistics/dashboard
func (h *StatisticsHandler) GetDashboardStats(c *gin.Context) {
	stats, err := h.service.GetDashboardStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to retrieve dashboard statistics",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": stats,
	})
}

// GetRevenue handles retrieving revenue data for a specific period
// GET /api/admin/statistics/revenue?start_date=2024-01-01&end_date=2024-12-31
func (h *StatisticsHandler) GetRevenue(c *gin.Context) {
	startDateStr := c.Query("start_date")
	endDateStr := c.Query("end_date")

	// Default to last 30 days if not specified
	var startDate, endDate time.Time
	var err error

	if startDateStr != "" {
		startDate, err = time.Parse("2006-01-02", startDateStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "invalid start_date format, use YYYY-MM-DD",
			})
			return
		}
	} else {
		startDate = time.Now().AddDate(0, 0, -30)
	}

	if endDateStr != "" {
		endDate, err = time.Parse("2006-01-02", endDateStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "invalid end_date format, use YYYY-MM-DD",
			})
			return
		}
	} else {
		endDate = time.Now()
	}

	// Set time to end of day for endDate
	endDate = endDate.Add(23*time.Hour + 59*time.Minute + 59*time.Second)

	data, err := h.service.GetRevenueByPeriod(startDate, endDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to retrieve revenue data",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": data,
		"period": gin.H{
			"start_date": startDate.Format("2006-01-02"),
			"end_date":   endDate.Format("2006-01-02"),
		},
	})
}

// GetTopProducts handles retrieving top selling products
// GET /api/admin/statistics/products/top?limit=10
func (h *StatisticsHandler) GetTopProducts(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	data, err := h.service.GetTopSellingProducts(limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to retrieve top products",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": data,
	})
}

// GetOrderStats handles retrieving order statistics by status
// GET /api/admin/statistics/orders
func (h *StatisticsHandler) GetOrderStats(c *gin.Context) {
	data, err := h.service.GetOrderStatsByStatus()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to retrieve order statistics",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": data,
	})
}

// GetCustomerStats handles retrieving customer growth statistics
// GET /api/admin/statistics/customers?period=daily&limit=30
func (h *StatisticsHandler) GetCustomerStats(c *gin.Context) {
	period := c.DefaultQuery("period", "daily")
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "30"))

	data, err := h.service.GetCustomerGrowth(period, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to retrieve customer statistics",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": data,
		"period": period,
	})
}

// GetCategoryRevenue handles retrieving revenue by category
// GET /api/admin/statistics/categories/revenue
func (h *StatisticsHandler) GetCategoryRevenue(c *gin.Context) {
	data, err := h.service.GetRevenueByCategory()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to retrieve category revenue",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": data,
	})
}
