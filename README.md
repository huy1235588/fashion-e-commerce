# Fashion E-Commerce - Đồ án tốt nghiệp

Website thương mại điện tử bán hàng thời trang được xây dựng bằng Golang và PostgreSQL.

## 🎯 Mục tiêu dự án

Xây dựng một hệ thống website bán hàng thời trang hoàn chỉnh với các tính năng cốt lõi, phục vụ cho đồ án tốt nghiệp.

## 🛠️ Công nghệ sử dụng

### Backend
- **Language**: Golang 1.21+
- **Framework**: Gin Framework
- **ORM**: GORM
- **Authentication**: JWT (JSON Web Token)
- **Payment**: VNPay / MoMo
- **Email**: SMTP (Gmail)

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **Routing**: React Router v6
- **HTTP Client**: Axios

### Database
- **Database**: PostgreSQL 15+

## 📋 Yêu cầu hệ thống

- Go 1.21 trở lên
- Node.js 18+ và npm/yarn
- PostgreSQL 15 trở lên
- Git

## 🚀 Cài đặt và chạy project

### 1. Clone repository

```bash
git clone <repository-url>
cd fashion-e-commerce
```

### 2. Cài đặt dependencies

**Backend:**
```bash
cd backend
go mod download
```

**Frontend:**
```bash
cd frontend
npm install
# hoặc
yarn install
```

### 3. Cấu hình database

Tạo database PostgreSQL:

```sql
CREATE DATABASE fashion_ecommerce;
```

### 4. Cấu hình môi trường

**Backend:** Tạo file `backend/.env`:

```env
# Server
PORT=8080
ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=fashion_ecommerce

# JWT
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRE_HOURS=24

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Upload
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE=10485760

# VNPay
VNPAY_TMN_CODE=your-tmn-code
VNPAY_HASH_SECRET=your-hash-secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:8080/api/payments/vnpay/return

# MoMo
MOMO_PARTNER_CODE=your-partner-code
MOMO_ACCESS_KEY=your-access-key
MOMO_SECRET_KEY=your-secret-key
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
MOMO_RETURN_URL=http://localhost:8080/api/payments/momo/return
```

**Frontend:** Tạo file `frontend/.env`:

```env
# API Base URL
VITE_API_URL=http://localhost:8080/api

# Upload URL
VITE_UPLOAD_URL=http://localhost:8080/uploads
```

### 5. Chạy migration

```bash
# Import database schema từ thư mục root
psql -U postgres -d fashion_ecommerce -f DATABASE_DESIGN.sql
```

### 6. Chạy ứng dụng

**Backend (Terminal 1):**
```bash
cd backend

# Development mode
go run cmd/server/main.go

# Or build and run
go build -o bin/server cmd/server/main.go
./bin/server
```

Backend API: `http://localhost:8080`

**Frontend (Terminal 2):**
```bash
cd frontend

# Development mode
npm run dev
# hoặc
yarn dev
```

Frontend: `http://localhost:5173`

## 📁 Cấu trúc dự án

```
fashion-e-commerce/
├── backend/                        # Backend Golang
│   ├── cmd/server/
│   │   └── main.go                # Entry point
│   ├── internal/
│   │   ├── config/                # Cấu hình
│   │   ├── database/              # Database connection
│   │   ├── models/                # Database models
│   │   ├── repositories/          # Data access layer
│   │   ├── services/              # Business logic
│   │   ├── handlers/              # HTTP handlers
│   │   ├── middleware/            # Middleware
│   │   └── utils/                 # Utilities
│   ├── migrations/                # Database migrations
│   ├── uploads/                   # Uploaded files
│   ├── .env
│   ├── go.mod
│   └── go.sum
├── frontend/                       # Frontend React
│   ├── src/
│   │   ├── api/                   # API calls
│   │   ├── components/            # Components
│   │   ├── pages/                 # Pages
│   │   ├── context/               # Context
│   │   ├── hooks/                 # Custom hooks
│   │   ├── utils/                 # Utilities
│   │   └── routes/                # Routes
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── DATABASE_DESIGN.sql            # Database schema
├── THESIS_DOCUMENTATION.md        # Tài liệu đồ án
├── .gitignore
└── README.md
```

## 📝 API Documentation

### Authentication

- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `POST /api/auth/reset-password` - Đặt lại mật khẩu

### User Management

- `GET /api/users/profile` - Xem thông tin cá nhân
- `PUT /api/users/profile` - Cập nhật thông tin
- `GET /api/users/addresses` - Danh sách địa chỉ
- `POST /api/users/addresses` - Thêm địa chỉ mới
- `PUT /api/users/addresses/:id` - Sửa địa chỉ
- `DELETE /api/users/addresses/:id` - Xóa địa chỉ

### Products

- `GET /api/products` - Danh sách sản phẩm (có filter, search, pagination)
- `GET /api/products/:id` - Chi tiết sản phẩm
- `GET /api/categories` - Danh sách danh mục

### Cart

- `GET /api/cart` - Xem giỏ hàng
- `POST /api/cart/items` - Thêm vào giỏ
- `PUT /api/cart/items/:id` - Cập nhật số lượng
- `DELETE /api/cart/items/:id` - Xóa khỏi giỏ

### Orders

- `GET /api/orders` - Danh sách đơn hàng
- `GET /api/orders/:id` - Chi tiết đơn hàng
- `POST /api/orders` - Tạo đơn hàng
- `PUT /api/orders/:id/cancel` - Hủy đơn hàng

### Admin (Yêu cầu quyền admin)

- `POST /api/admin/categories` - Quản lý danh mục
- `POST /api/admin/products` - Quản lý sản phẩm
- `GET /api/admin/orders` - Quản lý đơn hàng
- `PUT /api/admin/orders/:id/status` - Cập nhật trạng thái đơn
- `GET /api/admin/stats/*` - Thống kê báo cáo

Chi tiết API xem tại: [THESIS_DOCUMENTATION.md](THESIS_DOCUMENTATION.md)

## 🧪 Testing

**Backend:**
```bash
cd backend

# Run all tests
go test ./...

# Run tests with coverage
go test -cover ./...

# Run specific package tests
go test ./internal/services/...
```

**Frontend:**
```bash
cd frontend

# Run tests (if configured)
npm test

# Run with coverage
npm run test:coverage
```

## 📦 Build Production

**Backend:**
```bash
cd backend

# Build binary
go build -o bin/server cmd/server/main.go

# Run production
./bin/server
```

**Frontend:**
```bash
cd frontend

# Build for production
npm run build
# hoặc
yarn build

# Preview production build
npm run preview
```

Files build sẽ được tạo trong `frontend/dist/`

## 🔐 Default Accounts

**Admin Account:**
- Email: `admin@fashion.com`
- Password: `admin123`

## 📚 Tài liệu tham khảo

- [Gin Framework Documentation](https://gin-gonic.com/docs/)
- [GORM Documentation](https://gorm.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Introduction](https://jwt.io/introduction)

## 👥 Tác giả

[Tên sinh viên]  
MSSV: [Mã số sinh viên]  
Trường: [Tên trường]  
Năm: 2025

## 📄 License

Dự án được phát triển cho mục đích học tập - Đồ án tốt nghiệp.

## 📞 Liên hệ

- Email: [your-email@example.com]
- GitHub: [your-github-profile]
