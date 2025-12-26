# Data Seeding

Script này tạo dữ liệu mẫu cho hệ thống e-commerce.

## Dữ liệu được tạo

### 1. Users (3 người dùng)
- **Admin**: admin@example.com / 123456
- **User 1**: user1@example.com / 123456
- **User 2**: user2@example.com / 123456

### 2. Categories (5 danh mục)
- Áo nam
- Quần nam
- Áo nữ
- Quần nữ
- Phụ kiện

### 3. Products (10 sản phẩm)
Mỗi sản phẩm có:
- Tên, mô tả, giá
- Hình ảnh (sử dụng Unsplash)
- Nhiều variants (size, màu sắc, tồn kho)
- SKU riêng cho mỗi variant

### 4. Addresses (3 địa chỉ)
- 2 địa chỉ cho user1 (HCM)
- 1 địa chỉ cho user2 (Hà Nội)

## Cách chạy

### Từ thư mục backend:

```bash
# Chạy migrations trước
go run cmd/server/main.go migrate

# Sau đó seed data
go run cmd/seed/main.go
```

### Hoặc build và chạy:

```bash
cd cmd/seed
go build -o seed
./seed
```

## Lưu ý

- Script sẽ kiểm tra dữ liệu đã tồn tại trước khi tạo (tránh duplicate)
- Nếu đã có dữ liệu, script sẽ bỏ qua phần đó
- Mật khẩu mặc định: **123456** (đã được hash bằng bcrypt)
- Hình ảnh sử dụng từ Unsplash (cần internet để hiển thị)

## Reset và seed lại

Nếu muốn xóa toàn bộ dữ liệu và seed lại:

```bash
# Xóa database
dropdb fashion_ecommerce

# Tạo lại database
createdb fashion_ecommerce

# Chạy migrations
go run cmd/server/main.go migrate

# Seed data
go run cmd/seed/main.go
```
