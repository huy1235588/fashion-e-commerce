# Tasks: Enhance UI Design

## Phase 1: Design System Foundation

### 1.1 Setup Design Tokens
- [ ] Cập nhật `tailwind.config.ts` với extended theme (colors, fonts, shadows)
- [ ] Tạo `frontend/src/styles/design-tokens.css` với CSS custom properties
- [ ] Update `globals.css` import design tokens
- [ ] Thêm Google Fonts (Inter, Plus Jakarta Sans) vào `layout.tsx`

### 1.2 Base UI Components
- [ ] Tạo `frontend/src/components/ui/Button.tsx` với variants (primary, secondary, outline, ghost)
- [ ] Tạo `frontend/src/components/ui/Input.tsx` với states (default, focus, error)
- [ ] Tạo `frontend/src/components/ui/Badge.tsx` (status badges, labels)
- [ ] Tạo `frontend/src/components/ui/Card.tsx` (base card component)
- [ ] Tạo `frontend/src/components/ui/Skeleton.tsx` (loading skeleton variants)

### 1.3 Install Dependencies
- [ ] Run: `npm install embla-carousel-react framer-motion recharts @headlessui/react`
- [ ] Verify installations work

## Phase 2: Header & Navigation

### 2.1 Header Redesign
- [ ] Tạo folder `frontend/src/components/common/Header/`
- [ ] Refactor Header.tsx thành component structure mới
- [ ] Implement sticky header với backdrop blur effect
- [ ] Add logo với responsive sizing

### 2.2 Search Bar
- [ ] Tạo `SearchBar.tsx` component
- [ ] Add expandable search on mobile (icon -> full width)
- [ ] Implement search suggestions dropdown (UI only, connect to API sau)
- [ ] Add keyboard navigation (arrow keys, enter, escape)

### 2.3 Navigation Menu
- [ ] Create desktop navigation với hover dropdowns
- [ ] Tạo `MegaMenu.tsx` cho categories (2-3 column layout)
- [ ] Add active state styling for current page

### 2.4 Cart Preview
- [ ] Tạo `CartPreview.tsx` (hover popup showing cart items)
- [ ] Show item thumbnails, quantity, subtotal
- [ ] Add "View Cart" và "Checkout" buttons

### 2.5 User Menu
- [ ] Tạo `UserMenu.tsx` dropdown
- [ ] Include: Profile, Orders, Addresses, Logout
- [ ] Add avatar display

### 2.6 Mobile Navigation
- [ ] Tạo `MobileDrawer.tsx` (slide-out menu)
- [ ] Implement hamburger icon animation
- [ ] Add accordion cho category navigation
- [ ] Include search, cart, user actions

## Phase 3: Footer Redesign

### 3.1 Footer Layout
- [ ] Redesign `Footer.tsx` với 4-column grid
- [ ] Column 1: Logo, about text, social icons
- [ ] Column 2: Quick links (Products, Categories, etc.)
- [ ] Column 3: Customer Service (FAQ, Returns, Contact)
- [ ] Column 4: Newsletter signup form

### 3.2 Footer Elements
- [ ] Add social media icons (Facebook, Instagram, TikTok, etc.)
- [ ] Add payment method icons (Visa, Mastercard, VNPay, MoMo)
- [ ] Add trust badges (Secure checkout, Money back guarantee)
- [ ] Responsive: Stack columns on mobile

## Phase 4: Product Card Enhancement

### 4.1 Card Redesign
- [ ] Update `ProductCard.tsx` với new styling
- [ ] Add image container với consistent aspect ratio
- [ ] Implement image hover zoom effect
- [ ] Add discount badge styling (% off)
- [ ] Add "New" badge cho recent products
- [ ] Add stock status indicator (In stock, Low stock, Out of stock)

### 4.2 Quick Actions
- [ ] Add "Quick View" button on hover
- [ ] Add "Add to Cart" button on hover
- [ ] Add "Wishlist" heart icon
- [ ] Implement hover transition animations

### 4.3 Rating Display
- [ ] Add star rating component
- [ ] Show average rating và review count
- [ ] Style for empty/partial/full stars

### 4.4 Product Grid
- [ ] Tạo/update `ProductGrid.tsx` (nếu chưa có)
- [ ] Add view toggle (grid 2/3/4 cols, list view)
- [ ] Responsive grid columns

## Phase 5: Homepage Redesign

### 5.1 Hero Section
- [ ] Implement hero carousel với Embla
- [ ] Create slide component với text overlay positioning
- [ ] Add autoplay với pause on hover
- [ ] Add navigation dots và arrows
- [ ] Responsive: Adjust text size, positioning

### 5.2 Categories Section
- [ ] Redesign category cards với images
- [ ] Add hover effects (scale, overlay)
- [ ] Improve grid layout

### 5.3 Featured Products
- [ ] Update section styling
- [ ] Add "See All" link
- [ ] Use new ProductCard component

### 5.4 New Sections
- [ ] Add "Flash Sale" section với countdown timer
- [ ] Add "New Arrivals" section
- [ ] Add "Testimonials" carousel section
- [ ] Add "Brand Partners" logo section

### 5.5 Why Choose Us Section
- [ ] Improve feature cards styling
- [ ] Add icons hoặc illustrations
- [ ] Better visual hierarchy

