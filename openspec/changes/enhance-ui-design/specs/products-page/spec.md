# Spec: Products Page Enhancement

## Overview
Nâng cấp trang danh sách sản phẩm với advanced filters, better UX, và improved layout.

## MODIFIED Requirements

### Requirement: Filter Sidebar
Filter sidebar MUST have improved UI and more options.

#### Scenario: Collapsible filter sections
**Given** filter sidebar render
**When** user views filters
**Then** mỗi filter group (Categories, Price, etc.) có thể collapse/expand

#### Scenario: Category filter with checkboxes
**Given** categories loaded
**When** filter sidebar render
**Then** categories hiển thị dạng checkbox list, cho phép multi-select

#### Scenario: Price range slider
**Given** filter sidebar render
**When** user wants to filter by price
**Then** có range slider hoặc dual inputs cho min/max price

#### Scenario: Mobile filter bottom sheet
**Given** user đang trên mobile
**When** user taps "Bộ lọc" button
**Then** filter UI hiển thị dạng bottom sheet hoặc full-screen overlay với "Áp dụng" button

## ADDED Requirements

### Requirement: Active Filters Display
Active filters MUST be displayed clearly and be removable.

#### Scenario: Active filters as chips
**Given** user đã apply một số filters
**When** products page render
**Then** phía trên product grid hiển thị các filter chips với X button để remove

#### Scenario: Clear all filters
**Given** có multiple active filters
**When** user wants to reset
**Then** có "Xóa tất cả" button để clear all filters một lần

### Requirement: Sort Options
Page MUST have dropdown sort options.

#### Scenario: Sort dropdown
**Given** products page render
**When** user views top of product grid
**Then** có sort dropdown với options: "Mới nhất", "Giá: Thấp → Cao", "Giá: Cao → Thấp", "Bán chạy"

#### Scenario: Sort changes product order
**Given** user selects sort option
**When** selection changes
**Then** products reorder theo selection (maintain current filters)

### Requirement: View Toggle
User MUST be able to toggle between grid and list view.

#### Scenario: Grid/List toggle buttons
**Given** products page render
**When** user views product area
**Then** có toggle buttons cho grid view (2/3/4 cols) và list view

#### Scenario: List view displays
**Given** user selects list view
**When** products render
**Then** products hiển thị horizontal layout với larger image, more description visible

### Requirement: Product Count Display
Page MUST display the number of products.

#### Scenario: Product count shows
**Given** products loaded
**When** page render
**Then** hiển thị "Hiển thị X - Y của Z sản phẩm" text

### Requirement: Breadcrumb Navigation
Page MUST have breadcrumb for navigation context.

#### Scenario: Breadcrumb displays
**Given** user trên products page
**When** page render
**Then** breadcrumb hiển thị: "Trang chủ > Sản phẩm" (và category nếu filtered)

### Requirement: Improved Pagination
Pagination MUST have better UX.

#### Scenario: Page number buttons
**Given** multiple pages of products
**When** pagination render
**Then** hiển thị: First, Prev, page numbers (với ellipsis nếu nhiều), Next, Last

#### Scenario: Pagination shows range
**Given** pagination visible
**When** user views pagination
**Then** có thể thấy đang ở page nào của tổng bao nhiêu pages
