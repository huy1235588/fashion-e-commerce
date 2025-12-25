-- =====================================================
-- DATABASE DESIGN - FASHION E-COMMERCE
-- =====================================================

-- Drop tables if exists (for development)
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS shipping_addresses CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'customer', -- customer, admin
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- =====================================================
-- ADDRESSES TABLE
-- =====================================================
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    province VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    detail_address TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- =====================================================
-- CATEGORIES TABLE
-- =====================================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON categories(slug);

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    discount_price DECIMAL(10, 2),
    slug VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_price ON products(price);

-- =====================================================
-- PRODUCT IMAGES TABLE
-- =====================================================
CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);

-- =====================================================
-- PRODUCT VARIANTS TABLE (Size, Color, Stock)
-- =====================================================
CREATE TABLE product_variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size VARCHAR(20) NOT NULL, -- S, M, L, XL, XXL
    color VARCHAR(50) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    sku VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_product_variant UNIQUE(product_id, size, color)
);

CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);

-- =====================================================
-- CARTS TABLE
-- =====================================================
CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_cart UNIQUE(user_id)
);

CREATE INDEX idx_carts_user_id ON carts(user_id);

-- =====================================================
-- CART ITEMS TABLE
-- =====================================================
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id INTEGER NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_cart_item UNIQUE(cart_id, variant_id)
);

CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);

-- =====================================================
-- ORDERS TABLE
-- =====================================================
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    order_code VARCHAR(50) UNIQUE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_fee DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    final_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL, -- cod, vnpay, momo
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, shipping, delivered, cancelled
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_code ON orders(order_code);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- =====================================================
-- ORDER ITEMS TABLE
-- =====================================================
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    variant_id INTEGER NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
    product_name VARCHAR(255) NOT NULL,
    variant_info VARCHAR(100) NOT NULL, -- "Size: L, Color: Black"
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- =====================================================
-- SHIPPING ADDRESSES TABLE
-- =====================================================
CREATE TABLE shipping_addresses (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    province VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    detail_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_order_shipping UNIQUE(order_id)
);

CREATE INDEX idx_shipping_addresses_order_id ON shipping_addresses(order_id);

-- =====================================================
-- REVIEWS TABLE
-- =====================================================
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_order_review UNIQUE(user_id, order_id, product_id)
);

CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);

-- =====================================================
-- PAYMENTS TABLE
-- =====================================================
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    transaction_id VARCHAR(255),
    payment_method VARCHAR(20) NOT NULL, -- vnpay, momo, cod
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, success, failed
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);

-- =====================================================
-- SAMPLE DATA (Optional for testing)
-- =====================================================

-- Insert admin user (password: admin123)
INSERT INTO users (email, password, full_name, phone, role) VALUES
('admin@fashion.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin User', '0901234567', 'admin');

-- Insert sample categories
INSERT INTO categories (name, description, slug) VALUES
('Áo thun', 'Các loại áo thun nam nữ', 'ao-thun'),
('Quần jean', 'Quần jean thời trang', 'quan-jean'),
('Váy', 'Váy đầm nữ', 'vay'),
('Áo khoác', 'Áo khoác các loại', 'ao-khoac'),
('Phụ kiện', 'Phụ kiện thời trang', 'phu-kien');

-- Insert sample products
INSERT INTO products (category_id, name, description, price, discount_price, slug, is_active) VALUES
(1, 'Áo thun basic trắng', 'Áo thun cotton 100% màu trắng basic', 150000, 120000, 'ao-thun-basic-trang', TRUE),
(1, 'Áo thun nam đen in hình', 'Áo thun cotton có in hình trendy', 200000, NULL, 'ao-thun-nam-den-in-hinh', TRUE),
(2, 'Quần jean nam xanh đậm', 'Quần jean denim cao cấp', 450000, 380000, 'quan-jean-nam-xanh-dam', TRUE),
(3, 'Váy midi hoa nhí', 'Váy midi họa tiết hoa nhí dễ thương', 350000, NULL, 'vay-midi-hoa-nhi', TRUE),
(4, 'Áo khoác hoodie', 'Áo hoodie nỉ ngoại form rộng', 500000, 450000, 'ao-khoac-hoodie', TRUE);

-- Insert sample product variants
INSERT INTO product_variants (product_id, size, color, stock_quantity, sku) VALUES
-- Áo thun basic trắng
(1, 'S', 'Trắng', 50, 'AT-BASIC-WHITE-S'),
(1, 'M', 'Trắng', 100, 'AT-BASIC-WHITE-M'),
(1, 'L', 'Trắng', 80, 'AT-BASIC-WHITE-L'),
(1, 'XL', 'Trắng', 30, 'AT-BASIC-WHITE-XL'),

-- Áo thun đen in hình
(2, 'M', 'Đen', 60, 'AT-INH-BLACK-M'),
(2, 'L', 'Đen', 70, 'AT-INH-BLACK-L'),
(2, 'XL', 'Đen', 40, 'AT-INH-BLACK-XL'),

-- Quần jean
(3, 'M', 'Xanh đậm', 40, 'QJ-XDAM-M'),
(3, 'L', 'Xanh đậm', 50, 'QJ-XDAM-L'),
(3, 'XL', 'Xanh đậm', 30, 'QJ-XDAM-XL'),

-- Váy midi
(4, 'S', 'Hoa nhí', 25, 'VAY-MIDI-HOANHI-S'),
(4, 'M', 'Hoa nhí', 40, 'VAY-MIDI-HOANHI-M'),

-- Áo khoác
(5, 'L', 'Đen', 20, 'HOODIE-BLACK-L'),
(5, 'XL', 'Đen', 15, 'HOODIE-BLACK-XL'),
(5, 'L', 'Xám', 25, 'HOODIE-GRAY-L');

-- =====================================================
-- USEFUL QUERIES FOR DEVELOPMENT
-- =====================================================

-- Get products with category and variants
-- SELECT p.*, c.name as category_name, 
--        COUNT(DISTINCT pv.id) as variant_count,
--        SUM(pv.stock_quantity) as total_stock
-- FROM products p
-- JOIN categories c ON p.category_id = c.id
-- LEFT JOIN product_variants pv ON p.id = pv.product_id
-- GROUP BY p.id, c.name;

-- Get order details
-- SELECT o.*, u.full_name, u.email,
--        sa.province, sa.district, sa.detail_address,
--        COUNT(oi.id) as item_count
-- FROM orders o
-- JOIN users u ON o.user_id = u.id
-- LEFT JOIN shipping_addresses sa ON o.id = sa.order_id
-- LEFT JOIN order_items oi ON o.id = oi.order_id
-- GROUP BY o.id, u.full_name, u.email, sa.province, sa.district, sa.detail_address;

-- =====================================================
-- TRIGGERS (Auto update updated_at)
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
