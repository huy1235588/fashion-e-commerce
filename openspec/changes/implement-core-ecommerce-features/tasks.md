# Implementation Tasks

## Overview
This checklist breaks down the implementation into sequential, verifiable tasks. Each task delivers user-visible progress and includes validation steps.

## Phase 1: Foundation & Authentication (Days 1-2)

### Backend
- [ ] **1.1**: Create User model with GORM tags and validation
- [ ] **1.2**: Implement UserRepository with methods: Create, FindByEmail, FindByID, Update, List
- [ ] **1.3**: Implement AuthService with Register, Login, HashPassword, VerifyPassword, GenerateJWT
- [ ] **1.4**: Create JWT utilities (GenerateToken, ValidateToken, ExtractClaims)
- [ ] **1.5**: Implement auth middleware for protected routes (ValidateJWT, RequireRole)
- [ ] **1.6**: Create AuthHandler with Register, Login, GetProfile, UpdateProfile endpoints
- [ ] **1.7**: Add password reset flow: SendResetCode, VerifyCode, ResetPassword endpoints
- [ ] **1.8**: Write tests for AuthService and auth middleware
- [ ] **Validation**: Test registration, login, JWT token generation, protected endpoint access

### Frontend
- [ ] **1.9**: Create auth types (User, LoginRequest, RegisterRequest, AuthResponse)
- [ ] **1.10**: Implement auth.service.ts with register, login, logout, getProfile methods
- [ ] **1.11**: Create authStore using Zustand (user state, setUser, clearUser, isAuthenticated)
- [ ] **1.12**: Build Login page with form validation
- [ ] **1.13**: Build Register page with form validation
- [ ] **1.14**: Create PrivateRoute component for protected pages
- [ ] **1.15**: Add auth token interceptor to API client
- [ ] **1.16**: Build user profile page (view/edit)
- [ ] **Validation**: User can register, login, view profile, and token persists on refresh

## Phase 2: Product Catalog & Categories (Days 3-4)

### Backend
- [ ] **2.1**: Create Category model and CategoryRepository (CRUD operations)
- [ ] **2.2**: Create Product, ProductImage, ProductVariant models
- [ ] **2.3**: Implement CategoryService with CRUD operations
- [ ] **2.4**: Implement ProductRepository with methods: Create, Update, Delete, FindByID, FindBySlug, List (with filters)
- [ ] **2.5**: Implement ProductService with business logic for creating products with variants and images
- [ ] **2.6**: Create CategoryHandler (admin-only endpoints for CRUD)
- [ ] **2.7**: Create ProductHandler with GetProducts (pagination, filters), GetProductByID, GetProductBySlug
- [ ] **2.8**: Add admin ProductHandler endpoints: CreateProduct, UpdateProduct, DeleteProduct, UploadImages
- [ ] **2.9**: Implement file upload handler for product images (validation: size, type, storage)
- [ ] **2.10**: Add product filtering by category, price range, search query
- [ ] **2.11**: Write tests for ProductService and filtering logic
- [ ] **Validation**: Admin can create products with variants/images; customers can browse and filter products

### Frontend
- [ ] **2.12**: Create product types (Product, Category, ProductVariant, ProductImage, ProductFilters)
- [ ] **2.13**: Implement product.service.ts (getProducts, getProductById, getCategories, searchProducts)
- [ ] **2.14**: Build ProductList component with pagination
- [ ] **2.15**: Build ProductCard component (image, name, price, discount)
- [ ] **2.16**: Create product listing page with filters (category, price range, search)
- [ ] **2.17**: Build product detail page (images gallery, variants selector, add to cart button)
- [ ] **2.18**: Create admin category management page (list, create, edit, delete)
- [ ] **2.19**: Create admin product management page (list, create, edit with image upload)
- [ ] **2.20**: Add product variant selector component (size/color dropdowns)
- [ ] **Validation**: Products display correctly, filtering works, admin can manage products and categories

## Phase 3: Shopping Cart (Day 5)

