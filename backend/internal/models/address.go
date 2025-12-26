package models

import (
	"time"
)

// Address represents a user's delivery address
type Address struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	UserID        uint      `gorm:"not null;index" json:"user_id"`
	User          *User     `gorm:"foreignKey:UserID" json:"user,omitempty"`
	FullName      string    `gorm:"size:255;not null" json:"full_name" binding:"required"`
	Phone         string    `gorm:"size:20;not null" json:"phone" binding:"required"`
	Province      string    `gorm:"size:100;not null" json:"province" binding:"required"`
	District      string    `gorm:"size:100;not null" json:"district" binding:"required"`
	Ward          string    `gorm:"size:100;not null" json:"ward" binding:"required"`
	DetailAddress string    `gorm:"type:text;not null" json:"detail_address" binding:"required"`
	IsDefault     bool      `gorm:"default:false" json:"is_default"`
	CreatedAt     time.Time `json:"created_at"`
}

// AddressResponse is the response DTO for address
type AddressResponse struct {
	ID            uint   `json:"id"`
	UserID        uint   `json:"user_id"`
	FullName      string `json:"full_name"`
	Phone         string `json:"phone"`
	Province      string `json:"province"`
	District      string `json:"district"`
	Ward          string `json:"ward"`
	DetailAddress string `json:"detail_address"`
	IsDefault     bool   `json:"is_default"`
	CreatedAt     string `json:"created_at"`
}

// ToResponse converts Address to AddressResponse
func (a *Address) ToResponse() AddressResponse {
	return AddressResponse{
		ID:            a.ID,
		UserID:        a.UserID,
		FullName:      a.FullName,
		Phone:         a.Phone,
		Province:      a.Province,
		District:      a.District,
		Ward:          a.Ward,
		DetailAddress: a.DetailAddress,
		IsDefault:     a.IsDefault,
		CreatedAt:     a.CreatedAt.Format(time.RFC3339),
	}
}
