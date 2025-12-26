package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/huy1235588/fashion-e-commerce/internal/models"
	"github.com/huy1235588/fashion-e-commerce/internal/services"
)

// CategoryHandler handles category HTTP requests
type CategoryHandler struct {
	service *services.CategoryService
}

// NewCategoryHandler creates a new category handler
func NewCategoryHandler(service *services.CategoryService) *CategoryHandler {
	return &CategoryHandler{service: service}
}

// CreateCategory handles category creation (admin only)
// @Summary Create a new category
// @Tags categories
// @Accept json
// @Produce json
// @Param category body models.Category true "Category data"
// @Success 201 {object} models.CategoryResponse
// @Router /admin/categories [post]
func (h *CategoryHandler) CreateCategory(c *gin.Context) {
	var category models.Category
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.CreateCategory(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": category.ToResponse()})
}

// GetCategory handles retrieving a single category
// @Summary Get category by ID
// @Tags categories
// @Produce json
// @Param id path int true "Category ID"
// @Success 200 {object} models.CategoryResponse
// @Router /categories/{id} [get]
func (h *CategoryHandler) GetCategory(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid category ID"})
		return
	}

	category, err := h.service.GetCategory(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "category not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": category.ToResponse()})
}

// GetCategoryBySlug handles retrieving a category by slug
// @Summary Get category by slug
// @Tags categories
// @Produce json
// @Param slug path string true "Category slug"
// @Success 200 {object} models.CategoryResponse
// @Router /categories/slug/{slug} [get]
func (h *CategoryHandler) GetCategoryBySlug(c *gin.Context) {
	slug := c.Param("slug")

	category, err := h.service.GetCategoryBySlug(slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "category not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": category.ToResponse()})
}

// UpdateCategory handles category updates (admin only)
// @Summary Update a category
// @Tags categories
// @Accept json
// @Produce json
// @Param id path int true "Category ID"
// @Param category body models.Category true "Category data"
// @Success 200 {object} models.CategoryResponse
// @Router /admin/categories/{id} [put]
func (h *CategoryHandler) UpdateCategory(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid category ID"})
		return
	}

	var updates models.Category
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.UpdateCategory(uint(id), &updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	category, _ := h.service.GetCategory(uint(id))
	c.JSON(http.StatusOK, gin.H{"data": category.ToResponse()})
}

// DeleteCategory handles category deletion (admin only)
// @Summary Delete a category
// @Tags categories
// @Param id path int true "Category ID"
// @Success 204
// @Router /admin/categories/{id} [delete]
func (h *CategoryHandler) DeleteCategory(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid category ID"})
		return
	}

	if err := h.service.DeleteCategory(uint(id)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

// ListCategories handles retrieving all categories
// @Summary List all categories
// @Tags categories
// @Produce json
// @Success 200 {array} models.CategoryResponse
// @Router /categories [get]
func (h *CategoryHandler) ListCategories(c *gin.Context) {
	categories, err := h.service.ListCategories()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to retrieve categories"})
		return
	}

	responses := make([]models.CategoryResponse, len(categories))
	for i, cat := range categories {
		responses[i] = cat.ToResponse()
	}

	c.JSON(http.StatusOK, gin.H{"data": responses})
}