### Backend
- [ ] **3.1**: Create Cart, CartItem models
- [ ] **3.2**: Implement CartRepository with methods: GetByUserID, Create, AddItem, UpdateItem, RemoveItem, Clear
- [ ] **3.3**: Implement CartService with business logic: validate stock, calculate totals, handle variant changes
- [ ] **3.4**: Create CartHandler with endpoints: GetCart, AddToCart, UpdateCartItem, RemoveFromCart, ClearCart
- [ ] **3.5**: Add stock validation when adding/updating cart items
- [ ] **3.6**: Write tests for CartService stock validation and total calculation
- [ ] **Validation**: Cart operations work correctly, stock limits enforced, totals calculated accurately

### Frontend
- [ ] **3.7**: Create cart types (Cart, CartItem, AddToCartRequest)
- [ ] **3.8**: Implement cart.service.ts (getCart, addToCart, updateQuantity, removeItem, clearCart)
- [ ] **3.9**: Create cartStore with Zustand (cart state, item count, total)
- [ ] **3.10**: Build CartItem component (product info, quantity selector, remove button)
- [ ] **3.11**: Build CartSummary component (subtotal, shipping, total)
- [ ] **3.12**: Create cart page with list of items and summary
- [ ] **3.13**: Add "Add to Cart" functionality to product detail page
- [ ] **3.14**: Show cart item count in header
- [ ] **Validation**: Users can add products to cart, update quantities, see accurate totals

## Phase 4: Address Management (Day 6)

### Backend
- [ ] **4.1**: Create Address model and AddressRepository (CRUD, SetDefault)
- [ ] **4.2**: Implement AddressService with business logic (ensure only one default per user)
- [ ] **4.3**: Create AddressHandler with endpoints: List, Create, Update, Delete, SetDefault
- [ ] **4.4**: Add validation for Vietnamese address format (province, district, ward required)
- [ ] **4.5**: Write tests for default address switching logic
- [ ] **Validation**: Users can manage multiple addresses, set default works correctly

### Frontend
- [ ] **4.6**: Create address types (Address, CreateAddressRequest)
- [ ] **4.7**: Implement address service methods
- [ ] **4.8**: Build address list component with default indicator
- [ ] **4.9**: Create address form component (province/district/ward/detail)
- [ ] **4.10**: Add address selection during checkout
- [ ] **Validation**: Address management UI works, default selection persists

## Phase 5: Order Management (Days 7-8)

### Backend
- [ ] **5.1**: Create Order, OrderItem, ShippingAddress models
- [ ] **5.2**: Implement OrderRepository with methods: Create, FindByID, FindByUser, List, UpdateStatus
- [ ] **5.3**: Implement OrderService with logic: CreateFromCart, ValidateStock, UpdateStatus, CalculateTotals, CancelOrder
- [ ] **5.4**: Add order code generation utility (unique identifier)
- [ ] **5.5**: Implement stock deduction when order is created
- [ ] **5.6**: Implement stock restoration when order is cancelled
- [ ] **5.7**: Create OrderHandler for customers: CreateOrder, GetMyOrders, GetOrderByID, CancelOrder
- [ ] **5.8**: Create OrderHandler for admin: GetAllOrders, UpdateOrderStatus, GetOrderStatistics
- [ ] **5.9**: Add order status transition validation (prevent invalid state changes)
- [ ] **5.10**: Write tests for order creation, stock management, status transitions
- [ ] **Validation**: Orders created correctly, stock updated, status workflow enforced, cancellation works

### Frontend
- [ ] **5.11**: Create order types (Order, OrderItem, OrderStatus, CreateOrderRequest)
- [ ] **5.12**: Implement order.service.ts (createOrder, getOrders, getOrderById, cancelOrder)
- [ ] **5.13**: Build checkout page (address selection, payment method, order summary)
- [ ] **5.14**: Create order confirmation page (order details, payment instructions)
- [ ] **5.15**: Build order history page (list with status badges)
- [ ] **5.16**: Create order detail page (items, shipping, status timeline)
- [ ] **5.17**: Add cancel order button (only for pending status)
- [ ] **5.18**: Build admin order management page (list all orders, filter by status)
- [ ] **5.19**: Create admin order detail with status update controls
- [ ] **Validation**: Checkout flow works, order history displays, status updates reflect correctly

## Phase 6: Payment Integration (Days 9-10)

