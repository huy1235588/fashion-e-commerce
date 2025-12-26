package services

import (
	"errors"
	"fmt"
	"github.com/huy1235588/fashion-e-commerce/internal/models"
	"github.com/huy1235588/fashion-e-commerce/internal/repositories"
	"gorm.io/gorm"
)

// CartService handles shopping cart business logic
type CartService struct {
	cartRepo    repositories.CartRepository
	productRepo repositories.ProductRepository
}

// NewCartService creates a new cart service
func NewCartService(cartRepo repositories.CartRepository, productRepo repositories.ProductRepository) *CartService {
	return &CartService{
		cartRepo:    cartRepo,
		productRepo: productRepo,
	}
}

// GetOrCreateCart gets the user's cart or creates one if it doesn't exist
func (s *CartService) GetOrCreateCart(userID uint) (*models.Cart, error) {
	cart, err := s.cartRepo.GetByUserID(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// Create new cart
			cart = &models.Cart{UserID: userID}
			if err := s.cartRepo.Create(cart); err != nil {
				return nil, err
			}
			// Reload with preloaded items
			cart, err = s.cartRepo.GetByUserID(userID)
			if err != nil {
				return nil, err
			}
		} else {
			return nil, err
		}
	}
	return cart, nil
}

// AddToCart adds a product variant to the cart
func (s *CartService) AddToCart(userID uint, productID uint, variantID uint, quantity int) (*models.Cart, error) {
	if quantity <= 0 {
		return nil, errors.New("quantity must be greater than 0")
	}

	// Get or create cart
	cart, err := s.GetOrCreateCart(userID)
	if err != nil {
		return nil, err
	}

	// Validate product and variant
	product, err := s.productRepo.FindByID(productID)
	if err != nil {
		return nil, errors.New("product not found")
	}

	if !product.IsActive {
		return nil, errors.New("product is not available")
	}

	// Find variant
	var variant *models.ProductVariant
	for i := range product.Variants {
		if product.Variants[i].ID == variantID {
			variant = &product.Variants[i]
			break
		}
	}

	if variant == nil {
		return nil, errors.New("product variant not found")
	}

	// Check if item already exists in cart
	existingItem, err := s.cartRepo.FindItemByVariant(cart.ID, variantID)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	if existingItem != nil {
		// Update quantity
		newQuantity := existingItem.Quantity + quantity
		if newQuantity > variant.StockQuantity {
			return nil, fmt.Errorf("not enough stock (available: %d)", variant.StockQuantity)
		}
		existingItem.Quantity = newQuantity
		if err := s.cartRepo.UpdateItem(existingItem); err != nil {
			return nil, err
		}
	} else {
		// Validate stock
		if quantity > variant.StockQuantity {
			return nil, fmt.Errorf("not enough stock (available: %d)", variant.StockQuantity)
		}

		// Add new item
		price := product.Price
		if product.DiscountPrice != nil && *product.DiscountPrice < product.Price {
			price = *product.DiscountPrice
		}

		item := &models.CartItem{
			CartID:    cart.ID,
			ProductID: productID,
			VariantID: variantID,
			Quantity:  quantity,
			Price:     price,
		}

		if err := s.cartRepo.AddItem(item); err != nil {
			return nil, err
		}
	}

	// Reload cart with updated items
	return s.cartRepo.GetByUserID(userID)
}

// UpdateCartItem updates the quantity of a cart item
func (s *CartService) UpdateCartItem(userID uint, itemID uint, quantity int) (*models.Cart, error) {
	if quantity <= 0 {
		return nil, errors.New("quantity must be greater than 0")
	}

	// Get cart
	cart, err := s.cartRepo.GetByUserID(userID)
	if err != nil {
		return nil, err
	}

	// Find item
	item, err := s.cartRepo.FindItemByID(itemID)
	if err != nil {
		return nil, errors.New("cart item not found")
	}

	if item.CartID != cart.ID {
		return nil, errors.New("cart item does not belong to this cart")
	}

	// Validate stock
	if item.Variant != nil && quantity > item.Variant.StockQuantity {
		return nil, fmt.Errorf("not enough stock (available: %d)", item.Variant.StockQuantity)
	}

	// Update quantity
	item.Quantity = quantity
	if err := s.cartRepo.UpdateItem(item); err != nil {
		return nil, err
	}

	// Reload cart
	return s.cartRepo.GetByUserID(userID)
}

// RemoveCartItem removes an item from the cart
func (s *CartService) RemoveCartItem(userID uint, itemID uint) (*models.Cart, error) {
	// Get cart
	cart, err := s.cartRepo.GetByUserID(userID)
	if err != nil {
		return nil, err
	}

	// Find item
	item, err := s.cartRepo.FindItemByID(itemID)
	if err != nil {
		return nil, errors.New("cart item not found")
	}

	if item.CartID != cart.ID {
		return nil, errors.New("cart item does not belong to this cart")
	}

	// Remove item
	if err := s.cartRepo.RemoveItem(itemID); err != nil {
		return nil, err
	}

	// Reload cart
	return s.cartRepo.GetByUserID(userID)
}

// ClearCart removes all items from the cart
func (s *CartService) ClearCart(userID uint) (*models.Cart, error) {
	cart, err := s.cartRepo.GetByUserID(userID)
	if err != nil {
		return nil, err
	}

	if err := s.cartRepo.ClearCart(cart.ID); err != nil {
		return nil, err
	}

	// Reload cart
	return s.cartRepo.GetByUserID(userID)
}
