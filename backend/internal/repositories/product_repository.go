package repositories

import (
	"github.com/huy1235588/fashion-e-commerce/internal/models"
	"gorm.io/gorm"
)

// ProductFilters represents filters for product listing
type ProductFilters struct {
	CategoryID   *uint
	MinPrice     *float64
	MaxPrice     *float64
	SearchQuery  string
	IsActive     *bool
	Page         int
	PageSize     int
}

// ProductRepository defines the interface for product data access
type ProductRepository interface {
	Create(product *models.Product) error
	FindByID(id uint) (*models.Product, error)
	FindBySlug(slug string) (*models.Product, error)
	Update(product *models.Product) error
	Delete(id uint) error
	List(filters ProductFilters) ([]models.Product, int64, error)
	
	// Image operations
	CreateImage(image *models.ProductImage) error
	DeleteImage(id uint) error
	FindImageByID(id uint) (*models.ProductImage, error)
	GetProductImages(productID uint) ([]models.ProductImage, error)
	
	// Variant operations
	CreateVariant(variant *models.ProductVariant) error
	UpdateVariant(variant *models.ProductVariant) error
	DeleteVariant(id uint) error
	GetProductVariants(productID uint) ([]models.ProductVariant, error)
	FindVariantBySKU(sku string) (*models.ProductVariant, error)
}

type productRepository struct {
	db *gorm.DB
}

// NewProductRepository creates a new product repository
func NewProductRepository(db *gorm.DB) ProductRepository {
	return &productRepository{db: db}
}

func (r *productRepository) Create(product *models.Product) error {
	return r.db.Create(product).Error
}

func (r *productRepository) FindByID(id uint) (*models.Product, error) {
	var product models.Product
	err := r.db.Preload("Category").
		Preload("Images").
		Preload("Variants").
		First(&product, id).Error
	if err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *productRepository) FindBySlug(slug string) (*models.Product, error) {
	var product models.Product
	err := r.db.Preload("Category").
		Preload("Images").
		Preload("Variants").
		Where("slug = ?", slug).
		First(&product).Error
	if err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *productRepository) Update(product *models.Product) error {
	return r.db.Save(product).Error
}

func (r *productRepository) Delete(id uint) error {
	return r.db.Delete(&models.Product{}, id).Error
}

func (r *productRepository) List(filters ProductFilters) ([]models.Product, int64, error) {
	var products []models.Product
	var total int64

	query := r.db.Model(&models.Product{}).
		Preload("Category").
		Preload("Images").
		Preload("Variants")

	// Apply filters
	if filters.CategoryID != nil {
		query = query.Where("category_id = ?", *filters.CategoryID)
	}

	if filters.MinPrice != nil {
		query = query.Where("price >= ?", *filters.MinPrice)
	}

	if filters.MaxPrice != nil {
		query = query.Where("price <= ?", *filters.MaxPrice)
	}

	if filters.SearchQuery != "" {
		searchTerm := "%" + filters.SearchQuery + "%"
		query = query.Where("name ILIKE ? OR description ILIKE ?", searchTerm, searchTerm)
	}

	if filters.IsActive != nil {
		query = query.Where("is_active = ?", *filters.IsActive)
	}

	// Count total before pagination
	query.Count(&total)

	// Apply pagination
	if filters.Page > 0 && filters.PageSize > 0 {
		offset := (filters.Page - 1) * filters.PageSize
		query = query.Offset(offset).Limit(filters.PageSize)
	}

	// Execute query
	err := query.Order("created_at DESC").Find(&products).Error
	return products, total, err
}

// Image operations
func (r *productRepository) CreateImage(image *models.ProductImage) error {
	return r.db.Create(image).Error
}

func (r *productRepository) DeleteImage(id uint) error {
	return r.db.Delete(&models.ProductImage{}, id).Error
}

func (r *productRepository) FindImageByID(id uint) (*models.ProductImage, error) {
	var image models.ProductImage
	if err := r.db.First(&image, id).Error; err != nil {
		return nil, err
	}
	return &image, nil
}

func (r *productRepository) GetProductImages(productID uint) ([]models.ProductImage, error) {
	var images []models.ProductImage
	err := r.db.Where("product_id = ?", productID).Find(&images).Error
	return images, err
}

// Variant operations
func (r *productRepository) CreateVariant(variant *models.ProductVariant) error {
	return r.db.Create(variant).Error
}

func (r *productRepository) UpdateVariant(variant *models.ProductVariant) error {
	return r.db.Save(variant).Error
}

func (r *productRepository) DeleteVariant(id uint) error {
	return r.db.Delete(&models.ProductVariant{}, id).Error
}

func (r *productRepository) GetProductVariants(productID uint) ([]models.ProductVariant, error) {
	var variants []models.ProductVariant
	err := r.db.Where("product_id = ?", productID).Find(&variants).Error
	return variants, err
}

func (r *productRepository) FindVariantBySKU(sku string) (*models.ProductVariant, error) {
	var variant models.ProductVariant
	err := r.db.Where("sku = ?", sku).First(&variant).Error
	if err != nil {
		return nil, err
	}
	return &variant, nil
}
