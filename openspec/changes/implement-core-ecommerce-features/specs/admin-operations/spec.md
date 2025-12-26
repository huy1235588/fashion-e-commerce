# Admin Operations Capability

## ADDED Requirements

### Requirement: Admin Dashboard Statistics
The system MUST provide admin users access to business metrics and analytics.

**Acceptance Criteria:**
- Display total revenue (all time and by date range)
- Show order statistics (total orders, by status)
- Show customer statistics (total customers, new in period)
- Display top-selling products
- Support date range filtering (day, week, month, year, custom)
- All statistics calculated from database in real-time

#### Scenario: View total revenue
**Given** admin user is authenticated  
**When** admin requests total revenue  
**Then** sum of all orders with payment_status = "paid" is calculated  
**And** total revenue amount is returned  
**And** HTTP status 200 is returned

#### Scenario: View revenue by date range
**Given** admin selects date range 2025-01-01 to 2025-01-31  
**When** admin requests revenue statistics  
**Then** sum of paid orders within date range is calculated  
**And** revenue amount is returned  
**And** HTTP status 200 is returned

#### Scenario: View order statistics by status
**Given** multiple orders with various statuses  
**When** admin requests order statistics  
**Then** count of orders grouped by status is returned  
**And** result includes: {pending: 10, processing: 5, shipping: 8, delivered: 30, cancelled: 2}  
**And** HTTP status 200 is returned

#### Scenario: View customer statistics
**Given** database contains user records  
**When** admin requests customer statistics  
**Then** total customer count (role = "customer") is returned  
**And** count of new customers in specified period is returned  
**And** HTTP status 200 is returned

#### Scenario: View top-selling products
**Given** order_items data exists  
**When** admin requests top 10 products  
**Then** products ranked by total quantity sold are returned  
**And** each result includes: product_id, name, total_quantity_sold  
**And** limited to top 10  
**And** HTTP status 200 is returned

#### Scenario: Dashboard summary for date range
**Given** admin selects date range "last 30 days"  
**When** admin requests dashboard summary  
**Then** response includes: total_revenue, order_count, new_customers, top_products  
**And** all metrics filtered by date range  
**And** HTTP status 200 is returned

### Requirement: User Management
The system MUST allow admin to view and manage user accounts.

**Acceptance Criteria:**
- List all users with pagination
- Filter users by role (customer, admin)
- Filter users by active status
- View detailed user information
- Activate/deactivate user accounts
- Cannot delete users (soft delete via is_active flag)

#### Scenario: Admin lists all users
**Given** 50 users exist in database  
**When** admin requests user list  
**Then** first 20 users are returned (default pagination)  
**And** each user includes: id, email, full_name, role, is_active, created_at  
**And** password is excluded  
**And** HTTP status 200 is returned

#### Scenario: Filter users by role
**Given** users with various roles exist  
**When** admin filters by role = "customer"  
**Then** only users with role "customer" are returned  
**And** HTTP status 200 is returned

#### Scenario: Filter users by active status
**Given** users with is_active = true and false exist  
**When** admin filters by is_active = false  
**Then** only inactive users are returned  
**And** HTTP status 200 is returned

#### Scenario: View user details
**Given** user ID 123 exists  
**When** admin requests GET /api/admin/users/123  
**Then** full user details are returned  
**And** user's order history is included  
**And** HTTP status 200 is returned

#### Scenario: Deactivate user account
**Given** user with is_active = true  
**When** admin deactivates the user  
**Then** user.is_active = false  
**And** user cannot log in  
**And** HTTP status 200 is returned

#### Scenario: Activate user account
**Given** user with is_active = false  
**When** admin activates the user  
**Then** user.is_active = true  
**And** user can log in  
**And** HTTP status 200 is returned

#### Scenario: Non-admin cannot access user management
**Given** customer user is authenticated  
**When** customer attempts to access /api/admin/users  
**Then** request fails with 403 Forbidden  
**And** error message "Admin access required" is returned

### Requirement: Order Management
The system MUST provide admin comprehensive order management capabilities.

**Acceptance Criteria:**
- View all orders from all users
- Filter orders by status, payment method, date range
- Search orders by order_code or customer email
- Update order status through workflow
- View detailed order information
- Export orders (optional enhancement, not in MVP)

#### Scenario: Admin views all orders
**Given** 100 orders exist from various users  
**When** admin requests order list  
**Then** all orders are returned with pagination  
**And** HTTP status 200 is returned

#### Scenario: Filter orders by status
**Given** orders with various statuses  
**When** admin filters by status = "pending"  
**Then** only pending orders are returned  
**And** HTTP status 200 is returned

#### Scenario: Search orders by order code
**Given** order with order_code = "ORD-2025-00123"  
**When** admin searches by "ORD-2025-00123"  
**Then** matching order is returned  
**And** HTTP status 200 is returned

#### Scenario: Search orders by customer email
**Given** orders from customer with email "customer@example.com"  
**When** admin searches by "customer@example.com"  
**Then** all orders from that customer are returned  
**And** HTTP status 200 is returned

#### Scenario: Admin updates order status
**Given** order with status "pending"  
**When** admin updates status to "processing"  
**Then** order.status = "processing"  
**And** updated_at timestamp is updated  
**And** HTTP status 200 is returned

