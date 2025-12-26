# Product Catalog Capability

## ADDED Requirements

### Requirement: Category Management
Admins MUST be able to manage product categories with CRUD operations.

**Acceptance Criteria:**
- Categories have: name, description, slug
- Slug must be unique and URL-friendly
- Only admins can create/update/delete categories
- All users can view categories
- Deleting category with products is restricted

#### Scenario: Admin creates new category
**Given** an authenticated admin user  
**When** the admin submits category data (name, description, slug)  
**Then** a new category is created in database  
**And** the category data is returned  
**And** HTTP status 201 is returned

#### Scenario: Create category with duplicate slug
**Given** a category with slug "ao-thun" already exists  
**When** admin attempts to create category with same slug  
**Then** creation fails with "Slug already exists" error  
**And** HTTP status 400 is returned

#### Scenario: Admin updates category
**Given** an existing category  
**When** admin updates category fields  
**Then** the category is updated in database  
**And** HTTP status 200 is returned

#### Scenario: Admin deletes category without products
**Given** a category with no associated products  
**When** admin requests to delete the category  
**Then** the category is deleted  
**And** HTTP status 200 is returned

#### Scenario: Attempt to delete category with products
**Given** a category that has associated products  
**When** admin attempts to delete the category  
**Then** deletion fails with "Cannot delete category with existing products" error  
**And** HTTP status 400 is returned

#### Scenario: List all categories
**Given** multiple categories exist  
**When** any user requests category list  
**Then** all categories are returned  
**And** HTTP status 200 is returned

### Requirement: Product Creation and Management
Admins MUST be able to create and manage products with variants and images.

**Acceptance Criteria:**
- Products have: name, description, price, discount_price, category_id, slug
- Each product can have multiple variants (size, color, stock)
- Each product can have multiple images (at least one must be primary)
- Slug must be unique
- Price must be positive
- Only admins can create/update/delete products
- Deleting product cascades to variants and images

#### Scenario: Admin creates product with variants and images
**Given** an authenticated admin user  
**When** admin submits product data with variants and image URLs  
**Then** product record is created  
**And** all variants are created with unique SKUs  
**And** all images are associated with product  
**And** exactly one image is marked as primary  
**And** HTTP status 201 is returned

#### Scenario: Create product without variants
**Given** admin submits product without any variants  
**When** the create request is processed  
**Then** creation fails with "Product must have at least one variant" error  
**And** HTTP status 400 is returned

#### Scenario: Create product without primary image
**Given** admin submits product with multiple images but none marked as primary  
**When** the create request is processed  
**Then** the first image is automatically set as primary  
**And** product is created successfully

#### Scenario: Admin updates product information
**Given** an existing product  
**When** admin updates product fields (name, description, price)  
**Then** the product is updated in database  
**And** updated data is returned  
**And** HTTP status 200 is returned

#### Scenario: Admin adds new variant to existing product
**Given** an existing product  
**When** admin adds a new variant (size, color, stock)  
**Then** the variant is created with unique SKU  
**And** variant is associated with the product  
**And** HTTP status 201 is returned

#### Scenario: Admin deletes product
**Given** an existing product with variants and images  
**When** admin requests to delete the product  
**Then** the product is deleted  
**And** all associated variants are deleted (cascade)  
**And** all associated images are deleted (cascade)  
**And** HTTP status 200 is returned

### Requirement: Product Listing and Filtering
The system MUST allow users to browse products with pagination and filters.

**Acceptance Criteria:**
- Products listed with pagination (default: 20 per page)
- Filter by category
- Filter by price range (min/max)
- Search by product name
- Sort by: newest, price (low to high), price (high to low)
- Only active products shown to customers
- Response includes total count for pagination

#### Scenario: List products with default pagination
**Given** 50 products exist in database  
**When** user requests product list without pagination params  
**Then** the first 20 products are returned  
**And** response includes total count = 50  
**And** HTTP status 200 is returned

#### Scenario: List products with pagination
**Given** 50 products exist  
**When** user requests page 2 with limit 20  
**Then** products 21-40 are returned  
**And** HTTP status 200 is returned

#### Scenario: Filter products by category
**Given** products in multiple categories  
**When** user filters by category_id = 1  
**Then** only products with category_id = 1 are returned  
**And** HTTP status 200 is returned

#### Scenario: Filter products by price range
**Given** products with various prices  
**When** user filters with min_price = 100000 and max_price = 500000  
**Then** only products within that price range are returned  
**And** HTTP status 200 is returned

#### Scenario: Search products by name
**Given** products with names containing "áo thun"  
**When** user searches with query "thun"  
**Then** products matching "thun" in name are returned  
**And** search is case-insensitive  
**And** HTTP status 200 is returned

