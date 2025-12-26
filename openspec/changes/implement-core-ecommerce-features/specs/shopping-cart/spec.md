# Shopping Cart Capability

## ADDED Requirements

### Requirement: Cart Initialization
Each authenticated user MUST have a unique shopping cart.

**Acceptance Criteria:**
- Cart is automatically created on first use
- One cart per user (unique constraint)
- Cart persists across sessions
- Cart includes user_id reference

#### Scenario: Auto-create cart on first item addition
**Given** an authenticated user with no existing cart  
**When** the user adds their first product to cart  
**Then** a new cart is created for the user  
**And** the product is added to the cart  
**And** HTTP status 201 is returned

#### Scenario: Retrieve existing cart
**Given** a user with an existing cart  
**When** the user requests their cart  
**Then** the existing cart with all items is returned  
**And** HTTP status 200 is returned

#### Scenario: Unauthenticated user cannot access cart
**Given** a user is not authenticated  
**When** the user attempts to access cart  
**Then** the request is rejected with 401 Unauthorized

### Requirement: Add Items to Cart
The system MUST allow users to add product variants to their shopping cart.

**Acceptance Criteria:**
- Add product by variant_id and quantity
- Validate variant exists and has sufficient stock
- Store current price at time of adding (price snapshot)
- If item already exists in cart, update quantity instead of creating duplicate
- Quantity must be positive integer
- Cannot exceed available stock

#### Scenario: Add new item to cart
**Given** an authenticated user with a cart  
**And** a product variant with stock_quantity = 10  
**When** user adds that variant with quantity = 2  
**Then** a cart_item is created with quantity = 2  
**And** current product price is saved in cart_item  
**And** HTTP status 201 is returned

#### Scenario: Add existing item to cart
**Given** a cart already contains variant ID 5 with quantity 2  
**When** user adds variant ID 5 with quantity 3  
**Then** the existing cart_item quantity is updated to 5  
**And** HTTP status 200 is returned

#### Scenario: Add item with insufficient stock
**Given** a product variant with stock_quantity = 3  
**When** user attempts to add quantity = 5  
**Then** the request fails with "Insufficient stock" error  
**And** HTTP status 400 is returned

#### Scenario: Add item with invalid quantity
**Given** a user attempts to add item with quantity = 0  
**When** the request is processed  
**Then** the request fails with "Quantity must be at least 1" error  
**And** HTTP status 400 is returned

#### Scenario: Add non-existent variant
**Given** variant ID 999 does not exist  
**When** user attempts to add it to cart  
**Then** the request fails with "Product variant not found" error  
**And** HTTP status 404 is returned

### Requirement: Update Cart Item Quantity
The system MUST allow users to change the quantity of items in their cart.

**Acceptance Criteria:**
- Update quantity by cart_item_id
- New quantity must be positive
- Validate against available stock
- Setting quantity to 0 removes the item
- Cannot update items from another user's cart

#### Scenario: Update item quantity to valid amount
**Given** a cart_item with quantity = 2  
**And** variant stock_quantity = 10  
**When** user updates quantity to 5  
**Then** cart_item quantity is updated to 5  
**And** HTTP status 200 is returned

#### Scenario: Update quantity exceeding stock
**Given** a cart_item with quantity = 2  
**And** variant stock_quantity = 4  
**When** user updates quantity to 6  
**Then** update fails with "Insufficient stock" error  
**And** HTTP status 400 is returned

#### Scenario: Set quantity to zero removes item
**Given** a cart_item with quantity = 3  
**When** user updates quantity to 0  
**Then** the cart_item is deleted from cart  
**And** HTTP status 200 is returned

#### Scenario: User cannot update another user's cart item
**Given** user A is authenticated  
**And** cart_item belongs to user B  
**When** user A attempts to update that cart_item  
**Then** the request fails with 403 Forbidden  
**And** error message "Not authorized to modify this cart" is returned

### Requirement: Remove Items from Cart
The system MUST allow users to remove specific items from their cart.

**Acceptance Criteria:**
- Remove item by cart_item_id
- User can only remove items from their own cart
- Removing non-existent item returns 404