#### Scenario: View order details as admin
**Given** any order exists  
**When** admin requests order details  
**Then** full order information is returned  
**And** customer details included  
**And** payment details included  
**And** HTTP status 200 is returned

### Requirement: Category Management
The system MUST allow admin to manage product categories (detailed in product-catalog capability).

**Acceptance Criteria:**
- Create, update, delete categories
- View category list
- Prevent deletion of categories with products

#### Scenario: Reference to product-catalog/spec.md
**Given** this requirement is fully defined in product-catalog/spec.md  
**When** implementation is needed  
**Then** refer to product-catalog capability for complete scenarios

### Requirement: Product Management
The system MUST allow admin to manage products, variants, and images (detailed in product-catalog capability).

**Acceptance Criteria:**
- Create products with variants and images
- Update product information
- Manage product variants and stock
- Upload and manage product images
- Activate/deactivate products

#### Scenario: Reference to product-catalog/spec.md
**Given** this requirement is fully defined in product-catalog/spec.md  
**When** implementation is needed  
**Then** refer to product-catalog capability for complete scenarios

### Requirement: Revenue Analytics
The system MUST allow admin to view revenue trends and breakdowns.

**Acceptance Criteria:**
- Daily revenue chart
- Monthly revenue summary
- Revenue by payment method
- Revenue by category
- Year-over-year comparison

#### Scenario: View daily revenue for month
**Given** admin selects month January 2025  
**When** admin requests daily revenue breakdown  
**Then** revenue for each day in January is returned  
**And** response format: [{date: "2025-01-01", revenue: 5000000}, ...]  
**And** HTTP status 200 is returned

#### Scenario: View monthly revenue for year
**Given** admin selects year 2025  
**When** admin requests monthly revenue breakdown  
**Then** revenue for each month is returned  
**And** response format: [{month: "2025-01", revenue: 150000000}, ...]  
**And** HTTP status 200 is returned

#### Scenario: View revenue by payment method
**Given** orders paid via COD, VNPay, MoMo  
**When** admin requests revenue by payment method  
**Then** revenue grouped by payment method is returned  
**And** response: {cod: 50000000, vnpay: 30000000, momo: 20000000}  
**And** HTTP status 200 is returned

#### Scenario: View revenue by category
**Given** products sold from various categories  
**When** admin requests revenue by category  
**Then** revenue grouped by category is returned  
**And** each result includes: category_name, total_revenue  
**And** HTTP status 200 is returned

### Requirement: Admin Access Control
All admin endpoints MUST be protected with role-based access control.

**Acceptance Criteria:**
- Admin endpoints require authentication
- User role must be "admin"
- Non-admin users receive 403 Forbidden
- Admin middleware applied to all admin routes

#### Scenario: Admin accesses admin endpoint
**Given** user with role "admin" and valid token  
**When** user requests admin endpoint  
**Then** request is allowed  
**And** endpoint processes normally

#### Scenario: Customer attempts to access admin endpoint
**Given** user with role "customer" and valid token  
**When** user requests admin endpoint  
**Then** request fails with 403 Forbidden  
**And** error message "Admin access required" is returned

#### Scenario: Unauthenticated user attempts admin access
**Given** no authentication token provided  
**When** request is made to admin endpoint  
**Then** request fails with 401 Unauthorized  
**And** error message "Authorization token required" is returned

### Requirement: Product Stock Management
The system MUST allow admin to view and update product stock levels.

**Acceptance Criteria:**
- View current stock for all variants
- Update stock quantity for variants
- View low stock alerts (stock < threshold)
- View out-of-stock products

#### Scenario: View all product stock levels
**Given** products with variants exist  
**When** admin requests stock overview  
**Then** all variants with stock quantities are returned  
**And** includes: product_name, size, color, sku, stock_quantity  
**And** HTTP status 200 is returned

#### Scenario: Update variant stock quantity
**Given** variant with stock_quantity = 10  
**When** admin updates stock to 50  
**Then** variant.stock_quantity = 50  
**And** updated_at timestamp is updated  
**And** HTTP status 200 is returned

#### Scenario: View low stock products
**Given** variants with various stock levels  
**And** low stock threshold = 5  
**When** admin requests low stock report  
**Then** only variants with stock_quantity <= 5 are returned  
**And** HTTP status 200 is returned

#### Scenario: View out-of-stock products
**Given** variants with various stock levels  
**When** admin requests out-of-stock report  
**Then** only variants with stock_quantity = 0 are returned  
**And** HTTP status 200 is returned

### Requirement: Review Moderation
The system MUST allow admin to moderate product reviews.

**Acceptance Criteria:**
- View all reviews across all products
- Delete inappropriate reviews
- View flagged/reported reviews (future enhancement)

#### Scenario: Admin views all reviews
**Given** reviews exist for various products  
**When** admin requests review list  
**Then** all reviews are returned with pagination  
**And** includes: product_name, user_name, rating, comment, created_at  
**And** HTTP status 200 is returned

#### Scenario: Admin deletes review
**Given** review ID 50 exists  
**When** admin deletes review 50  
**Then** review is deleted from database  
**And** HTTP status 200 is returned
