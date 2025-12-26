# Order Management Capability

## ADDED Requirements

### Requirement: Order Creation from Cart
The system MUST allow users to create orders from their shopping cart.

**Acceptance Criteria:**
- Order created from current cart contents
- Requires shipping address selection
- Requires payment method selection
- Generate unique order_code (e.g., "ORD-2025-00001")
- Calculate totals: subtotal, shipping_fee, discount_amount, final_amount
- Create order_items from cart_items with price snapshot
- Create shipping_address record
- Validate stock availability before creating order
- Deduct stock from variants when order is created
- Clear cart after successful order creation
- Initial order status: "pending"
- Initial payment status: "pending"

#### Scenario: Create order with valid cart and address
**Given** user has cart with 3 items  
**And** user has selected a shipping address  
**And** user has chosen payment method "cod"  
**And** all items have sufficient stock  
**When** user creates an order  
**Then** a new order record is created with unique order_code  
**And** order_items are created from cart_items  
**And** shipping_address is copied to order  
**And** stock is deducted for each variant  
**And** cart is cleared  
**And** order status = "pending"  
**And** payment_status = "pending"  
**And** HTTP status 201 is returned

#### Scenario: Create order with empty cart
**Given** user's cart is empty  
**When** user attempts to create an order  
**Then** creation fails with "Cart is empty" error  
**And** HTTP status 400 is returned

#### Scenario: Create order with insufficient stock
**Given** cart contains item with quantity 5  
**And** variant stock_quantity = 3  
**When** user attempts to create order  
**Then** creation fails with "Insufficient stock for some items" error  
**And** no stock is deducted  
**And** HTTP status 400 is returned

#### Scenario: Create order without shipping address
**Given** user has items in cart  
**When** user attempts to create order without providing address_id  
**Then** creation fails with "Shipping address required" error  
**And** HTTP status 400 is returned

#### Scenario: Order code is unique
**Given** previous order has code "ORD-2025-00001"  
**When** new order is created  
**Then** order_code is generated as "ORD-2025-00002"  
**And** code is unique across all orders

### Requirement: Order Status Management
Orders MUST progress through defined states with proper validation.

**Acceptance Criteria:**
- Status values: pending, processing, shipping, delivered, cancelled
- Valid transitions:
  - pending → processing (admin confirms)
  - processing → shipping (admin dispatches)
  - shipping → delivered (admin confirms delivery)
  - pending → cancelled (customer or admin cancels)
  - processing → cancelled (admin only)
- Invalid transitions are rejected
- Status updates recorded with timestamp (updated_at)
- Only admins can update order status (except customer cancellation)

#### Scenario: Admin confirms pending order
**Given** an order with status "pending"  
**When** admin updates status to "processing"  
**Then** order status changes to "processing"  
**And** updated_at timestamp is updated  
**And** HTTP status 200 is returned

#### Scenario: Admin dispatches processing order
**Given** an order with status "processing"  
**When** admin updates status to "shipping"  
**Then** order status changes to "shipping"  
**And** HTTP status 200 is returned

#### Scenario: Admin marks order as delivered
**Given** an order with status "shipping"  
**When** admin updates status to "delivered"  
**Then** order status changes to "delivered"  
**And** HTTP status 200 is returned

#### Scenario: Invalid status transition
**Given** an order with status "pending"  
**When** admin attempts to update status to "delivered" (skipping intermediate states)  
**Then** update fails with "Invalid status transition" error  
**And** HTTP status 400 is returned

#### Scenario: Customer cannot update order status directly
**Given** a customer user  
**When** customer attempts to update order status  
**Then** request fails with 403 Forbidden  
**And** error message "Admin access required" is returned

### Requirement: Order Cancellation
The system MUST allow users and admins to cancel orders with stock restoration.

**Acceptance Criteria:**
- Customers can cancel only "pending" orders
- Admins can cancel "pending" or "processing" orders
- Cannot cancel "shipping", "delivered", or already "cancelled" orders
- Cancelling restores stock to variants
- Cancellation updates payment_status to "failed"
- Cancellation sets status to "cancelled"

#### Scenario: Customer cancels pending order
**Given** a customer with an order in "pending" status  
**When** customer requests to cancel the order  
**Then** order status changes to "cancelled"  
**And** stock is restored for all order items  
**And** payment_status = "failed"  
**And** HTTP status 200 is returned

#### Scenario: Customer cannot cancel processing order
**Given** a customer with an order in "processing" status  
**When** customer attempts to cancel the order  
**Then** cancellation fails with "Cannot cancel order in this status" error  
**And** HTTP status 400 is returned

#### Scenario: Admin cancels processing order
**Given** an admin user  
**And** an order in "processing" status  
**When** admin cancels the order  
**Then** order status changes to "cancelled"  
**And** stock is restored  
**And** HTTP status 200 is returned

#### Scenario: Cannot cancel delivered order
**Given** an order with status "delivered"  
**When** admin attempts to cancel it  
**Then** cancellation fails with "Cannot cancel delivered order" error  
**And** HTTP status 400 is returned

