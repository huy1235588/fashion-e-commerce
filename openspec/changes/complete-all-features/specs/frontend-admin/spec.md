# Frontend Admin Panel Specification

## ADDED Requirements

### Requirement: Admin Dashboard
The admin panel MUST display comprehensive business analytics and statistics.

#### Scenario: View admin dashboard
**Given** an admin user logs in  
**When** admin accesses dashboard page  
**Then** the following metrics are displayed:
  - Total revenue card
  - Total orders card
  - Total customers card
  - Total products card  
**And** revenue chart is shown (last 30 days)  
**And** order status distribution pie chart is shown  
**And** top 5 selling products table is shown

#### Scenario: Filter dashboard by date range
**Given** admin is viewing dashboard  
**When** admin selects custom date range  
**Then** revenue chart updates with selected period  
**And** metrics are recalculated for the period  
**And** charts are re-rendered with new data

#### Scenario: View revenue trend
**Given** dashboard revenue chart  
**When** chart renders  
**Then** daily revenue is plotted as a line chart  
**And** x-axis shows dates  
**And** y-axis shows revenue in VND  
**And** hovering shows exact value for each day  
**And** chart uses Vietnamese formatting for numbers

### Requirement: Category Management
The admin panel MUST provide full CRUD operations for categories.

#### Scenario: View category list
**Given** admin accesses category management  
**When** page loads  
**Then** all categories are displayed in a table  
**And** table shows: ID, name, slug, product count  
**And** action buttons (edit, delete) are shown for each row  
**And** "Thêm danh mục" button is shown at top

#### Scenario: Add new category
**Given** admin clicks "Thêm danh mục"  
**When** add category modal opens  
**Then** form fields are shown: name, description  
**And** slug is auto-generated from name  
**And** on submit, category is created via API  
**And** modal closes and table refreshes  
**And** success toast shows "Thêm danh mục thành công"

#### Scenario: Edit category
**Given** admin clicks edit on a category  
**When** edit modal opens  
**Then** form is pre-filled with category data  
**And** admin can modify name and description  
**And** on submit, category is updated via API  
**And** table refreshes with updated data

#### Scenario: Delete category
**Given** admin clicks delete on a category  
**When** confirmation dialog appears  
**Then** dialog shows "Bạn có chắc muốn xóa danh mục này?"  
**And** on confirm, category is deleted via API  
**And** category is removed from table  
**And** cannot delete if category has products

### Requirement: Product Management
The admin panel MUST provide comprehensive product management with image upload.

#### Scenario: View product list
**Given** admin accesses product management  
**When** page loads  
**Then** products are displayed in a table with:
  - Image thumbnail
  - Name
  - Category
  - Price
  - Stock quantity
  - Status (active/inactive)
  - Actions (edit, delete)  
**And** pagination is shown  
**And** search box allows filtering by name

#### Scenario: Add new product
**Given** admin clicks "Thêm sản phẩm"  
**When** add product page opens  
**Then** form includes fields:
  - Name (required)
  - Description (rich text editor)
  - Category (dropdown)
  - Price (required)
  - Discount price (optional)
  - Images (upload multiple)
  - Variants (size, color, stock)  
**And** admin can upload up to 5 images  
**And** images are previewed before upload  
**And** admin can add/remove variant rows

#### Scenario: Upload product images
**Given** admin is adding/editing a product  
**When** admin selects image files  
**Then** images are validated (type, size)  
**And** previews are shown  
**And** on form submit, images are uploaded to backend  
**And** image URLs are saved with product  
**And** first image is marked as primary

#### Scenario: Manage product variants
**Given** admin is adding a product  
**When** admin adds variant (size: M, color: Red, stock: 10)  
**Then** variant row is added to variants table  
**And** admin can add multiple variants  
**And** SKU is auto-generated for each variant  
**And** all variants are saved with product

#### Scenario: Edit product
**Given** admin clicks edit on a product  
**When** edit page loads  
**Then** form is pre-filled with product data  
**And** existing images are shown  
**And** existing variants are displayed  
**And** admin can modify any field  
**And** admin can delete old images and upload new ones  
**And** on submit, product is updated via API

#### Scenario: Toggle product status
**Given** a product is active  
**When** admin toggles status switch  
**Then** product status changes to inactive  
**And** API updates product.is_active  
**And** inactive products are hidden from customer view

#### Scenario: Delete product
**Given** admin clicks delete on a product  
**When** confirmation dialog appears  
**Then** dialog shows "Bạn có chắc muốn xóa sản phẩm này?"  
**And** on confirm, product is deleted via API  
**And** product is removed from list  
**And** associated images are deleted from server

### Requirement: Order Management
The admin panel MUST allow viewing and updating order status.

#### Scenario: View order list
**Given** admin accesses order management  
**When** page loads  
**Then** all orders are displayed in a table  
**And** table shows: order code, customer, date, total, status  
**And** orders can be filtered by status  
**And** orders can be searched by order code  
**And** orders are sorted by date descending

