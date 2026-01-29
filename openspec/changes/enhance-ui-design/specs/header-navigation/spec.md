# Spec: Header Enhancement

## Overview
Nâng cấp header với sticky behavior, search bar, mega menu, và responsive mobile navigation.

## ADDED Requirements

### Requirement: Sticky Header
The header MUST be sticky on scroll with visual feedback.

#### Scenario: Header sticks on scroll
**Given** user đang ở trang bất kỳ
**When** user scrolls xuống trang
**Then** header stays fixed ở top với backdrop blur effect và subtle shadow

#### Scenario: Header returns to normal on scroll top
**Given** user đã scroll xuống và header đang sticky
**When** user scrolls về đầu trang
**Then** header trở về trạng thái bình thường không có shadow

### Requirement: Search Bar Integration
The header MUST have an integrated search bar.

#### Scenario: Desktop search bar visible
**Given** user đang trên desktop (>= 1024px)
**When** header được render
**Then** search bar hiển thị trong header với input field và search icon

#### Scenario: Mobile search expandable
**Given** user đang trên mobile (< 1024px)
**When** user tap vào search icon
**Then** search bar expands full width overlay hoặc dropdown

#### Scenario: Search suggestions display
**Given** user đang nhập trong search bar
**When** có text input
**Then** dropdown suggestions hiển thị (UI ready, kết nối API sau)

### Requirement: Category Mega Menu
The navigation MUST have a mega menu for categories.

#### Scenario: Mega menu on hover
**Given** user đang trên desktop
**When** user hover vào "Danh mục" navigation item
**Then** mega menu dropdown hiển thị với danh sách categories trong 2-3 columns

#### Scenario: Mega menu closes properly
**Given** mega menu đang mở
**When** user di chuột ra khỏi menu hoặc click elsewhere
**Then** mega menu đóng smoothly

### Requirement: Cart Preview Popup
The header cart icon MUST have a preview popup.

#### Scenario: Cart preview on hover
**Given** user có items trong cart
**When** user hover vào cart icon trên desktop
**Then** popup hiển thị: tối đa 3 items với thumbnail, tên, quantity, giá, subtotal, và buttons "Xem giỏ hàng" / "Thanh toán"

#### Scenario: Empty cart preview
**Given** cart trống
**When** user hover vào cart icon
**Then** popup hiển thị message "Giỏ hàng trống" với link tới products

### Requirement: User Dropdown Menu
The user area MUST have a dropdown menu.

#### Scenario: User dropdown on click
**Given** user đã đăng nhập
**When** user click vào user name/avatar
**Then** dropdown menu hiển thị với: Profile, Đơn hàng, Địa chỉ, và Đăng xuất

#### Scenario: Avatar display
**Given** user đã đăng nhập
**When** header render user area
**Then** hiển thị user avatar (hoặc initials) cùng với tên

### Requirement: Mobile Navigation Drawer
Mobile MUST have a slide-out navigation drawer.

#### Scenario: Hamburger menu opens drawer
**Given** user đang trên mobile
**When** user tap hamburger icon
**Then** drawer slides in từ trái với overlay backdrop

#### Scenario: Drawer contains full navigation
**Given** mobile drawer đang mở
**When** user xem drawer
**Then** drawer chứa: logo, search, menu items với accordion cho categories, cart link, user options, và close button

#### Scenario: Drawer closes properly
**Given** drawer đang mở
**When** user tap close button, overlay, hoặc navigate to page
**Then** drawer slides out và page accessible trở lại
