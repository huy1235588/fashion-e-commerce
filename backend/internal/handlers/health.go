package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/huy1235588/fashion-e-commerce/internal/database"
)

// HealthResponse represents the health check response
type HealthResponse struct {
	Status    string    `json:"status"`
	Timestamp time.Time `json:"timestamp"`
	Database  string    `json:"database"`
}

// Health handles GET /health endpoint
func Health(c *gin.Context) {
	response := HealthResponse{
		Timestamp: time.Now(),
	}

	// Check database health
	if err := database.Health(); err != nil {
		response.Status = "unhealthy"
		response.Database = "disconnected"
		c.JSON(http.StatusServiceUnavailable, response)
		return
	}

	response.Status = "healthy"
	response.Database = "connected"
	c.JSON(http.StatusOK, response)
}