### 5.6 Newsletter Section
- [ ] Redesign CTA section
- [ ] Better input + button styling
- [ ] Add background pattern hoặc image

## Phase 6: Products Page Enhancement

### 6.1 Page Layout
- [ ] Add breadcrumb navigation
- [ ] Add product count display ("Showing X of Y products")
- [ ] Improve page title và description area

### 6.2 Filter Sidebar
- [ ] Tạo `FilterSidebar.tsx` component
- [ ] Implement collapsible filter sections
- [ ] Add checkbox filters cho categories
- [ ] Add price range slider
- [ ] Add size filter (nếu applicable)
- [ ] Add color filter với swatches
- [ ] Add rating filter

### 6.3 Active Filters
- [ ] Display active filters as pills/chips
- [ ] Add remove individual filter
- [ ] Add "Clear All" button

### 6.4 Sort & View Options
- [ ] Add sort dropdown (Newest, Price Low-High, Price High-Low, Popular)
- [ ] Add grid/list view toggle
- [ ] Persist view preference

### 6.5 Mobile Filters
- [ ] Create filter bottom sheet hoặc full-screen overlay
- [ ] Add "Apply Filters" button
- [ ] Show active filter count on toggle button

### 6.6 Pagination
- [ ] Improve pagination styling
- [ ] Add page number buttons (not just Prev/Next)
- [ ] Consider infinite scroll option

## Phase 7: Admin Dashboard Polish

### 7.1 Dashboard Layout
- [ ] Improve overall spacing và visual hierarchy
- [ ] Add welcome message với time-based greeting
- [ ] Add date range selector cho stats

### 7.2 Stats Cards
- [ ] Redesign stat cards với icons
- [ ] Add trend indicators (↑ up X%, ↓ down X%)
- [ ] Add mini sparkline charts (optional)
- [ ] Color code by metric type

### 7.3 Charts
- [ ] Add Revenue over time line chart (Recharts)
- [ ] Add Orders by status bar chart
- [ ] Add Revenue by category pie chart
- [ ] Make charts responsive
- [ ] Add tooltips và legends

### 7.4 Recent Activity
- [ ] Add "Recent Orders" table
- [ ] Add "Low Stock Alerts" section
- [ ] Add "Recent Customers" section (optional)

### 7.5 Quick Actions
- [ ] Add quick action buttons (Add Product, View Orders, etc.)

## Phase 8: Loading States & Empty States

### 8.1 Skeleton Loading
- [ ] Implement skeleton cho ProductCard
- [ ] Implement skeleton cho product list/grid
- [ ] Implement skeleton cho dashboard stats
- [ ] Implement skeleton cho tables

### 8.2 Empty States
- [ ] Create empty state component với illustration
- [ ] Add empty state cho: Cart, Orders, Wishlist, Search results
- [ ] Include helpful CTA buttons

### 8.3 Error States
- [ ] Improve ErrorMessage component styling
- [ ] Add retry button
- [ ] Add helpful error descriptions

## Phase 9: Global Polish

### 9.1 Toast Notifications
- [ ] Update Toast component styling
- [ ] Add icons for success/error/warning/info
- [ ] Improve positioning và animations

### 9.2 Modal/Dialog
- [ ] Create base Modal component nếu chưa có
- [ ] Add proper backdrop
- [ ] Add close button styling
- [ ] Implement animation (fade + scale)

### 9.3 Form Styling
- [ ] Ensure consistent input styling across app
- [ ] Add proper focus states
- [ ] Add error states với messages
- [ ] Style labels và helper text

### 9.4 Button Consistency
- [ ] Apply Button component across app
- [ ] Ensure consistent hover/active states
- [ ] Add loading state với spinner

## Phase 10: Animations & Transitions

### 10.1 Page Transitions
- [ ] Add fade transition between pages (optional với Framer Motion)
- [ ] Add loading progress bar (NProgress style)

### 10.2 Micro-interactions
- [ ] Add smooth transitions to all interactive elements
- [ ] Add hover effects to buttons, cards, links
- [ ] Add focus-visible styles

### 10.3 Scroll Animations
- [ ] Add fade-in-up on scroll for homepage sections
- [ ] Keep subtle, không overwhelming

## Phase 11: Testing & QA

### 11.1 Responsive Testing
- [ ] Test trên mobile (360px, 390px, 414px)
- [ ] Test trên tablet (768px, 1024px)
- [ ] Test trên desktop (1280px, 1440px, 1920px)

### 11.2 Browser Testing
- [ ] Test trên Chrome
- [ ] Test trên Firefox
- [ ] Test trên Safari (nếu có Mac)
- [ ] Test trên Edge

### 11.3 Performance
- [ ] Run Lighthouse audit
- [ ] Optimize images nếu cần
- [ ] Check bundle size
- [ ] Fix any performance issues

### 11.4 Accessibility
- [ ] Check keyboard navigation
- [ ] Check color contrast
- [ ] Add proper ARIA labels
- [ ] Test với screen reader (basic)

---

## Notes
- Hoàn thành từng phase trước khi chuyển sang phase tiếp theo
- Commit thường xuyên sau mỗi task hoàn thành
- Test responsive sau mỗi component lớn
- Ưu tiên mobile-first approach
