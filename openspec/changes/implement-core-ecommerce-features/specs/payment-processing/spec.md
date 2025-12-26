# Payment Processing Capability

## ADDED Requirements

### Requirement: Cash on Delivery (COD) Payment
The system MUST support cash on delivery payment method.

**Acceptance Criteria:**
- Payment method "cod" is selectable at checkout
- COD orders created with payment_status = "pending"
- Payment record created with status "pending"
- Payment status remains "pending" until admin marks order as delivered
- When order status → "delivered", payment_status → "success"
- When order cancelled, payment_status → "failed"

#### Scenario: Create COD order
**Given** user selects payment method "cod" at checkout  
**When** order is created  
**Then** order.payment_method = "cod"  
**And** order.payment_status = "pending"  
**And** payment record created with status "pending"  
**And** HTTP status 201 is returned

#### Scenario: Mark COD order as delivered
**Given** a COD order with status "shipping"  
**When** admin updates status to "delivered"  
**Then** order.status = "delivered"  
**And** order.payment_status = "success"  
**And** payment.status = "success"  
**And** payment.payment_date = current timestamp  
**And** HTTP status 200 is returned

#### Scenario: Cancel COD order
**Given** a COD order with status "pending"  
**When** order is cancelled  
**Then** order.payment_status = "failed"  
**And** payment.status = "failed"  
**And** HTTP status 200 is returned

### Requirement: VNPay Payment Gateway Integration
The system MUST integrate with VNPay for online payments.

**Acceptance Criteria:**
- VNPay credentials configured (TMN_CODE, HASH_SECRET, URL) from environment
- Generate payment URL with order information
- Redirect user to VNPay payment gateway
- Handle VNPay return callback with signature verification
- Handle VNPay IPN (Instant Payment Notification) callback
- Update order payment status based on VNPay response
- Validate VNPay secure hash to prevent tampering

#### Scenario: Initiate VNPay payment
**Given** user selects payment method "vnpay" at checkout  
**And** order is created with payment_status = "pending"  
**When** user requests VNPay payment URL  
**Then** payment URL is generated with order data  
**And** URL includes: amount, order_code, return_url, notify_url  
**And** secure hash calculated and appended  
**And** payment URL is returned  
**And** HTTP status 200 is returned

#### Scenario: Successful VNPay payment callback
**Given** user completed payment on VNPay  
**When** VNPay redirects to return_url with transaction data  
**Then** system validates secure hash  
**And** if response_code = "00", payment is successful  
**And** order.payment_status = "paid"  
**And** payment record updated with transaction_id and status "success"  
**And** user redirected to order confirmation page  
**And** HTTP status 200 is returned

#### Scenario: Failed VNPay payment callback
**Given** user cancelled payment on VNPay  
**When** VNPay redirects with failure response_code  
**Then** system validates secure hash  
**And** order.payment_status remains "pending"  
**And** payment.status = "failed"  
**And** user redirected to payment failure page  
**And** HTTP status 200 is returned

#### Scenario: Invalid VNPay signature
**Given** a VNPay callback with tampered data  
**When** system validates secure hash  
**Then** validation fails  
**And** request is rejected with "Invalid signature" error  
**And** no payment status is updated  
**And** HTTP status 400 is returned

#### Scenario: VNPay IPN notification
**Given** VNPay sends IPN to notify_url  
**When** system receives IPN with transaction data  
**Then** secure hash is validated  
**And** payment status updated based on transaction result  
**And** acknowledgment response sent to VNPay  
**And** HTTP status 200 is returned

### Requirement: MoMo Payment Gateway Integration
The system MUST integrate with MoMo e-wallet for online payments.

**Acceptance Criteria:**
- MoMo credentials configured (PARTNER_CODE, ACCESS_KEY, SECRET_KEY, ENDPOINT) from environment
- Generate payment URL with order information using MoMo API
- Redirect user to MoMo payment gateway
- Handle MoMo return callback with signature verification
- Handle MoMo IPN callback
- Update order payment status based on MoMo response
- Validate MoMo signature to prevent tampering

#### Scenario: Initiate MoMo payment
**Given** user selects payment method "momo" at checkout  
**And** order is created with payment_status = "pending"  
**When** user requests MoMo payment  
**Then** payment request sent to MoMo API  
**And** request includes: partnerCode, orderId, amount, orderInfo, redirectUrl, ipnUrl  
**And** signature calculated and included  
**And** MoMo payment URL is returned  
**And** HTTP status 200 is returned

#### Scenario: Successful MoMo payment callback
**Given** user completed payment on MoMo  
**When** MoMo redirects to return URL with transaction data  
**Then** system validates signature  
**And** if resultCode = 0, payment is successful  
**And** order.payment_status = "paid"  
**And** payment record updated with transaction_id (transId) and status "success"  
**And** user redirected to order confirmation page  
**And** HTTP status 200 is returned

#### Scenario: Failed MoMo payment callback
**Given** user cancelled or payment failed on MoMo  
**When** MoMo redirects with failure resultCode  
**Then** system validates signature  
**And** order.payment_status remains "pending"  
**And** payment.status = "failed"  
**And** user redirected to payment failure page  
**And** HTTP status 200 is returned

