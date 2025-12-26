package repositories

import (
	"github.com/huy1235588/fashion-e-commerce/internal/models"
	"gorm.io/gorm"
)

// AddressRepository defines the interface for address data access
type AddressRepository interface {
	Create(address *models.Address) error
	FindByID(id uint) (*models.Address, error)
	FindByUserID(userID uint) ([]models.Address, error)
	Update(address *models.Address) error
	Delete(id uint) error
	SetDefault(userID uint, addressID uint) error
	UnsetAllDefaults(userID uint) error
}

type addressRepository struct {
	db *gorm.DB
}

// NewAddressRepository creates a new address repository
func NewAddressRepository(db *gorm.DB) AddressRepository {
	return &addressRepository{db: db}
}

func (r *addressRepository) Create(address *models.Address) error {
	return r.db.Create(address).Error
}

func (r *addressRepository) FindByID(id uint) (*models.Address, error) {
	var address models.Address
	err := r.db.First(&address, id).Error
	if err != nil {
		return nil, err
	}
	return &address, nil
}

func (r *addressRepository) FindByUserID(userID uint) ([]models.Address, error) {
	var addresses []models.Address
	err := r.db.Where("user_id = ?", userID).
		Order("is_default DESC, created_at DESC").
		Find(&addresses).Error
	return addresses, err
}

func (r *addressRepository) Update(address *models.Address) error {
	return r.db.Save(address).Error
}

func (r *addressRepository) Delete(id uint) error {
	return r.db.Delete(&models.Address{}, id).Error
}

func (r *addressRepository) SetDefault(userID uint, addressID uint) error {
	// Start transaction
	return r.db.Transaction(func(tx *gorm.DB) error {
		// First, unset all defaults for this user
		if err := tx.Model(&models.Address{}).
			Where("user_id = ?", userID).
			Update("is_default", false).Error; err != nil {
			return err
		}

		// Then set the specified address as default
		if err := tx.Model(&models.Address{}).
			Where("id = ? AND user_id = ?", addressID, userID).
			Update("is_default", true).Error; err != nil {
			return err
		}

		return nil
	})
}

func (r *addressRepository) UnsetAllDefaults(userID uint) error {
	return r.db.Model(&models.Address{}).
		Where("user_id = ?", userID).
		Update("is_default", false).Error
}
