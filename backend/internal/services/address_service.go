package services

import (
	"errors"
	"github.com/huy1235588/fashion-e-commerce/internal/models"
	"github.com/huy1235588/fashion-e-commerce/internal/repositories"
	"gorm.io/gorm"
)

// AddressService handles address business logic
type AddressService struct {
	repo repositories.AddressRepository
}

// NewAddressService creates a new address service
func NewAddressService(repo repositories.AddressRepository) *AddressService {
	return &AddressService{repo: repo}
}

// CreateAddress creates a new address
func (s *AddressService) CreateAddress(address *models.Address) error {
	// Validate Vietnamese address format
	if address.Province == "" || address.District == "" || address.Ward == "" {
		return errors.New("province, district, and ward are required")
	}

	// If this is marked as default, unset other defaults first
	if address.IsDefault {
		if err := s.repo.UnsetAllDefaults(address.UserID); err != nil {
			return err
		}
	}

	// Check if user has no addresses, make this the default
	existingAddresses, err := s.repo.FindByUserID(address.UserID)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}
	if len(existingAddresses) == 0 {
		address.IsDefault = true
	}

	return s.repo.Create(address)
}

// GetAddress retrieves an address by ID
func (s *AddressService) GetAddress(id uint, userID uint) (*models.Address, error) {
	address, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	// Ensure the address belongs to the user
	if address.UserID != userID {
		return nil, errors.New("address not found")
	}

	return address, nil
}

// GetUserAddresses retrieves all addresses for a user
func (s *AddressService) GetUserAddresses(userID uint) ([]models.Address, error) {
	return s.repo.FindByUserID(userID)
}

// UpdateAddress updates an address
func (s *AddressService) UpdateAddress(id uint, userID uint, updates *models.Address) error {
	address, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}

	// Ensure the address belongs to the user
	if address.UserID != userID {
		return errors.New("address not found")
	}

	// Validate Vietnamese address format
	if updates.Province == "" || updates.District == "" || updates.Ward == "" {
		return errors.New("province, district, and ward are required")
	}

	// Update fields
	address.FullName = updates.FullName
	address.Phone = updates.Phone
	address.Province = updates.Province
	address.District = updates.District
	address.Ward = updates.Ward
	address.DetailAddress = updates.DetailAddress

	// Handle default flag
	if updates.IsDefault && !address.IsDefault {
		// If setting as default, unset other defaults first
		if err := s.repo.UnsetAllDefaults(userID); err != nil {
			return err
		}
		address.IsDefault = true
	} else if !updates.IsDefault && address.IsDefault {
		// Don't allow unsetting default without setting another one
		return errors.New("cannot unset default address; set another address as default first")
	}

	return s.repo.Update(address)
}

// DeleteAddress deletes an address
func (s *AddressService) DeleteAddress(id uint, userID uint) error {
	address, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}

	// Ensure the address belongs to the user
	if address.UserID != userID {
		return errors.New("address not found")
	}

	// If deleting default address, check if there are other addresses
	if address.IsDefault {
		addresses, err := s.repo.FindByUserID(userID)
		if err != nil {
			return err
		}
		if len(addresses) > 1 {
			// Set another address as default before deleting
			for _, addr := range addresses {
				if addr.ID != id {
					if err := s.repo.SetDefault(userID, addr.ID); err != nil {
						return err
					}
					break
				}
			}
		}
	}

	return s.repo.Delete(id)
}

// SetDefaultAddress sets an address as the default
func (s *AddressService) SetDefaultAddress(id uint, userID uint) error {
	address, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}

	// Ensure the address belongs to the user
	if address.UserID != userID {
		return errors.New("address not found")
	}

	return s.repo.SetDefault(userID, id)
}
