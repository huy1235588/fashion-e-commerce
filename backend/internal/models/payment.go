package models

import (
	"time"

	"gorm.io/gorm"
)

// Payment represents a payment transaction
type Payment struct {
	ID              uint           `gorm:"primarykey" json:"id"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`
	OrderID         uint           `gorm:"not null;index" json:"order_id"`
	PaymentMethod   PaymentMethod  `gorm:"type:varchar(20);not null" json:"payment_method"`
	PaymentStatus   PaymentStatus  `gorm:"type:varchar(20);not null;default:'pending'" json:"payment_status"`
	Amount          float64        `gorm:"type:decimal(10,2);not null" json:"amount"`
	TransactionID   string         `gorm:"type:varchar(100);uniqueIndex" json:"transaction_id,omitempty"`
	GatewayResponse string         `gorm:"type:text" json:"gateway_response,omitempty"`
	PaidAt          *time.Time     `json:"paid_at,omitempty"`

	// Relations
	Order Order `gorm:"foreignKey:OrderID" json:"order,omitempty"`
}

// PaymentResponse is the DTO for payment responses
type PaymentResponse struct {
	ID              uint          `json:"id"`
	OrderID         uint          `json:"order_id"`
	PaymentMethod   PaymentMethod `json:"payment_method"`
	PaymentStatus   PaymentStatus `json:"payment_status"`
	Amount          float64       `json:"amount"`
	TransactionID   string        `json:"transaction_id,omitempty"`
	PaidAt          *time.Time    `json:"paid_at,omitempty"`
	CreatedAt       time.Time     `json:"created_at"`
	UpdatedAt       time.Time     `json:"updated_at"`
}

// ToResponse converts Payment to PaymentResponse
func (p *Payment) ToResponse() PaymentResponse {
	return PaymentResponse{
		ID:            p.ID,
		OrderID:       p.OrderID,
		PaymentMethod: p.PaymentMethod,
		PaymentStatus: p.PaymentStatus,
		Amount:        p.Amount,
		TransactionID: p.TransactionID,
		PaidAt:        p.PaidAt,
		CreatedAt:     p.CreatedAt,
		UpdatedAt:     p.UpdatedAt,
	}
}