#### Scenario: Combine multiple filters
**Given** products in database  
**When** user applies category filter AND price range AND search query  
**Then** products matching ALL criteria are returned  
**And** HTTP status 200 is returned

#### Scenario: Sort products by price ascending
**Given** multiple products  
**When** user requests sort by price ascending  
**Then** products are returned ordered by price low to high  
**And** HTTP status 200 is returned

### Requirement: Product Detail Retrieval
The system MUST allow users to view detailed product information including variants and images.

**Acceptance Criteria:**
- Product details include all fields
- All variants with stock quantities included
- All images returned with primary image indicator
- Category information included
- Average rating included (if reviews exist)
- Inactive products return 404 for customers (admins can still view)

#### Scenario: Get product by ID
**Given** a product with ID 123 exists  
**When** user requests GET /api/products/123  
**Then** full product details are returned  
**And** all variants are included  
**And** all images are included  
**And** category name is included  
**And** HTTP status 200 is returned

#### Scenario: Get product by slug
**Given** a product with slug "ao-thun-basic"  
**When** user requests GET /api/products/slug/ao-thun-basic  
**Then** full product details are returned  
**And** HTTP status 200 is returned

#### Scenario: Get inactive product as customer
**Given** a product with is_active = false  
**When** a customer requests the product  
**Then** the request returns 404 Not Found  
**And** error message "Product not found" is returned

#### Scenario: Get inactive product as admin
**Given** a product with is_active = false  
**When** an admin requests the product  
**Then** full product details are returned (admins can view inactive products)  
**And** HTTP status 200 is returned

#### Scenario: Get non-existent product
**Given** no product with ID 999 exists  
**When** user requests GET /api/products/999  
**Then** HTTP status 404 is returned  
**And** error message "Product not found" is returned

### Requirement: Product Image Management
Admins MUST be able to upload and manage product images.

**Acceptance Criteria:**
- Support image upload via multipart/form-data
- Validate file type: jpeg, jpg, png only
- Validate file size: max 10MB per file
- Store files in /uploads/products/ directory
- Generate unique filename to prevent collisions
- Return image URL after successful upload
- Allow setting primary image
- Allow deleting images

#### Scenario: Upload product image
**Given** an authenticated admin  
**When** admin uploads a valid image file for product  
**Then** the file is validated (type and size)  
**And** the file is saved to /uploads/products/ with unique name  
**And** database record created with image_url  
**And** image URL is returned  
**And** HTTP status 201 is returned

#### Scenario: Upload invalid file type
**Given** admin attempts to upload a .pdf file  
**When** the upload request is processed  
**Then** upload fails with "Invalid file type" error  
**And** HTTP status 400 is returned

#### Scenario: Upload oversized image
**Given** admin uploads an image larger than 10MB  
**When** the upload request is processed  
**Then** upload fails with "File too large" error  
**And** HTTP status 400 is returned

#### Scenario: Set primary image
**Given** a product with multiple images  
**When** admin sets image ID 5 as primary  
**Then** image 5 is marked is_primary = true  
**And** all other images for that product are marked is_primary = false  
**And** HTTP status 200 is returned

#### Scenario: Delete product image
**Given** a product image exists  
**When** admin deletes the image  
**Then** the database record is deleted  
**And** the file is deleted from filesystem  
**And** HTTP status 200 is returned

### Requirement: Product Variant Stock Management
The system MUST track inventory levels for each product variant.

**Acceptance Criteria:**
- Each variant has stock_quantity field
- Stock is unique per size/color combination
- Stock is decremented when order is placed
- Stock is restored when order is cancelled
- Prevent negative stock
- SKU (Stock Keeping Unit) must be unique

#### Scenario: Create variant with stock quantity
**Given** admin creates a product variant  
**When** stock_quantity is provided  
**Then** variant is created with that stock level  
**And** unique SKU is generated  
**And** HTTP status 201 is returned

#### Scenario: Update variant stock
**Given** a variant with stock_quantity = 50  
**When** admin updates stock to 75  
**Then** stock_quantity is updated to 75  
**And** HTTP status 200 is returned

#### Scenario: Prevent duplicate variant for same product
**Given** a variant with size M and color Red exists for product ID 1  
**When** admin attempts to create another variant with size M and color Red for product ID 1  
**Then** creation fails with "Variant already exists for this product" error  
**And** HTTP status 400 is returned

#### Scenario: Ensure unique SKU
**Given** a variant with SKU "PROD-001-M-RED"  
**When** admin attempts to create another variant with same SKU  
**Then** creation fails with "SKU already exists" error  
**And** HTTP status 400 is returned
