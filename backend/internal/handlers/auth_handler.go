package handlers

import (
	"net/http"

	"github.com/huy1235588/fashion-e-commerce/internal/middleware"
	"github.com/huy1235588/fashion-e-commerce/internal/services"

	"github.com/gin-gonic/gin"
)

// AuthHandler handles authentication endpoints
type AuthHandler struct {
	authService services.AuthService
}

// NewAuthHandler creates a new auth handler
func NewAuthHandler(authService services.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

// RegisterRequest represents registration request body
type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
	FullName string `json:"full_name" binding:"required"`
	Phone    string `json:"phone"`
}

// LoginRequest represents login request body
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// UpdateProfileRequest represents update profile request body
type UpdateProfileRequest struct {
	FullName string `json:"full_name" binding:"required"`
	Phone    string `json:"phone"`
}

// SendResetCodeRequest represents send reset code request
type SendResetCodeRequest struct {
	Email string `json:"email" binding:"required,email"`
}

// VerifyResetCodeRequest represents verify reset code request
type VerifyResetCodeRequest struct {
	Code        string `json:"code" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=8"`
}

// Register handles user registration
// POST /api/auth/register
func (h *AuthHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	user, err := h.authService.Register(req.Email, req.Password, req.FullName, req.Phone)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Auto-login: generate token for newly registered user
	_, token, err := h.authService.Login(req.Email, req.Password)
	if err != nil {
		// Registration succeeded but auto-login failed
		c.JSON(http.StatusCreated, gin.H{
			"message": "User registered successfully. Please login.",
			"user":    user.ToResponse(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User registered successfully",
		"token":   token,
		"user":    user.ToResponse(),
	})
}

// Login handles user login
// POST /api/auth/login
func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	user, token, err := h.authService.Login(req.Email, req.Password)
	if err != nil {
		status := http.StatusUnauthorized
		if err.Error() == "account is deactivated" {
			status = http.StatusForbidden
		}
		c.JSON(status, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"token":   token,
		"user":    user.ToResponse(),
	})
}

// GetProfile handles getting user profile
// GET /api/auth/profile
func (h *AuthHandler) GetProfile(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Authentication required",
		})
		return
	}

	user, err := h.authService.GetProfile(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "User not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": user.ToResponse(),
	})
}

// UpdateProfile handles updating user profile
// PUT /api/auth/profile
func (h *AuthHandler) UpdateProfile(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Authentication required",
		})
		return
	}

	var req UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	user, err := h.authService.UpdateProfile(userID, req.FullName, req.Phone)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Profile updated successfully",
		"user":    user.ToResponse(),
	})
}

// SendResetCode handles sending password reset code
// POST /api/auth/forgot-password
func (h *AuthHandler) SendResetCode(c *gin.Context) {
	var req SendResetCodeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	if err := h.authService.SendResetCode(req.Email); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to send reset code",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Reset code sent to email",
	})
}

// ResetPassword handles password reset with code
// POST /api/auth/reset-password
func (h *AuthHandler) ResetPassword(c *gin.Context) {
	var req VerifyResetCodeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Verify code and get user ID
	userID, err := h.authService.VerifyResetCode(req.Code)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Reset password
	if err := h.authService.ResetPassword(userID, req.NewPassword); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Password reset successfully",
	})
}