#### Scenario: View order details
**Given** admin clicks on an order  
**When** order detail page loads  
**Then** complete order information is shown:
  - Order code, date, status
  - Customer info (name, email, phone)
  - Shipping address
  - Order items with quantities
  - Payment method and status
  - Subtotal, shipping fee, total  
**And** status update dropdown is shown  
**And** order timeline/history is shown

#### Scenario: Update order status to processing
**Given** an order with status "pending"  
**When** admin selects "processing" from dropdown  
**Then** confirmation dialog is shown  
**And** on confirm, order status is updated via API  
**And** order detail refreshes with new status  
**And** customer receives notification email (optional)

#### Scenario: Update order status to shipping
**Given** an order with status "processing"  
**When** admin selects "shipping"  
**Then** order status is updated  
**And** shipping date is recorded  
**And** customer receives shipping notification

#### Scenario: Mark order as delivered
**Given** an order with status "shipping"  
**When** admin selects "delivered"  
**Then** order status is updated  
**And** if payment method was COD, payment_status changes to "paid"  
**And** delivery date is recorded

#### Scenario: Cancel order
**Given** an order with status "pending" or "processing"  
**When** admin selects "cancelled"  
**Then** cancellation reason dialog is shown  
**And** on confirm, order status is updated  
**And** product stock quantities are restored  
**And** if payment was made, refund process is initiated

#### Scenario: Filter orders by status
**Given** admin is viewing order list  
**When** admin selects status filter "pending"  
**Then** only orders with status "pending" are shown  
**And** order count is updated  
**And** filter can be cleared to show all

#### Scenario: Search orders
**Given** admin enters order code "ORD-20231201-001" in search  
**When** search is triggered  
**Then** matching orders are displayed  
**And** if no match, show "Không tìm thấy đơn hàng"

### Requirement: Customer Management
The admin panel MUST allow viewing and managing customer accounts.

#### Scenario: View customer list
**Given** admin accesses customer management  
**When** page loads  
**Then** all customers are displayed in a table  
**And** table shows: ID, email, name, phone, registration date, status  
**And** action buttons (view, activate/deactivate) are shown  
**And** customers can be searched by email or name

#### Scenario: View customer details
**Given** admin clicks on a customer  
**When** customer detail page loads  
**Then** customer information is shown:
  - Personal info (email, name, phone)
  - Registration date
  - Account status (active/inactive)
  - Total orders
  - Total spent
  - Order history  
**And** recent orders are listed  
**And** activate/deactivate button is shown

#### Scenario: Deactivate customer account
**Given** a customer account is active  
**When** admin clicks "Khóa tài khoản"  
**Then** confirmation dialog is shown  
**And** on confirm, customer.is_active is set to false  
**And** customer cannot log in  
**And** status badge updates to "Inactive"

#### Scenario: Activate customer account
**Given** a customer account is inactive  
**When** admin clicks "Mở khóa tài khoản"  
**Then** customer.is_active is set to true  
**And** customer can log in again  
**And** status badge updates to "Active"

#### Scenario: Search customers
**Given** admin enters email "user@example.com" in search  
**When** search is triggered  
**Then** matching customers are displayed  
**And** search also works with name  
**And** search is case-insensitive

### Requirement: Admin Layout and Navigation
The admin panel MUST have a consistent layout with navigation.

#### Scenario: View admin sidebar
**Given** admin is logged in  
**When** accessing any admin page  
**Then** sidebar navigation is shown with links:
  - Dashboard
  - Danh mục
  - Sản phẩm
  - Đơn hàng
  - Khách hàng
  - Đăng xuất  
**And** current page is highlighted in sidebar  
**And** sidebar is collapsible on mobile

#### Scenario: Admin header
**Given** admin is on any admin page  
**When** header renders  
**Then** admin name is shown  
**And** logout button is shown  
**And** clicking logout clears session and redirects to login

#### Scenario: Protect admin routes
**Given** a non-admin user tries to access admin pages  
**When** page loads  
**Then** user role is checked  
**And** if not admin, redirect to home page  
**And** error toast shows "Bạn không có quyền truy cập"

### Requirement: Admin UI Components
The admin panel MUST use reusable data table and form components.

#### Scenario: Use data table component
**Given** admin views any list page (products, orders, customers)  
**When** table renders  
**Then** table supports:
  - Column sorting
  - Pagination
  - Row selection (optional)
  - Responsive design  
**And** table has consistent styling across all pages

#### Scenario: Use file upload component
**Given** admin is uploading product images  
**When** upload component renders  
**Then** drag-and-drop area is shown  
**And** "Choose files" button is shown  
**And** file validation runs on selection  
**And** preview thumbnails are shown  
**And** remove button on each thumbnail  
**And** upload progress is shown during upload

#### Scenario: Show loading states
**Given** admin triggers an API operation  
**When** request is in progress  
**Then** loading spinner is shown  
**And** buttons are disabled  
**And** user cannot submit duplicate requests  
**And** on completion, spinner disappears

#### Scenario: Show error messages
**Given** an API request fails  
**When** error is received  
**Then** error toast notification is shown  
**And** error message is user-friendly  
**And** technical errors are logged to console  
**And** user can retry the operation