#### Scenario: Invalid MoMo signature
**Given** a MoMo callback with invalid signature  
**When** system validates signature  
**Then** validation fails  
**And** request is rejected with "Invalid signature" error  
**And** no payment status is updated  
**And** HTTP status 400 is returned

#### Scenario: MoMo IPN notification
**Given** MoMo sends IPN to notify URL  
**When** system receives IPN with transaction data  
**Then** signature is validated  
**And** payment status updated based on result  
**And** acknowledgment response sent to MoMo  
**And** HTTP status 200 is returned

### Requirement: Payment Record Tracking
The system MUST maintain payment transaction records for audit.

**Acceptance Criteria:**
- Payment record created when order is created
- Record includes: order_id, payment_method, amount, status
- For online payments: transaction_id, payment_date stored
- Payment status values: pending, success, failed
- One payment record per order (unique order_id)

#### Scenario: Create payment record for new order
**Given** an order is created with payment method "vnpay"  
**When** order creation completes  
**Then** payment record is created  
**And** payment.order_id = order.id  
**And** payment.payment_method = "vnpay"  
**And** payment.amount = order.final_amount  
**And** payment.status = "pending"  
**And** HTTP status 201 is returned

#### Scenario: Update payment record on successful transaction
**Given** payment with status "pending"  
**When** online payment succeeds  
**Then** payment.status = "success"  
**And** payment.transaction_id = transaction ID from gateway  
**And** payment.payment_date = current timestamp  
**And** HTTP status 200 is returned

#### Scenario: Update payment record on failed transaction
**Given** payment with status "pending"  
**When** online payment fails  
**Then** payment.status = "failed"  
**And** payment.payment_date may be null  
**And** HTTP status 200 is returned

### Requirement: Payment Method Selection
The system MUST allow users to select payment method during checkout.

**Acceptance Criteria:**
- Available methods: cod, vnpay, momo
- Payment method is required field in order creation
- Invalid payment methods are rejected
- Payment method stored in order.payment_method

#### Scenario: Select valid payment method
**Given** user is creating an order  
**When** user selects payment_method = "vnpay"  
**Then** order is created with payment_method = "vnpay"  
**And** HTTP status 201 is returned

#### Scenario: Select invalid payment method
**Given** user is creating an order  
**When** user provides payment_method = "paypal"  
**Then** creation fails with "Invalid payment method" error  
**And** HTTP status 400 is returned

#### Scenario: Missing payment method
**Given** user is creating an order  
**When** payment_method is not provided  
**Then** creation fails with "Payment method required" error  
**And** HTTP status 400 is returned

### Requirement: Payment Configuration
Payment gateway credentials MUST be configurable via environment variables.

**Acceptance Criteria:**
- VNPay config: VNPAY_TMN_CODE, VNPAY_HASH_SECRET, VNPAY_URL, VNPAY_RETURN_URL
- MoMo config: MOMO_PARTNER_CODE, MOMO_ACCESS_KEY, MOMO_SECRET_KEY, MOMO_ENDPOINT, MOMO_RETURN_URL, MOMO_NOTIFY_URL
- Sandbox mode supported (separate credentials for testing)
- Missing credentials cause graceful error (not server crash)

#### Scenario: Load VNPay configuration
**Given** environment variables are set for VNPay  
**When** application starts  
**Then** VNPay config is loaded and available  
**And** payment service can generate VNPay URLs

#### Scenario: Load MoMo configuration
**Given** environment variables are set for MoMo  
**When** application starts  
**Then** MoMo config is loaded and available  
**And** payment service can generate MoMo requests

#### Scenario: Missing payment gateway credentials
**Given** VNPay credentials are not configured  
**When** user attempts to pay with VNPay  
**Then** error "VNPay payment not configured" is returned  
**And** HTTP status 500 is returned

### Requirement: Payment Status Synchronization
Order payment status MUST stay synchronized with payment records.

**Acceptance Criteria:**
- order.payment_status reflects latest payment status
- When payment.status = "success", order.payment_status = "paid"
- When payment.status = "failed", order.payment_status may remain "pending" (allow retry) or become "failed" (cancelled order)
- Payment status changes trigger order updates

#### Scenario: Sync payment success to order
**Given** order with payment_status = "pending"  
**When** payment is confirmed successful  
**Then** order.payment_status = "paid"  
**And** order status may transition to "processing" (if auto-confirm enabled)  
**And** HTTP status 200 is returned

#### Scenario: Order cancellation fails payment
**Given** order with payment_status = "pending"  
**When** order is cancelled  
**Then** payment.status = "failed"  
**And** order.payment_status = "failed"  
**And** HTTP status 200 is returned

### Requirement: Payment Amount Validation
Payment amount MUST match order final amount.

**Acceptance Criteria:**
- Payment amount = order.final_amount
- Callback amount validated against order amount
- Mismatch is logged and rejected

#### Scenario: Validate callback amount matches order
**Given** order with final_amount = 500000 VND  
**When** VNPay callback returns with amount = 500000 VND  
**Then** validation passes  
**And** payment is processed

#### Scenario: Reject callback with wrong amount
**Given** order with final_amount = 500000 VND  
**When** VNPay callback returns with amount = 300000 VND  
**Then** validation fails  
**And** payment is rejected with "Amount mismatch" error  
**And** HTTP status 400 is returned