#### Scenario: Remove item from cart
**Given** a cart contains cart_item with ID 10  
**When** user requests to remove cart_item 10  
**Then** the cart_item is deleted  
**And** HTTP status 200 is returned

#### Scenario: Remove non-existent cart item
**Given** cart_item ID 999 does not exist  
**When** user attempts to remove it  
**Then** the request returns 404 Not Found  
**And** error message "Cart item not found" is returned

#### Scenario: User cannot remove another user's cart item
**Given** user A is authenticated  
**And** cart_item belongs to user B  
**When** user A attempts to remove that cart_item  
**Then** the request fails with 403 Forbidden

### Requirement: View Cart Contents
The system MUST allow users to view all items in their cart with details.

**Acceptance Criteria:**
- Return all cart items with product details
- Include product name, variant info (size, color), image, price
- Calculate and return subtotal for each item (price × quantity)
- Calculate and return cart total
- Return empty array if cart is empty
- Sort items by date added (newest first)

#### Scenario: View cart with items
**Given** a cart contains 3 items  
**When** user requests their cart  
**Then** all 3 items are returned  
**And** each item includes product name, variant size/color, image URL, price, quantity  
**And** subtotal is calculated for each item  
**And** cart total is sum of all subtotals  
**And** HTTP status 200 is returned

#### Scenario: View empty cart
**Given** user has a cart with no items  
**When** user requests their cart  
**Then** empty items array is returned  
**And** cart total = 0  
**And** HTTP status 200 is returned

### Requirement: Clear Cart
The system MUST allow users to remove all items from their cart at once.

**Acceptance Criteria:**
- Deletes all cart_items for user's cart
- Cart entity remains (not deleted, only emptied)
- Returns success even if cart already empty

#### Scenario: Clear cart with items
**Given** a cart contains 5 items  
**When** user requests to clear cart  
**Then** all 5 cart_items are deleted  
**And** cart remains but is empty  
**And** HTTP status 200 is returned

#### Scenario: Clear already empty cart
**Given** a cart with no items  
**When** user requests to clear cart  
**Then** the request succeeds with no changes  
**And** HTTP status 200 is returned

### Requirement: Cart Price Consistency
The cart MUST handle price changes between adding items and checkout.

**Acceptance Criteria:**
- Price is snapshot at time of adding to cart (stored in cart_item.price)
- If product price changes after adding to cart, cart shows original price
- User should be notified at checkout if current price differs from cart price
- Price is re-validated during order creation

#### Scenario: Product price changes after adding to cart
**Given** user added product to cart when price was 100000 VND  
**And** product price is later changed to 120000 VND  
**When** user views their cart  
**Then** cart shows the original price 100000 VND  
**And** subtotal is calculated using 100000 VND

#### Scenario: Price validation at checkout
**Given** cart_item price differs from current product price  
**When** user proceeds to checkout  
**Then** order creation uses current product price (not cart price)  
**And** user may be shown price difference notification (frontend responsibility)

### Requirement: Cart Stock Validation
The cart MUST validate stock availability before allowing operations.

**Acceptance Criteria:**
- Check stock before adding item
- Check stock before updating quantity
- Prevent adding more items than available stock
- If stock becomes insufficient (due to other orders), notify user

#### Scenario: Validate stock when adding to cart
**Given** a variant with stock_quantity = 5  
**When** user attempts to add quantity = 6  
**Then** the request fails with "Insufficient stock. Only 5 available" error  
**And** HTTP status 400 is returned

#### Scenario: Validate stock when updating quantity
**Given** cart has item with quantity = 2  
**And** variant stock_quantity = 3  
**When** user updates quantity to 4  
**Then** the request fails with "Insufficient stock. Only 3 available" error  
**And** HTTP status 400 is returned

#### Scenario: Stock becomes unavailable after adding to cart
**Given** user added variant with quantity 5 to cart when stock was 10  
**And** stock is now reduced to 3 (due to other orders)  
**When** user views cart  
**Then** cart displays the item normally (with quantity 5)  
**But** at checkout, validation fails with "Stock no longer available for some items" error
