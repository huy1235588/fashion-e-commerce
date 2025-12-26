package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/huy1235588/fashion-e-commerce/internal/services"
)

// ReviewHandler handles review-related HTTP requests
type ReviewHandler struct {
	reviewService *services.ReviewService
}

// NewReviewHandler creates a new ReviewHandler
func NewReviewHandler(reviewService *services.ReviewService) *ReviewHandler {
	return &ReviewHandler{reviewService: reviewService}
}

// CreateReview handles POST /api/reviews
func (h *ReviewHandler) CreateReview(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req services.CreateReviewRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	review, err := h.reviewService.CreateReview(userID.(uint), req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Review created successfully",
		"data":    review.ToResponse(),
	})
}

// GetProductReviews handles GET /api/products/:id/reviews
func (h *ReviewHandler) GetProductReviews(c *gin.Context) {
	productID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid product ID"})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	reviews, total, err := h.reviewService.GetProductReviews(uint(productID), page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch reviews"})
		return
	}

	// Convert to response format
	reviewResponses := make([]interface{}, len(reviews))
	for i, review := range reviews {
		reviewResponses[i] = review.ToResponse()
	}

	c.JSON(http.StatusOK, gin.H{
		"data": reviewResponses,
		"pagination": gin.H{
			"page":        page,
			"limit":       limit,
			"total":       total,
			"total_pages": (total + int64(limit) - 1) / int64(limit),
		},
	})
}

// GetProductRating handles GET /api/products/:id/rating
func (h *ReviewHandler) GetProductRating(c *gin.Context) {
	productID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid product ID"})
		return
	}

	average, count, err := h.reviewService.GetProductRating(uint(productID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch rating"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"average_rating": average,
		"review_count":   count,
	})
}

// GetUserReviews handles GET /api/users/me/reviews
func (h *ReviewHandler) GetUserReviews(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	reviews, err := h.reviewService.GetUserReviews(userID.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch reviews"})
		return
	}

	// Convert to response format
	reviewResponses := make([]interface{}, len(reviews))
	for i, review := range reviews {
		reviewResponses[i] = review.ToResponse()
	}

	c.JSON(http.StatusOK, gin.H{"data": reviewResponses})
}

// DeleteReview handles DELETE /api/reviews/:id
func (h *ReviewHandler) DeleteReview(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	reviewID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid review ID"})
		return
	}

	if err := h.reviewService.DeleteReview(uint(reviewID), userID.(uint)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Review deleted successfully"})
}
