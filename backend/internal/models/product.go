package models

import (
	"time"
)

// Product represents a product in the store
type Product struct {
	ID            uint             `gorm:"primaryKey" json:"id"`
	CategoryID    uint             `gorm:"not null;index" json:"category_id" binding:"required"`
	Category      *Category        `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
	Name          string           `gorm:"size:255;not null" json:"name" binding:"required"`
	Description   string           `gorm:"type:text" json:"description"`
	Price         float64          `gorm:"type:decimal(10,2);not null" json:"price" binding:"required,gt=0"`
	DiscountPrice *float64         `gorm:"type:decimal(10,2)" json:"discount_price"`
	Slug          string           `gorm:"size:255;uniqueIndex;not null" json:"slug" binding:"required"`
	IsActive      bool             `gorm:"default:true;index" json:"is_active"`
	Images        []ProductImage   `gorm:"foreignKey:ProductID" json:"images,omitempty"`
	Variants      []ProductVariant `gorm:"foreignKey:ProductID" json:"variants,omitempty"`
	CreatedAt     time.Time        `json:"created_at"`
	UpdatedAt     time.Time        `json:"updated_at"`
}

// ProductImage represents a product image
type ProductImage struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	ProductID uint      `gorm:"not null;index" json:"product_id"`
	ImageURL  string    `gorm:"size:500;not null" json:"image_url" binding:"required"`
	IsPrimary bool      `gorm:"default:false" json:"is_primary"`
	CreatedAt time.Time `json:"created_at"`
}

// ProductVariant represents a product variant (size, color, stock)
type ProductVariant struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	ProductID     uint      `gorm:"not null;index" json:"product_id"`
	Size          string    `gorm:"size:20;not null" json:"size" binding:"required"`
	Color         string    `gorm:"size:50;not null" json:"color" binding:"required"`
	StockQuantity int       `gorm:"not null;default:0" json:"stock_quantity" binding:"min=0"`
	SKU           string    `gorm:"size:100;uniqueIndex;not null" json:"sku" binding:"required"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// ProductResponse is the response DTO for product
type ProductResponse struct {
	ID            uint                    `json:"id"`
	CategoryID    uint                    `json:"category_id"`
	Category      *CategoryResponse       `json:"category,omitempty"`
	Name          string                  `json:"name"`
	Description   string                  `json:"description"`
	Price         float64                 `json:"price"`
	DiscountPrice *float64                `json:"discount_price"`
	Slug          string                  `json:"slug"`
	IsActive      bool                    `json:"is_active"`
	Images        []ProductImageResponse  `json:"images,omitempty"`
	Variants      []ProductVariantResponse `json:"variants,omitempty"`
	CreatedAt     string                  `json:"created_at"`
	UpdatedAt     string                  `json:"updated_at"`
}

// ProductImageResponse is the response DTO for product image
type ProductImageResponse struct {
	ID        uint   `json:"id"`
	ProductID uint   `json:"product_id"`
	ImageURL  string `json:"image_url"`
	IsPrimary bool   `json:"is_primary"`
	CreatedAt string `json:"created_at"`
}

// ProductVariantResponse is the response DTO for product variant
type ProductVariantResponse struct {
	ID            uint   `json:"id"`
	ProductID     uint   `json:"product_id"`
	Size          string `json:"size"`
	Color         string `json:"color"`
	StockQuantity int    `json:"stock_quantity"`
	SKU           string `json:"sku"`
	CreatedAt     string `json:"created_at"`
	UpdatedAt     string `json:"updated_at"`
}

// ToResponse converts Product to ProductResponse
func (p *Product) ToResponse() ProductResponse {
	response := ProductResponse{
		ID:            p.ID,
		CategoryID:    p.CategoryID,
		Name:          p.Name,
		Description:   p.Description,
		Price:         p.Price,
		DiscountPrice: p.DiscountPrice,
		Slug:          p.Slug,
		IsActive:      p.IsActive,
		CreatedAt:     p.CreatedAt.Format(time.RFC3339),
		UpdatedAt:     p.UpdatedAt.Format(time.RFC3339),
	}

	if p.Category != nil {
		cat := p.Category.ToResponse()
		response.Category = &cat
	}

	if len(p.Images) > 0 {
		response.Images = make([]ProductImageResponse, len(p.Images))
		for i, img := range p.Images {
			response.Images[i] = img.ToResponse()
		}
	}

	if len(p.Variants) > 0 {
		response.Variants = make([]ProductVariantResponse, len(p.Variants))
		for i, variant := range p.Variants {
			response.Variants[i] = variant.ToResponse()
		}
	}

	return response
}

// ToResponse converts ProductImage to ProductImageResponse
func (pi *ProductImage) ToResponse() ProductImageResponse {
	return ProductImageResponse{
		ID:        pi.ID,
		ProductID: pi.ProductID,
		ImageURL:  pi.ImageURL,
		IsPrimary: pi.IsPrimary,
		CreatedAt: pi.CreatedAt.Format(time.RFC3339),
	}
}

// ToResponse converts ProductVariant to ProductVariantResponse
func (pv *ProductVariant) ToResponse() ProductVariantResponse {
	return ProductVariantResponse{
		ID:            pv.ID,
		ProductID:     pv.ProductID,
		Size:          pv.Size,
		Color:         pv.Color,
		StockQuantity: pv.StockQuantity,
		SKU:           pv.SKU,
		CreatedAt:     pv.CreatedAt.Format(time.RFC3339),
		UpdatedAt:     pv.UpdatedAt.Format(time.RFC3339),
	}
}
