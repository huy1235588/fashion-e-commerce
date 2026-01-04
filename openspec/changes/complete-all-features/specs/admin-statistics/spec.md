# Admin Statistics Specification

## ADDED Requirements

### Requirement: Dashboard Overview Statistics
The admin panel MUST display key business metrics on the dashboard.

#### Scenario: View dashboard summary
**Given** an admin user accesses the dashboard  
**When** the dashboard page loads  
**Then** the following metrics are displayed:
  - Total revenue (all time)
  - Total orders count
  - Total customers count
  - Total products count
  - Revenue today
  - Orders today
  - Pending orders count

#### Scenario: Calculate total revenue
**Given** there are completed orders with total amounts 1000000, 500000, 750000 VND  
**When** the system calculates total revenue  
**Then** the result is 2250000 VND  
**And** only orders with status "delivered" are counted  
**And** cancelled orders are excluded

### Requirement: Revenue Analytics
The admin panel MUST provide revenue statistics by time period.

#### Scenario: Get revenue by date range
**Given** admin selects date range from 2023-12-01 to 2023-12-31  
**When** the system retrieves revenue data  
**Then** revenue is aggregated by day for the selected period  
**And** each day shows total revenue from delivered orders  
**And** days without orders show 0 revenue  
**And** results are sorted by date ascending

#### Scenario: View monthly revenue
**Given** admin selects "Monthly" period  
**When** the system retrieves monthly revenue  
**Then** revenue is aggregated by month for the current year  
**And** each month shows total revenue from delivered orders  
**And** results include month name and total amount

#### Scenario: View yearly revenue
**Given** admin selects "Yearly" period  
**When** the system retrieves yearly revenue  
**Then** revenue is aggregated by year  
**And** shows revenue comparison across multiple years  
**And** results are sorted by year descending

### Requirement: Product Performance Analytics
The admin panel MUST show top-selling products and category performance.

#### Scenario: Get top-selling products
**Given** multiple products have been sold  
**When** admin requests top 10 selling products  
**Then** products are ranked by total quantity sold  
**And** the list includes product name, total quantity, and total revenue  
**And** only products from delivered orders are counted  
**And** maximum 10 products are returned

#### Scenario: View product with no sales
**Given** a product has never been ordered  
**When** top products are calculated  
**Then** the product does not appear in the top products list  
**And** products with 0 sales are excluded

#### Scenario: Get revenue by category
**Given** products belong to different categories (Men, Women, Accessories)  
**When** admin requests category revenue  
**Then** revenue is aggregated by category  
**And** each category shows total revenue and order count  
**And** categories are sorted by revenue descending

### Requirement: Order Statistics
The admin panel MUST display order statistics and trends.

#### Scenario: Get order count by status
**Given** orders exist with various statuses  
**When** the system retrieves order statistics  
**Then** orders are counted for each status:
  - Pending: count
  - Processing: count
  - Shipping: count
  - Delivered: count
  - Cancelled: count  
**And** percentages are calculated for each status

#### Scenario: Calculate average order value
**Given** delivered orders with amounts 500000, 1000000, 750000 VND  
**When** the system calculates average order value  
**Then** the result is 750000 VND  
**And** only delivered orders are included in calculation

### Requirement: Customer Analytics
The admin panel MUST track customer growth and engagement.

#### Scenario: Get customer growth by month
**Given** new customers registered in different months  
**When** admin requests customer growth  
**Then** customers are counted by registration month  
**And** each month shows new customer count  
**And** results cover the last 12 months  
**And** months are sorted chronologically

#### Scenario: Get total customers
**Given** the database has 150 registered customers  
**When** the dashboard loads  
**Then** the total customer count is 150  
**And** all customers are counted regardless of status

#### Scenario: Get active customers
**Given** some customers have is_active = true and others false  
**When** the system counts active customers  
**Then** only customers with is_active = true are counted  
**And** inactive customers are excluded

### Requirement: Statistics Performance
The statistics queries MUST be optimized for performance.

#### Scenario: Load dashboard within acceptable time
**Given** the database contains thousands of orders and products  
**When** admin accesses the dashboard  
**Then** all statistics load within 3 seconds  
**And** queries use proper database indexes  
**And** aggregations are performed at database level

#### Scenario: Handle concurrent statistics requests
**Given** multiple admin users access dashboard simultaneously  
**When** statistics are calculated  
**Then** each request is handled independently  
**And** database queries do not lock tables  
**And** all users receive results within acceptable time
