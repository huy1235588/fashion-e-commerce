# Frontend Customer Features Specification

## ADDED Requirements

### Requirement: User Authentication UI
The frontend MUST provide complete authentication flows with proper validation.

#### Scenario: User login with valid credentials
**Given** a user enters email "user@example.com" and password "Password123"  
**When** the user submits the login form  
**Then** the form is validated client-side  
**And** API request is sent to /api/auth/login  
**And** JWT token is stored in localStorage  
**And** user data is stored in auth store  
**And** user is redirected to home page

#### Scenario: Show login validation errors
**Given** a user enters email "invalid-email" and password "123"  
**When** the user tries to submit  
**Then** email field shows error "Invalid email format"  
**And** password field shows error "Password must be at least 8 characters"  
**And** the form is not submitted  
**And** error messages are displayed in Vietnamese

#### Scenario: User registration
**Given** a new user fills registration form with valid data  
**When** the user submits the form  
**Then** all fields are validated (email, password, name, phone)  
**And** API request is sent to /api/auth/register  
**And** success message is shown "Đăng ký thành công"  
**And** user is redirected to login page

#### Scenario: Request password reset
**Given** a user enters email "user@example.com" on forgot password page  
**When** the user submits the form  
**Then** API request is sent to /api/auth/forgot-password  
**And** success message is shown "Mã xác nhận đã được gửi đến email của bạn"  
**And** user is redirected to reset password page

#### Scenario: Reset password with OTP
**Given** a user enters OTP "123456" and new password on reset page  
**When** the user submits the form  
**Then** API request is sent to /api/auth/reset-password  
**And** password is successfully reset  
**And** success message is shown  
**And** user is redirected to login page

### Requirement: Product Browsing and Search
The frontend MUST provide comprehensive product browsing with filters and search.

#### Scenario: View product listing
**Given** a user accesses the products page  
**When** the page loads  
**Then** products are displayed in a grid layout  
**And** each product shows image, name, price, and discount price (if any)  
**And** products are loaded with pagination (20 per page)  
**And** loading skeletons are shown while fetching

#### Scenario: Search products by name
**Given** a user types "áo" in the search box  
**When** the search is triggered (with debounce)  
**Then** API request is sent with search query  
**And** filtered products are displayed  
**And** if no results, show "Không tìm thấy sản phẩm"

#### Scenario: Filter products by category
**Given** a user selects category "Áo nam"  
**When** the filter is applied  
**Then** only products in selected category are shown  
**And** URL is updated with category parameter  
**And** filter state persists on page reload

#### Scenario: Filter products by price range
**Given** a user sets price range from 100000 to 500000 VND  
**When** the filter is applied  
**Then** only products within price range are shown  
**And** products can have multiple active filters simultaneously

#### Scenario: Sort products
**Given** a user selects sort option "Giá tăng dần"  
**When** the sort is applied  
**Then** products are reordered by price ascending  
**And** pagination resets to page 1

### Requirement: Product Detail Page
The frontend MUST display comprehensive product information with purchase options.

#### Scenario: View product details
**Given** a user clicks on a product  
**When** the product detail page loads  
**Then** the following information is displayed:
  - Product images in a gallery
  - Product name and description
  - Price and discount price
  - Available sizes and colors
  - Stock availability
  - Product reviews and ratings  
**And** page uses Server-Side Rendering for SEO

#### Scenario: Select product variant
**Given** a product has variants (size: S, M, L; color: Red, Blue)  
**When** user selects size "M" and color "Red"  
**Then** the selected variant is highlighted  
**And** stock quantity for selected variant is shown  
**And** "Add to Cart" button is enabled if in stock  
**And** "Out of Stock" message is shown if stock is 0

#### Scenario: Add product to cart
**Given** a user selects variant and quantity 2  
**When** user clicks "Thêm vào giỏ hàng"  
**Then** item is added to cart store  
**And** if user is logged in, cart is synced with backend  
**And** success toast shows "Đã thêm vào giỏ hàng"  
**And** cart badge updates with new count

### Requirement: Shopping Cart Management
The frontend MUST provide complete cart functionality with real-time updates.

#### Scenario: View shopping cart
**Given** a user has items in cart  
**When** user accesses cart page  
**Then** all cart items are displayed with:
  - Product image and name
  - Selected variant (size, color)
  - Unit price
  - Quantity selector
  - Subtotal  
**And** total amount is calculated and displayed  
**And** "Tiến hành thanh toán" button is shown

#### Scenario: Update item quantity
**Given** a cart item has quantity 2  
**When** user changes quantity to 3  
**Then** cart store is updated  
**And** if user is logged in, backend is updated  
**And** subtotal and total are recalculated  
**And** UI updates without page reload

