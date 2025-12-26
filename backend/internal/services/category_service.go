package services

import (
	"errors"
	"github.com/huy1235588/fashion-e-commerce/internal/models"
	"github.com/huy1235588/fashion-e-commerce/internal/repositories"
	"gorm.io/gorm"
)

// CategoryService handles category business logic
type CategoryService struct {
	repo repositories.CategoryRepository
}

// NewCategoryService creates a new category service
func NewCategoryService(repo repositories.CategoryRepository) *CategoryService {
	return &CategoryService{repo: repo}
}

// CreateCategory creates a new category
func (s *CategoryService) CreateCategory(category *models.Category) error {
	// Check if slug already exists
	existing, err := s.repo.FindBySlug(category.Slug)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}
	if existing != nil {
		return errors.New("category with this slug already exists")
	}

	return s.repo.Create(category)
}

// GetCategory retrieves a category by ID
func (s *CategoryService) GetCategory(id uint) (*models.Category, error) {
	return s.repo.FindByID(id)
}

// GetCategoryBySlug retrieves a category by slug
func (s *CategoryService) GetCategoryBySlug(slug string) (*models.Category, error) {
	return s.repo.FindBySlug(slug)
}

// UpdateCategory updates a category
func (s *CategoryService) UpdateCategory(id uint, updates *models.Category) error {
	category, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}

	// Check if slug is being changed and if it conflicts
	if updates.Slug != category.Slug {
		existing, err := s.repo.FindBySlug(updates.Slug)
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			return err
		}
		if existing != nil && existing.ID != id {
			return errors.New("category with this slug already exists")
		}
	}

	category.Name = updates.Name
	category.Description = updates.Description
	category.Slug = updates.Slug

	return s.repo.Update(category)
}

// DeleteCategory deletes a category
func (s *CategoryService) DeleteCategory(id uint) error {
	return s.repo.Delete(id)
}

// ListCategories retrieves all categories
func (s *CategoryService) ListCategories() ([]models.Category, error) {
	return s.repo.List()
}
