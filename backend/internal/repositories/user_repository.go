package repositories

import (
	"errors"

	"github.com/huy1235588/fashion-e-commerce/internal/models"

	"gorm.io/gorm"
)

// UserRepository handles database operations for users
type UserRepository interface {
	Create(user *models.User) error
	FindByEmail(email string) (*models.User, error)
	FindByID(id uint) (*models.User, error)
	Update(user *models.User) error
	List(limit, offset int, filters map[string]interface{}) ([]models.User, int64, error)
	UpdateActiveStatus(userID uint, isActive bool) error
}

type userRepository struct {
	db *gorm.DB
}

// NewUserRepository creates a new user repository
func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

// Create creates a new user
func (r *userRepository) Create(user *models.User) error {
	return r.db.Create(user).Error
}

// FindByEmail finds a user by email
func (r *userRepository) FindByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	return &user, nil
}

// FindByID finds a user by ID
func (r *userRepository) FindByID(id uint) (*models.User, error) {
	var user models.User
	err := r.db.First(&user, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	return &user, nil
}

// Update updates an existing user
func (r *userRepository) Update(user *models.User) error {
	return r.db.Save(user).Error
}

// List returns paginated list of users with optional filters
func (r *userRepository) List(limit, offset int, filters map[string]interface{}) ([]models.User, int64, error) {
	var users []models.User
	var total int64

	query := r.db.Model(&models.User{})

	// Apply filters
	if role, ok := filters["role"].(string); ok && role != "" {
		query = query.Where("role = ?", role)
	}
	if isActive, ok := filters["is_active"].(bool); ok {
		query = query.Where("is_active = ?", isActive)
	}

	// Count total
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results
	if err := query.Limit(limit).Offset(offset).Order("created_at DESC").Find(&users).Error; err != nil {
		return nil, 0, err
	}

	return users, total, nil
}

// UpdateActiveStatus updates the active status of a user
func (r *userRepository) UpdateActiveStatus(userID uint, isActive bool) error {
	return r.db.Model(&models.User{}).Where("id = ?", userID).Update("is_active", isActive).Error
}

// PasswordResetCodeRepository handles password reset codes
type PasswordResetCodeRepository interface {
	Create(code *models.PasswordResetCode) error
	FindByCode(code string) (*models.PasswordResetCode, error)
	MarkAsUsed(codeID uint) error
	DeleteExpired() error
}

type passwordResetCodeRepository struct {
	db *gorm.DB
}

// NewPasswordResetCodeRepository creates a new password reset code repository
func NewPasswordResetCodeRepository(db *gorm.DB) PasswordResetCodeRepository {
	return &passwordResetCodeRepository{db: db}
}

// Create creates a new password reset code
func (r *passwordResetCodeRepository) Create(code *models.PasswordResetCode) error {
	return r.db.Create(code).Error
}

// FindByCode finds a password reset code by code string
func (r *passwordResetCodeRepository) FindByCode(code string) (*models.PasswordResetCode, error) {
	var resetCode models.PasswordResetCode
	err := r.db.Where("code = ? AND used = ? AND expires_at > NOW()", code, false).First(&resetCode).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("invalid or expired reset code")
		}
		return nil, err
	}
	return &resetCode, nil
}

// MarkAsUsed marks a password reset code as used
func (r *passwordResetCodeRepository) MarkAsUsed(codeID uint) error {
	return r.db.Model(&models.PasswordResetCode{}).Where("id = ?", codeID).Update("used", true).Error
}

// DeleteExpired deletes expired password reset codes
func (r *passwordResetCodeRepository) DeleteExpired() error {
	return r.db.Where("expires_at < NOW()").Delete(&models.PasswordResetCode{}).Error
}
