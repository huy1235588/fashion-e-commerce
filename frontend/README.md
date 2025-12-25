# Fashion E-Commerce Frontend

Next.js 16.1.1 + TypeScript frontend cho Fashion E-Commerce.

## Yêu cầu

-   Node.js 18+ và npm/yarn
-   Backend API đang chạy tại `http://localhost:8080`

## Cài đặt

```bash
# Cài đặt dependencies
npm install

# Hoặc dùng yarn
yarn install
```

## Cấu hình

Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_UPLOAD_URL=http://localhost:8080/uploads
```

## Chạy ứng dụng

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

Ứng dụng sẽ chạy tại: http://localhost:3000

## Cấu trúc thư mục

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Route group - Auth pages
│   │   ├── login/
│   │   └── register/
│   ├── products/          # Products pages
│   ├── cart/              # Cart page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
│
├── components/            # React components
│   ├── common/           # Header, Footer, Loading
│   ├── product/          # Product components
│   └── cart/             # Cart components
│
├── lib/                  # Utilities
│   ├── api.ts            # API client (axios)
│   ├── utils.ts          # Helper functions
│   └── constants.ts      # Constants
│
├── services/             # API services
│   ├── auth.service.ts
│   ├── product.service.ts
│   ├── cart.service.ts
│   └── order.service.ts
│
├── types/                # TypeScript types
│   ├── user.ts
│   ├── product.ts
│   ├── cart.ts
│   ├── order.ts
│   └── api.ts
│
├── hooks/                # Custom hooks
│   ├── useAuth.ts
│   └── useCart.ts
│
└── store/                # Zustand stores
    ├── authStore.ts
    └── cartStore.ts
```

## Tính năng đã triển khai

-   ✅ Authentication (Login/Register)
-   ✅ Product listing
-   ✅ Shopping cart management
-   ✅ TypeScript types cho tất cả entities
-   ✅ Zustand state management
-   ✅ API integration với axios
-   ✅ Responsive design với Tailwind CSS

## Tính năng cần phát triển

-   [ ] Product detail page
-   [ ] Checkout flow
-   [ ] Order history
-   [ ] User profile management
-   [ ] Product filtering & search
-   [ ] Admin panel
-   [ ] Payment integration (VNPay/MoMo)

## Tech Stack

-   **Framework**: Next.js 16.1.1 (App Router)
-   **Language**: TypeScript 5+
-   **Styling**: Tailwind CSS
-   **State Management**: Zustand
-   **HTTP Client**: Axios
-   **Image Handling**: Next.js Image Optimization

## Scripts

-   `npm run dev` - Chạy development server
-   `npm run build` - Build production
-   `npm start` - Chạy production server
-   `npm run lint` - Chạy ESLint
-   `npm run type-check` - Kiểm tra TypeScript types
