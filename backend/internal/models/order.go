package models

import (
	"time"

	"gorm.io/gorm"
)

type OrderStatus string

const (
	OrderStatusPending    OrderStatus = "pending"
	OrderStatusProcessing OrderStatus = "processing"
	OrderStatusShipping   OrderStatus = "shipping"
	OrderStatusDelivered  OrderStatus = "delivered"
	OrderStatusCancelled  OrderStatus = "cancelled"
)

type PaymentMethod string

const (
	PaymentMethodCOD   PaymentMethod = "cod"
	PaymentMethodVNPay PaymentMethod = "vnpay"
	PaymentMethodMoMo  PaymentMethod = "momo"
)

type PaymentStatus string

const (
	PaymentStatusPending   PaymentStatus = "pending"
	PaymentStatusPaid      PaymentStatus = "paid"
	PaymentStatusFailed    PaymentStatus = "failed"
	PaymentStatusRefunded  PaymentStatus = "refunded"
)

// Order represents a customer order
type Order struct {
	ID              uint           `gorm:"primarykey" json:"id"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`
	OrderCode       string         `gorm:"uniqueIndex;not null" json:"order_code"`
	UserID          uint           `gorm:"not null;index" json:"user_id"`
	Status          OrderStatus    `gorm:"type:varchar(20);not null;default:'pending'" json:"status"`
	PaymentMethod   PaymentMethod  `gorm:"type:varchar(20);not null" json:"payment_method"`
	PaymentStatus   PaymentStatus  `gorm:"type:varchar(20);not null;default:'pending'" json:"payment_status"`
	SubtotalAmount  float64        `gorm:"type:decimal(10,2);not null" json:"subtotal_amount"`
	ShippingFee     float64        `gorm:"type:decimal(10,2);not null;default:0" json:"shipping_fee"`
	TotalAmount     float64        `gorm:"type:decimal(10,2);not null" json:"total_amount"`
	Note            string         `gorm:"type:text" json:"note"`
	CancelReason    string         `gorm:"type:text" json:"cancel_reason,omitempty"`

	// Shipping address (denormalized for historical record)
	ShippingFullName    string `gorm:"type:varchar(100);not null" json:"shipping_full_name"`
	ShippingPhone       string `gorm:"type:varchar(20);not null" json:"shipping_phone"`
	ShippingProvince    string `gorm:"type:varchar(100);not null" json:"shipping_province"`
	ShippingDistrict    string `gorm:"type:varchar(100);not null" json:"shipping_district"`
	ShippingWard        string `gorm:"type:varchar(100);not null" json:"shipping_ward"`
	ShippingDetailAddress string `gorm:"type:text;not null" json:"shipping_detail_address"`

	// Relations
	User       User        `gorm:"foreignKey:UserID" json:"user,omitempty"`
	OrderItems []OrderItem `gorm:"foreignKey:OrderID" json:"order_items,omitempty"`
}

// OrderItem represents a product item in an order
type OrderItem struct {
	ID         uint           `gorm:"primarykey" json:"id"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
	OrderID    uint           `gorm:"not null;index" json:"order_id"`
	ProductID  uint           `gorm:"not null;index" json:"product_id"`
	VariantID  *uint          `gorm:"index" json:"variant_id"`
	ProductName string        `gorm:"type:varchar(255);not null" json:"product_name"`
	VariantName string        `gorm:"type:varchar(100)" json:"variant_name,omitempty"`
	Price      float64        `gorm:"type:decimal(10,2);not null" json:"price"`
	Quantity   int            `gorm:"not null" json:"quantity"`
	Subtotal   float64        `gorm:"type:decimal(10,2);not null" json:"subtotal"`

	// Relations
	Order   Order           `gorm:"foreignKey:OrderID" json:"-"`
	Product Product         `gorm:"foreignKey:ProductID" json:"product,omitempty"`
	Variant *ProductVariant `gorm:"foreignKey:VariantID" json:"variant,omitempty"`
}

// OrderResponse is the DTO for order responses
type OrderResponse struct {
	ID                    uint            `json:"id"`
	OrderCode             string          `json:"order_code"`
	UserID                uint            `json:"user_id"`
	Status                OrderStatus     `json:"status"`
	PaymentMethod         PaymentMethod   `json:"payment_method"`
	PaymentStatus         PaymentStatus   `json:"payment_status"`
	SubtotalAmount        float64         `json:"subtotal_amount"`
	ShippingFee           float64         `json:"shipping_fee"`
	TotalAmount           float64         `json:"total_amount"`
	Note                  string          `json:"note,omitempty"`
	CancelReason          string          `json:"cancel_reason,omitempty"`
	ShippingFullName      string          `json:"shipping_full_name"`
	ShippingPhone         string          `json:"shipping_phone"`
	ShippingProvince      string          `json:"shipping_province"`
	ShippingDistrict      string          `json:"shipping_district"`
	ShippingWard          string          `json:"shipping_ward"`
	ShippingDetailAddress string          `json:"shipping_detail_address"`
	OrderItems            []OrderItemResponse `json:"order_items,omitempty"`
	CreatedAt             time.Time       `json:"created_at"`
	UpdatedAt             time.Time       `json:"updated_at"`
}

// OrderItemResponse is the DTO for order item responses
type OrderItemResponse struct {
	ID          uint    `json:"id"`
	ProductID   uint    `json:"product_id"`
	VariantID   *uint   `json:"variant_id"`
	ProductName string  `json:"product_name"`
	VariantName string  `json:"variant_name,omitempty"`
	Price       float64 `json:"price"`
	Quantity    int     `json:"quantity"`
	Subtotal    float64 `json:"subtotal"`
}

// ToResponse converts Order to OrderResponse
func (o *Order) ToResponse() OrderResponse {
	response := OrderResponse{
		ID:                    o.ID,
		OrderCode:             o.OrderCode,
		UserID:                o.UserID,
		Status:                o.Status,
		PaymentMethod:         o.PaymentMethod,
		PaymentStatus:         o.PaymentStatus,
		SubtotalAmount:        o.SubtotalAmount,
		ShippingFee:           o.ShippingFee,
		TotalAmount:           o.TotalAmount,
		Note:                  o.Note,
		CancelReason:          o.CancelReason,
		ShippingFullName:      o.ShippingFullName,
		ShippingPhone:         o.ShippingPhone,
		ShippingProvince:      o.ShippingProvince,
		ShippingDistrict:      o.ShippingDistrict,
		ShippingWard:          o.ShippingWard,
		ShippingDetailAddress: o.ShippingDetailAddress,
		CreatedAt:             o.CreatedAt,
		UpdatedAt:             o.UpdatedAt,
	}

	if len(o.OrderItems) > 0 {
		response.OrderItems = make([]OrderItemResponse, len(o.OrderItems))
		for i, item := range o.OrderItems {
			response.OrderItems[i] = item.ToResponse()
		}
	}

	return response
}

// ToResponse converts OrderItem to OrderItemResponse
func (oi *OrderItem) ToResponse() OrderItemResponse {
	return OrderItemResponse{
		ID:          oi.ID,
		ProductID:   oi.ProductID,
		VariantID:   oi.VariantID,
		ProductName: oi.ProductName,
		VariantName: oi.VariantName,
		Price:       oi.Price,
		Quantity:    oi.Quantity,
		Subtotal:    oi.Subtotal,
	}
}
