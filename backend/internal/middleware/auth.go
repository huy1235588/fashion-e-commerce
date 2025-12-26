package middleware

import (
	"errors"
	"net/http"
	"strings"

	"github.com/huy1235588/fashion-e-commerce/internal/utils"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware validates JWT tokens
type AuthMiddleware struct {
	jwtUtil *utils.JWTUtil
}

// NewAuthMiddleware creates a new auth middleware
func NewAuthMiddleware(jwtUtil *utils.JWTUtil) *AuthMiddleware {
	return &AuthMiddleware{jwtUtil: jwtUtil}
}

// ValidateJWT middleware validates JWT token from Authorization header
func (m *AuthMiddleware) ValidateJWT() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Extract token from Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Authorization token required",
			})
			c.Abort()
			return
		}

		// Check Bearer prefix
		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid authorization format. Use: Bearer <token>",
			})
			c.Abort()
			return
		}

		tokenString := tokenParts[1]

		// Validate token
		claims, err := m.jwtUtil.ValidateToken(tokenString)
		if err != nil {
			if strings.Contains(err.Error(), "expired") {
				c.JSON(http.StatusUnauthorized, gin.H{
					"error": "Token expired",
				})
			} else {
				c.JSON(http.StatusUnauthorized, gin.H{
					"error": "Invalid token",
				})
			}
			c.Abort()
			return
		}

		// Set user information in context
		c.Set("user_id", claims.UserID)
		c.Set("user_email", claims.Email)
		c.Set("user_role", claims.Role)

		c.Next()
	}
}

// RequireRole middleware checks if user has required role
func (m *AuthMiddleware) RequireRole(requiredRole string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get user role from context (set by ValidateJWT middleware)
		role, exists := c.Get("user_role")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Authentication required",
			})
			c.Abort()
			return
		}

		userRole, ok := role.(string)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Invalid role type",
			})
			c.Abort()
			return
		}

		// Check if user has required role
		if userRole != requiredRole {
			c.JSON(http.StatusForbidden, gin.H{
				"error": requiredRole + " access required",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// RequireAdmin middleware ensures user is an admin
func (m *AuthMiddleware) RequireAdmin() gin.HandlerFunc {
	return m.RequireRole("admin")
}

// GetUserID extracts user ID from context
func GetUserID(c *gin.Context) (uint, error) {
	userID, exists := c.Get("user_id")
	if !exists {
		return 0, errors.New("user ID not found in context")
	}

	id, ok := userID.(uint)
	if !ok {
		return 0, errors.New("invalid user ID type")
	}

	return id, nil
}

// GetUserRole extracts user role from context
func GetUserRole(c *gin.Context) (string, error) {
	role, exists := c.Get("user_role")
	if !exists {
		return "", errors.New("user role not found in context")
	}

	userRole, ok := role.(string)
	if !ok {
		return "", errors.New("invalid user role type")
	}

	return userRole, nil
}
