package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/huy1235588/fashion-e-commerce/internal/models"
	"github.com/huy1235588/fashion-e-commerce/internal/repositories"
	"github.com/huy1235588/fashion-e-commerce/internal/services"
)

// ProductHandler handles product HTTP requests
type ProductHandler struct {
	service *services.ProductService
}

// NewProductHandler creates a new product handler
func NewProductHandler(service *services.ProductService) *ProductHandler {
	return &ProductHandler{service: service}
}

// CreateProductRequest represents the request body for creating a product
type CreateProductRequest struct {
	Product  models.Product         `json:"product" binding:"required"`
	Variants []models.ProductVariant `json:"variants"`
	Images   []models.ProductImage   `json:"images"`
}

// CreateProduct handles product creation (admin only)
// @Summary Create a new product
// @Tags products
// @Accept json
// @Produce json
// @Param product body CreateProductRequest true "Product data"
// @Success 201 {object} models.ProductResponse
// @Router /admin/products [post]
func (h *ProductHandler) CreateProduct(c *gin.Context) {
	var req CreateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.CreateProduct(&req.Product, req.Variants, req.Images); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Fetch the created product with all relations
	product, _ := h.service.GetProduct(req.Product.ID)
	c.JSON(http.StatusCreated, gin.H{"data": product.ToResponse()})
}

// GetProduct handles retrieving a single product
// @Summary Get product by ID
// @Tags products
// @Produce json
// @Param id path int true "Product ID"
// @Success 200 {object} models.ProductResponse
// @Router /products/{id} [get]
func (h *ProductHandler) GetProduct(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid product ID"})
		return
	}

	product, err := h.service.GetProduct(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "product not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": product.ToResponse()})
}

// GetProductBySlug handles retrieving a product by slug
// @Summary Get product by slug
// @Tags products
// @Produce json
// @Param slug path string true "Product slug"
// @Success 200 {object} models.ProductResponse
// @Router /products/slug/{slug} [get]
func (h *ProductHandler) GetProductBySlug(c *gin.Context) {
	slug := c.Param("slug")

	product, err := h.service.GetProductBySlug(slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "product not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": product.ToResponse()})
}

// UpdateProduct handles product updates (admin only)
// @Summary Update a product
// @Tags products
// @Accept json
// @Produce json
// @Param id path int true "Product ID"
// @Param product body models.Product true "Product data"
// @Success 200 {object} models.ProductResponse
// @Router /admin/products/{id} [put]
func (h *ProductHandler) UpdateProduct(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid product ID"})
		return
	}

	var updates models.Product
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.UpdateProduct(uint(id), &updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	product, _ := h.service.GetProduct(uint(id))
	c.JSON(http.StatusOK, gin.H{"data": product.ToResponse()})
}