#### Scenario: Remove item from cart
**Given** a cart has multiple items  
**When** user clicks remove on one item  
**Then** confirmation dialog is shown  
**And** on confirmation, item is removed from cart  
**And** cart is updated in store and backend  
**And** total is recalculated

#### Scenario: View empty cart
**Given** cart has no items  
**When** user accesses cart page  
**Then** empty cart message is shown "Giỏ hàng của bạn đang trống"  
**And** "Tiếp tục mua sắm" button is shown  
**And** clicking it redirects to products page

### Requirement: Checkout Process
The frontend MUST provide a complete checkout flow with validation.

#### Scenario: Proceed to checkout
**Given** a logged-in user has items in cart  
**When** user clicks "Tiến hành thanh toán"  
**Then** user is redirected to checkout page  
**And** user's saved addresses are loaded  
**And** cart items are displayed in order summary

#### Scenario: Select shipping address
**Given** user has multiple saved addresses  
**When** user selects an address  
**Then** the address is highlighted as selected  
**And** address details are shown in order summary  
**And** user can add new address if needed

#### Scenario: Select payment method
**Given** user is on checkout page  
**When** user selects payment method options:
  - COD (Cash on Delivery)
  - VNPay
  - MoMo  
**Then** the selected method is highlighted  
**And** appropriate message is shown for each method

#### Scenario: Place order with COD
**Given** user has selected address and COD payment  
**When** user clicks "Đặt hàng"  
**Then** order is created via API  
**And** user is redirected to order success page  
**And** order confirmation is shown  
**And** cart is cleared

#### Scenario: Place order with online payment
**Given** user has selected address and VNPay/MoMo  
**When** user clicks "Đặt hàng"  
**Then** order is created with pending payment  
**And** payment URL is generated  
**And** user is redirected to payment gateway  
**And** after payment, user returns to callback page  
**And** payment result is verified and order is updated

### Requirement: Order Management
The frontend MUST allow customers to view and manage their orders.

#### Scenario: View order history
**Given** a logged-in customer  
**When** customer accesses orders page  
**Then** all customer's orders are displayed  
**And** each order shows: order code, date, total, status  
**And** orders are sorted by date descending  
**And** orders can be filtered by status

#### Scenario: View order details
**Given** a customer clicks on an order  
**When** order detail page loads  
**Then** complete order information is displayed:
  - Order code and date
  - Order status with timeline
  - Items ordered with variants
  - Shipping address
  - Payment method and status
  - Total amounts  
**And** cancel button is shown if status is "pending"

#### Scenario: Cancel order
**Given** an order with status "pending"  
**When** customer clicks "Hủy đơn hàng"  
**Then** confirmation dialog is shown  
**And** on confirmation, API request is sent  
**And** order status changes to "cancelled"  
**And** success message is shown  
**And** order detail is refreshed

#### Scenario: Cannot cancel processed order
**Given** an order with status "processing" or later  
**When** customer views order details  
**Then** cancel button is not shown  
**And** message explains "Không thể hủy đơn hàng đã được xử lý"

### Requirement: Profile and Address Management
The frontend MUST allow customers to manage their profile and addresses.

#### Scenario: Update profile
**Given** a logged-in customer  
**When** customer updates name or phone  
**Then** form validation is applied  
**And** API request updates user profile  
**And** auth store is updated with new data  
**And** success message is shown

#### Scenario: Add new address
**Given** a customer accesses address management  
**When** customer clicks "Thêm địa chỉ mới"  
**Then** address form modal is shown  
**And** form includes fields: name, phone, province, district, ward, detail  
**And** customer fills and submits form  
**And** address is saved via API  
**And** address list is refreshed

#### Scenario: Set default address
**Given** a customer has multiple addresses  
**When** customer sets an address as default  
**Then** API request updates default address  
**And** previous default is unmarked  
**And** new default is marked with badge "Mặc định"

#### Scenario: Delete address
**Given** a customer wants to remove an address  
**When** customer clicks delete  
**Then** confirmation dialog is shown  
**And** on confirmation, address is deleted via API  
**And** address is removed from list  
**And** cannot delete if it's the only address

### Requirement: Product Reviews
The frontend MUST allow customers to review purchased products.

#### Scenario: Submit product review
**Given** a customer who purchased a product  
**When** customer writes review with rating and comment  
**Then** form is validated (rating required, comment optional)  
**And** review is submitted via API  
**And** review appears in product detail page  
**And** success message is shown

#### Scenario: View product reviews
**Given** a product has reviews  
**When** viewing product detail page  
**Then** all reviews are displayed with:
  - Reviewer name
  - Rating (stars)
  - Comment
  - Review date  
**And** average rating is calculated and shown  
**And** reviews are paginated if many

#### Scenario: Cannot review without purchase
**Given** a customer who didn't buy a product  
**When** viewing product detail  
**Then** review form is not shown  
**And** message explains "Bạn cần mua sản phẩm để đánh giá"
