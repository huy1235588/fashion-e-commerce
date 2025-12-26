package repositories

import (
	"github.com/huy1235588/fashion-e-commerce/internal/models"
	"gorm.io/gorm"
)

// CategoryRepository defines the interface for category data access
type CategoryRepository interface {
	Create(category *models.Category) error
	FindByID(id uint) (*models.Category, error)
	FindBySlug(slug string) (*models.Category, error)
	Update(category *models.Category) error
	Delete(id uint) error
	List() ([]models.Category, error)
}

type categoryRepository struct {
	db *gorm.DB
}

// NewCategoryRepository creates a new category repository
func NewCategoryRepository(db *gorm.DB) CategoryRepository {
	return &categoryRepository{db: db}
}

func (r *categoryRepository) Create(category *models.Category) error {
	return r.db.Create(category).Error
}

func (r *categoryRepository) FindByID(id uint) (*models.Category, error) {
	var category models.Category
	err := r.db.First(&category, id).Error
	if err != nil {
		return nil, err
	}
	return &category, nil
}

func (r *categoryRepository) FindBySlug(slug string) (*models.Category, error) {
	var category models.Category
	err := r.db.Where("slug = ?", slug).First(&category).Error
	if err != nil {
		return nil, err
	}
	return &category, nil
}

func (r *categoryRepository) Update(category *models.Category) error {
	return r.db.Save(category).Error
}

func (r *categoryRepository) Delete(id uint) error {
	return r.db.Delete(&models.Category{}, id).Error
}

func (r *categoryRepository) List() ([]models.Category, error) {
	var categories []models.Category
	err := r.db.Order("name ASC").Find(&categories).Error
	return categories, err
}
