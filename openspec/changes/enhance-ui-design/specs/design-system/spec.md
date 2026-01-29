# Spec: Design System

## Overview
Hệ thống thiết kế chuẩn hóa cho Fashion E-Commerce, định nghĩa colors, typography, spacing, và base components.

## ADDED Requirements

### Requirement: Design Tokens
The system MUST define and use design tokens consistently throughout the application.

#### Scenario: Color palette được định nghĩa
**Given** ứng dụng sử dụng Tailwind CSS
**When** developer cần sử dụng màu sắc
**Then** có thể sử dụng các color tokens: primary (blue), secondary (gray), accent (pink), và semantic colors (success, warning, error, info)

#### Scenario: Typography scale được áp dụng
**Given** trang web cần hiển thị text
**When** render các headings và body text
**Then** sử dụng font-family nhất quán (Inter/Plus Jakarta Sans) với size scale từ xs đến 5xl

#### Scenario: Spacing system được sử dụng
**Given** các components cần spacing
**When** apply margins và paddings
**Then** sử dụng spacing scale dựa trên 4px base unit

### Requirement: Base UI Components
The system MUST provide reusable base UI components.

#### Scenario: Button component với variants
**Given** user thấy buttons trên trang
**When** buttons được render
**Then** buttons có consistent styling với các variants: primary, secondary, outline, ghost, và các sizes: sm, md, lg

#### Scenario: Input component với states
**Given** user thấy form inputs
**When** inputs được render
**Then** inputs có consistent styling với states: default, focus, error, disabled

#### Scenario: Card component base
**Given** content cần được grouped
**When** Card component được sử dụng
**Then** card có consistent border radius, shadow, và padding

#### Scenario: Skeleton loading component
**Given** content đang được tải
**When** loading state được hiển thị
**Then** skeleton placeholder hiển thị với pulse animation thay vì blank space

#### Scenario: Badge component
**Given** cần hiển thị labels hoặc status
**When** Badge component được sử dụng
**Then** badge có variants cho: default, success, warning, error, info với styling nhất quán
