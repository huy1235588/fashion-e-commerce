# Design Document: Complete All Features

## Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│  ┌────────────┐  ┌─────────────┐  ┌───────────────────┐   │
│  │   Pages    │  │  Components │  │  State Management │   │
│  │  (App Dir) │  │   (React)   │  │    (Zustand)      │   │
│  └─────┬──────┘  └──────┬──────┘  └─────────┬─────────┘   │
│        │                │                    │              │
│        └────────────────┴────────────────────┘              │
│                         │                                   │
│                    API Services                             │
│                         │                                   │
└─────────────────────────┼───────────────────────────────────┘
                          │ HTTP/JSON
┌─────────────────────────┼───────────────────────────────────┐
│                         │  Backend (Golang/Gin)             │
│                    ┌────▼─────┐                             │
│                    │ Handlers │                             │
│                    └────┬─────┘                             │
│                         │                                   │
│                    ┌────▼─────┐                             │
│                    │ Services │◄──┬──► Email Service (SMTP)│
│                    └────┬─────┘   ├──► File Upload         │
│                         │         └──► Payment Gateways    │
│                  ┌──────▼────────┐                          │
│                  │  Repositories │                          │
│                  └──────┬────────┘                          │
│                         │                                   │
│                    ┌────▼─────┐                             │
│                    │   GORM   │                             │
│                    └────┬─────┘                             │
└─────────────────────────┼───────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                   PostgreSQL Database                       │
└─────────────────────────────────────────────────────────────┘
```

## Backend Design Decisions

### 1. Email Service Architecture

**Choice**: SMTP with Gmail using gomail.v2

**Rationale**:
- Simple integration for thesis project
- No external service costs
- Gmail is reliable and well-documented
- Meets thesis requirements

**Implementation**:
```go
// internal/utils/email.go
type EmailService struct {
    Host     string
    Port     int
    Username string
    Password string
}

func (e *EmailService) SendEmail(to, subject, htmlBody string) error
func (e *EmailService) SendPasswordResetEmail(email, code string) error
func (e *EmailService) SendOrderConfirmationEmail(order *models.Order) error
```

**Templates**:
- HTML templates in `internal/utils/templates/`
- Separate templates for: password reset, order confirmation
- Support Vietnamese language

**Error Handling**:
- Log all email failures
- Don't expose SMTP errors to users
- Retry mechanism for transient failures (optional)

### 2. File Upload Architecture

**Choice**: Local file system storage in `./uploads`

**Rationale**:
- Simple deployment without cloud dependencies
- Sufficient for thesis scope
- Easy to manage and backup
- No additional costs

**Structure**:
```
uploads/
  └── products/
      ├── {product-id}/
      │   ├── image1.jpg
      │   ├── image2.jpg
      │   └── thumbnail_image1.jpg
```

**Implementation**:
```go
// internal/utils/upload.go
type UploadService struct {
    MaxFileSize    int64
    AllowedTypes   []string
    UploadDir      string
    ThumbnailSize  int
}

func (u *UploadService) UploadImage(file multipart.File, header *multipart.FileHeader, productID uint) (string, error)
func (u *UploadService) ValidateImage(header *multipart.FileHeader) error
func (u *UploadService) CompressImage(src, dest string, quality int) error
func (u *UploadService) DeleteImage(path string) error
```

**Features**:
- File type validation (JPEG, PNG, WebP)
- File size limit (10MB default)
- Image compression to reduce storage
- Automatic thumbnail generation (optional)
- Delete old images when updating

**Security**:
- Sanitize filenames
- Generate unique filenames (UUID)
- Check for malicious content (basic)
- Restrict file access via proper routing

### 3. Payment Gateway Integration

**Choice**: VNPay and MoMo via direct API integration

**Rationale**:
- Required for Vietnamese market
- Well-documented sandbox APIs
- No third-party SDKs needed
- Demonstrates API integration skills

**VNPay Flow**:
```
1. Customer clicks "Pay with VNPay"
2. Backend creates payment URL with signature
   - Hash: SHA256(params + secret key)
   - URL: vnpay_url?params&signature
3. Redirect customer to VNPay
4. Customer completes payment
5. VNPay redirects to return URL
6. Backend verifies signature
7. Update order/payment status
8. Show success/failure page
```

**MoMo Flow**:
```
1. Customer clicks "Pay with MoMo"
2. Backend creates payment request
   - Signature: HMAC_SHA256(params, secret)
   - POST to MoMo API
3. Receive QR code or redirect URL
4. Customer scans QR or redirects
5. MoMo calls IPN webhook
6. Backend verifies signature
7. Update order/payment status
8. Return confirmation
```

**Implementation**:
```go
// internal/utils/payment.go
func CreateVNPayURL(order *models.Order, returnURL string) (string, error)
func VerifyVNPaySignature(params url.Values, signature string) bool

