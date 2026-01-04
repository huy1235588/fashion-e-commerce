# Backend Utilities Specification

## ADDED Requirements

### Requirement: Email Service Implementation
The system MUST provide email sending capabilities for password reset and order confirmations using Gmail SMTP.

#### Scenario: Send password reset email
**Given** a user requests password reset with email "user@example.com" and reset code "123456"  
**When** the system calls `SendPasswordResetEmail(email, code)`  
**Then** an HTML email with the reset code is sent to the user's email address  
**And** the email subject is in Vietnamese  
**And** the email contains a link to reset password page with the code

#### Scenario: Send order confirmation email
**Given** an order is successfully created with order code "ORD-20231201-001"  
**When** the system calls `SendOrderConfirmationEmail(order)`  
**Then** an HTML email is sent to the customer's email  
**And** the email contains order details (code, items, total, shipping address)  
**And** the email is formatted in Vietnamese

#### Scenario: Handle email sending failure
**Given** SMTP server is unavailable  
**When** the system attempts to send an email  
**Then** the error is logged but does not block the main operation  
**And** the user is not notified of email failure

### Requirement: File Upload Service
The system MUST support image upload for products with validation and optimization.

#### Scenario: Upload valid product image
**Given** a user uploads a JPEG image of 5MB  
**When** the system processes the upload  
**Then** the image is validated for type and size  
**And** the image is compressed to reduce file size  
**And** the image is saved to `uploads/products/{product-id}/` directory  
**And** the image URL is returned to the caller

#### Scenario: Reject invalid file type
**Given** a user uploads a PDF file  
**When** the system validates the upload  
**Then** the upload is rejected with error "Invalid file type. Only JPEG, PNG, WebP allowed"  
**And** no file is saved to disk

#### Scenario: Reject oversized file
**Given** a user uploads an image of 15MB  
**When** the system validates the upload  
**Then** the upload is rejected with error "File size exceeds maximum limit of 10MB"  
**And** no file is saved to disk

#### Scenario: Delete old images when updating
**Given** a product has existing image at "uploads/products/1/old.jpg"  
**When** a new image is uploaded for the same product  
**Then** the old image file is deleted from disk  
**And** the new image is saved  
**And** the product record is updated with new image URL

### Requirement: Input Validation Utilities
The system MUST provide validation helpers for Vietnamese addresses and phone numbers.

#### Scenario: Validate Vietnamese phone number
**Given** a user enters phone number "0123456789"  
**When** the system validates the phone number  
**Then** the validation passes as it matches Vietnamese format  
**And** returns true

#### Scenario: Reject invalid phone number
**Given** a user enters phone number "123"  
**When** the system validates the phone number  
**Then** the validation fails  
**And** returns error "Invalid Vietnamese phone number format"

#### Scenario: Validate price values
**Given** a user enters price "50000"  
**When** the system validates the price  
**Then** the validation passes as it is a positive number  
**And** returns true

#### Scenario: Reject negative price
**Given** a user enters price "-1000"  
**When** the system validates the price  
**Then** the validation fails  
**And** returns error "Price must be a positive number"