#### Scenario: Stock restoration on cancellation
**Given** order with item: variant_id=5, quantity=3  
**And** variant currently has stock_quantity = 10  
**When** order is cancelled  
**Then** variant stock_quantity is increased to 13  
**And** HTTP status 200 is returned

### Requirement: View Order History
The system MUST allow users to view their order history with details.

**Acceptance Criteria:**
- Users can list their own orders
- Admins can list all orders
- Support pagination (default 10 per page)
- Support filtering by status
- Support sorting by date (newest first default)
- Include order_code, total, status, payment_status, created_at
- Can view detailed order by order_id

#### Scenario: Customer views own orders
**Given** a customer with 5 orders  
**When** customer requests their order list  
**Then** all 5 of their orders are returned  
**And** orders from other users are not included  
**And** orders sorted by created_at descending  
**And** HTTP status 200 is returned

#### Scenario: Admin views all orders
**Given** 20 orders from various users  
**When** admin requests order list  
**Then** all 20 orders are returned  
**And** HTTP status 200 is returned

#### Scenario: Filter orders by status
**Given** customer has orders with various statuses  
**When** customer filters by status "delivered"  
**Then** only orders with status "delivered" are returned  
**And** HTTP status 200 is returned

#### Scenario: Paginate order list
**Given** customer has 25 orders  
**When** customer requests page 2 with limit 10  
**Then** orders 11-20 are returned  
**And** HTTP status 200 is returned

### Requirement: View Order Details
The system MUST allow users to view complete details of an order.

**Acceptance Criteria:**
- Include all order fields
- Include all order_items with product details
- Include shipping address
- Include payment information
- Users can only view their own orders
- Admins can view any order

#### Scenario: Customer views own order details
**Given** a customer with order ID 123  
**When** customer requests GET /api/orders/123  
**Then** complete order details are returned  
**And** order_items list included  
**And** shipping_address included  
**And** payment info included  
**And** HTTP status 200 is returned

#### Scenario: Customer cannot view another user's order
**Given** user A is authenticated  
**And** order ID 456 belongs to user B  
**When** user A requests GET /api/orders/456  
**Then** request fails with 403 Forbidden  
**And** error message "Not authorized to view this order" is returned

#### Scenario: Admin views any order details
**Given** admin user  
**And** order ID 789 belongs to any user  
**When** admin requests GET /api/orders/789  
**Then** complete order details are returned  
**And** HTTP status 200 is returned

### Requirement: Order Total Calculation
The system MUST correctly calculate order totals.

**Acceptance Criteria:**
- total_amount = sum of (item.price × item.quantity) for all items
- final_amount = total_amount + shipping_fee - discount_amount
- shipping_fee is configurable (default: 30000 VND)
- discount_amount defaults to 0 (product discount_price used, not order-level)
- All amounts stored as DECIMAL(10,2)

#### Scenario: Calculate order with no discount or shipping
**Given** cart with items totaling 500000 VND  
**And** shipping_fee = 0  
**And** discount_amount = 0  
**When** order is created  
**Then** total_amount = 500000  
**And** final_amount = 500000  
**And** HTTP status 201 is returned

#### Scenario: Calculate order with shipping fee
**Given** cart with items totaling 500000 VND  
**And** shipping_fee = 30000 VND  
**When** order is created  
**Then** total_amount = 500000  
**And** final_amount = 530000  
**And** HTTP status 201 is returned

#### Scenario: Calculate order with discount
**Given** cart with items totaling 500000 VND  
**And** shipping_fee = 30000  
**And** discount_amount = 50000  
**When** order is created  
**Then** total_amount = 500000  
**And** final_amount = 480000 (500000 + 30000 - 50000)  
**And** HTTP status 201 is returned

### Requirement: Order Item Price Snapshot
Order items MUST preserve price at time of purchase.

**Acceptance Criteria:**
- order_items.price stores product price at time of order creation
- If product price changes later, order history shows original price
- Subtotal calculated as price × quantity

#### Scenario: Price snapshot in order items
**Given** product current price is 200000 VND  
**When** order is created with that product  
**Then** order_item.price = 200000  
**And** subtotal = 200000 × quantity  
**And** HTTP status 201 is returned

#### Scenario: Product price changes after order
**Given** order created when product price was 200000  
**And** product price is later changed to 250000  
**When** customer views order details  
**Then** order_item still shows price 200000  
**And** subtotal unchanged  
**And** HTTP status 200 is returned

### Requirement: Shipping Address Association
Each order MUST have associated shipping address information.

**Acceptance Criteria:**
- Shipping address copied from user's address book to order
- Stored in shipping_addresses table with order_id reference
- Address is snapshot (changes to user address don't affect order)
- Includes: full_name, phone, province, district, ward, detail_address

#### Scenario: Copy shipping address to order
**Given** user selects address_id = 10  
**And** address has full_name="Nguyen Van A", phone="0901234567", etc.  
**When** order is created  
**Then** shipping_addresses record created with order_id  
**And** all address fields are copied  
**And** HTTP status 201 is returned

#### Scenario: Address update doesn't affect existing order
**Given** order created with shipping address  
**When** user updates their address in address book  
**Then** order's shipping_address remains unchanged  
**And** HTTP status 200 is returned
