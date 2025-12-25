# Project Context

## Purpose
Fashion E-Commerce is a full-stack e-commerce platform for selling fashion products, built as a graduation thesis project. The system provides comprehensive features for both customers (browsing, shopping, checkout, payment) and administrators (product management, order processing, analytics).

**Key Goals:**
- Build a complete, production-ready e-commerce system
- Demonstrate modern web development practices with Go and React
- Implement secure authentication, payment integration, and order management
- Support Vietnamese market with VNPay/MoMo payment gateways

## Tech Stack

### Backend
- **Language**: Golang 1.21+
- **Framework**: Gin Framework (web framework)
- **ORM**: GORM (PostgreSQL ORM)
- **Authentication**: JWT (JSON Web Token)
- **Email**: SMTP (Gmail)
- **Payment Gateways**: VNPay, MoMo

### Frontend
- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS
- **State Management**: Zustand / React Context API
- **HTTP Client**: Axios / Fetch API
- **UI Components**: Radix UI / shadcn/ui
- **Rendering**: SSR, SSG, and Client-side rendering

### Database
- **Primary Database**: PostgreSQL 15+
- **Key Tables**: users, products, categories, orders, cart, addresses, reviews, payments

### Development Tools
- **Version Control**: Git
- **Package Manager**: Go Modules (backend), npm/yarn (frontend)

## Project Conventions

### Code Style

**Golang:**
- Follow standard Go conventions (gofmt, golint)
- Use snake_case for database columns
- Use camelCase for struct fields with JSON tags
- Package structure: `internal/` for private code, `cmd/` for entry points
- Error handling: Always check errors, use descriptive error messages
- Comments: Use godoc-style comments for exported functions

**TypeScript/Next.js:**
- Use TypeScript for all code (strict mode enabled)
- Use functional components with hooks
- Use PascalCase for component names, interfaces, and types
- Use camelCase for functions and variables
- Follow Tailwind CSS utility-first approach
- Prefer const over let, avoid var
- Use Next.js App Router conventions (Server/Client Components)
- Define proper types for all props, state, and API responses
- Use 'use client' directive only when necessary

**Database:**
- Use lowercase with underscores for table and column names
- Always add indexes for foreign keys and frequently queried columns
- Use timestamp fields: `created_at`, `updated_at`
- Use SERIAL for auto-incrementing primary keys

### Architecture Patterns

**Backend Architecture (Layered):**
```
cmd/server/          → Entry point
internal/
  ├── config/        → Configuration management
  ├── database/      → Database connection
  ├── models/        → Data models (GORM structs)
  ├── repositories/  → Data access layer
  ├── services/      → Business logic layer
  ├── handlers/      → HTTP handlers (controllers)
  ├── middleware/    → Auth, CORS, logging
  └── utils/         → Helper functions
```

**Design Patterns:**
- Repository Pattern: Separate data access from business logic
- Service Layer: Business logic isolated from HTTP handlers
- Middleware: Authentication, authorization, request validation
- Dependency Injection: Pass dependencies through constructors

**Frontend Architecture (Next.js App Router):**
- Component-based architecture with Server/Client Components
- Smart/Container components handle logic
- Dumb/Presentational components for UI
- Zustand or Context API for global state (user, cart)
- Custom hooks for reusable logic
- API services layer for backend communication
- TypeScript types/interfaces in dedicated files
- Route groups for logical organization
- Server Components by default, Client Components when needed

### Testing Strategy
- Unit tests for critical business logic (services, repositories)
- Integration tests for API endpoints
- Manual testing for UI/UX flows
- Test database setup with separate test credentials
- Mock external services (payment gateways, email) in tests

### Git Workflow
- **Branching Strategy**: Feature branches from main
  - `main` → Production-ready code
  - `develop` → Development branch (if needed)
  - `feature/feature-name` → New features
  - `fix/bug-name` → Bug fixes
- **Commit Conventions**: 
  - Use descriptive commit messages
  - Prefix types: `feat:`, `fix:`, `docs:`, `refactor:`, `style:`, `test:`
  - Example: `feat: add product filtering by price range`
- **Pull Requests**: Required for merging to main

## Domain Context

### E-Commerce Business Rules

**User Roles:**
- `customer`: Regular users who can browse and purchase products
- `admin`: Administrative users with full access to management features

**Order Workflow:**
1. Customer adds products to cart (with size/color variants)
2. Customer proceeds to checkout, selects shipping address
3. Customer chooses payment method (COD or online)
4. Order created with status `pending`
5. Admin processes order: `pending` → `processing` → `shipping` → `delivered`
6. Customer can cancel order only when status is `pending`

**Order Statuses:**
- `pending`: Order placed, awaiting confirmation
- `processing`: Order confirmed and being prepared
- `shipping`: Order dispatched for delivery
- `delivered`: Order successfully delivered
- `cancelled`: Order cancelled by customer or admin

**Payment Methods:**
- COD (Cash on Delivery): Payment upon receiving goods
- VNPay: Vietnamese payment gateway
- MoMo: Vietnamese e-wallet

**Product Variants:**
- Products have multiple variants (size, color)
- Each variant has its own stock quantity
- Price can have discount_price for sales

**Reviews:**
- Only customers who purchased a product can review it
- Reviews include rating (1-5 stars) and optional comment

### Vietnamese Localization
- Address format: Province → District → Ward → Detail Address
- Currency: VND (Vietnamese Dong)
- Payment gateways: VNPay, MoMo (local Vietnamese services)

## Important Constraints

### Technical Constraints
- File uploads limited to 10MB (configurable via MAX_UPLOAD_SIZE)
- Uploaded files stored in `./uploads` directory
- JWT tokens expire after 24 hours (configurable)
- PostgreSQL required (no support for other databases)
- Email sending requires Gmail SMTP (app password required)

### Business Constraints
- This is a thesis/educational project, not production deployment
- Focus on core e-commerce features (MVP scope)
- Vietnamese market focused (address format, payment gateways)
- Single-vendor system (no multi-vendor marketplace)

### Security Constraints
- Passwords must be hashed (bcrypt)
- JWT tokens for authentication
- Admin routes protected by role-based middleware
- Input validation on all API endpoints
- SQL injection prevention via GORM parameterized queries

## External Dependencies

### Required Services
- **PostgreSQL Database**: Required for data persistence
- **Gmail SMTP**: Required for sending emails (password reset, order confirmations)
  - Requires app password (not regular Gmail password)
  - SMTP Host: smtp.gmail.com:587
- **VNPay/MoMo**: Payment gateway integration (sandbox for development)

### Development Dependencies
- Go 1.21+ runtime
- Node.js 18+ and npm/yarn
- Git for version control
- Recommended: PostgreSQL GUI tools (pgAdmin, DBeaver)

### Optional Tools
- Postman/Insomnia for API testing
- React DevTools for frontend debugging
- Go debugging tools (Delve)
