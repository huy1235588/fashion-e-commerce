package models

import (
	"time"
)

// Cart represents a shopping cart
type Cart struct {
	ID        uint       `gorm:"primaryKey" json:"id"`
	UserID    uint       `gorm:"not null;uniqueIndex" json:"user_id"`
	User      *User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Items     []CartItem `gorm:"foreignKey:CartID" json:"items,omitempty"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
}

// CartItem represents an item in the shopping cart
type CartItem struct {
	ID        uint            `gorm:"primaryKey" json:"id"`
	CartID    uint            `gorm:"not null;index" json:"cart_id"`
	ProductID uint            `gorm:"not null;index" json:"product_id"`
	Product   *Product        `gorm:"foreignKey:ProductID" json:"product,omitempty"`
	VariantID uint            `gorm:"not null;index" json:"variant_id"`
	Variant   *ProductVariant `gorm:"foreignKey:VariantID" json:"variant,omitempty"`
	Quantity  int             `gorm:"not null;default:1" json:"quantity" binding:"required,min=1"`
	Price     float64         `gorm:"type:decimal(10,2);not null" json:"price"`
	CreatedAt time.Time       `json:"created_at"`
	UpdatedAt time.Time       `json:"updated_at"`
}

// CartResponse is the response DTO for cart
type CartResponse struct {
	ID        uint               `json:"id"`
	UserID    uint               `json:"user_id"`
	Items     []CartItemResponse `json:"items"`
	Subtotal  float64            `json:"subtotal"`
	Total     float64            `json:"total"`
	ItemCount int                `json:"item_count"`
	CreatedAt string             `json:"created_at"`
	UpdatedAt string             `json:"updated_at"`
}

// CartItemResponse is the response DTO for cart item
type CartItemResponse struct {
	ID        uint                    `json:"id"`
	CartID    uint                    `json:"cart_id"`
	ProductID uint                    `json:"product_id"`
	Product   *ProductResponse        `json:"product,omitempty"`
	VariantID uint                    `json:"variant_id"`
	Variant   *ProductVariantResponse `json:"variant,omitempty"`
	Quantity  int                     `json:"quantity"`
	Price     float64                 `json:"price"`
	Subtotal  float64                 `json:"subtotal"`
	CreatedAt string                  `json:"created_at"`
	UpdatedAt string                  `json:"updated_at"`
}

// ToResponse converts Cart to CartResponse
func (c *Cart) ToResponse() CartResponse {
	response := CartResponse{
		ID:        c.ID,
		UserID:    c.UserID,
		CreatedAt: c.CreatedAt.Format(time.RFC3339),
		UpdatedAt: c.UpdatedAt.Format(time.RFC3339),
	}

	if len(c.Items) > 0 {
		response.Items = make([]CartItemResponse, len(c.Items))
		var subtotal float64
		var itemCount int

		for i, item := range c.Items {
			response.Items[i] = item.ToResponse()
			subtotal += response.Items[i].Subtotal
			itemCount += item.Quantity
		}

		response.Subtotal = subtotal
		response.Total = subtotal // Can add shipping, taxes here
		response.ItemCount = itemCount
	} else {
		response.Items = []CartItemResponse{}
		response.Subtotal = 0
		response.Total = 0
		response.ItemCount = 0
	}

	return response
}

// ToResponse converts CartItem to CartItemResponse
func (ci *CartItem) ToResponse() CartItemResponse {
	response := CartItemResponse{
		ID:        ci.ID,
		CartID:    ci.CartID,
		ProductID: ci.ProductID,
		VariantID: ci.VariantID,
		Quantity:  ci.Quantity,
		Price:     ci.Price,
		Subtotal:  ci.Price * float64(ci.Quantity),
		CreatedAt: ci.CreatedAt.Format(time.RFC3339),
		UpdatedAt: ci.UpdatedAt.Format(time.RFC3339),
	}

	if ci.Product != nil {
		prod := ci.Product.ToResponse()
		response.Product = &prod
	}

	if ci.Variant != nil {
		variant := ci.Variant.ToResponse()
		response.Variant = &variant
	}

	return response
}
