# Spec: Admin Dashboard Enhancement

## Overview
Nâng cấp admin dashboard với data visualization, improved stats cards, và better layout.

## MODIFIED Requirements

### Requirement: Statistics Cards
Stats cards MUST have improved styling and information.

#### Scenario: Stats cards with icons
**Given** dashboard loads stats
**When** stats cards render
**Then** mỗi card có colored icon, metric name, value lớn, và comparison data

#### Scenario: Trend indicators
**Given** stats have comparison data (today vs yesterday, etc.)
**When** stats cards render
**Then** hiển thị trend indicator với arrow (↑/↓) và percentage change với color coding (green positive, red negative)

## ADDED Requirements

### Requirement: Revenue Chart
Dashboard MUST have a chart displaying revenue over time.

#### Scenario: Line chart displays
**Given** revenue data available
**When** dashboard render
**Then** hiển thị line chart với revenue theo ngày trong period selected

#### Scenario: Chart period selector
**Given** revenue chart visible
**When** user wants to change period
**Then** có buttons/dropdown để chọn: 7 ngày, 30 ngày, 90 ngày

#### Scenario: Chart tooltips
**Given** revenue chart visible
**When** user hovers over data point
**Then** tooltip hiển thị date và exact revenue amount

### Requirement: Orders Status Chart
Dashboard MUST have a chart displaying orders by status.

#### Scenario: Bar/Pie chart for order status
**Given** orders data available
**When** dashboard render
**Then** chart hiển thị breakdown orders theo status: Pending, Processing, Shipped, Delivered, Cancelled

### Requirement: Recent Orders Table
Dashboard MUST have a recent orders table.

#### Scenario: Recent orders list
**Given** orders exist
**When** dashboard render
**Then** table hiển thị 5-10 recent orders với: Order ID, Customer, Total, Status, Date

#### Scenario: Order status badges
**Given** recent orders table visible
**When** status column render
**Then** status hiển thị dạng colored badge (yellow: pending, blue: processing, green: delivered, red: cancelled)

#### Scenario: Quick link to order detail
**Given** recent orders table visible
**When** user clicks order row
**Then** navigate to order detail page

### Requirement: Low Stock Alerts
Dashboard MUST have alerts for low stock products.

#### Scenario: Low stock warning panel
**Given** products với stock <= 10
**When** dashboard render
**Then** hiển thị warning panel list products cần restock với: Product name, current stock, link to edit

### Requirement: Quick Actions Panel
Dashboard MUST have quick action buttons.

#### Scenario: Quick actions available
**Given** admin on dashboard
**When** page render
**Then** có quick action buttons: "Thêm sản phẩm", "Xem đơn hàng", "Quản lý danh mục"

### Requirement: Dashboard Welcome Header
Dashboard MUST have a personalized header.

#### Scenario: Welcome message
**Given** admin logged in
**When** dashboard render
**Then** hiển thị "Chào [Admin Name]" với time-based greeting (Chào buổi sáng/chiều/tối)

#### Scenario: Date range selector
**Given** dashboard visible
**When** admin wants to filter stats
**Then** có date range selector để chọn period cho all dashboard data
