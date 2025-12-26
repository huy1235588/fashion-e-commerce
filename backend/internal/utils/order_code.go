package utils

import (
	"fmt"
	"math/rand"
	"time"
)

// GenerateOrderCode generates a unique order code
// Format: ORD-YYYYMMDD-XXXXXX (e.g., ORD-20231225-A3B5C7)
func GenerateOrderCode() string {
	now := time.Now()
	datePart := now.Format("20060102")
	
	// Generate random alphanumeric suffix
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	suffix := make([]byte, 6)
	for i := range suffix {
		suffix[i] = charset[rand.Intn(len(charset))]
	}
	
	return fmt.Sprintf("ORD-%s-%s", datePart, string(suffix))
}
