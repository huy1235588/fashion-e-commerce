package models

import (
	"time"

	"gorm.io/gorm"
)

// User represents a user in the system (customer or admin)
type User struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	Email     string         `gorm:"uniqueIndex;not null" json:"email" validate:"required,email"`
	Password  string         `gorm:"not null" json:"-"` // Never expose password in JSON
	FullName  string         `gorm:"not null" json:"full_name" validate:"required"`
	Phone     string         `json:"phone"`
	Role      string         `gorm:"not null;default:'customer'" json:"role"` // customer, admin
	IsActive  bool           `gorm:"default:true" json:"is_active"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// TableName specifies the table name for User model
func (User) TableName() string {
	return "users"
}

// UserResponse is used for API responses (without sensitive data)
type UserResponse struct {
	ID        uint      `json:"id"`
	Email     string    `json:"email"`
	FullName  string    `json:"full_name"`
	Phone     string    `json:"phone"`
	Role      string    `json:"role"`
	IsActive  bool      `json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
}

// ToResponse converts User to UserResponse
func (u *User) ToResponse() UserResponse {
	return UserResponse{
		ID:        u.ID,
		Email:     u.Email,
		FullName:  u.FullName,
		Phone:     u.Phone,
		Role:      u.Role,
		IsActive:  u.IsActive,
		CreatedAt: u.CreatedAt,
	}
}

// PasswordResetCode stores password reset verification codes
type PasswordResetCode struct {
	ID        uint      `gorm:"primarykey" json:"id"`
	UserID    uint      `gorm:"not null" json:"user_id"`
	Code      string    `gorm:"not null" json:"code"`
	ExpiresAt time.Time `gorm:"not null" json:"expires_at"`
	Used      bool      `gorm:"default:false" json:"used"`
	CreatedAt time.Time `json:"created_at"`
}

// TableName specifies the table name for PasswordResetCode
func (PasswordResetCode) TableName() string {
	return "password_reset_codes"
}
