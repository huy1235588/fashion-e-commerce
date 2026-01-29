# Design Document: Enhance UI Design

## Overview
Tài liệu này mô tả các quyết định thiết kế kỹ thuật cho việc nâng cấp giao diện Fashion E-Commerce.

## Design System Architecture

### Color Palette
```css
/* Primary Colors */
--color-primary-50: #eff6ff;
--color-primary-100: #dbeafe;
--color-primary-500: #3b82f6;
--color-primary-600: #2563eb;
--color-primary-700: #1d4ed8;

/* Secondary (Neutral) */
--color-gray-50: #f9fafb;
--color-gray-100: #f3f4f6;
--color-gray-200: #e5e7eb;
--color-gray-500: #6b7280;
--color-gray-700: #374151;
--color-gray-900: #111827;

/* Semantic Colors */
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error: #ef4444;
--color-info: #3b82f6;

/* Accent (for highlights, sales) */
--color-accent: #ec4899; /* Pink for sales/promotions */
```

### Typography Scale
```css
/* Font Family */
--font-sans: 'Inter', system-ui, sans-serif;
--font-display: 'Plus Jakarta Sans', var(--font-sans);

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Spacing System
Sử dụng 4px base unit với Tailwind defaults:
- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px
- `space-6`: 24px
- `space-8`: 32px
- `space-12`: 48px
- `space-16`: 64px

### Shadow System
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

### Border Radius
```css
--radius-sm: 0.25rem;  /* 4px */
--radius-md: 0.5rem;   /* 8px */
--radius-lg: 0.75rem;  /* 12px */
--radius-xl: 1rem;     /* 16px */
--radius-full: 9999px; /* Pills, avatars */
```

## Component Architecture

### 1. Header Component Structure
```
Header/
├── Logo
├── SearchBar (expandable on mobile)
├── Navigation
│   ├── NavItem (with mega menu support)
│   └── MegaMenu (for categories)
├── Actions
│   ├── CartIcon (with badge & preview)
│   ├── UserMenu (dropdown)
│   └── MobileMenuToggle
└── MobileDrawer (slide-out menu)
```

**Key Features:**
- Sticky on scroll với backdrop blur
- Search với autocomplete suggestions
- Cart preview on hover
- Responsive breakpoint: `lg:1024px`

### 2. Product Card Variants
```typescript
interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'horizontal';
  showQuickActions?: boolean;
  showRating?: boolean;
}
```

**Hover States:**
- Image zoom effect (transform: scale(1.05))
- Quick action buttons fade in
- Shadow elevation increase

### 3. Hero Carousel
```typescript
// Using Embla Carousel for performance
interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  cta: {
    text: string;
    link: string;
  };
  position: 'left' | 'center' | 'right';
}
```

**Implementation:**
- Autoplay với pause on hover
- Touch/swipe support
- Dots pagination
- Optional arrows

### 4. Filter Sidebar (Products Page)
```typescript
interface FilterState {
  categories: number[];
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  rating: number | null;
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'popular';
}
```

**UX Patterns:**
- Collapsible sections
- Checkbox cho multi-select
- Range slider cho price
- Active filters pills với clear option
- Mobile: Bottom sheet hoặc full-screen overlay

### 5. Admin Dashboard Charts
```typescript
// Using Recharts
interface RevenueChartProps {
  data: {
    date: string;
    revenue: number;
    orders: number;
  }[];
  period: '7d' | '30d' | '90d';
}
```

**Charts cần thiết:**
- Line chart: Revenue over time
- Bar chart: Orders by status
- Pie chart: Revenue by category
- Stats cards với trend indicators

## Animation Guidelines

### Transitions
```css
/* Default transition */
--transition-base: 150ms ease-in-out;
--transition-slow: 300ms ease-in-out;

/* Properties */
transition-property: color, background-color, border-color, 
                     transform, opacity, box-shadow;
```

### Micro-interactions
1. **Button hover**: Scale(1.02), shadow increase
2. **Card hover**: TranslateY(-4px), shadow increase
3. **Link hover**: Underline animation from left
4. **Icon buttons**: Scale(1.1)
5. **Modal**: Fade + scale from 0.95
6. **Drawer**: Slide from edge
7. **Toast**: Slide + fade from top-right

### Page Transitions (Optional - Framer Motion)
```typescript
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};
```

## Responsive Strategy

### Breakpoints
```css
/* Mobile first */
sm: 640px   /* Large phones */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### Layout Adaptations
| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| Header Nav | Hamburger menu | Hamburger | Full nav |
| Product Grid | 2 cols | 3 cols | 4 cols |
| Filters | Bottom sheet | Sidebar | Sidebar |
| Hero | Stack content | Side-by-side | Side-by-side |
| Footer | Stack | 2 cols | 4 cols |

## Performance Considerations

### Image Optimization
- Use Next.js `Image` component everywhere
- Implement blur placeholder
- Lazy load below-fold images
- Product images: 400x400 thumbnail, 800x800 detail

### Bundle Size
- Import icons individually from react-icons
- Use dynamic imports for heavy components (charts)
- CSS Modules hoặc Tailwind purge để minimize CSS

### Loading Strategy
- Skeleton loading cho product cards
- Progressive image loading
- Optimistic UI updates
- Prefetch on hover cho product links

## File Structure
```
frontend/src/
├── components/
│   ├── ui/           # New: Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Dropdown.tsx
│   │   └── Modal.tsx
│   ├── common/
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── MegaMenu.tsx
│   │   │   ├── CartPreview.tsx
│   │   │   ├── UserMenu.tsx
│   │   │   └── MobileDrawer.tsx
│   │   ├── Footer.tsx
│   │   ├── Loading.tsx
│   │   └── Toast.tsx
│   └── product/
│       ├── ProductCard.tsx
│       ├── ProductGrid.tsx
│       └── FilterSidebar.tsx
├── styles/
│   └── design-tokens.css  # CSS custom properties
└── lib/
    └── animations.ts      # Framer motion variants
```

## Dependencies to Add
```json
{
  "dependencies": {
    "embla-carousel-react": "^8.0.0",
    "framer-motion": "^11.0.0",
    "recharts": "^2.12.0",
    "@headlessui/react": "^2.0.0"
  }
}
```

**Rationale:**
- `embla-carousel-react`: Lightweight, performant carousel
- `framer-motion`: Production-ready animation library
- `recharts`: React-based, composable charts
- `@headlessui/react`: Accessible UI primitives (optional, có thể dùng shadcn/ui)
