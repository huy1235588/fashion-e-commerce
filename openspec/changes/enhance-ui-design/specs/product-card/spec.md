# Spec: Product Card Enhancement

## Overview
Nâng cấp product card với hover effects, quick actions, rating display, và badges.

## MODIFIED Requirements

### Requirement: Product Card Display
Product card MUST display product information in an attractive manner.

#### Scenario: Card displays product info
**Given** product data được cung cấp
**When** ProductCard render
**Then** card hiển thị: image, name, price (hoặc discount price), rating stars, và relevant badges

#### Scenario: Image hover zoom effect
**Given** user xem product card
**When** user hovers over product image
**Then** image scales up smoothly (1.05) với overflow hidden để không vượt card bounds

#### Scenario: Card hover elevation
**Given** user xem product grid
**When** user hovers over a card
**Then** card lifts up (translateY -4px) với shadow tăng để tạo depth effect

## ADDED Requirements

### Requirement: Discount Badge Display
Products with discount MUST display a clear badge.

#### Scenario: Percentage discount badge
**Given** product có discount_price < price
**When** card render
**Then** badge hiển thị "- X%" ở góc trên phải image với background màu accent/red

#### Scenario: No badge for non-discounted products
**Given** product không có discount
**When** card render
**Then** không hiển thị discount badge

### Requirement: New Product Badge
New products MUST have a "New" badge.

#### Scenario: New badge for recent products
**Given** product được tạo trong 7 ngày gần nhất
**When** card render
**Then** "Mới" badge hiển thị với styling khác biệt (ví dụ: green background)

### Requirement: Stock Status Indicator
Card MUST display stock status.

#### Scenario: Low stock warning
**Given** product có stock quantity <= 5 và > 0
**When** card render
**Then** hiển thị "Còn X sản phẩm" text với màu warning

#### Scenario: Out of stock indicator
**Given** product có stock quantity = 0
**When** card render
**Then** hiển thị "Hết hàng" badge, image có overlay mờ, và card muted

### Requirement: Quick Actions on Hover
Card MUST have quick action buttons on hover.

#### Scenario: Quick view button appears on hover
**Given** user đang trên desktop
**When** user hovers over product card
**Then** "Xem nhanh" button fades in overlay trên image

#### Scenario: Add to cart button on hover
**Given** user hovers over product card và product in stock
**When** quick actions visible
**Then** "Thêm vào giỏ" button hiển thị và clickable

#### Scenario: Wishlist icon
**Given** user views product card
**When** card render (không cần hover)
**Then** heart icon hiển thị ở góc để toggle wishlist (UI only, functionality sau)

### Requirement: Rating Display
Card MUST display average rating.

#### Scenario: Star rating with count
**Given** product có reviews
**When** card render
**Then** hiển thị star rating (filled/empty stars) và số lượng reviews "(X đánh giá)"

#### Scenario: No rating display
**Given** product chưa có reviews
**When** card render
**Then** có thể hiển thị "Chưa có đánh giá" hoặc không hiển thị rating section
