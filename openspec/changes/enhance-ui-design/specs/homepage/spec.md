# Spec: Homepage Enhancement

## Overview
Nâng cấp trang chủ với hero carousel, improved sections, và visual appeal tốt hơn.

## MODIFIED Requirements

### Requirement: Hero Section
Hero section MUST have carousel/slider with multiple slides.

#### Scenario: Hero carousel displays slides
**Given** user truy cập homepage
**When** page loads
**Then** hero carousel hiển thị slides với image, title, subtitle, và CTA buttons

#### Scenario: Carousel auto-plays
**Given** hero carousel đang hiển thị
**When** không có user interaction
**Then** slides tự động chuyển sau mỗi 5 giây

#### Scenario: Carousel pauses on hover
**Given** carousel đang autoplay
**When** user hovers over carousel
**Then** autoplay tạm dừng, resume khi mouse leave

#### Scenario: Carousel navigation
**Given** hero carousel hiển thị
**When** user muốn navigate
**Then** có thể sử dụng dots pagination, arrows (desktop), hoặc swipe (mobile)

### Requirement: Categories Section
Categories section MUST have images and better visual appeal.

#### Scenario: Category cards with images
**Given** categories được load
**When** categories section render
**Then** mỗi category card có background image hoặc icon lớn, tên category, và hover effect

#### Scenario: Category hover effect
**Given** user xem categories
**When** hover over category card
**Then** card có overlay effect và scale nhẹ

### Requirement: Featured Products Section
Featured products section MUST have improved styling.

#### Scenario: Section header with link
**Given** featured products section render
**When** user xem section
**Then** có title "Sản Phẩm Nổi Bật" bên trái và "Xem tất cả →" link bên phải

#### Scenario: Uses enhanced ProductCard
**Given** featured products load
**When** products render
**Then** sử dụng enhanced ProductCard với all new features

## ADDED Requirements

### Requirement: Flash Sale Section
Homepage MUST have a flash sale section with countdown.

#### Scenario: Flash sale with countdown
**Given** có active flash sale (hoặc mock data)
**When** section render
**Then** hiển thị countdown timer (HH:MM:SS), discounted products, và urgency messaging

#### Scenario: Countdown updates realtime
**Given** flash sale section visible
**When** time passes
**Then** countdown timer updates mỗi giây

### Requirement: New Arrivals Section
Homepage MUST have a new arrivals section.

#### Scenario: New arrivals display
**Given** có new products (created within 30 days)
**When** new arrivals section render
**Then** hiển thị grid products mới với "Mới" badge

### Requirement: Testimonials Section
Homepage MUST have a testimonials/reviews section.

#### Scenario: Customer testimonials carousel
**Given** user views homepage
**When** testimonials section render
**Then** carousel hiển thị customer reviews với avatar, name, rating, và quote

### Requirement: Trust Features Section
"Why choose us" section MUST have improved styling.

#### Scenario: Feature cards enhanced styling
**Given** trust features section render
**When** user views section
**Then** cards có icons lớn hơn, better colors, và hover effects

### Requirement: Newsletter CTA Section
Newsletter section MUST have more attractive styling.

#### Scenario: Newsletter with improved styling
**Given** newsletter section render
**When** user views section
**Then** section có background gradient/pattern, input field styled tốt, và button nổi bật
