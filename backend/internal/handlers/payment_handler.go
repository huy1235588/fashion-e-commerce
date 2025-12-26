package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/huy1235588/fashion-e-commerce/internal/services"
)

type PaymentHandler struct {
	paymentService services.PaymentService
}

func NewPaymentHandler(paymentService services.PaymentService) *PaymentHandler {
	return &PaymentHandler{
		paymentService: paymentService,
	}
}

// InitiatePayment initiates a payment for an order
// @Summary Initiate payment
// @Description Generate payment URL for VNPay/MoMo or confirm COD
// @Tags payments
// @Accept json
// @Produce json
// @Param request body services.InitiatePaymentRequest true "Initiate Payment Request"
// @Success 200 {object} map[string]interface{}
// @Router /payments/initiate [post]
func (h *PaymentHandler) InitiatePayment(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var req services.InitiatePaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get client IP
	req.IPAddr = c.ClientIP()

	paymentURL, err := h.paymentService.InitiatePayment(userID.(uint), req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// If no payment URL (COD), return success
	if paymentURL == "" {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "COD payment confirmed",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":     true,
		"payment_url": paymentURL,
	})
}

// VNPayCallback handles VNPay payment callback
// @Summary VNPay callback
// @Description Process VNPay payment return callback
// @Tags payments
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Router /payments/vnpay/callback [get]
func (h *PaymentHandler) VNPayCallback(c *gin.Context) {
	// Get all query parameters
	queryParams := make(map[string]string)
	for key, values := range c.Request.URL.Query() {
		if len(values) > 0 {
			queryParams[key] = values[0]
		}
	}

	err := h.paymentService.ProcessVNPayCallback(queryParams)
	if err != nil {
		c.Redirect(http.StatusTemporaryRedirect, "/payment/failure?error="+err.Error())
		return
	}

	c.Redirect(http.StatusTemporaryRedirect, "/payment/success")
}

// VNPayReturn handles VNPay return URL (user-facing)
// @Summary VNPay return
// @Description Handle VNPay return URL after payment
// @Tags payments
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Router /payments/vnpay/return [get]
func (h *PaymentHandler) VNPayReturn(c *gin.Context) {
	// Get all query parameters
	queryParams := make(map[string]string)
	for key, values := range c.Request.URL.Query() {
		if len(values) > 0 {
			queryParams[key] = values[0]
		}
	}

	responseCode := queryParams["vnp_ResponseCode"]
	orderCode := queryParams["vnp_TxnRef"]

	if responseCode == "00" {
		// Payment successful - redirect to success page
		c.Redirect(http.StatusTemporaryRedirect, "/payment/success?order_code="+orderCode)
	} else {
		// Payment failed - redirect to failure page
		c.Redirect(http.StatusTemporaryRedirect, "/payment/failure?order_code="+orderCode)
	}
}

// MoMoCallback handles MoMo IPN callback
// @Summary MoMo IPN callback
// @Description Process MoMo IPN (Instant Payment Notification)
// @Tags payments
// @Accept json
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Router /payments/momo/ipn [post]
func (h *PaymentHandler) MoMoCallback(c *gin.Context) {
	var params map[string]interface{}
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.paymentService.ProcessMoMoCallback(params)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"resultCode": 1,
			"message":    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"resultCode": 0,
		"message":    "Success",
	})
}

// MoMoReturn handles MoMo return URL (user-facing)
// @Summary MoMo return
// @Description Handle MoMo return URL after payment
// @Tags payments
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Router /payments/momo/return [get]
func (h *PaymentHandler) MoMoReturn(c *gin.Context) {
	resultCode := c.Query("resultCode")
	orderID := c.Query("orderId")

	if resultCode == "0" {
		// Payment successful
		c.Redirect(http.StatusTemporaryRedirect, "/payment/success?order_code="+orderID)
	} else {
		// Payment failed
		c.Redirect(http.StatusTemporaryRedirect, "/payment/failure?order_code="+orderID)
	}
}
