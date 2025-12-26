# Product Reviews Capability

## ADDED Requirements

### Requirement: Submit Product Review
The system MUST allow customers who purchased a product to review it.

**Acceptance Criteria:**
- Reviews include: rating (1-5 stars), optional comment
- User must have purchased the product in a delivered order
- User can only review each product once per order
- Rating is required, comment is optional
- Review associates with user_id, product_id, order_id

#### Scenario: Customer submits valid review for purchased product
**Given** user has order ID 10 with status "delivered"  
**And** order contains product ID 5  
**And** user has not yet reviewed product 5 from order 10  
**When** user submits review with rating = 4 and comment = "Good quality"  
**Then** review record is created  
**And** review.user_id = current user  
**And** review.product_id = 5  
**And** review.order_id = 10  
**And** review.rating = 4  
**And** review.comment = "Good quality"  
**And** HTTP status 201 is returned

#### Scenario: User cannot review product not purchased
**Given** user has no orders containing product ID 8  
**When** user attempts to submit review for product 8  
**Then** creation fails with "You must purchase this product to review it" error  
**And** HTTP status 403 is returned

#### Scenario: User cannot review product from pending order
**Given** user has order with status "pending" containing product ID 5  
**When** user attempts to submit review for product 5  
**Then** creation fails with "Can only review products from delivered orders" error  
**And** HTTP status 403 is returned

#### Scenario: Prevent duplicate review for same product in same order
**Given** user already reviewed product ID 5 from order ID 10  
**When** user attempts to submit another review for product 5 from order 10  
**Then** creation fails with "You already reviewed this product" error  
**And** HTTP status 400 is returned

#### Scenario: Invalid rating value
**Given** user attempts to submit review with rating = 6  
**When** the request is processed  
**Then** creation fails with "Rating must be between 1 and 5" error  
**And** HTTP status 400 is returned

#### Scenario: Submit review without comment
**Given** user has purchased product ID 5  
**When** user submits review with rating = 5 and no comment  
**Then** review is created with empty comment  
**And** HTTP status 201 is returned

### Requirement: View Product Reviews
The system MUST allow users to view reviews for products.

**Acceptance Criteria:**
- Reviews listed for each product
- Include reviewer name (full_name), rating, comment, created_at
- Support pagination (default 10 reviews per page)
- Sort by date (newest first)
- Calculate and display average rating
- Display total review count

#### Scenario: View reviews for product
**Given** product ID 5 has 15 reviews  
**When** user requests reviews for product 5  
**Then** the first 10 reviews are returned (page 1)  
**And** each review includes: user full_name, rating, comment, created_at  
**And** average rating is calculated  
**And** total count = 15  
**And** HTTP status 200 is returned

#### Scenario: View reviews with pagination
**Given** product has 25 reviews  
**When** user requests page 2 with limit 10  
**Then** reviews 11-20 are returned  
**And** HTTP status 200 is returned

#### Scenario: View reviews for product with no reviews
**Given** product ID 8 has no reviews  
**When** user requests reviews for product 8  
**Then** empty reviews array is returned  
**And** average rating = 0  
**And** total count = 0  
**And** HTTP status 200 is returned

#### Scenario: Calculate average rating
**Given** product has reviews with ratings: 5, 4, 5, 3, 4  
**When** reviews are retrieved  
**Then** average rating = 4.2  
**And** HTTP status 200 is returned

### Requirement: Update Review
The system MUST allow users to edit their own reviews.

**Acceptance Criteria:**
- Users can update rating and comment
- Users can only update their own reviews
- Cannot update review of another user

#### Scenario: User updates own review
**Given** user has review ID 20  
**When** user updates rating to 5 and comment to "Excellent after using longer"  
**Then** review.rating = 5  
**And** review.comment = "Excellent after using longer"  
**And** review.updated_at = current timestamp  
**And** HTTP status 200 is returned

