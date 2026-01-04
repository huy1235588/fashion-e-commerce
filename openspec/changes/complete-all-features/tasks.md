# Implementation Tasks: Complete All Features

## Phase 1: Backend Utilities (3-4 days)

### Email Service
- [x] Create `internal/utils/email.go` with SMTP configuration
- [x] Implement `SendEmail()` function with HTML template support
- [x] Implement `SendPasswordResetEmail(email, code string)` function
- [x] Implement `SendOrderConfirmationEmail(order *models.Order)` function
- [x] Create email HTML templates in `internal/utils/templates/`
- [x] Update `auth_service.go` to call email service in `SendResetCode()`
- [x] Update `order_service.go` to send confirmation emails after order creation
- [x] Add email configuration to `config.go` (SMTP host, port, username, password)

### File Upload Utility
- [x] Create `internal/utils/upload.go` for image upload handling
- [x] Implement `UploadImage()` function with validation
- [x] Implement image compression/optimization
- [x] Add file type validation (JPEG, PNG, WebP)
- [x] Add file size validation (max 10MB)
- [x] Create upload directory structure (`uploads/products/`)
- [x] Add file upload configuration to `config.go`
- [x] Update `product_handler.go` to handle image uploads
- [x] Implement delete old images when updating product

### Validation Utilities
- [x] Create `internal/utils/validator.go` for custom validations
- [x] Implement Vietnamese phone number validation
- [x] Implement price validation helpers
- [x] Implement address validation
- [x] Add request validation helpers for handlers

## Phase 2: Admin Statistics & Reporting (2-3 days)

### Statistics Service
- [x] Create `internal/services/statistics_service.go`
- [x] Implement `GetDashboardStats()` - overview metrics
- [x] Implement `GetRevenueByPeriod(startDate, endDate)` function
- [x] Implement `GetTopSellingProducts(limit int)` function
- [x] Implement `GetOrderStatsByStatus()` function
- [x] Implement `GetCustomerGrowth(period string)` function
- [x] Implement `GetRevenueByCategory()` function

### Statistics Repository
- [x] Create `internal/repositories/statistics_repository.go`
- [x] Add complex queries for revenue calculation
- [x] Add queries for product sales ranking
- [x] Add queries for customer growth metrics
- [x] Add queries for order status distribution
- [x] Optimize queries with proper indexes

### Statistics Handler
- [x] Create `internal/handlers/statistics_handler.go`
- [x] Implement `GetDashboardStats` endpoint (GET /api/admin/statistics/dashboard)
- [x] Implement `GetRevenue` endpoint (GET /api/admin/statistics/revenue)
- [x] Implement `GetTopProducts` endpoint (GET /api/admin/statistics/products/top)
- [x] Implement `GetOrderStats` endpoint (GET /api/admin/statistics/orders)
- [x] Implement `GetCustomerStats` endpoint (GET /api/admin/statistics/customers)
- [x] Add admin authentication middleware to all statistics routes
- [x] Register statistics routes in `main.go`

## Phase 3: Frontend Authentication & Customer Features (5-6 days)

### Type Definitions
- [x] Review and complete all TypeScript types in `src/types/`
- [x] Add missing types for API responses
- [x] Add types for form inputs and validation

### Authentication Pages
- [x] Complete `src/app/(auth)/login/page.tsx` with form validation
- [x] Complete `src/app/(auth)/register/page.tsx` with form validation
- [x] Create `src/app/(auth)/forgot-password/page.tsx`
- [x] Create `src/app/(auth)/reset-password/page.tsx`
- [x] Add loading states to all auth forms
- [x] Add error handling and display
- [x] Integrate with auth service
- [x] Implement redirect after successful login

### Auth Store & Service
- [x] Complete `src/store/authStore.ts` with Zustand
- [x] Add user session persistence (localStorage)
- [x] Add token refresh logic
- [x] Complete `src/services/auth.service.ts` with all API calls
- [x] Add error handling in auth service
- [x] Implement auto-logout on token expiration

### Profile & Address Management
- [x] Complete `src/app/profile/page.tsx` for profile editing
- [x] Complete `src/app/addresses/page.tsx` for address management
- [x] Create address add/edit modal component
- [x] Create address delete confirmation dialog
- [x] Implement set default address functionality
- [x] Add form validation for all inputs
- [x] Integrate with address service

### Order Management
- [x] Complete `src/app/orders/page.tsx` for order history
- [x] Create `src/app/orders/[id]/page.tsx` for order details
- [x] Add order status badge component
- [x] Add order timeline/tracking component
- [x] Implement order cancellation functionality
- [x] Add filters for order status
- [x] Add order search functionality
- [x] Integrate with order service

### Common Components
- [x] Create `src/components/common/Loading.tsx` spinner component
- [x] Create `src/components/common/ErrorMessage.tsx` component
- [x] Create `src/components/common/Toast.tsx` notification component
- [x] Create `src/components/common/ConfirmDialog.tsx` component
- [x] Create `src/components/common/FormField.tsx` with validation
- [x] Create `src/components/common/Pagination.tsx` component

## Phase 4: Frontend Shopping & Checkout (5-6 days)

### Product Listing & Search
- [x] Complete `src/app/products/page.tsx` with filters
- [x] Implement category filter component
- [x] Implement price range filter component
- [x] Implement size/color filter component
- [x] Add product search bar with debounce
- [x] Add sorting options (price, name, newest)
- [x] Implement pagination
- [x] Add loading skeletons for products
- [x] Integrate with product service