func CreateMoMoPayment(order *models.Order, returnURL string) (*MoMoResponse, error)
func VerifyMoMoSignature(params map[string]string, signature string) bool
```

**Security**:
- Never expose secret keys in frontend
- Always verify signatures on callbacks
- Log all payment transactions
- Implement idempotency for webhooks
- Handle race conditions (double payment)

**Error Handling**:
- Handle timeout scenarios
- Handle cancelled payments
- Handle insufficient balance
- Provide clear error messages
- Implement payment retry logic

### 4. Statistics & Analytics

**Design**: Aggregation queries with caching considerations

**Key Metrics**:
- Total revenue (by period)
- Order count (by status, by period)
- Customer growth (new registrations)
- Top-selling products
- Average order value
- Category performance

**Implementation**:
```go
// internal/services/statistics_service.go
type DashboardStats struct {
    TotalRevenue    float64
    TotalOrders     int
    TotalCustomers  int
    TotalProducts   int
    RevenueToday    float64
    OrdersToday     int
    PendingOrders   int
}

func (s *statisticsService) GetDashboardStats() (*DashboardStats, error)
func (s *statisticsService) GetRevenueByPeriod(start, end time.Time) ([]RevenueData, error)
func (s *statisticsService) GetTopProducts(limit int) ([]ProductStats, error)
```

**Query Optimization**:
- Use database aggregation functions (SUM, COUNT, AVG)
- Add proper indexes on foreign keys and timestamps
- Use BETWEEN for date range queries
- Limit result sets appropriately

**Future Enhancement** (not in scope):
- Redis caching for frequently accessed stats
- Background jobs for heavy calculations
- Real-time updates with WebSockets

## Frontend Design Decisions

### 1. State Management Strategy

**Choice**: Zustand for global state + React hooks for local state

**Rationale**:
- Simpler than Redux for this scope
- TypeScript friendly
- Minimal boilerplate
- Good performance
- Easy to learn

**Stores**:
```typescript
// src/store/authStore.ts
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}

// src/store/cartStore.ts
interface CartState {
  items: CartItem[];
  total: number;
  addItem: (product: Product, variant: Variant, quantity: number) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  syncWithBackend: () => Promise<void>;
}
```

**Persistence**:
- Auth token in localStorage
- Cart items in localStorage
- Sync with backend after login
- Clear on logout

### 2. Component Architecture

**Pattern**: Container/Presentational pattern with Server/Client Components

**Structure**:
```
components/
  ├── auth/
  │   ├── LoginForm.tsx          (Client Component)
  │   ├── RegisterForm.tsx       (Client Component)
  │   └── ResetPasswordForm.tsx  (Client Component)
  ├── product/
  │   ├── ProductCard.tsx        (Server Component)
  │   ├── ProductGrid.tsx        (Server Component)
  │   ├── ProductFilters.tsx     (Client Component)
  │   └── ProductDetail.tsx      (Client Component)
  ├── cart/
  │   ├── CartItem.tsx           (Client Component)
  │   ├── CartSummary.tsx        (Client Component)
  │   └── CartEmpty.tsx          (Server Component)
  ├── order/
  │   ├── OrderCard.tsx          (Server Component)
  │   ├── OrderStatus.tsx        (Server Component)
  │   └── OrderTimeline.tsx      (Server Component)
  └── common/
      ├── Loading.tsx            (Server Component)
      ├── ErrorMessage.tsx       (Server Component)
      ├── Toast.tsx              (Client Component)
      └── ConfirmDialog.tsx      (Client Component)
```

**Guidelines**:
- Use Server Components by default
- Mark as Client Component only when needed (interactivity, hooks)
- Extract reusable logic to custom hooks
- Keep components small and focused
- Use TypeScript interfaces for props

### 3. Form Handling & Validation

**Choice**: React Hook Form + Zod for validation

**Rationale**:
- Excellent TypeScript support
- Minimal re-renders
- Built-in validation
- Easy error handling
- Good DX

**Example**:
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  
  // ...
}
```

### 4. API Service Layer

**Pattern**: Service classes with error handling

**Structure**:
```typescript
// src/services/base.service.ts
class BaseService {
  protected apiUrl: string;
  protected getAuthHeaders(): HeadersInit;
  protected handleError(error: any): never;
}

// src/services/product.service.ts
class ProductService extends BaseService {
  async getProducts(filters: ProductFilters): Promise<PaginatedResponse<Product>>
  async getProductById(id: number): Promise<Product>
  async createProduct(data: CreateProductData): Promise<Product>
  // ...
}
```

**Error Handling**:
- Catch and transform API errors
- Provide user-friendly messages
- Log errors to console (dev mode)
- Handle network errors gracefully
- Show toast notifications

### 5. Admin Panel Architecture

**Design**: Separate admin layout with sidebar navigation

**Features**:
- Dashboard with charts (using recharts or chart.js)
- Data tables with sorting, filtering, pagination
- Modal forms for CRUD operations
- Image upload with preview
- Rich text editor for descriptions

