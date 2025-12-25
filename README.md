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
- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS
- **State Management**: Zustand / React Context
- **HTTP Client**: Axios / Fetch API
- **UI Components**: Radix UI / shadcn/ui

### Database
- **Database**: PostgreSQL 15+

## 📋 Yêu cầu hệ thống

- Go 1.21 trở lên
- Node.js 18+ và npm/yarn
- PostgreSQL 15 trở lên
- Git

## 🚀 Quick Start

### Prerequisites

- Go 1.21 or higher
- Node.js 18+ and npm/yarn
- PostgreSQL 15 or higher
- Git

### 1. Clone Repository

```bash
git clone <repository-url>
cd fashion-e-commerce
```

### 2. Database Setup

Create the PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE fashion_ecommerce;

# Exit
\q

# Run database schema
psql -U postgres -d fashion_ecommerce -f database/DATABASE_DESIGN.sql
```

### 3. Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env and configure your database credentials
# DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME

# Install dependencies (if Go is installed)
go mod download

# Run the server
go run cmd/server/main.go
```

Backend will start at: **http://localhost:8080**

Test health endpoint:
```bash
curl http://localhost:8080/health
```

See [backend/README.md](backend/README.md) for detailed setup instructions.

### 4. Frontend Setup

```bash
cd frontend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will start at: **http://localhost:3000**

See [frontend/README.md](frontend/README.md) for detailed setup instructions.

## 📁 Project Structure

```
fashion-e-commerce/
├── backend/              # Go backend server
│   ├── cmd/
│   │   └── server/      # Application entry point
│   ├── internal/
│   │   ├── config/      # Configuration management
│   │   ├── database/    # Database connection
│   │   ├── handlers/    # HTTP handlers
│   │   ├── middleware/  # Middleware (CORS, logging, auth)
│   │   ├── models/      # Data models
│   │   ├── repositories/# Data access layer
│   │   └── services/    # Business logic
│   └── .env.example     # Environment variables template
├── frontend/            # Next.js frontend application
│   ├── src/
│   │   ├── app/         # Next.js App Router pages
│   │   ├── components/  # React components
│   │   ├── lib/         # Utilities and configurations
│   │   ├── services/    # API services
│   │   └── types/       # TypeScript type definitions
│   └── .env.example     # Environment variables template
├── database/            # Database schemas and migrations
│   └── DATABASE_DESIGN.sql
├── docs/                # Documentation
└── openspec/            # OpenSpec change proposals
```

## 🔧 Development Workflow

### Running Full Stack

1. **Start PostgreSQL** (if not running)
2. **Terminal 1 - Backend:**
   ```bash
   cd backend
   go run cmd/server/main.go
   ```
3. **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
4. **Access Application:** http://localhost:3000

### Making Changes

- Backend code is in `backend/internal/`
- Frontend code is in `frontend/src/`
- Database schema is in `database/DATABASE_DESIGN.sql`
- Create feature branches from `main` for new features

## 📚 Documentation

- [Backend README](backend/README.md) - Backend setup and API documentation
- [Frontend README](frontend/README.md) - Frontend setup and development guide
- [Database Design](database/DATABASE_DESIGN.sql) - Database schema
- [Thesis Documentation](docs/THESIS_DOCUMENTATION.md) - Full project documentation
- [OpenSpec Guide](openspec/AGENTS.md) - Change proposal workflow

## 🎨 Features (Planned)

### Customer Features
- Browse products by category
- Search and filter products
- Product detail view
- Shopping cart management
- User authentication (register/login)
- Order placement and tracking
- Multiple payment methods (COD, VNPay, MoMo)
- User profile and address management
- Order history
- Product reviews and ratings

### Admin Features
- Product management (CRUD)
- Category management
- Order management and processing
- User management
- Sales analytics and reports
- Inventory management

## 🔐 Environment Variables

### Backend (.env)
```env
SERVER_PORT=8080
GIN_MODE=debug
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=fashion_ecommerce
DB_SSLMODE=disable
APP_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_UPLOAD_URL=http://localhost:8080/uploads
```

## 🐛 Troubleshooting

### Backend Issues

- **Database connection failed**: Verify PostgreSQL is running and credentials are correct
- **Port already in use**: Change `SERVER_PORT` in `.env` or kill the process using port 8080
- See [backend/README.md](backend/README.md) for more troubleshooting

### Frontend Issues

- **CORS errors**: Ensure backend is running and CORS is properly configured
- **Module not found**: Run `npm install` to install dependencies
- See [frontend/README.md](frontend/README.md) for more troubleshooting

## 📝 API Endpoints

### Current Endpoints

- `GET /health` - Health check endpoint
- `GET /api/v1/health` - API health check

### Planned Endpoints

- `/api/v1/auth/*` - Authentication
- `/api/v1/products/*` - Product management
- `/api/v1/cart/*` - Shopping cart
- `/api/v1/orders/*` - Order management
- `/api/v1/users/*` - User management
- `/api/v1/admin/*` - Admin operations
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

**Frontend:** Tạo file `frontend/.env.local`:

```env
# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Upload URL
NEXT_PUBLIC_UPLOAD_URL=http://localhost:8080/uploads
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
