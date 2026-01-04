package utils

import (
	"errors"
	"regexp"
	"strings"
)

// Validator provides validation functions
type Validator struct{}

// NewValidator creates a new validator
func NewValidator() *Validator {
	return &Validator{}
}

// ValidateVietnamesePhone validates Vietnamese phone numbers
// Accepts formats: 0xxxxxxxxx, +84xxxxxxxxx, 84xxxxxxxxx
func (v *Validator) ValidateVietnamesePhone(phone string) error {
	if phone == "" {
		return errors.New("phone number is required")
	}

	// Remove spaces and dashes
	phone = strings.ReplaceAll(phone, " ", "")
	phone = strings.ReplaceAll(phone, "-", "")

	// Vietnamese phone number patterns
	patterns := []string{
		`^0(3|5|7|8|9)\d{8}$`,              // 0xxxxxxxxx format
		`^\+84(3|5|7|8|9)\d{8}$`,           // +84xxxxxxxxx format
		`^84(3|5|7|8|9)\d{8}$`,             // 84xxxxxxxxx format
	}

	for _, pattern := range patterns {
		matched, _ := regexp.MatchString(pattern, phone)
		if matched {
			return nil
		}
	}

	return errors.New("invalid Vietnamese phone number format")
}

// NormalizeVietnamesePhone normalizes Vietnamese phone number to 0xxxxxxxxx format
func (v *Validator) NormalizeVietnamesePhone(phone string) string {
	// Remove spaces and dashes
	phone = strings.ReplaceAll(phone, " ", "")
	phone = strings.ReplaceAll(phone, "-", "")

	// Convert +84 or 84 to 0
	if strings.HasPrefix(phone, "+84") {
		return "0" + phone[3:]
	}
	if strings.HasPrefix(phone, "84") {
		return "0" + phone[2:]
	}

	return phone
}

// ValidateEmail validates email format
func (v *Validator) ValidateEmail(email string) error {
	if email == "" {
		return errors.New("email is required")
	}

	pattern := `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
	matched, _ := regexp.MatchString(pattern, email)
	if !matched {
		return errors.New("invalid email format")
	}

	return nil
}

// ValidatePrice validates price value
func (v *Validator) ValidatePrice(price float64) error {
	if price < 0 {
		return errors.New("price must be greater than or equal to 0")
	}

	if price > 1000000000 { // 1 billion VND limit
		return errors.New("price exceeds maximum allowed value")
	}

	return nil
}

// ValidateQuantity validates quantity value
func (v *Validator) ValidateQuantity(quantity int) error {
	if quantity < 0 {
		return errors.New("quantity must be greater than or equal to 0")
	}

	if quantity > 10000 {
		return errors.New("quantity exceeds maximum allowed value")
	}

	return nil
}

// ValidateVietnameseAddress validates Vietnamese address components
func (v *Validator) ValidateVietnameseAddress(addressLine, ward, district, city string) error {
	if addressLine == "" {
		return errors.New("address line is required")
	}

	if ward == "" {
		return errors.New("ward is required")
	}

	if district == "" {
		return errors.New("district is required")
	}

	if city == "" {
		return errors.New("city is required")
	}

	// Check minimum length
	if len(addressLine) < 5 {
		return errors.New("address line is too short")
	}

	return nil
}

// ValidatePassword validates password strength
func (v *Validator) ValidatePassword(password string) error {
	if password == "" {
		return errors.New("password is required")
	}

	if len(password) < 8 {
		return errors.New("password must be at least 8 characters long")
	}

	if len(password) > 100 {
		return errors.New("password is too long")
	}

	return nil
}

// ValidateFullName validates full name
func (v *Validator) ValidateFullName(fullName string) error {
	if fullName == "" {
		return errors.New("full name is required")
	}

	if len(fullName) < 2 {
		return errors.New("full name is too short")
	}

	if len(fullName) > 100 {
		return errors.New("full name is too long")
	}

	return nil
}

// ValidateProductName validates product name
func (v *Validator) ValidateProductName(name string) error {
	if name == "" {
		return errors.New("product name is required")
	}

	if len(name) < 3 {
		return errors.New("product name is too short")
	}

	if len(name) > 200 {
		return errors.New("product name is too long")
	}

	return nil
}

// ValidateSlug validates URL slug
func (v *Validator) ValidateSlug(slug string) error {
	if slug == "" {
		return errors.New("slug is required")
	}

	pattern := `^[a-z0-9]+(?:-[a-z0-9]+)*$`
	matched, _ := regexp.MatchString(pattern, slug)
	if !matched {
		return errors.New("invalid slug format. Use only lowercase letters, numbers, and hyphens")
	}

	return nil
}

// ValidateColor validates color value (hex color code)
func (v *Validator) ValidateColor(color string) error {
	if color == "" {
		return nil // Color is optional
	}

	pattern := `^#[0-9A-Fa-f]{6}$`
	matched, _ := regexp.MatchString(pattern, color)
	if !matched {
		return errors.New("invalid color format. Use hex color code (e.g., #FF5733)")
	}

	return nil
}

// ValidateSize validates size value
func (v *Validator) ValidateSize(size string) error {
	if size == "" {
		return errors.New("size is required")
	}

	validSizes := []string{"XS", "S", "M", "L", "XL", "XXL", "XXXL"}
	sizeUpper := strings.ToUpper(size)
	
	for _, validSize := range validSizes {
		if sizeUpper == validSize {
			return nil
		}
	}

	return errors.New("invalid size. Valid sizes are: XS, S, M, L, XL, XXL, XXXL")
}

// ValidateRating validates rating value (1-5 stars)
func (v *Validator) ValidateRating(rating int) error {
	if rating < 1 || rating > 5 {
		return errors.New("rating must be between 1 and 5")
	}

	return nil
}

// ValidateOrderStatus validates order status
func (v *Validator) ValidateOrderStatus(status string) error {
	validStatuses := []string{"pending", "confirmed", "processing", "shipping", "delivered", "cancelled"}
	
	for _, validStatus := range validStatuses {
		if status == validStatus {
			return nil
		}
	}

	return errors.New("invalid order status")
}

// ValidatePaymentMethod validates payment method
func (v *Validator) ValidatePaymentMethod(method string) error {
	validMethods := []string{"cod", "vnpay", "momo"}
	
	for _, validMethod := range validMethods {
		if method == validMethod {
			return nil
		}
	}

	return errors.New("invalid payment method")
}

// ValidatePaymentStatus validates payment status
func (v *Validator) ValidatePaymentStatus(status string) error {
	validStatuses := []string{"pending", "paid", "failed", "refunded"}
	
	for _, validStatus := range validStatuses {
		if status == validStatus {
			return nil
		}
	}

	return errors.New("invalid payment status")
}

// TrimAndValidateString trims whitespace and validates string is not empty
func (v *Validator) TrimAndValidateString(value, fieldName string) (string, error) {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return "", errors.New(fieldName + " is required")
	}
	return trimmed, nil
}
