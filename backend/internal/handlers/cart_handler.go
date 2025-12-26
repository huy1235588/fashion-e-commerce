package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/huy1235588/fashion-e-commerce/internal/middleware"
	"github.com/huy1235588/fashion-e-commerce/internal/services"
)

// CartHandler handles shopping cart HTTP requests
type CartHandler struct {
	service *services.CartService
}

// NewCartHandler creates a new cart handler
func NewCartHandler(service *services.CartService) *CartHandler {
	return &CartHandler{service: service}
}

// AddToCartRequest represents the request body for adding to cart
type AddToCartRequest struct {
	ProductID uint `json:"product_id" binding:"required"`
	VariantID uint `json:"variant_id" binding:"required"`
	Quantity  int  `json:"quantity" binding:"required,min=1"`
}

// UpdateCartItemRequest represents the request body for updating cart item
type UpdateCartItemRequest struct {
	Quantity int `json:"quantity" binding:"required,min=1"`
}

// GetCart handles retrieving the user's cart
// @Summary Get user's shopping cart
// @Tags cart
// @Produce json
// @Success 200 {object} models.CartResponse
// @Router /cart [get]
func (h *CartHandler) GetCart(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	cart, err := h.service.GetOrCreateCart(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to retrieve cart"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": cart.ToResponse()})
}

// AddToCart handles adding an item to cart
// @Summary Add item to cart
// @Tags cart
// @Accept json
// @Produce json
// @Param item body AddToCartRequest true "Item data"
// @Success 200 {object} models.CartResponse
// @Router /cart/items [post]
func (h *CartHandler) AddToCart(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req AddToCartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cart, err := h.service.AddToCart(userID, req.ProductID, req.VariantID, req.Quantity)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": cart.ToResponse()})
}

// UpdateCartItem handles updating a cart item quantity
// @Summary Update cart item quantity
// @Tags cart
// @Accept json
// @Produce json
// @Param id path int true "Cart Item ID"
// @Param item body UpdateCartItemRequest true "Update data"
// @Success 200 {object} models.CartResponse
// @Router /cart/items/{id} [put]
func (h *CartHandler) UpdateCartItem(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	itemID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid item ID"})
		return
	}

	var req UpdateCartItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cart, err := h.service.UpdateCartItem(userID, uint(itemID), req.Quantity)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": cart.ToResponse()})
}

// RemoveCartItem handles removing an item from cart
// @Summary Remove item from cart
// @Tags cart
// @Param id path int true "Cart Item ID"
// @Success 200 {object} models.CartResponse
// @Router /cart/items/{id} [delete]
func (h *CartHandler) RemoveCartItem(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	itemID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid item ID"})
		return
	}

	cart, err := h.service.RemoveCartItem(userID, uint(itemID))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": cart.ToResponse()})
}

// ClearCart handles clearing all items from cart
// @Summary Clear all items from cart
// @Tags cart
// @Success 200 {object} models.CartResponse
// @Router /cart/clear [post]
func (h *CartHandler) ClearCart(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	cart, err := h.service.ClearCart(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": cart.ToResponse()})
}