### Backend
- [ ] **6.1**: Create Payment model and PaymentRepository
- [ ] **6.2**: Implement VNPay integration: GeneratePaymentURL, VerifyCallback, ProcessReturn
- [ ] **6.3**: Implement MoMo integration: GeneratePaymentURL, VerifyCallback, ProcessIPN
- [ ] **6.4**: Implement COD payment handler (mark as pending, update on delivery)
- [ ] **6.5**: Create PaymentService to orchestrate payment flow and update order status
- [ ] **6.6**: Create PaymentHandler with endpoints: InitiatePayment, VNPayCallback, MoMoCallback, CODConfirm
- [ ] **6.7**: Add payment configuration to config (VNPay/MoMo credentials, sandbox mode)
- [ ] **6.8**: Implement payment status synchronization with order status
- [ ] **6.9**: Write tests for payment URL generation and callback verification
- [ ] **Validation**: Payment URLs generated correctly, callbacks processed, order status updates on payment success

### Frontend
- [ ] **6.10**: Create payment types (PaymentMethod, PaymentStatus, InitiatePaymentRequest)
- [ ] **6.11**: Add payment method selection to checkout page
- [ ] **6.12**: Create payment return/callback pages for VNPay and MoMo
- [ ] **6.13**: Handle payment redirect flow (redirect to gateway, return to success/failure page)
- [ ] **6.14**: Display payment instructions for COD orders
- [ ] **6.15**: Show payment status in order detail page
- [ ] **Validation**: Payment methods selectable, redirects work, payment status displayed correctly

## Phase 7: Product Reviews (Day 11)

### Backend
- [ ] **7.1**: Create Review model and ReviewRepository
- [ ] **7.2**: Implement ReviewService with logic: ValidatePurchase, CreateReview, GetProductReviews
- [ ] **7.3**: Create ReviewHandler with endpoints: CreateReview, GetReviews, UpdateReview, DeleteReview
- [ ] **7.4**: Add validation: user must have purchased product to review
- [ ] **7.5**: Add rating validation (1-5 stars)
- [ ] **7.6**: Prevent duplicate reviews for same product in same order
- [ ] **7.7**: Write tests for purchase validation and duplicate prevention
- [ ] **Validation**: Only verified purchasers can review, duplicates prevented

### Frontend
- [ ] **7.8**: Create review types (Review, CreateReviewRequest)
- [ ] **7.9**: Implement review service methods
- [ ] **7.10**: Build review list component (rating stars, comment, user, date)
- [ ] **7.11**: Create review form component (star rating selector, comment textarea)
- [ ] **7.12**: Add review section to product detail page
- [ ] **7.13**: Add "Write Review" button on order detail page (only for delivered orders)
- [ ] **7.14**: Display average rating on product card and detail page
- [ ] **Validation**: Reviews display correctly, submission works only for eligible users

## Phase 8: Admin Dashboard & Statistics (Day 12)

### Backend
- [ ] **8.1**: Create StatisticsService with methods: GetRevenue, GetOrderStats, GetCustomerStats, GetTopProducts
- [ ] **8.2**: Implement queries for revenue by date range (day/month/year)
- [ ] **8.3**: Implement order statistics (count by status, recent orders)
- [ ] **8.4**: Implement customer statistics (total, new in period)
- [ ] **8.5**: Implement top-selling products query
- [ ] **8.6**: Create StatisticsHandler (admin-only) with dashboard endpoints
- [ ] **8.7**: Write tests for statistics calculations
- [ ] **Validation**: Statistics calculated correctly, admin-only access enforced

### Frontend
- [ ] **8.8**: Create statistics types (RevenueStats, OrderStats, CustomerStats, TopProduct)
- [ ] **8.9**: Implement statistics service methods
- [ ] **8.10**: Build admin dashboard page with metrics cards (total revenue, orders, customers)
- [ ] **8.11**: Add revenue chart (by date range)
- [ ] **8.12**: Display order status breakdown (pie/bar chart)
- [ ] **8.13**: Show top-selling products list
- [ ] **8.14**: Add date range picker for filtering statistics
- [ ] **Validation**: Dashboard displays accurate statistics, charts render correctly

