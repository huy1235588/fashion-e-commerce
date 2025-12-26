package repositories

import (
	"github.com/huy1235588/fashion-e-commerce/internal/models"
	"gorm.io/gorm"
)

// CartRepository defines the interface for cart data access
type CartRepository interface {
	GetByUserID(userID uint) (*models.Cart, error)
	Create(cart *models.Cart) error
	Update(cart *models.Cart) error
	
	// Cart item operations
	AddItem(item *models.CartItem) error
	UpdateItem(item *models.CartItem) error
	RemoveItem(itemID uint) error
	FindItemByID(itemID uint) (*models.CartItem, error)
	FindItemByVariant(cartID uint, variantID uint) (*models.CartItem, error)
	ClearCart(cartID uint) error
}

type cartRepository struct {
	db *gorm.DB
}

// NewCartRepository creates a new cart repository
func NewCartRepository(db *gorm.DB) CartRepository {
	return &cartRepository{db: db}
}

func (r *cartRepository) GetByUserID(userID uint) (*models.Cart, error) {
	var cart models.Cart
	err := r.db.Preload("Items.Product.Images").
		Preload("Items.Product.Category").
		Preload("Items.Variant").
		Where("user_id = ?", userID).
		First(&cart).Error
	
	if err != nil {
		return nil, err
	}
	return &cart, nil
}

func (r *cartRepository) Create(cart *models.Cart) error {
	return r.db.Create(cart).Error
}

func (r *cartRepository) Update(cart *models.Cart) error {
	return r.db.Save(cart).Error
}

func (r *cartRepository) AddItem(item *models.CartItem) error {
	return r.db.Create(item).Error
}

func (r *cartRepository) UpdateItem(item *models.CartItem) error {
	return r.db.Save(item).Error
}

func (r *cartRepository) RemoveItem(itemID uint) error {
	return r.db.Delete(&models.CartItem{}, itemID).Error
}

func (r *cartRepository) FindItemByID(itemID uint) (*models.CartItem, error) {
	var item models.CartItem
	err := r.db.Preload("Product").
		Preload("Variant").
		First(&item, itemID).Error
	if err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *cartRepository) FindItemByVariant(cartID uint, variantID uint) (*models.CartItem, error) {
	var item models.CartItem
	err := r.db.Where("cart_id = ? AND variant_id = ?", cartID, variantID).
		First(&item).Error
	if err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *cartRepository) ClearCart(cartID uint) error {
	return r.db.Where("cart_id = ?", cartID).Delete(&models.CartItem{}).Error
}
