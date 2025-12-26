package database

import (
	"log"

	"github.com/huy1235588/fashion-e-commerce/internal/models"
)

// RunMigrations runs database auto-migrations for all models
func RunMigrations() error {
	log.Println("Running database migrations...")

	if DB == nil {
		return nil
	}

	// Auto-migrate all models
	err := DB.AutoMigrate(
		&models.User{},
		&models.PasswordResetCode{},
		&models.Category{},
		&models.Product{},
		&models.ProductImage{},
		&models.ProductVariant{},
		&models.Cart{},
		&models.CartItem{},
		&models.Address{},
		&models.Order{},
		&models.OrderItem{},
		&models.Payment{},
		&models.Review{},
	)

	if err != nil {
		log.Printf("Migration failed: %v", err)
		return err
	}

	log.Println("Database migrations completed successfully")
	return nil
}