## Phase 9: User Management (Admin) (Day 13)

### Backend
- [ ] **9.1**: Extend UserRepository with List, UpdateActiveStatus methods
- [ ] **9.2**: Implement UserService for admin operations
- [ ] **9.3**: Create UserHandler (admin-only) with endpoints: GetAllUsers, GetUserByID, ActivateUser, DeactivateUser
- [ ] **9.4**: Add user filtering (by role, active status)
- [ ] **9.5**: Write tests for user activation/deactivation
- [ ] **Validation**: Admin can view and manage user accounts

### Frontend
- [ ] **9.6**: Build admin user list page with filters
- [ ] **9.7**: Create user detail modal/page showing user info and order history
- [ ] **9.8**: Add activate/deactivate toggle buttons
- [ ] **Validation**: User management UI works, status changes reflected

## Phase 10: Testing & Polish (Days 14-15)

### Testing
- [ ] **10.1**: Write integration tests for auth flow (register → login → protected access)
- [ ] **10.2**: Write integration tests for shopping flow (browse → add to cart → checkout → payment)
- [ ] **10.3**: Test admin workflows (create product → manage orders → view stats)
- [ ] **10.4**: Test error scenarios (invalid input, unauthorized access, insufficient stock)
- [ ] **10.5**: Perform cross-browser testing (Chrome, Firefox, Safari)
- [ ] **10.6**: Test responsive design on mobile/tablet/desktop
- [ ] **10.7**: Security audit: SQL injection, XSS, CSRF, auth bypass attempts

### Polish
- [ ] **10.8**: Add loading states to all async operations
- [ ] **10.9**: Implement error handling and user-friendly error messages
- [ ] **10.10**: Add success notifications for user actions
- [ ] **10.11**: Optimize images (lazy loading, compression)
- [ ] **10.12**: Review and fix accessibility issues (ARIA labels, keyboard navigation)
- [ ] **10.13**: Add input validation feedback on all forms
- [ ] **10.14**: Ensure consistent styling across all pages
- [ ] **Validation**: Application works smoothly, errors handled gracefully, UI polished

## Phase 11: Documentation & Deployment Prep (Days 16-17)

### Documentation
- [ ] **11.1**: Write API documentation (endpoints, request/response formats, auth requirements)
- [ ] **11.2**: Update README with setup instructions and environment variables
- [ ] **11.3**: Document deployment process
- [ ] **11.4**: Create database migration guide
- [ ] **11.5**: Write user guide (customer features)
- [ ] **11.6**: Write admin guide (admin features)

### Deployment
- [ ] **11.7**: Set up environment-specific configurations (dev, staging, production)
- [ ] **11.8**: Configure production database
- [ ] **11.9**: Set up production email service
- [ ] **11.10**: Configure production payment gateways
- [ ] **11.11**: Build frontend for production
- [ ] **11.12**: Deploy backend to server
- [ ] **11.13**: Deploy frontend (Vercel/Netlify or server)
- [ ] **11.14**: Verify production deployment
- [ ] **Validation**: Application deployed and accessible in production environment

## Dependencies
- **Critical Path**: Phase 1 must complete before all others (auth required)
- **Phase 2** must complete before Phase 3 (products needed for cart)
- **Phase 3** must complete before Phase 5 (cart needed for orders)
- **Phase 4** can run parallel with Phase 3 (addresses independent)
- **Phase 5** must complete before Phase 6 (orders needed for payments)
- **Phase 7** requires Phase 5 (reviews need completed orders)
- **Phases 8-9** can run parallel (both use existing data)
- **Phases 10-11** are sequential and final

## Parallelization Opportunities
- **Phase 4** (Address) can be developed alongside **Phase 3** (Cart)
- **Backend and Frontend tasks within each phase** can be split between developers
- **Phase 8** (Statistics) and **Phase 9** (User Management) can run concurrently
- **Frontend components** can be developed in parallel if backend APIs are mocked

## Notes
- Mark each task complete only after manual testing
- Update this file as implementation progresses
- Add notes for any deviations or issues encountered
- Each backend service should have corresponding repository tests
- Each API endpoint should be tested with Postman/Insomnia before frontend integration
