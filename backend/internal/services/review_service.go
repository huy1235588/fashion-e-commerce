package services

import (
	"errors"
	"github.com/huy1235588/fashion-e-commerce/internal/models"
	"github.com/huy1235588/fashion-e-commerce/internal/repositories"
)

// ReviewService handles business logic for reviews
type ReviewService struct {
	reviewRepo repositories.ReviewRepository
	orderRepo  repositories.OrderRepository
}

// NewReviewService creates a new ReviewService
func NewReviewService(
	reviewRepo repositories.ReviewRepository,
	orderRepo repositories.OrderRepository,
) *ReviewService {
	return &ReviewService{
		reviewRepo: reviewRepo,
		orderRepo:  orderRepo,
	}
}

// CreateReviewRequest represents review creation request
type CreateReviewRequest struct {
	ProductID uint     `json:"product_id" binding:"required"`
	OrderID   uint     `json:"order_id" binding:"required"`
	Rating    int      `json:"rating" binding:"required,min=1,max=5"`
	Comment   string   `json:"comment"`
	Images    []string `json:"images"`
}

// CreateReview creates a new review
func (s *ReviewService) CreateReview(userID uint, req CreateReviewRequest) (*models.Review, error) {
	// 1. Verify order exists and belongs to user
	order, err := s.orderRepo.FindByID(req.OrderID)
	if err != nil {
		return nil, errors.New("order not found")
	}
	if order.UserID != userID {
		return nil, errors.New("unauthorized: order does not belong to user")
	}

	// 2. Verify order is delivered or completed
	if order.Status != "delivered" && order.Status != "completed" {
		return nil, errors.New("can only review delivered or completed orders")
	}

	// 3. Verify order contains the product
	hasProduct := false
	for _, item := range order.OrderItems {
		if item.ProductID == req.ProductID {
			hasProduct = true
			break
		}
	}
	if !hasProduct {
		return nil, errors.New("product not found in order")
	}

	// 4. Check if user already reviewed this product for this order
	exists, err := s.reviewRepo.CheckUserReviewed(userID, req.ProductID, req.OrderID)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, errors.New("you have already reviewed this product for this order")
	}

	// 5. Create review
	review := &models.Review{
		ProductID: req.ProductID,
		UserID:    userID,
		OrderID:   req.OrderID,
		Rating:    req.Rating,
		Comment:   req.Comment,
		Status:    "approved", // Auto-approve for now, can change to "pending" for moderation
	}

	if err := s.reviewRepo.Create(review); err != nil {
		return nil, err
	}

	return review, nil
}

// GetProductReviews gets all reviews for a product
func (s *ReviewService) GetProductReviews(productID uint, page, limit int) ([]models.Review, int64, error) {
	offset := (page - 1) * limit
	return s.reviewRepo.FindByProduct(productID, limit, offset)
}

// GetUserReviews gets all reviews by a user
func (s *ReviewService) GetUserReviews(userID uint) ([]models.Review, error) {
	// Get all reviews (use large limit)
	reviews, _, err := s.reviewRepo.FindByUser(userID, 1000, 0)
	return reviews, err
}

// GetProductRating gets average rating and count for a product
func (s *ReviewService) GetProductRating(productID uint) (float64, int64, error) {
	return s.reviewRepo.GetAverageRating(productID)
}

// DeleteReview deletes a review (user can delete their own review)
func (s *ReviewService) DeleteReview(reviewID, userID uint) error {
	review, err := s.reviewRepo.FindByID(reviewID)
	if err != nil {
		return errors.New("review not found")
	}

	if review.UserID != userID {
		return errors.New("unauthorized: you can only delete your own reviews")
	}

	return s.reviewRepo.Delete(reviewID)
}

// UpdateReviewStatus updates review status (admin only)
func (s *ReviewService) UpdateReviewStatus(reviewID uint, status string) error {
	if status != "pending" && status != "approved" && status != "rejected" {
		return errors.New("invalid status")
	}

	return s.reviewRepo.UpdateStatus(reviewID, status)
}
