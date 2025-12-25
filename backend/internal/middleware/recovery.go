package middleware

import (
	"log"
	"net/http"
	"runtime/debug"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// Recovery returns a panic recovery middleware
func Recovery() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				// Generate error ID for tracking
				errorID := uuid.New().String()

				// Log the panic with stack trace
				log.Printf("[PANIC RECOVERED] Error ID: %s\n", errorID)
				log.Printf("Error: %v\n", err)
				log.Printf("Stack trace:\n%s\n", debug.Stack())

				// Return error response
				c.JSON(http.StatusInternalServerError, gin.H{
					"error":    "Internal server error",
					"error_id": errorID,
				})

				// Abort the request
				c.Abort()
			}
		}()

		c.Next()
	}
}
