# TÀI LIỆU ĐỒ ÁN TỐT NGHIỆP
## WEBSITE BÁN HÀNG THỜI TRANG

---

## THÔNG TIN DỰ ÁN

### 1. Tên dự án
Website Thương mại điện tử Thời trang

### 2. Công nghệ sử dụng
- **Backend**: Golang (Gin Framework)
- **Frontend**: Next.js 16.1.1 (App Router) + TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Payment**: VNPay/MoMo
- **Styling**: Tailwind CSS
- **State Management**: Zustand / React Context API
- **UI Components**: Radix UI / shadcn/ui

### 3. Mô tả tổng quan
Xây dựng hệ thống website thương mại điện tử chuyên bán các sản phẩm thời trang, hỗ trợ người dùng mua sắm trực tuyến với đầy đủ các tính năng cốt lõi.

---

## PHÂN TÍCH YÊU CẦU HỆ THỐNG

### 1. Chức năng cho Khách hàng (Customer)

#### 1.1. Quản lý tài khoản
- ✅ Đăng ký tài khoản (email, password)
- ✅ Đăng nhập/Đăng xuất
- ✅ Quên mật khẩu (gửi OTP qua email)
- ✅ Xem và cập nhật thông tin cá nhân
- ✅ Quản lý địa chỉ giao hàng

#### 1.2. Quản lý sản phẩm
- ✅ Xem danh sách sản phẩm (có phân trang)
- ✅ Tìm kiếm sản phẩm (theo tên, danh mục)
- ✅ Lọc sản phẩm (theo giá, size, màu sắc, danh mục)
- ✅ Xem chi tiết sản phẩm
- ✅ Xem hình ảnh sản phẩm

#### 1.3. Giỏ hàng
- ✅ Thêm sản phẩm vào giỏ hàng
- ✅ Xem giỏ hàng
- ✅ Cập nhật số lượng sản phẩm
- ✅ Xóa sản phẩm khỏi giỏ hàng
- ✅ Tính tổng tiền tự động

#### 1.4. Đặt hàng
- ✅ Tạo đơn hàng từ giỏ hàng
- ✅ Chọn địa chỉ giao hàng
- ✅ Chọn phương thức thanh toán
- ✅ Xác nhận đơn hàng
- ✅ Xem lịch sử đơn hàng
- ✅ Xem chi tiết đơn hàng
- ✅ Hủy đơn hàng (khi còn ở trạng thái pending)

#### 1.5. Thanh toán
- ✅ Thanh toán khi nhận hàng (COD)
- ✅ Thanh toán online (VNPay/MoMo)
- ✅ Xác nhận thanh toán

#### 1.6. Đánh giá sản phẩm
- ✅ Đánh giá và bình luận sản phẩm đã mua
- ✅ Xem đánh giá của người khác

### 2. Chức năng cho Quản trị viên (Admin)

#### 2.1. Quản lý danh mục
- ✅ Thêm, sửa, xóa danh mục
- ✅ Xem danh sách danh mục

#### 2.2. Quản lý sản phẩm
- ✅ Thêm sản phẩm mới
- ✅ Cập nhật thông tin sản phẩm
- ✅ Xóa sản phẩm
- ✅ Upload hình ảnh sản phẩm
- ✅ Quản lý tồn kho (số lượng theo size/màu)

#### 2.3. Quản lý đơn hàng
- ✅ Xem danh sách đơn hàng
- ✅ Xem chi tiết đơn hàng
- ✅ Cập nhật trạng thái đơn hàng (pending → processing → shipping → delivered → cancelled)
- ✅ Thống kê đơn hàng theo trạng thái

#### 2.4. Quản lý khách hàng
- ✅ Xem danh sách khách hàng
- ✅ Xem thông tin chi tiết khách hàng
- ✅ Khóa/Mở khóa tài khoản

#### 2.5. Báo cáo thống kê
- ✅ Thống kê doanh thu theo ngày/tháng/năm
- ✅ Thống kê sản phẩm bán chạy
- ✅ Thống kê số lượng đơn hàng
- ✅ Thống kê số lượng khách hàng mới

---

## CƠ SỞ DỮ LIỆU

### 1. Sơ đồ ERD

#### Các bảng chính:

**users** (Người dùng)
- id (PK)
- email (unique)
- password (hash)
- full_name
- phone
- role (customer/admin)
- is_active
- created_at
- updated_at