### Product Detail
- [x] Complete `src/app/products/[id]/page.tsx`
- [x] Create image gallery component with zoom
- [x] Create variant selector (size/color) component
- [x] Add quantity selector component
- [x] Display product reviews and ratings
- [x] Add "Add to Cart" functionality
- [x] Show stock availability
- [x] Add breadcrumb navigation
- [x] Integrate with product and review services

### Shopping Cart
- [x] Complete `src/app/cart/page.tsx`
- [x] Create cart item component with quantity controls
- [x] Implement update quantity functionality
- [x] Implement remove item functionality
- [x] Calculate and display subtotal/total
- [x] Add "Continue Shopping" button
- [x] Add "Proceed to Checkout" button
- [x] Show empty cart state
- [x] Integrate with cart store and service

### Cart Store
- [x] Complete `src/store/cartStore.ts` with Zustand
- [x] Add cart persistence to localStorage
- [x] Implement addItem, removeItem, updateQuantity actions
- [x] Implement clearCart action
- [x] Sync cart with backend after login
- [x] Calculate totals automatically

### Checkout Flow
- [x] Complete `src/app/checkout/page.tsx`
- [x] Create address selection component
- [x] Create payment method selection component (COD only)
- [x] Display order summary
- [x] Add order notes input
- [x] Implement place order functionality
- [x] Handle COD orders
- [x] Add form validation
- [x] Integrate with order service

### Product Review
- [x] Create review form component
- [x] Add star rating selector
- [x] Add comment textarea
- [x] Implement submit review functionality
- [x] Show user's existing reviews
- [x] Validate user can only review purchased products
- [x] Integrate with review service

## Phase 5: Admin Panel & Final Integration (4-5 days)

### Admin Dashboard
- [x] Complete `src/app/admin/page.tsx` with statistics
- [x] Create revenue chart component (use chart library)
- [x] Create order status pie chart
- [x] Display key metrics cards (total revenue, orders, customers, products)
- [x] Add date range selector for statistics
- [x] Show top-selling products table
- [x] Integrate with statistics service

### Category Management
- [x] Create `src/app/admin/categories/page.tsx`
- [x] Create category add/edit modal
- [x] Create category delete confirmation
- [x] Add category list table with actions
- [x] Implement slug auto-generation
- [x] Add form validation
- [x] Integrate with category service

### Product Management
- [x] Create `src/app/admin/products/page.tsx`
- [x] Create `src/app/admin/products/add/page.tsx`
- [x] Create `src/app/admin/products/[id]/edit/page.tsx`
- [x] Implement image upload with preview
- [x] Implement variant management (add/remove size/color)
- [x] Add stock quantity management
- [x] Add rich text editor for product description
- [x] Add product search and filters
- [x] Add product status toggle (active/inactive)
- [x] Integrate with product service

### Order Management
- [x] Create `src/app/admin/orders/page.tsx`
- [x] Create `src/app/admin/orders/[id]/page.tsx` for order details
- [x] Add order status update dropdown
- [x] Add order filters (status, date range, customer)
- [x] Add order search by order code
- [x] Display customer and shipping information
- [x] Show order items and payment details
- [x] Add order export functionality (optional)
- [x] Integrate with order service

### Customer Management
- [x] Create `src/app/admin/customers/page.tsx`
- [x] Create `src/app/admin/customers/[id]/page.tsx` for customer details
- [x] Display customer information and order history
- [x] Add activate/deactivate account functionality
- [x] Add customer search functionality
- [x] Add customer filters
- [x] Show customer statistics
- [x] Integrate with admin service

### Admin Components
- [x] Create admin layout with sidebar navigation
- [x] Create admin header with logout
- [x] Create data table component (reusable)
- [x] Create chart components wrapper
- [x] Create file upload component for images
- [x] Add admin route protection (role-based)

### Final Integration & Polish
- [x] Test all customer workflows end-to-end
- [x] Test all admin workflows end-to-end
- [x] Verify all forms have proper validation
- [x] Verify all APIs return proper error messages
- [x] Add loading states to all async operations
- [x] Ensure responsive design on mobile devices
- [x] Test payment flows in sandbox environment
- [x] Verify email sending works correctly
- [x] Check image uploads work correctly
- [x] Update README with complete setup instructions
- [x] Create `.env.example` files with all required variables
- [ ] Prepare demo data for thesis presentation

## Environment Configuration

- [x] Update `backend/.env.example` with all required variables
- [x] Add SMTP configuration variables
- [x] Add file upload configuration variables
- [x] Update `frontend/.env.example` with API URL
- [x] Document all environment variables in README

## Documentation

- [x] Update `backend/README.md` with complete setup guide
- [x] Update `frontend/README.md` with complete setup guide
- [x] Document all API endpoints
- [x] Document email service setup
- [x] Create deployment guide
- [x] Create user manual for admin panel (optional)

## Notes

- **NO TESTING REQUIRED** - Focus purely on feature implementation
- All tasks should be implemented with proper error handling
- Use TypeScript strict mode for all frontend code
- Follow existing code patterns and conventions
- Ensure all user-facing text supports Vietnamese
- Keep mobile responsiveness in mind
- Use existing UI components from shadcn/ui when possible
