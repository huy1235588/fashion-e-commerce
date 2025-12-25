# HƯỚNG DẪN SETUP DỰ ÁN CHI TIẾT

Tài liệu này hướng dẫn chi tiết cách setup dự án Fashion E-Commerce từ đầu.

---

## 📋 CHUẨN BỊ

### 1. Cài đặt các công cụ cần thiết

#### Windows:

**Golang:**
```powershell
# Download từ: https://go.dev/dl/
# Hoặc dùng chocolatey:
choco install golang

# Kiểm tra
go version
```

**Node.js:**
```powershell
# Download từ: https://nodejs.org/
# Hoặc dùng chocolatey:
choco install nodejs

# Kiểm tra
node --version
npm --version
```

**PostgreSQL:**
```powershell
# Download từ: https://www.postgresql.org/download/windows/
# Hoặc dùng chocolatey:
choco install postgresql

# Kiểm tra
psql --version
```

**Git:**
```powershell
# Download từ: https://git-scm.com/download/win
# Hoặc dùng chocolatey:
choco install git

# Kiểm tra
git --version
```

---

## 🚀 SETUP DỰ ÁN

### BƯỚC 1: Clone hoặc tạo mới project

```powershell
# Nếu đã có repository
git clone <your-repo-url>
cd fashion-e-commerce

# Nếu tạo mới
mkdir fashion-e-commerce
cd fashion-e-commerce
git init
```

### BƯỚC 2: Setup Backend (Golang)

#### 2.1. Tạo cấu trúc thư mục

```powershell
# Tạo thư mục backend
mkdir backend
cd backend

# Khởi tạo Go module
go mod init github.com/yourusername/fashion-e-commerce

# Tạo các thư mục
mkdir -p cmd/server
mkdir -p internal/config
mkdir -p internal/database
mkdir -p internal/models
mkdir -p internal/repositories
mkdir -p internal/services
mkdir -p internal/handlers
mkdir -p internal/middleware
mkdir -p internal/utils
mkdir -p migrations
mkdir uploads
```

#### 2.2. Cài đặt dependencies

```powershell
# Web framework
go get -u github.com/gin-gonic/gin

# ORM
go get -u gorm.io/gorm
go get -u gorm.io/driver/postgres

# JWT
go get -u github.com/golang-jwt/jwt/v5

# Password hashing
go get -u golang.org/x/crypto/bcrypt

# Environment variables
go get -u github.com/joho/godotenv

# Validation
go get -u github.com/go-playground/validator/v10

# Email
go get -u gopkg.in/gomail.v2

# CORS
go get -u github.com/gin-contrib/cors
```

#### 2.3. Tạo file .env

Tạo file `backend/.env`:

```env
# Server
PORT=8080
ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=fashion_ecommerce

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE_HOURS=24

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Upload
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE=10485760
```

### BƯỚC 3: Setup Database

#### 3.1. Tạo database

```powershell
# Mở PostgreSQL command line
psql -U postgres

# Trong psql:
CREATE DATABASE fashion_ecommerce;
\c fashion_ecommerce
\q
```

#### 3.2. Import schema

```powershell
# Từ thư mục root của project
psql -U postgres -d fashion_ecommerce -f DATABASE_DESIGN.sql
```

### BƯỚC 4: Setup Frontend (React)

#### 4.1. Tạo React app với Vite

```powershell
# Quay về thư mục root
cd ..

# Tạo React app
npm create vite@latest frontend -- --template react
cd frontend
```

#### 4.2. Cài đặt dependencies

```powershell
# Core dependencies
npm install react-router-dom axios

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Form handling
npm install react-hook-form

# Toast notifications
npm install react-hot-toast

# Icons (optional)
npm install react-icons
```

#### 4.3. Cấu hình Tailwind CSS

Sửa file `frontend/tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Sửa file `frontend/src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### 4.4. Tạo file .env

Tạo file `frontend/.env`:

```env
VITE_API_URL=http://localhost:8080/api
VITE_UPLOAD_URL=http://localhost:8080/uploads
```

