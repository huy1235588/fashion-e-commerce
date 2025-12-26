package models

import (
	"time"
)

// Review represents a product review
type Review struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	ProductID uint      `json:"product_id" gorm:"not null;index"`
	UserID    uint      `json:"user_id" gorm:"not null;index"`
	OrderID   uint      `json:"order_id" gorm:"not null;index"` // To verify purchase
	Rating    int       `json:"rating" gorm:"not null;check:rating >= 1 AND rating <= 5"`
	Comment   string    `json:"comment" gorm:"type:text"`
	Images    string    `json:"images" gorm:"type:text"` // JSON array of image URLs
	Status    string    `json:"status" gorm:"type:varchar(20);default:'pending';check:status IN ('pending', 'approved', 'rejected')"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	// Relationships
	Product *Product `json:"product,omitempty" gorm:"foreignKey:ProductID"`
	User    *User    `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Order   *Order   `json:"order,omitempty" gorm:"foreignKey:OrderID"`
}

// TableName sets the table name for Review
func (Review) TableName() string {
	return "reviews"
}

// ReviewResponse represents review data for API responses
type ReviewResponse struct {
	ID        uint      `json:"id"`
	ProductID uint      `json:"product_id"`
	UserID    uint      `json:"user_id"`
	Rating    int       `json:"rating"`
	Comment   string    `json:"comment"`
	Images    []string  `json:"images,omitempty"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
	User      *struct {
		ID       uint   `json:"id"`
		FullName string `json:"full_name"`
	} `json:"user,omitempty"`
}

// ToResponse converts Review to ReviewResponse
func (r *Review) ToResponse() ReviewResponse {
	resp := ReviewResponse{
		ID:        r.ID,
		ProductID: r.ProductID,
		UserID:    r.UserID,
		Rating:    r.Rating,
		Comment:   r.Comment,
		Status:    r.Status,
		CreatedAt: r.CreatedAt,
	}

	// Parse images JSON if exists
	// Images are stored as comma-separated URLs for simplicity
	// In production, use proper JSON array

	if r.User != nil {
		resp.User = &struct {
			ID       uint   `json:"id"`
			FullName string `json:"full_name"`
		}{
			ID:       r.User.ID,
			FullName: r.User.FullName,
		}
	}

	return resp
}