// DeleteProduct handles product deletion (admin only)
// @Summary Delete a product
// @Tags products
// @Param id path int true "Product ID"
// @Success 204
// @Router /admin/products/{id} [delete]
func (h *ProductHandler) DeleteProduct(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid product ID"})
		return
	}

	if err := h.service.DeleteProduct(uint(id)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

// ListProducts handles retrieving products with filters
// @Summary List products
// @Tags products
// @Produce json
// @Param category_id query int false "Category ID"
// @Param min_price query number false "Minimum price"
// @Param max_price query number false "Maximum price"
// @Param search query string false "Search query"
// @Param page query int false "Page number" default(1)
// @Param page_size query int false "Page size" default(20)
// @Success 200 {object} map[string]interface{}
// @Router /products [get]
func (h *ProductHandler) ListProducts(c *gin.Context) {
	var filters repositories.ProductFilters

	// Parse query parameters
	if categoryID := c.Query("category_id"); categoryID != "" {
		id, err := strconv.ParseUint(categoryID, 10, 32)
		if err == nil {
			catID := uint(id)
			filters.CategoryID = &catID
		}
	}

	if minPrice := c.Query("min_price"); minPrice != "" {
		price, err := strconv.ParseFloat(minPrice, 64)
		if err == nil {
			filters.MinPrice = &price
		}
	}

	if maxPrice := c.Query("max_price"); maxPrice != "" {
		price, err := strconv.ParseFloat(maxPrice, 64)
		if err == nil {
			filters.MaxPrice = &price
		}
	}

	filters.SearchQuery = c.Query("search")

	// Only show active products for non-admin users
	isActive := true
	filters.IsActive = &isActive

	// Pagination
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	filters.Page = page
	filters.PageSize = pageSize

	products, total, err := h.service.ListProducts(filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to retrieve products"})
		return
	}

	responses := make([]models.ProductResponse, len(products))
	for i, product := range products {
		responses[i] = product.ToResponse()
	}

	c.JSON(http.StatusOK, gin.H{
		"data": responses,
		"pagination": gin.H{
			"total":     total,
			"page":      page,
			"page_size": pageSize,
			"pages":     (total + int64(pageSize) - 1) / int64(pageSize),
		},
	})
}

// AddProductImage handles adding an image to a product (admin only)
// @Summary Add image to product
// @Tags products
// @Accept json
// @Produce json
// @Param id path int true "Product ID"
// @Param image body models.ProductImage true "Image data"
// @Success 201 {object} models.ProductImageResponse
// @Router /admin/products/{id}/images [post]
func (h *ProductHandler) AddProductImage(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid product ID"})
		return
	}

	// Prefer handling multipart upload when an image file is provided
	if fileHeader, err := c.FormFile("image"); err == nil {
		isPrimary := false
		if primaryVal := c.DefaultPostForm("is_primary", "false"); primaryVal != "" {
			primaryParsed, _ := strconv.ParseBool(primaryVal)
			isPrimary = primaryParsed
		}

		file, err := fileHeader.Open()
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "unable to read uploaded file"})
			return
		}
		defer file.Close()

		uploadedPath, err := h.service.AddProductImageWithFile(uint(id), file, fileHeader, isPrimary)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "image uploaded successfully", "path": uploadedPath})
		return
	}

	// Fallback to JSON payload for backward compatibility
	var image models.ProductImage
	if err := c.ShouldBindJSON(&image); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.AddProductImage(uint(id), image.ImageURL, image.IsPrimary); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "image added successfully"})
}

// DeleteProductImage handles deleting a product image (admin only)
// @Summary Delete product image
// @Tags products
// @Param id path int true "Product ID"
// @Param image_id path int true "Image ID"
// @Success 204
// @Router /admin/products/{id}/images/{image_id} [delete]
func (h *ProductHandler) DeleteProductImage(c *gin.Context) {
	imageID, err := strconv.ParseUint(c.Param("image_id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid image ID"})
		return
	}

	if err := h.service.DeleteProductImage(uint(imageID)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

// AddProductVariant handles adding a variant to a product (admin only)
// @Summary Add variant to product
// @Tags products
// @Accept json
// @Produce json
// @Param id path int true "Product ID"
// @Param variant body models.ProductVariant true "Variant data"
// @Success 201 {object} models.ProductVariantResponse
// @Router /admin/products/{id}/variants [post]
func (h *ProductHandler) AddProductVariant(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid product ID"})
		return
	}

	var variant models.ProductVariant
	if err := c.ShouldBindJSON(&variant); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	variant.ProductID = uint(id)
	if err := h.service.AddProductVariant(&variant); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": variant.ToResponse()})
}

// UpdateProductVariant handles updating a product variant (admin only)
// @Summary Update product variant
// @Tags products
// @Accept json
// @Produce json
// @Param id path int true "Product ID"
// @Param variant_id path int true "Variant ID"
// @Param variant body models.ProductVariant true "Variant data"
// @Success 200 {object} models.ProductVariantResponse
// @Router /admin/products/{id}/variants/{variant_id} [put]
func (h *ProductHandler) UpdateProductVariant(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid product ID"})
		return
	}

	variantID, err := strconv.ParseUint(c.Param("variant_id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid variant ID"})
		return
	}

	var updates models.ProductVariant
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updates.ProductID = uint(id)
	if err := h.service.UpdateProductVariant(uint(variantID), &updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "variant updated successfully"})
}

// DeleteProductVariant handles deleting a product variant (admin only)
// @Summary Delete product variant
// @Tags products
// @Param id path int true "Product ID"
// @Param variant_id path int true "Variant ID"
// @Success 204
// @Router /admin/products/{id}/variants/{variant_id} [delete]
func (h *ProductHandler) DeleteProductVariant(c *gin.Context) {
	variantID, err := strconv.ParseUint(c.Param("variant_id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid variant ID"})
		return
	}

	if err := h.service.DeleteProductVariant(uint(variantID)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