#### 4.5. Tạo cấu trúc thư mục

```powershell
# Trong thư mục frontend/src
mkdir api components pages context hooks utils routes
mkdir components/common components/product components/cart
mkdir pages/admin
```

---

## 🔧 CẤU HÌNH CHI TIẾT

### Backend Config (backend/internal/config/config.go)

```go
package config

import (
    "os"
    "github.com/joho/godotenv"
)

type Config struct {
    Port        string
    Environment string
    Database    DatabaseConfig
    JWT         JWTConfig
    SMTP        SMTPConfig
    Upload      UploadConfig
}

type DatabaseConfig struct {
    Host     string
    Port     string
    User     string
    Password string
    DBName   string
}

type JWTConfig struct {
    Secret      string
    ExpireHours int
}

type SMTPConfig struct {
    Host     string
    Port     string
    User     string
    Password string
}

type UploadConfig struct {
    Dir     string
    MaxSize int64
}

func Load() (*Config, error) {
    if err := godotenv.Load(); err != nil {
        return nil, err
    }

    return &Config{
        Port:        getEnv("PORT", "8080"),
        Environment: getEnv("ENV", "development"),
        Database: DatabaseConfig{
            Host:     getEnv("DB_HOST", "localhost"),
            Port:     getEnv("DB_PORT", "5432"),
            User:     getEnv("DB_USER", "postgres"),
            Password: getEnv("DB_PASSWORD", ""),
            DBName:   getEnv("DB_NAME", "fashion_ecommerce"),
        },
        JWT: JWTConfig{
            Secret:      getEnv("JWT_SECRET", "secret"),
            ExpireHours: 24,
        },
        SMTP: SMTPConfig{
            Host:     getEnv("SMTP_HOST", "smtp.gmail.com"),
            Port:     getEnv("SMTP_PORT", "587"),
            User:     getEnv("SMTP_USER", ""),
            Password: getEnv("SMTP_PASSWORD", ""),
        },
        Upload: UploadConfig{
            Dir:     getEnv("UPLOAD_DIR", "./uploads"),
            MaxSize: 10485760, // 10MB
        },
    }, nil
}

func getEnv(key, defaultValue string) string {
    if value := os.Getenv(key); value != "" {
        return value
    }
    return defaultValue
}
```

### Frontend Axios Config (frontend/src/api/axios.js)

```javascript
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

---

## ▶️ CHẠY DỰ ÁN

### Chạy Backend

```powershell
# Terminal 1 - Backend
cd backend
go run cmd/server/main.go
```

Backend chạy tại: http://localhost:8080

### Chạy Frontend

```powershell
# Terminal 2 - Frontend
cd frontend
npm run dev
```

Frontend chạy tại: http://localhost:5173

---

## ✅ KIỂM TRA

### Test Backend API

```powershell
# Test health check
curl http://localhost:8080/health

# Test register
curl -X POST http://localhost:8080/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\",\"password\":\"password123\",\"full_name\":\"Test User\"}'
```

### Test Frontend

Mở browser: http://localhost:5173

---

## 🐛 TROUBLESHOOTING

### Lỗi thường gặp:

**1. Cannot connect to PostgreSQL:**
- Kiểm tra PostgreSQL service đang chạy
- Kiểm tra username/password trong .env
- Kiểm tra port 5432 không bị chiếm

**2. Go module errors:**
```powershell
go mod tidy
go mod download
```

**3. Frontend build errors:**
```powershell
rm -rf node_modules package-lock.json
npm install
```

**4. CORS errors:**
- Kiểm tra CORS middleware trong backend
- Kiểm tra API URL trong frontend .env

---

## 📚 TÀI LIỆU THAM KHẢO

- [Gin Documentation](https://gin-gonic.com/docs/)
- [GORM Documentation](https://gorm.io/docs/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra logs trong terminal
2. Kiểm tra lại các file .env
3. Đảm bảo tất cả dependencies đã được cài đặt
4. Kiểm tra database đã được tạo và import schema

Chúc bạn setup thành công! 🎉