**addresses** (Địa chỉ)
- id (PK)
- user_id (FK → users)
- full_name
- phone
- province
- district
- ward
- detail_address
- is_default
- created_at

**categories** (Danh mục)
- id (PK)
- name
- description
- slug
- created_at
- updated_at

**products** (Sản phẩm)
- id (PK)
- category_id (FK → categories)
- name
- description
- price
- discount_price
- slug
- is_active
- created_at
- updated_at

**product_images** (Hình ảnh sản phẩm)
- id (PK)
- product_id (FK → products)
- image_url
- is_primary
- created_at

**product_variants** (Biến thể sản phẩm - size, màu)
- id (PK)
- product_id (FK → products)
- size
- color
- stock_quantity
- sku
- created_at
- updated_at

**carts** (Giỏ hàng)
- id (PK)
- user_id (FK → users)
- created_at
- updated_at

**cart_items** (Chi tiết giỏ hàng)
- id (PK)
- cart_id (FK → carts)
- product_id (FK → products)
- variant_id (FK → product_variants)
- quantity
- price
- created_at
- updated_at

**orders** (Đơn hàng)
- id (PK)
- user_id (FK → users)
- order_code (unique)
- total_amount
- shipping_fee
- discount_amount
- final_amount
- payment_method (cod/online)
- payment_status (pending/paid/failed)
- status (pending/processing/shipping/delivered/cancelled)
- note
- created_at
- updated_at

**order_items** (Chi tiết đơn hàng)
- id (PK)
- order_id (FK → orders)
- product_id (FK → products)
- variant_id (FK → product_variants)
- product_name
- variant_info
- quantity
- price
- subtotal
- created_at

**shipping_addresses** (Địa chỉ giao hàng đơn hàng)
- id (PK)
- order_id (FK → orders)
- full_name
- phone
- province
- district
- ward
- detail_address
- created_at

**reviews** (Đánh giá)
- id (PK)
- product_id (FK → products)
- user_id (FK → users)
- order_id (FK → orders)
- rating (1-5)
- comment
- created_at
- updated_at

**payments** (Thanh toán)
- id (PK)
- order_id (FK → orders)
- transaction_id
- payment_method
- amount
- status (pending/success/failed)
- payment_date
- created_at

---

## KIẾN TRÚC HỆ THỐNG

### 1. Cấu trúc thư mục Monorepo (Frontend + Backend)

```
fashion-e-commerce/
├── backend/                       # Backend Golang
│   ├── cmd/
│   │   └── server/
│   │       └── main.go           # Entry point
│   ├── internal/
│   │   ├── config/
│   │   │   └── config.go         # Cấu hình hệ thống
│   │   ├── database/
│   │   │   └── database.go       # Kết nối database
│   │   ├── models/
│   │   │   ├── user.go
│   │   │   ├── product.go
│   │   │   ├── category.go
│   │   │   ├── cart.go
│   │   │   ├── order.go
│   │   │   ├── review.go
│   │   │   └── payment.go
│   │   ├── repositories/
│   │   │   ├── user_repository.go
│   │   │   ├── product_repository.go
│   │   │   ├── category_repository.go
│   │   │   ├── cart_repository.go
│   │   │   ├── order_repository.go
│   │   │   └── review_repository.go
│   │   ├── services/
│   │   │   ├── auth_service.go
│   │   │   ├── user_service.go
│   │   │   ├── product_service.go
│   │   │   ├── category_service.go
│   │   │   ├── cart_service.go
│   │   │   ├── order_service.go
│   │   │   ├── payment_service.go
│   │   │   └── review_service.go
│   │   ├── handlers/
│   │   │   ├── auth_handler.go
│   │   │   ├── user_handler.go
│   │   │   ├── product_handler.go
│   │   │   ├── category_handler.go
│   │   │   ├── cart_handler.go
│   │   │   ├── order_handler.go
│   │   │   ├── payment_handler.go
│   │   │   └── review_handler.go
│   │   ├── middleware/
│   │   │   ├── auth.go           # JWT authentication
│   │   │   ├── cors.go
│   │   │   └── logger.go
│   │   └── utils/
│   │       ├── jwt.go
│   │       ├── hash.go
│   │       ├── email.go
│   │       ├── upload.go
│   │       └── validator.go
│   ├── migrations/
│   │   └── *.sql                 # Migration files
│   ├── uploads/                  # Thư mục lưu ảnh
│   ├── go.mod
│   └── go.sum
│
├── frontend/                      # Frontend React
│   ├── public/
│   │   └── assets/
│   ├── src/
│   │   ├── api/                  # API calls
│   │   │   ├── axios.js
│   │   │   ├── authApi.js
│   │   │   ├── productApi.js
│   │   │   ├── cartApi.js
│   │   │   └── orderApi.js
│   │   ├── components/           # Reusable components
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Loading.jsx
│   │   │   ├── product/
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductList.jsx
│   │   │   │   └── ProductFilter.jsx
│   │   │   └── cart/
│   │   │       ├── CartItem.jsx
│   │   │       └── CartSummary.jsx
│   │   ├── pages/                # Pages
│   │   │   ├── Home.jsx
│   │   │   ├── ProductList.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderHistory.jsx
│   │   │   ├── OrderDetail.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Products.jsx
│   │   │       ├── Orders.jsx
│   │   │       └── Customers.jsx
│   │   ├── context/              # Context API
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── hooks/                # Custom hooks
│   │   │   ├── useAuth.js
│   │   │   └── useCart.js
│   │   ├── utils/                # Utilities
│   │   │   ├── formatCurrency.js
│   │   │   └── formatDate.js
│   │   ├── routes/               # Routes
│   │   │   └── AppRoutes.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── .env                          # Root environment
├── .gitignore                    # Root gitignore
├── README.md
├── THESIS_DOCUMENTATION.md
└── DATABASE_DESIGN.sql
```

