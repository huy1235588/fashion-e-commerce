package database

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/huy1235588/fashion-e-commerce/internal/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// Connect establishes a connection to the PostgreSQL database
func Connect(cfg *config.DatabaseConfig) error {
	dsn := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		cfg.Host,
		cfg.Port,
		cfg.User,
		cfg.Password,
		cfg.DBName,
		cfg.SSLMode,
	)

	var err error
	var gormDB *gorm.DB

	// Retry connection up to 3 times with exponential backoff
	maxRetries := 3
	for i := 0; i < maxRetries; i++ {
		gormDB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		})

		if err == nil {
			break
		}

		if i < maxRetries-1 {
			waitTime := time.Duration(i+1) * time.Second
			log.Printf("Failed to connect to database (attempt %d/%d), retrying in %v...", i+1, maxRetries, waitTime)
			time.Sleep(waitTime)
		}
	}

	if err != nil {
		return fmt.Errorf("failed to connect to database after %d attempts: %w", maxRetries, err)
	}

	// Get underlying SQL database to configure connection pool
	sqlDB, err := gormDB.DB()
	if err != nil {
		return fmt.Errorf("failed to get database instance: %w", err)
	}

	// Set connection pool settings
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	// Test connection
	if err := Ping(sqlDB); err != nil {
		return fmt.Errorf("database ping failed: %w", err)
	}

	DB = gormDB
	log.Println("Database connected successfully")
	return nil
}

// Ping checks if the database connection is alive
func Ping(db interface{}) error {
	type pinger interface {
		Ping() error
	}

	if p, ok := db.(pinger); ok {
		ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
		defer cancel()

		done := make(chan error, 1)
		go func() {
			done <- p.Ping()
		}()

		select {
		case err := <-done:
			return err
		case <-ctx.Done():
			return fmt.Errorf("ping timeout")
		}
	}
	return nil
}

// Close closes the database connection
func Close() error {
	if DB != nil {
		sqlDB, err := DB.DB()
		if err != nil {
			return err
		}
		return sqlDB.Close()
	}
	return nil
}

// Health checks the database health status
func Health() error {
	if DB == nil {
		return fmt.Errorf("database not initialized")
	}

	sqlDB, err := DB.DB()
	if err != nil {
		return fmt.Errorf("failed to get database instance: %w", err)
	}

	return Ping(sqlDB)
}
