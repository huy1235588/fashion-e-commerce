package handlers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/huy1235588/fashion-e-commerce/internal/utils"
)

// UploadHandler handles file upload requests
type UploadHandler struct {
	uploadService *utils.UploadService
}

// NewUploadHandler creates a new upload handler
func NewUploadHandler(uploadService *utils.UploadService) *UploadHandler {
	return &UploadHandler{uploadService: uploadService}
}

// UploadTempImage handles temporary image upload (before product is created)
// @Summary Upload temporary image
// @Tags upload
// @Accept multipart/form-data
// @Produce json
// @Param image formData file true "Image file"
// @Success 200 {object} map[string]interface{}
// @Router /upload/temp [post]
func (h *UploadHandler) UploadTempImage(c *gin.Context) {
	fileHeader, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no file uploaded"})
		return
	}

	file, err := fileHeader.Open()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "unable to read uploaded file"})
		return
	}
	defer file.Close()

	// Upload to temp directory (productID = 0 for temp)
	uploadedPath, err := h.uploadService.UploadImage(file, fileHeader, 0)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Return the relative path (e.g., /uploads/products/0/xxx.jpg)
	relativePath := fmt.Sprintf("/uploads/%s", uploadedPath)

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"path": relativePath,
		},
	})
}