#### Scenario: User cannot update another user's review
**Given** review ID 30 belongs to user B  
**And** user A is authenticated  
**When** user A attempts to update review 30  
**Then** update fails with 403 Forbidden  
**And** error message "Not authorized to update this review" is returned

#### Scenario: Update review rating only
**Given** user has review ID 20 with rating 3 and comment "Good"  
**When** user updates rating to 4 without changing comment  
**Then** review.rating = 4  
**And** review.comment remains "Good"  
**And** HTTP status 200 is returned

### Requirement: Delete Review
The system MUST allow users to delete their own reviews.

**Acceptance Criteria:**
- Users can delete their own reviews
- Users cannot delete other users' reviews
- Admins can delete any review

#### Scenario: User deletes own review
**Given** user has review ID 25  
**When** user requests to delete review 25  
**Then** the review is deleted from database  
**And** HTTP status 200 is returned

#### Scenario: User cannot delete another user's review
**Given** review ID 35 belongs to user B  
**And** user A is authenticated  
**When** user A attempts to delete review 35  
**Then** deletion fails with 403 Forbidden  
**And** error message "Not authorized to delete this review" is returned

#### Scenario: Admin deletes any review
**Given** admin user  
**And** review ID 40 exists  
**When** admin deletes review 40  
**Then** the review is deleted  
**And** HTTP status 200 is returned

### Requirement: Review Purchase Verification
The system MUST verify user purchased product before allowing review.

**Acceptance Criteria:**
- Check user has order with product
- Order must be in "delivered" status
- Query joins orders, order_items, products to verify
- Return clear error if verification fails

#### Scenario: Verify user purchased product
**Given** user ID 10 has delivered order containing product ID 5  
**When** system verifies purchase for review submission  
**Then** verification passes  
**And** review creation proceeds

#### Scenario: User never ordered product
**Given** user ID 10 has no orders containing product ID 8  
**When** system verifies purchase  
**Then** verification fails  
**And** error "You must purchase this product to review it" is returned

#### Scenario: User ordered but not yet delivered
**Given** user has order with status "shipping" containing product ID 5  
**When** system verifies purchase  
**Then** verification fails  
**And** error "Can only review products from delivered orders" is returned

### Requirement: Review Display on Product Page
Reviews MUST be integrated into product detail view.

**Acceptance Criteria:**
- Product API includes average rating and review count
- Frontend displays reviews on product detail page
- Show average rating prominently (e.g., star display)
- Provide link to write review for eligible users

#### Scenario: Product API includes review stats
**Given** product ID 5 has 10 reviews with average 4.5 stars  
**When** user requests product details for product 5  
**Then** response includes average_rating = 4.5  
**And** response includes review_count = 10  
**And** HTTP status 200 is returned

#### Scenario: Product with no reviews
**Given** product ID 8 has no reviews  
**When** user requests product details  
**Then** response includes average_rating = 0  
**And** response includes review_count = 0  
**And** HTTP status 200 is returned

### Requirement: Review Sorting and Filtering
The system MUST allow users to sort and filter reviews.

**Acceptance Criteria:**
- Sort by: date (newest/oldest), rating (highest/lowest)
- Filter by rating (e.g., show only 5-star reviews)
- Default sort: newest first

#### Scenario: Sort reviews by highest rating
**Given** product has reviews with various ratings  
**When** user requests reviews sorted by rating descending  
**Then** reviews are returned with 5-star reviews first, then 4-star, etc.  
**And** HTTP status 200 is returned

#### Scenario: Filter reviews by rating
**Given** product has reviews with ratings 5, 4, 3, 5, 2  
**When** user filters by rating = 5  
**Then** only reviews with rating 5 are returned  
**And** HTTP status 200 is returned

#### Scenario: Default sort is newest first
**Given** product has multiple reviews  
**When** user requests reviews without sort parameter  
**Then** reviews are sorted by created_at descending  
**And** HTTP status 200 is returned
