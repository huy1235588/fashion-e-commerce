package services

import (
	"errors"
	"fmt"
	"github.com/huy1235588/fashion-e-commerce/internal/models"
	"github.com/huy1235588/fashion-e-commerce/internal/repositories"
	"gorm.io/gorm"
)

// ProductService handles product business logic
type ProductService struct {
	productRepo  repositories.ProductRepository
	categoryRepo repositories.CategoryRepository
}

// NewProductService creates a new product service
func NewProductService(productRepo repositories.ProductRepository, categoryRepo repositories.CategoryRepository) *ProductService {
	return &ProductService{
		productRepo:  productRepo,
		categoryRepo: categoryRepo,
	}
}

// CreateProduct creates a new product with variants and images
func (s *ProductService) CreateProduct(product *models.Product, variants []models.ProductVariant, images []models.ProductImage) error {
	// Validate category exists
	_, err := s.categoryRepo.FindByID(product.CategoryID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("category not found")
		}
		return err
	}

	// Check if slug already exists
	existing, err := s.productRepo.FindBySlug(product.Slug)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}
	if existing != nil {
		return errors.New("product with this slug already exists")
	}

	// Create product
	if err := s.productRepo.Create(product); err != nil {
		return err
	}

	// Create variants
	for i := range variants {
		variants[i].ProductID = product.ID
		if err := s.productRepo.CreateVariant(&variants[i]); err != nil {
			return fmt.Errorf("failed to create variant: %w", err)
		}
	}

	// Create images
	for i := range images {
		images[i].ProductID = product.ID
		if err := s.productRepo.CreateImage(&images[i]); err != nil {
			return fmt.Errorf("failed to create image: %w", err)
		}
	}

	return nil
}

// GetProduct retrieves a product by ID
func (s *ProductService) GetProduct(id uint) (*models.Product, error) {
	return s.productRepo.FindByID(id)
}

// GetProductBySlug retrieves a product by slug
func (s *ProductService) GetProductBySlug(slug string) (*models.Product, error) {
	return s.productRepo.FindBySlug(slug)
}

// UpdateProduct updates a product
func (s *ProductService) UpdateProduct(id uint, updates *models.Product) error {
	product, err := s.productRepo.FindByID(id)
	if err != nil {
		return err
	}

	// Validate category if changed
	if updates.CategoryID != product.CategoryID {
		_, err := s.categoryRepo.FindByID(updates.CategoryID)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return errors.New("category not found")
			}
			return err
		}
	}

	// Check slug uniqueness if changed
	if updates.Slug != product.Slug {
		existing, err := s.productRepo.FindBySlug(updates.Slug)
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			return err
		}
		if existing != nil && existing.ID != id {
			return errors.New("product with this slug already exists")
		}
	}

	// Update fields
	product.CategoryID = updates.CategoryID
	product.Name = updates.Name
	product.Description = updates.Description
	product.Price = updates.Price
	product.DiscountPrice = updates.DiscountPrice
	product.Slug = updates.Slug
	product.IsActive = updates.IsActive

	return s.productRepo.Update(product)
}

// DeleteProduct deletes a product
func (s *ProductService) DeleteProduct(id uint) error {
	return s.productRepo.Delete(id)
}

// ListProducts retrieves products with filters
func (s *ProductService) ListProducts(filters repositories.ProductFilters) ([]models.Product, int64, error) {
	return s.productRepo.List(filters)
}

// AddProductImage adds an image to a product
func (s *ProductService) AddProductImage(productID uint, imageURL string, isPrimary bool) error {
	// Verify product exists
	_, err := s.productRepo.FindByID(productID)
	if err != nil {
		return err
	}

	image := &models.ProductImage{
		ProductID: productID,
		ImageURL:  imageURL,
		IsPrimary: isPrimary,
	}

	return s.productRepo.CreateImage(image)
}

// DeleteProductImage deletes a product image
func (s *ProductService) DeleteProductImage(imageID uint) error {
	return s.productRepo.DeleteImage(imageID)
}

// AddProductVariant adds a variant to a product
func (s *ProductService) AddProductVariant(variant *models.ProductVariant) error {
	// Verify product exists
	_, err := s.productRepo.FindByID(variant.ProductID)
	if err != nil {
		return err
	}

	// Check SKU uniqueness
	existing, err := s.productRepo.FindVariantBySKU(variant.SKU)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}
	if existing != nil {
		return errors.New("variant with this SKU already exists")
	}

	return s.productRepo.CreateVariant(variant)
}

// UpdateProductVariant updates a product variant
func (s *ProductService) UpdateProductVariant(id uint, updates *models.ProductVariant) error {
	variants, err := s.productRepo.GetProductVariants(updates.ProductID)
	if err != nil {
		return err
	}

	var variant *models.ProductVariant
	for i := range variants {
		if variants[i].ID == id {
			variant = &variants[i]
			break
		}
	}

	if variant == nil {
		return errors.New("variant not found")
	}

	// Check SKU uniqueness if changed
	if updates.SKU != variant.SKU {
		existing, err := s.productRepo.FindVariantBySKU(updates.SKU)
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			return err
		}
		if existing != nil && existing.ID != id {
			return errors.New("variant with this SKU already exists")
		}
	}

	variant.Size = updates.Size
	variant.Color = updates.Color
	variant.StockQuantity = updates.StockQuantity
	variant.SKU = updates.SKU

	return s.productRepo.UpdateVariant(variant)
}

// DeleteProductVariant deletes a product variant
func (s *ProductService) DeleteProductVariant(id uint) error {
	return s.productRepo.DeleteVariant(id)
}
