package utils

import (
	"errors"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"

	"github.com/google/uuid"
	"golang.org/x/image/draw"
)

// UploadService handles file upload operations
type UploadService struct {
	MaxFileSize   int64
	AllowedTypes  []string
	UploadDir     string
	ThumbnailSize int
}

// NewUploadService creates a new upload service
func NewUploadService(maxFileSize int64, uploadDir string) *UploadService {
	return &UploadService{
		MaxFileSize:   maxFileSize,
		AllowedTypes:  []string{"image/jpeg", "image/jpg", "image/png", "image/webp"},
		UploadDir:     uploadDir,
		ThumbnailSize: 300,
	}
}

// UploadImage uploads an image file and returns the file path
func (u *UploadService) UploadImage(file multipart.File, header *multipart.FileHeader, productID uint) (string, error) {
	// Validate image
	if err := u.ValidateImage(header); err != nil {
		return "", err
	}

	// Create product directory if not exists
	productDir := filepath.Join(u.UploadDir, "products", fmt.Sprintf("%d", productID))
	if err := os.MkdirAll(productDir, 0755); err != nil {
		return "", fmt.Errorf("failed to create upload directory: %w", err)
	}

	// Generate unique filename
	ext := filepath.Ext(header.Filename)
	filename := fmt.Sprintf("%s%s", uuid.New().String(), ext)
	filePath := filepath.Join(productDir, filename)

	// Create destination file
	dst, err := os.Create(filePath)
	if err != nil {
		return "", fmt.Errorf("failed to create file: %w", err)
	}
	defer dst.Close()

	// Copy file content
	if _, err := io.Copy(dst, file); err != nil {
		return "", fmt.Errorf("failed to save file: %w", err)
	}

	// Return relative path for storage in database
	relativePath := filepath.Join("products", fmt.Sprintf("%d", productID), filename)
	return filepath.ToSlash(relativePath), nil
}

// ValidateImage validates an uploaded image file
func (u *UploadService) ValidateImage(header *multipart.FileHeader) error {
	// Check file size
	if header.Size > u.MaxFileSize {
		return fmt.Errorf("file size exceeds maximum allowed size of %d bytes", u.MaxFileSize)
	}

	// Check file type
	contentType := header.Header.Get("Content-Type")
	if !u.isAllowedType(contentType) {
		return errors.New("file type not allowed. Only JPEG, PNG, and WebP are supported")
	}

	return nil
}

// isAllowedType checks if the content type is allowed
func (u *UploadService) isAllowedType(contentType string) bool {
	for _, allowed := range u.AllowedTypes {
		if strings.EqualFold(contentType, allowed) {
			return true
		}
	}
	return false
}

// CompressImage compresses an image to reduce file size
func (u *UploadService) CompressImage(srcPath, destPath string, quality int) error {
	// Open source file
	srcFile, err := os.Open(srcPath)
	if err != nil {
		return fmt.Errorf("failed to open source file: %w", err)
	}
	defer srcFile.Close()

	// Decode image
	img, format, err := image.Decode(srcFile)
	if err != nil {
		return fmt.Errorf("failed to decode image: %w", err)
	}

	// Create destination file
	destFile, err := os.Create(destPath)
	if err != nil {
		return fmt.Errorf("failed to create destination file: %w", err)
	}
	defer destFile.Close()

	// Encode image with compression
	switch format {
	case "jpeg", "jpg":
		options := &jpeg.Options{Quality: quality}
		return jpeg.Encode(destFile, img, options)
	case "png":
		encoder := png.Encoder{CompressionLevel: png.BestCompression}
		return encoder.Encode(destFile, img)
	default:
		return fmt.Errorf("unsupported image format: %s", format)
	}
}

// CreateThumbnail creates a thumbnail for an image
func (u *UploadService) CreateThumbnail(srcPath, destPath string) error {
	// Open source file
	srcFile, err := os.Open(srcPath)
	if err != nil {
		return fmt.Errorf("failed to open source file: %w", err)
	}
	defer srcFile.Close()

	// Decode image
	img, format, err := image.Decode(srcFile)
	if err != nil {
		return fmt.Errorf("failed to decode image: %w", err)
	}

	// Calculate thumbnail dimensions
	bounds := img.Bounds()
	width := bounds.Dx()
	height := bounds.Dy()
	
	var thumbWidth, thumbHeight int
	if width > height {
		thumbWidth = u.ThumbnailSize
		thumbHeight = (height * u.ThumbnailSize) / width
	} else {
		thumbHeight = u.ThumbnailSize
		thumbWidth = (width * u.ThumbnailSize) / height
	}

	// Create thumbnail
	thumbnail := image.NewRGBA(image.Rect(0, 0, thumbWidth, thumbHeight))
	draw.CatmullRom.Scale(thumbnail, thumbnail.Bounds(), img, bounds, draw.Over, nil)

	// Create destination file
	destFile, err := os.Create(destPath)
	if err != nil {
		return fmt.Errorf("failed to create destination file: %w", err)
	}
	defer destFile.Close()

	// Encode thumbnail
	switch format {
	case "jpeg", "jpg":
		options := &jpeg.Options{Quality: 85}
		return jpeg.Encode(destFile, thumbnail, options)
	case "png":
		return png.Encode(destFile, thumbnail)
	default:
		return fmt.Errorf("unsupported image format: %s", format)
	}
}

// DeleteImage deletes an image file
func (u *UploadService) DeleteImage(relativePath string) error {
	filePath := filepath.Join(u.UploadDir, relativePath)
	
	// Check if file exists
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		return nil // File doesn't exist, nothing to delete
	}

	// Delete file
	if err := os.Remove(filePath); err != nil {
		return fmt.Errorf("failed to delete file: %w", err)
	}

	return nil
}

// DeleteProductImages deletes all images for a product
func (u *UploadService) DeleteProductImages(productID uint) error {
	productDir := filepath.Join(u.UploadDir, "products", fmt.Sprintf("%d", productID))
	
	// Check if directory exists
	if _, err := os.Stat(productDir); os.IsNotExist(err) {
		return nil // Directory doesn't exist, nothing to delete
	}

	// Delete directory and all files
	if err := os.RemoveAll(productDir); err != nil {
		return fmt.Errorf("failed to delete product images: %w", err)
	}

	return nil
}

// SanitizeFilename sanitizes a filename by removing potentially harmful characters
func SanitizeFilename(filename string) string {
	// Remove path separators
	filename = filepath.Base(filename)
	
	// Replace spaces with underscores
	filename = strings.ReplaceAll(filename, " ", "_")
	
	// Remove any characters that are not alphanumeric, dash, underscore, or dot
	var sanitized strings.Builder
	for _, r := range filename {
		if (r >= 'a' && r <= 'z') || (r >= 'A' && r <= 'Z') || (r >= '0' && r <= '9') || r == '-' || r == '_' || r == '.' {
			sanitized.WriteRune(r)
		}
	}
	
	return sanitized.String()
}