### 2. API Endpoints

#### Authentication
```
POST   /api/auth/register          # Đăng ký
POST   /api/auth/login             # Đăng nhập
POST   /api/auth/forgot-password   # Quên mật khẩu
POST   /api/auth/reset-password    # Đặt lại mật khẩu
```

#### User
```
GET    /api/users/profile          # Xem profile (Auth)
PUT    /api/users/profile          # Cập nhật profile (Auth)
GET    /api/users/addresses        # Danh sách địa chỉ (Auth)
POST   /api/users/addresses        # Thêm địa chỉ (Auth)
PUT    /api/users/addresses/:id    # Sửa địa chỉ (Auth)
DELETE /api/users/addresses/:id    # Xóa địa chỉ (Auth)
```

#### Categories
```
GET    /api/categories             # Danh sách danh mục
GET    /api/categories/:id         # Chi tiết danh mục
POST   /api/admin/categories       # Thêm danh mục (Admin)
PUT    /api/admin/categories/:id   # Sửa danh mục (Admin)
DELETE /api/admin/categories/:id   # Xóa danh mục (Admin)
```

#### Products
```
GET    /api/products               # Danh sách sản phẩm (filter, search, pagination)
GET    /api/products/:id           # Chi tiết sản phẩm
POST   /api/admin/products         # Thêm sản phẩm (Admin)
PUT    /api/admin/products/:id     # Sửa sản phẩm (Admin)
DELETE /api/admin/products/:id     # Xóa sản phẩm (Admin)
POST   /api/admin/products/:id/images  # Upload ảnh (Admin)
```

#### Cart
```
GET    /api/cart                   # Xem giỏ hàng (Auth)
POST   /api/cart/items             # Thêm vào giỏ (Auth)
PUT    /api/cart/items/:id         # Cập nhật số lượng (Auth)
DELETE /api/cart/items/:id         # Xóa khỏi giỏ (Auth)
DELETE /api/cart/clear             # Xóa toàn bộ giỏ (Auth)
```

#### Orders
```
GET    /api/orders                 # Danh sách đơn hàng (Auth)
GET    /api/orders/:id             # Chi tiết đơn hàng (Auth)
POST   /api/orders                 # Tạo đơn hàng (Auth)
PUT    /api/orders/:id/cancel      # Hủy đơn hàng (Auth)
GET    /api/admin/orders           # Danh sách đơn (Admin)
PUT    /api/admin/orders/:id/status # Cập nhật trạng thái (Admin)
```

#### Payments
```
POST   /api/payments/vnpay/create  # Tạo thanh toán VNPay (Auth)
GET    /api/payments/vnpay/return  # Return URL VNPay
POST   /api/payments/momo/create   # Tạo thanh toán MoMo (Auth)
GET    /api/payments/momo/return   # Return URL MoMo
```