**Security**:
- Protected routes (check role in middleware)
- Redirect non-admin users to home
- Verify admin role on every API call (backend)

**Components**:
```typescript
// Admin Layout
app/admin/
  ├── layout.tsx              (Admin layout with sidebar)
  ├── page.tsx                (Dashboard)
  ├── categories/
  │   └── page.tsx
  ├── products/
  │   ├── page.tsx
  │   ├── add/
  │   │   └── page.tsx
  │   └── [id]/
  │       └── edit/
  │           └── page.tsx
  ├── orders/
  │   ├── page.tsx
  │   └── [id]/
  │       └── page.tsx
  └── customers/
      ├── page.tsx
      └── [id]/
          └── page.tsx
```

## Data Flow Examples

### Example 1: Add to Cart Flow

```
1. User clicks "Add to Cart" on product detail page
2. Client calls cartStore.addItem(product, variant, quantity)
3. Store updates local state and localStorage
4. If user is logged in:
   - Store calls API: POST /api/cart/items
   - Backend validates and saves to database
   - Returns updated cart
   - Store syncs with backend response
5. Show success toast notification
6. Update cart badge count in header
```

### Example 2: Checkout Flow

```
1. User clicks "Checkout" from cart page
2. Navigate to /checkout
3. Load user's saved addresses
4. User selects address (or adds new)
5. User selects payment method (COD/VNPay/MoMo)
6. User reviews order and clicks "Place Order"
7. Frontend validates form
8. Call API: POST /api/orders
9. Backend:
   - Validates cart items and stock
   - Calculates total
   - Creates order with status "pending"
   - If COD: Return success
   - If online: Create payment URL
10. If COD: Redirect to success page
11. If online: Redirect to payment gateway
12. After payment: Gateway redirects to callback
13. Callback verifies signature and updates order
14. Show success/failure page
15. Clear cart
```

### Example 3: Admin Updates Order Status

```
1. Admin views order detail
2. Admin selects new status from dropdown
3. Client shows confirmation dialog
4. Admin confirms
5. Call API: PATCH /api/admin/orders/:id/status
6. Backend:
   - Validates admin role
   - Validates status transition
   - Updates order status
   - If status = "delivered": Update payment_status = "paid"
   - If status = "cancelled": Restore stock quantity
   - Returns updated order
7. Show success toast
8. Update UI with new status
9. Send email notification to customer (optional)
```

## Database Considerations

### Indexes

Add these indexes for optimal query performance:

```sql
-- Foreign key indexes
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Search and filter indexes
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Composite indexes for common queries
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_products_category_active ON products(category_id, is_active);
```

### Transactions

Use transactions for:
- Creating order (order + order_items + update stock)
- Cancelling order (update order + restore stock)
- Payment confirmation (update order + update payment)

Example:
```go
func (s *orderService) CreateOrder(userID uint, cartItems []CartItem) (*Order, error) {
    return s.db.Transaction(func(tx *gorm.DB) error {
        // Create order
        // Create order items
        // Update stock quantities
        // Clear cart
        return nil
    })
}
```

## Environment Variables

### Backend (.env)

```bash
# Server
PORT=8080
GIN_MODE=release

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=fashion_ecommerce

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_NAME=Fashion E-Commerce
SMTP_FROM_EMAIL=your_email@gmail.com

# Upload
MAX_UPLOAD_SIZE=10485760
UPLOAD_DIR=./uploads

# VNPay
VNPAY_TMN_CODE=your_tmn_code
VNPAY_HASH_SECRET=your_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:3000/payment/callback

# MoMo
MOMO_PARTNER_CODE=your_partner_code
MOMO_ACCESS_KEY=your_access_key
MOMO_SECRET_KEY=your_secret_key
MOMO_ENDPOINT=https://test-payment.momo.vn
MOMO_RETURN_URL=http://localhost:3000/payment/callback
MOMO_IPN_URL=http://localhost:8080/api/payment/momo/ipn

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Testing Strategy (Excluded)

**Note**: As per requirements, NO testing implementation is included in this project. The focus is purely on feature development.

## Deployment Considerations (Future)

While deployment is not in the current scope, these considerations should be noted:

1. **Database**: PostgreSQL on cloud (DigitalOcean, AWS RDS)
2. **Backend**: Deploy to cloud VM or container platform
3. **Frontend**: Deploy to Vercel or Netlify
4. **File Storage**: Consider migrating to cloud storage (S3, Cloudinary)
5. **Email**: Consider dedicated email service for production
6. **Environment**: Use production payment gateway credentials
7. **SSL**: Enable HTTPS for security
8. **Backups**: Regular database backups

## Open Questions & Future Enhancements

**Current Scope - No open questions**. All requirements are clear from thesis documentation.

**Future Enhancements** (not in scope):
- Real-time order notifications
- Advanced analytics and reporting
- Product recommendations
- Inventory management alerts
- Customer loyalty program
- Wishlist functionality
- Product comparison
- Multi-vendor support
