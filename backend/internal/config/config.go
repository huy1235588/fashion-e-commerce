package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

// Config holds all application configuration
type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	App      AppConfig
	Payment  PaymentConfig
}

// ServerConfig holds server-related configuration
type ServerConfig struct {
	Port    int
	GinMode string
}

// DatabaseConfig holds database-related configuration
type DatabaseConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	DBName   string
	SSLMode  string
}

// AppConfig holds application-level configuration
type AppConfig struct {
	Environment    string
	JWTSecret      string
	JWTExpiresHours int
}

// PaymentConfig holds payment gateway configuration
type PaymentConfig struct {
	VNPay VNPayConfig
	MoMo  MoMoConfig
}

// VNPayConfig holds VNPay configuration
type VNPayConfig struct {
	TmnCode    string
	HashSecret string
	PaymentURL string
	ReturnURL  string
}

// MoMoConfig holds MoMo configuration
type MoMoConfig struct {
	PartnerCode string
	AccessKey   string
	SecretKey   string
	PaymentURL  string
	IPNUrl      string
	ReturnURL   string
}

// Load loads configuration from environment variables
func Load() (*Config, error) {
	// Load .env file if it exists (ignore error if not found)
	_ = godotenv.Load()

	config := &Config{
		Server: ServerConfig{
			Port:    getEnvAsInt("SERVER_PORT", 8080),
			GinMode: getEnv("GIN_MODE", "debug"),
		},
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnvAsInt("DB_PORT", 5432),
			User:     getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", ""),
			DBName:   getEnv("DB_NAME", "fashion_ecommerce"),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
		},
		App: AppConfig{
			Environment:     getEnv("APP_ENV", "development"),
			JWTSecret:       getEnv("JWT_SECRET", "your-secret-key-change-in-production"),
			JWTExpiresHours: getEnvAsInt("JWT_EXPIRES_HOURS", 24),
		},
		Payment: PaymentConfig{
			VNPay: VNPayConfig{
				TmnCode:    getEnv("VNPAY_TMN_CODE", ""),
				HashSecret: getEnv("VNPAY_HASH_SECRET", ""),
				PaymentURL: getEnv("VNPAY_PAYMENT_URL", "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"),
				ReturnURL:  getEnv("VNPAY_RETURN_URL", "http://localhost:3000/payment/vnpay/return"),
			},
			MoMo: MoMoConfig{
				PartnerCode: getEnv("MOMO_PARTNER_CODE", ""),
				AccessKey:   getEnv("MOMO_ACCESS_KEY", ""),
				SecretKey:   getEnv("MOMO_SECRET_KEY", ""),
				PaymentURL:  getEnv("MOMO_PAYMENT_URL", "https://test-payment.momo.vn/v2/gateway/api/create"),
				IPNUrl:      getEnv("MOMO_IPN_URL", "http://localhost:8080/api/payments/momo/ipn"),
				ReturnURL:   getEnv("MOMO_RETURN_URL", "http://localhost:3000/payment/momo/return"),
			},
		},}

// Validate required configuration
if err := config.Validate(); err != nil {
	return nil, err
}

return config, nil
}
// Validate validates the configuration
func (c *Config) Validate() error {
	if c.Database.Host == "" {
		return fmt.Errorf("configuration error: missing required variable DB_HOST")
	}
	if c.Database.User == "" {
		return fmt.Errorf("configuration error: missing required variable DB_USER")
	}
	if c.Database.DBName == "" {
		return fmt.Errorf("configuration error: missing required variable DB_NAME")
	}
	if c.Server.Port <= 0 || c.Server.Port > 65535 {
		return fmt.Errorf("invalid SERVER_PORT: must be between 1 and 65535")
	}
	return nil
}

// getEnv gets an environment variable or returns a default value
func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

// getEnvAsInt gets an environment variable as an integer or returns a default value
func getEnvAsInt(key string, defaultValue int) int {
	valueStr := os.Getenv(key)
	if valueStr == "" {
		return defaultValue
	}
	value, err := strconv.Atoi(valueStr)
	if err != nil {
		return defaultValue
	}
	return value
}
