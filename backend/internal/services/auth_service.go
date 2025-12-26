package services

import (
	"errors"
	"fmt"
	"math/rand"
	"time"

	"github.com/huy1235588/fashion-e-commerce/internal/models"
	"github.com/huy1235588/fashion-e-commerce/internal/repositories"
	"github.com/huy1235588/fashion-e-commerce/internal/utils"

	"golang.org/x/crypto/bcrypt"
)

// AuthService handles authentication business logic
type AuthService interface {
	Register(email, password, fullName, phone string) (*models.User, error)
	Login(email, password string) (*models.User, string, error)
	GetProfile(userID uint) (*models.User, error)
	UpdateProfile(userID uint, fullName, phone string) (*models.User, error)
	SendResetCode(email string) error
	VerifyResetCode(code string) (uint, error)
	ResetPassword(userID uint, newPassword string) error
}

type authService struct {
	userRepo      repositories.UserRepository
	resetCodeRepo repositories.PasswordResetCodeRepository
	jwtUtil       *utils.JWTUtil
}

// NewAuthService creates a new auth service
func NewAuthService(userRepo repositories.UserRepository, resetCodeRepo repositories.PasswordResetCodeRepository, jwtUtil *utils.JWTUtil) AuthService {
	return &authService{
		userRepo:      userRepo,
		resetCodeRepo: resetCodeRepo,
		jwtUtil:       jwtUtil,
	}
}

// Register creates a new user account
func (s *authService) Register(email, password, fullName, phone string) (*models.User, error) {
	// Check if user already exists
	existingUser, _ := s.userRepo.FindByEmail(email)
	if existingUser != nil {
		return nil, errors.New("email already registered")
	}

	// Validate password length
	if len(password) < 8 {
		return nil, errors.New("password must be at least 8 characters")
	}

	// Hash password
	hashedPassword, err := s.HashPassword(password)
	if err != nil {
		return nil, errors.New("failed to hash password")
	}

	// Create user
	user := &models.User{
		Email:    email,
		Password: hashedPassword,
		FullName: fullName,
		Phone:    phone,
		Role:     "customer",
		IsActive: true,
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	return user, nil
}

// Login authenticates a user and returns JWT token
func (s *authService) Login(email, password string) (*models.User, string, error) {
	// Find user by email
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return nil, "", errors.New("invalid credentials")
	}

	// Check if account is active
	if !user.IsActive {
		return nil, "", errors.New("account is deactivated")
	}

	// Verify password
	if !s.VerifyPassword(password, user.Password) {
		return nil, "", errors.New("invalid credentials")
	}

	// Generate JWT token
	token, err := s.jwtUtil.GenerateToken(user.ID, user.Email, user.Role)
	if err != nil {
		return nil, "", errors.New("failed to generate token")
	}

	return user, token, nil
}

// GetProfile retrieves user profile information
func (s *authService) GetProfile(userID uint) (*models.User, error) {
	return s.userRepo.FindByID(userID)
}

// UpdateProfile updates user profile information
func (s *authService) UpdateProfile(userID uint, fullName, phone string) (*models.User, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, err
	}

	// Update fields
	user.FullName = fullName
	user.Phone = phone

	if err := s.userRepo.Update(user); err != nil {
		return nil, err
	}

	return user, nil
}

// SendResetCode generates and stores a password reset code
func (s *authService) SendResetCode(email string) error {
	// Find user
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		// Don't reveal if email exists or not for security
		return nil
	}

	// Generate 6-digit code
	code := s.generateResetCode()

	// Create reset code record
	resetCode := &models.PasswordResetCode{
		UserID:    user.ID,
		Code:      code,
		ExpiresAt: time.Now().Add(15 * time.Minute),
		Used:      false,
	}

	if err := s.resetCodeRepo.Create(resetCode); err != nil {
		return err
	}

	// TODO: Send email with reset code
	// For now, just log it (in production, integrate with email service)
	fmt.Printf("Password reset code for %s: %s\n", email, code)

	return nil
}

// VerifyResetCode verifies a password reset code and returns user ID
func (s *authService) VerifyResetCode(code string) (uint, error) {
	resetCode, err := s.resetCodeRepo.FindByCode(code)
	if err != nil {
		return 0, err
	}

	return resetCode.UserID, nil
}

// ResetPassword resets user password
func (s *authService) ResetPassword(userID uint, newPassword string) error {
	// Validate password length
	if len(newPassword) < 8 {
		return errors.New("password must be at least 8 characters")
	}

	// Find user
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return err
	}

	// Hash new password
	hashedPassword, err := s.HashPassword(newPassword)
	if err != nil {
		return errors.New("failed to hash password")
	}

	// Update password
	user.Password = hashedPassword
	return s.userRepo.Update(user)
}

// HashPassword hashes a password using bcrypt
func (s *authService) HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

// VerifyPassword compares a password with a hash
func (s *authService) VerifyPassword(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// generateResetCode generates a 6-digit reset code
func (s *authService) generateResetCode() string {
	rand.Seed(time.Now().UnixNano())
	code := rand.Intn(900000) + 100000 // Generates 6-digit number
	return fmt.Sprintf("%06d", code)
}
