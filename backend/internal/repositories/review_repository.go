package repositories

import (
	"github.com/huy1235588/fashion-e-commerce/internal/models"
	"gorm.io/gorm"
)

// ReviewRepository interface defines review-related database operations
type ReviewRepository interface {
	Create(review *models.Review) error
	FindByID(id uint) (*models.Review, error)
	FindByProduct(productID uint, limit, offset int) ([]models.Review, int64, error)
	Update(review *models.Review) error
	Delete(id uint) error
	FindByUser(userID uint, limit, offset int) ([]models.Review, int64, error)
	CheckUserReviewed(userID uint, productID uint, orderID uint) (bool, error)
	GetAverageRating(productID uint) (float64, int64, error)
	UpdateStatus(id uint, status string) error
}

// reviewRepository handles review-related database operations
type reviewRepository struct {
	db *gorm.DB
}

// NewReviewRepository creates a new ReviewRepository
func NewReviewRepository(db *gorm.DB) ReviewRepository {
	return &reviewRepository{db: db}
}

// Create creates a new review
func (r *reviewRepository) Create(review *models.Review) error {
	return r.db.Create(review).Error
}

// FindByID finds a review by ID
func (r *reviewRepository) FindByID(id uint) (*models.Review, error) {
	var review models.Review
	err := r.db.Preload("User").Preload("Product").First(&review, id).Error
	return &review, err
}

// FindByProduct finds all approved reviews for a product with pagination
func (r *reviewRepository) FindByProduct(productID uint, limit, offset int) ([]models.Review, int64, error) {
	var reviews []models.Review
	var total int64

	query := r.db.Where("product_id = ? AND status = ?", productID, "approved")
	
	// Count total
	if err := query.Model(&models.Review{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get reviews with pagination
	err := query.Preload("User").
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&reviews).Error

	return reviews, total, err
}

// FindByUser finds all reviews by a user with pagination
func (r *reviewRepository) FindByUser(userID uint, limit, offset int) ([]models.Review, int64, error) {
	var reviews []models.Review
	var total int64

	query := r.db.Where("user_id = ?", userID)
	
	// Count total
	if err := query.Model(&models.Review{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get reviews
	err := query.Preload("Product").
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&reviews).Error
	
	return reviews, total, err
}

// CheckUserReviewed checks if user already reviewed this product for this order
func (r *reviewRepository) CheckUserReviewed(userID uint, productID uint, orderID uint) (bool, error) {
	var count int64
	err := r.db.Model(&models.Review{}).
		Where("user_id = ? AND product_id = ? AND order_id = ?", userID, productID, orderID).
		Count(&count).Error
	
	return count > 0, err
}

// Update updates a review
func (r *reviewRepository) Update(review *models.Review) error {
	return r.db.Save(review).Error
}

// Delete deletes a review
func (r *reviewRepository) Delete(id uint) error {
	return r.db.Delete(&models.Review{}, id).Error
}

// GetAverageRating calculates average rating for a product
func (r *reviewRepository) GetAverageRating(productID uint) (float64, int64, error) {
	var result struct {
		Average float64
		Count   int64
	}

	err := r.db.Model(&models.Review{}).
		Select("AVG(rating) as average, COUNT(*) as count").
		Where("product_id = ? AND status = ?", productID, "approved").
		Scan(&result).Error

	return result.Average, result.Count, err
}

// UpdateStatus updates review status (for admin approval)
func (r *reviewRepository) UpdateStatus(id uint, status string) error {
	return r.db.Model(&models.Review{}).Where("id = ?", id).Update("status", status).Error
}
