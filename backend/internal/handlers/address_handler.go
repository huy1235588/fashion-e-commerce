package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/huy1235588/fashion-e-commerce/internal/middleware"
	"github.com/huy1235588/fashion-e-commerce/internal/models"
	"github.com/huy1235588/fashion-e-commerce/internal/services"
)

// AddressHandler handles address HTTP requests
type AddressHandler struct {
	service *services.AddressService
}

// NewAddressHandler creates a new address handler
func NewAddressHandler(service *services.AddressService) *AddressHandler {
	return &AddressHandler{service: service}
}

// ListAddresses handles retrieving all addresses for the current user
// @Summary List user's addresses
// @Tags addresses
// @Produce json
// @Success 200 {array} models.AddressResponse
// @Router /addresses [get]
func (h *AddressHandler) ListAddresses(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	addresses, err := h.service.GetUserAddresses(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to retrieve addresses"})
		return
	}

	responses := make([]models.AddressResponse, len(addresses))
	for i, addr := range addresses {
		responses[i] = addr.ToResponse()
	}

	c.JSON(http.StatusOK, gin.H{"data": responses})
}

// GetAddress handles retrieving a single address
// @Summary Get address by ID
// @Tags addresses
// @Produce json
// @Param id path int true "Address ID"
// @Success 200 {object} models.AddressResponse
// @Router /addresses/{id} [get]
func (h *AddressHandler) GetAddress(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid address ID"})
		return
	}

	address, err := h.service.GetAddress(uint(id), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "address not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": address.ToResponse()})
}

// CreateAddress handles creating a new address
// @Summary Create a new address
// @Tags addresses
// @Accept json
// @Produce json
// @Param address body models.Address true "Address data"
// @Success 201 {object} models.AddressResponse
// @Router /addresses [post]
func (h *AddressHandler) CreateAddress(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var address models.Address
	if err := c.ShouldBindJSON(&address); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	address.UserID = userID

	if err := h.service.CreateAddress(&address); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": address.ToResponse()})
}

// UpdateAddress handles updating an address
// @Summary Update an address
// @Tags addresses
// @Accept json
// @Produce json
// @Param id path int true "Address ID"
// @Param address body models.Address true "Address data"
// @Success 200 {object} models.AddressResponse
// @Router /addresses/{id} [put]
func (h *AddressHandler) UpdateAddress(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid address ID"})
		return
	}

	var updates models.Address
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.UpdateAddress(uint(id), userID, &updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	address, _ := h.service.GetAddress(uint(id), userID)
	c.JSON(http.StatusOK, gin.H{"data": address.ToResponse()})
}

// DeleteAddress handles deleting an address
// @Summary Delete an address
// @Tags addresses
// @Param id path int true "Address ID"
// @Success 204
// @Router /addresses/{id} [delete]
func (h *AddressHandler) DeleteAddress(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid address ID"})
		return
	}

	if err := h.service.DeleteAddress(uint(id), userID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

// SetDefaultAddress handles setting an address as default
// @Summary Set address as default
// @Tags addresses
// @Param id path int true "Address ID"
// @Success 200 {object} models.AddressResponse
// @Router /addresses/{id}/set-default [put]
func (h *AddressHandler) SetDefaultAddress(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid address ID"})
		return
	}

	if err := h.service.SetDefaultAddress(uint(id), userID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	address, _ := h.service.GetAddress(uint(id), userID)
	c.JSON(http.StatusOK, gin.H{"data": address.ToResponse()})
}
