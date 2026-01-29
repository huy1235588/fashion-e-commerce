# Spec: Footer Redesign

## Overview
Redesign footer với multi-column layout, more information, và better visual design.

## MODIFIED Requirements

### Requirement: Footer Layout
Footer MUST have comprehensive layout with multiple sections.

#### Scenario: Four column layout on desktop
**Given** user đang trên desktop
**When** footer render
**Then** footer có 4 columns: About, Quick Links, Customer Service, Newsletter

#### Scenario: Responsive column stacking
**Given** user đang trên mobile/tablet
**When** footer render
**Then** columns stack vertically với proper spacing

### Requirement: About Section
Footer MUST have an about section with branding.

#### Scenario: About section content
**Given** footer render
**When** user views first column
**Then** hiển thị: Logo, brief description (2-3 lines), social media icons

### Requirement: Quick Links Section
Footer MUST have quick navigation links.

#### Scenario: Quick links list
**Given** footer render
**When** user views quick links column
**Then** hiển thị links: Sản phẩm, Danh mục, Khuyến mãi, Về chúng tôi

## ADDED Requirements

### Requirement: Social Media Links
Footer MUST have social media icons.

#### Scenario: Social icons display
**Given** footer render
**When** user views about section
**Then** hiển thị clickable icons cho: Facebook, Instagram, TikTok, YouTube

#### Scenario: Social icons hover effect
**Given** social icons visible
**When** user hovers icon
**Then** icon có color change hoặc scale effect

### Requirement: Customer Service Section
Footer MUST have customer service links.

#### Scenario: Customer service links
**Given** footer render
**When** user views customer service column
**Then** hiển thị links: FAQ, Chính sách đổi trả, Chính sách vận chuyển, Liên hệ

### Requirement: Newsletter Signup
Footer MUST have a newsletter signup form.

#### Scenario: Newsletter form
**Given** footer render
**When** user views newsletter column
**Then** hiển thị heading, description, email input, và subscribe button

#### Scenario: Newsletter input styling
**Given** newsletter form visible
**When** user focuses input
**Then** input có proper focus state styling

### Requirement: Payment Methods
Footer MUST display accepted payment methods.

#### Scenario: Payment icons display
**Given** footer render
**When** user views bottom section
**Then** hiển thị payment method icons: Visa, Mastercard, VNPay, MoMo, COD

### Requirement: Trust Badges
Footer MUST have trust badges/certifications.

#### Scenario: Trust badges display
**Given** footer render
**When** user views footer
**Then** hiển thị trust badges: "Thanh toán an toàn", "Đổi trả 7 ngày", "Giao hàng nhanh"

### Requirement: Copyright Section
Footer MUST have proper copyright section.

#### Scenario: Copyright and legal
**Given** footer render
**When** user views bottom of footer
**Then** hiển thị copyright text, year, và optional links to Terms/Privacy