#### Reviews
```
GET    /api/products/:id/reviews   # Danh sách đánh giá
POST   /api/reviews                # Thêm đánh giá (Auth)
PUT    /api/reviews/:id            # Sửa đánh giá (Auth)
DELETE /api/reviews/:id            # Xóa đánh giá (Auth)
```

#### Admin Statistics
```
GET    /api/admin/stats/dashboard  # Thống kê tổng quan (Admin)
GET    /api/admin/stats/revenue    # Thống kê doanh thu (Admin)
GET    /api/admin/stats/products   # Thống kê sản phẩm (Admin)
GET    /api/admin/stats/customers  # Thống kê khách hàng (Admin)
```

---

## LUỒNG NGHIỆP VỤ CHÍNH

### 1. Luồng đăng ký/đăng nhập
```
1. User nhập email, password
2. Hệ thống validate dữ liệu
3. Hash password (bcrypt)
4. Lưu vào database
5. Gửi email xác nhận (optional)
6. Đăng nhập → sinh JWT token
7. Trả token về client
8. Client lưu token (localStorage/cookie)
```

### 2. Luồng mua hàng
```
1. Khách hàng xem sản phẩm
2. Chọn size, màu sắc
3. Thêm vào giỏ hàng
   - Kiểm tra tồn kho
   - Thêm/Cập nhật cart_items
4. Xem giỏ hàng, điều chỉnh số lượng
5. Tiến hành đặt hàng
   - Chọn địa chỉ giao hàng
   - Chọn phương thức thanh toán
6. Xác nhận đơn hàng
   - Tạo order
   - Tạo order_items
   - Giảm số lượng tồn kho
   - Xóa giỏ hàng
7. Thanh toán
   - COD: Chờ xác nhận
   - Online: Redirect sang cổng thanh toán
8. Nhận thông báo đơn hàng
```

### 3. Luồng xử lý đơn hàng (Admin)
```
1. Admin xem danh sách đơn hàng mới
2. Xác nhận đơn hàng (pending → processing)
3. Chuẩn bị hàng
4. Chuyển sang đang giao (processing → shipping)
5. Hoàn thành (shipping → delivered)
6. Hoặc hủy (→ cancelled) và hoàn lại tồn kho
```

### 4. Luồng thanh toán online
```
1. User chọn thanh toán online
2. Tạo order với payment_status = pending
3. Gọi API VNPay/MoMo tạo payment URL
4. Redirect user sang trang thanh toán
5. User thanh toán
6. Cổng thanh toán gọi return URL
7. Verify signature
8. Cập nhật payment_status
9. Thông báo kết quả cho user
```

---

## YÊU CẦU KỸ THUẬT

### 1. Bảo mật
- ✅ Mã hóa mật khẩu bằng bcrypt
- ✅ Xác thực JWT cho các API cần đăng nhập
- ✅ Phân quyền Admin/Customer
- ✅ Validate input để chống SQL Injection, XSS
- ✅ HTTPS cho production
- ✅ Rate limiting cho API

### 2. Hiệu năng
- ✅ Phân trang cho danh sách sản phẩm, đơn hàng
- ✅ Index database cho các trường tìm kiếm
- ✅ Tối ưu query (eager loading, N+1 query)
- ✅ Nén ảnh khi upload
- ✅ Cache cho dữ liệu ít thay đổi (optional)

### 3. Xử lý lỗi
- ✅ Response format thống nhất
- ✅ HTTP status code chuẩn
- ✅ Log lỗi hệ thống
- ✅ Error message rõ ràng

### 4. Testing
- ✅ Unit test cho services
- ✅ Integration test cho APIs
- ✅ Test cases cho luồng nghiệp vụ chính

---

## KẾ HOẠCH THỰC HIỆN

### Giai đoạn 1: Chuẩn bị (1 tuần)
- [ ] Thiết lập môi trường phát triển
- [ ] Khởi tạo project Golang
- [ ] Thiết lập PostgreSQL
- [ ] Thiết kế database chi tiết
- [ ] Tạo migration files

### Giai đoạn 2: Backend Core (2 tuần)
- [ ] Xây dựng models
- [ ] Implement repositories
- [ ] Xây dựng authentication (JWT)
- [ ] API User management
- [ ] API Category management
- [ ] API Product management

