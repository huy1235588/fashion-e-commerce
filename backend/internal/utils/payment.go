package utils

import (
	"crypto/hmac"
	"crypto/sha256"
	"crypto/sha512"
	"encoding/hex"
	"fmt"
	"net/url"
	"sort"
	"strings"
	"time"
)

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

// VNPayHelper provides VNPay integration utilities
type VNPayHelper struct {
	config VNPayConfig
}

func NewVNPayHelper(config VNPayConfig) *VNPayHelper {
	return &VNPayHelper{config: config}
}

// GeneratePaymentURL generates VNPay payment URL
func (h *VNPayHelper) GeneratePaymentURL(orderCode string, amount int64, orderInfo string, ipAddr string) (string, error) {
	params := url.Values{}
	params.Set("vnp_Version", "2.1.0")
	params.Set("vnp_Command", "pay")
	params.Set("vnp_TmnCode", h.config.TmnCode)
	params.Set("vnp_Amount", fmt.Sprintf("%d", amount*100)) // VNPay uses smallest unit
	params.Set("vnp_CurrCode", "VND")
	params.Set("vnp_TxnRef", orderCode)
	params.Set("vnp_OrderInfo", orderInfo)
	params.Set("vnp_OrderType", "other")
	params.Set("vnp_Locale", "vn")
	params.Set("vnp_ReturnUrl", h.config.ReturnURL)
	params.Set("vnp_IpAddr", ipAddr)
	params.Set("vnp_CreateDate", time.Now().Format("20060102150405"))

	// Create signature
	signature := h.createSignature(params)
	params.Set("vnp_SecureHash", signature)

	return fmt.Sprintf("%s?%s", h.config.PaymentURL, params.Encode()), nil
}

// VerifyCallback verifies VNPay callback signature
func (h *VNPayHelper) VerifyCallback(queryParams url.Values) bool {
	secureHash := queryParams.Get("vnp_SecureHash")
	queryParams.Del("vnp_SecureHash")
	queryParams.Del("vnp_SecureHashType")

	expectedSignature := h.createSignature(queryParams)
	return secureHash == expectedSignature
}

func (h *VNPayHelper) createSignature(params url.Values) string {
	// Sort parameters
	keys := make([]string, 0, len(params))
	for k := range params {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	// Build hash data
	var hashData []string
	for _, k := range keys {
		if params.Get(k) != "" {
			hashData = append(hashData, fmt.Sprintf("%s=%s", k, params.Get(k)))
		}
	}
	signData := strings.Join(hashData, "&")

	// Create HMAC SHA512
	h256 := hmac.New(sha512.New, []byte(h.config.HashSecret))
	h256.Write([]byte(signData))
	return hex.EncodeToString(h256.Sum(nil))
}

// MoMoHelper provides MoMo integration utilities
type MoMoHelper struct {
	config MoMoConfig
}

func NewMoMoHelper(config MoMoConfig) *MoMoHelper {
	return &MoMoHelper{config: config}
}

// GeneratePaymentSignature generates MoMo payment signature
func (h *MoMoHelper) GeneratePaymentSignature(orderID, requestID string, amount int64, orderInfo string) string {
	rawSignature := fmt.Sprintf("accessKey=%s&amount=%d&extraData=&ipnUrl=%s&orderId=%s&orderInfo=%s&partnerCode=%s&redirectUrl=%s&requestId=%s&requestType=captureWallet",
		h.config.AccessKey,
		amount,
		h.config.IPNUrl,
		orderID,
		orderInfo,
		h.config.PartnerCode,
		h.config.ReturnURL,
		requestID,
	)

	hmacHash := hmac.New(sha256.New, []byte(h.config.SecretKey))
	hmacHash.Write([]byte(rawSignature))
	return hex.EncodeToString(hmacHash.Sum(nil))
}

// VerifyIPNSignature verifies MoMo IPN callback signature
func (h *MoMoHelper) VerifyIPNSignature(params map[string]interface{}, signature string) bool {
	rawSignature := fmt.Sprintf("accessKey=%s&amount=%v&extraData=%v&message=%v&orderId=%v&orderInfo=%v&orderType=%v&partnerCode=%s&payType=%v&requestId=%v&responseTime=%v&resultCode=%v&transId=%v",
		h.config.AccessKey,
		params["amount"],
		params["extraData"],
		params["message"],
		params["orderId"],
		params["orderInfo"],
		params["orderType"],
		h.config.PartnerCode,
		params["payType"],
		params["requestId"],
		params["responseTime"],
		params["resultCode"],
		params["transId"],
	)

	hmacHash := hmac.New(sha256.New, []byte(h.config.SecretKey))
	hmacHash.Write([]byte(rawSignature))
	expectedSignature := hex.EncodeToString(hmacHash.Sum(nil))

	return signature == expectedSignature
}