### Giai đoạn 3: Tính năng mua hàng (2 tuần)
- [ ] API Cart management
- [ ] API Order management
- [ ] Upload và quản lý hình ảnh
- [ ] Tích hợp thanh toán VNPay/MoMo
- [ ] API Review

### Giai đoạn 4: Admin & Báo cáo (1 tuần)
- [ ] Admin dashboard APIs
- [ ] Quản lý đơn hàng (Admin)
- [ ] Thống kê báo cáo
- [ ] Quản lý khách hàng

### Giai đoạn 5: Frontend Next.js + TypeScript (2-3 tuần)
- [ ] Setup Next.js 16.1.1 với App Router + TypeScript
- [ ] Setup Tailwind CSS, shadcn/ui, Zustand
- [ ] TypeScript types cho tất cả models
- [ ] Components chung (Header, Footer, Loading)
- [ ] Authentication UI (Login, Register) với route groups
- [ ] Trang chủ với banner và sản phẩm nổi bật (SSR/SSG)
- [ ] Danh sách sản phẩm (filter, search, pagination)
- [ ] Chi tiết sản phẩm (ảnh, đánh giá, chọn variant)
- [ ] Giỏ hàng và Checkout với state management
- [ ] Quản lý đơn hàng, profile
- [ ] Admin panel (Dashboard, Products, Orders)
- [ ] API Routes cho server-side logic (nếu cần)

### Giai đoạn 6: Testing & Triển khai (1 tuần)
- [ ] Viết unit tests
- [ ] Testing tích hợp
- [ ] Fix bugs
- [ ] Deploy lên server
- [ ] Tài liệu API (Swagger)

---

## CÔNG CỤ HỖ TRỢ

### Development
- **IDE**: VS Code / GoLand
- **Database Tool**: DBeaver / pgAdmin
- **API Testing**: Postman / Thunder Client
- **Version Control**: Git / GitHub

### Libraries Golang
```go
// go.mod
require (
    github.com/gin-gonic/gin              // Web framework
    github.com/golang-jwt/jwt/v5          // JWT
    golang.org/x/crypto                   // Bcrypt
    gorm.io/gorm                          // ORM
    gorm.io/driver/postgres               // PostgreSQL driver
    github.com/joho/godotenv              // .env loader
    github.com/go-playground/validator/v10 // Validation
    gopkg.in/gomail.v2                    // Email sender
)
```

---

## TIÊU CHÍ ĐÁNH GIÁ ĐỒ ÁN

### 1. Chức năng (40%)
- Đầy đủ các tính năng cốt lõi
- Luồng nghiệp vụ chính xác
- Xử lý các trường hợp lỗi

### 2. Kỹ thuật (30%)
- Cấu trúc code rõ ràng
- Tuân thủ design pattern
- Database được thiết kế tốt
- Bảo mật cơ bản

### 3. Giao diện (15%)
- UI/UX thân thiện
- Responsive design
- Dễ sử dụng

### 4. Tài liệu (15%)
- Tài liệu đầy đủ
- API documentation
- Hướng dẫn cài đặt
- Demo video

---

## GHI CHÚ

### Các tính năng KHÔNG cần thiết (loại bỏ)
- ❌ Dark mode
- ❌ Multi-language (i18n)
- ❌ Social login
- ❌ Chat/Chatbot
- ❌ Wishlist
- ❌ Compare products
- ❌ Flash sale/Voucher phức tạp
- ❌ Loyalty points
- ❌ Multi-vendor
- ❌ Real-time notifications

### Tập trung vào
- ✅ Các tính năng CRUD cơ bản
- ✅ Authentication & Authorization
- ✅ Luồng mua hàng hoàn chỉnh
- ✅ Thanh toán cơ bản
- ✅ Quản trị đơn giản
- ✅ Báo cáo thống kê cơ bản

---

## TÀI LIỆU THAM KHẢO

### Golang
- [Gin Framework](https://gin-gonic.com/)
- [GORM Documentation](https://gorm.io/)
- [JWT in Go](https://jwt.io/)

### Database
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/)

### Payment
- [VNPay Documentation](https://sandbox.vnpayment.vn/apis/)
- [MoMo Documentation](https://developers.momo.vn/)

---

**Lưu ý**: Tài liệu này là hướng dẫn tổng quan. Chi tiết implementation sẽ được thực hiện dần trong quá trình phát triển.
