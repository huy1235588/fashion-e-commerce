# Authentication Capability

## ADDED Requirements

### Requirement: User Registration
The system MUST allow users to create new accounts with email and password.

**Acceptance Criteria:**
- Email must be unique and valid format
- Password must be hashed using bcrypt before storage
- Password minimum length: 8 characters
- Full name and phone are required fields
- New users default to 'customer' role
- Account is active by default

#### Scenario: Successful registration
**Given** a user provides valid registration data (email, password, full_name, phone)  
**When** the registration request is submitted  
**Then** a new user record is created in the database  
**And** the password is hashed with bcrypt  
**And** the user receives their account information (excluding password)  
**And** HTTP status 201 is returned

#### Scenario: Duplicate email registration
**Given** an email already exists in the system  
**When** a user attempts to register with that email  
**Then** registration fails with "Email already registered" error  
**And** HTTP status 400 is returned

#### Scenario: Invalid email format
**Given** a user provides an invalid email format  
**When** the registration request is submitted  
**Then** registration fails with validation error  
**And** HTTP status 400 is returned

### Requirement: User Login
The system MUST allow users to authenticate with email and password to receive a JWT token.

**Acceptance Criteria:**
- Login accepts email and password
- Password verification uses bcrypt.Compare
- Successful login returns JWT token valid for 24 hours
- Token includes user ID, email, and role in claims
- Inactive accounts cannot log in
- Failed login attempts return generic error (no user enumeration)

#### Scenario: Successful login with valid credentials
**Given** a registered user with email "user@example.com" and password "password123"  
**When** the user submits login request with correct credentials  
**Then** the system verifies the password  
**And** a JWT token is generated and returned  
**And** the token includes user_id, email, role in payload  
**And** HTTP status 200 is returned

#### Scenario: Login with incorrect password
**Given** a registered user with email "user@example.com"  
**When** the user submits login request with wrong password  
**Then** login fails with "Invalid credentials" error  
**And** HTTP status 401 is returned

#### Scenario: Login with non-existent email
**Given** an email that doesn't exist in the system  
**When** login request is submitted  
**Then** login fails with "Invalid credentials" error  
**And** HTTP status 401 is returned

#### Scenario: Login with inactive account
**Given** a user account with is_active = false  
**When** login request is submitted  
**Then** login fails with "Account is deactivated" error  
**And** HTTP status 403 is returned

### Requirement: JWT Token Validation
Protected endpoints MUST validate JWT tokens and extract user information.

**Acceptance Criteria:**
- Middleware validates JWT signature
- Expired tokens are rejected (401)
- Missing tokens are rejected (401)
- Invalid tokens are rejected (401)
- Valid tokens attach user context to request
- Token secret loaded from environment variable

#### Scenario: Access protected endpoint with valid token
**Given** a user has a valid JWT token  
**When** the user makes a request to a protected endpoint with the token in Authorization header  
**Then** the middleware validates the token  
**And** user information is extracted and attached to request context  
**And** the request proceeds to the handler

#### Scenario: Access protected endpoint without token
**Given** no token is provided  
**When** a request is made to a protected endpoint  
**Then** the middleware returns 401 Unauthorized  
**And** the request is rejected with "Authorization token required" error

#### Scenario: Access protected endpoint with expired token
**Given** a JWT token that has expired  
**When** a request is made with the expired token  
**Then** the middleware returns 401 Unauthorized  
**And** the request is rejected with "Token expired" error

### Requirement: Role-Based Access Control
Admin-only endpoints MUST be restricted to users with admin role.

**Acceptance Criteria:**
- Middleware checks user role from JWT claims
- Non-admin users are rejected from admin endpoints (403)
- Admin users can access admin endpoints
- Role check happens after JWT validation

#### Scenario: Admin accessing admin endpoint
**Given** a user with role "admin" and valid JWT token  
**When** the user requests an admin-only endpoint  
**Then** the request is allowed to proceed

#### Scenario: Customer accessing admin endpoint
**Given** a user with role "customer" and valid JWT token  
**When** the user requests an admin-only endpoint  
**Then** the middleware returns 403 Forbidden  
**And** the request is rejected with "Admin access required" error

### Requirement: User Profile Management
The system MUST allow users to view and update their profile information.

**Acceptance Criteria:**
- Authenticated users can retrieve their own profile
- Users can update: full_name, phone
- Users cannot update: email, role, password via profile endpoint
- Profile updates validate required fields
- Password changes require separate endpoint

#### Scenario: Get own profile
**Given** an authenticated user  
**When** the user requests GET /api/auth/profile  
**Then** the system returns user data (id, email, full_name, phone, role, created_at)  
**And** password is excluded from response  
**And** HTTP status 200 is returned

#### Scenario: Update profile information
**Given** an authenticated user  
**When** the user submits updated full_name and phone  
**Then** the profile is updated in database  
**And** updated profile data is returned  
**And** HTTP status 200 is returned

### Requirement: Password Reset Flow
The system MUST allow users to reset forgotten passwords via email verification.

**Acceptance Criteria:**
- User requests reset by providing email
- System generates 6-digit verification code
- Code sent to user's email via SMTP
- Code expires after 15 minutes
- User verifies code and sets new password
- Code can only be used once

#### Scenario: Request password reset
**Given** a registered user email  
**When** the user requests password reset  
**Then** a 6-digit code is generated  
**And** the code is sent to the user's email  
**And** the code is stored with expiration timestamp  
**And** HTTP status 200 is returned with message "Reset code sent to email"

#### Scenario: Verify reset code and change password
**Given** a valid reset code sent to user's email  
**When** the user submits the code and new password  
**Then** the system validates the code and expiration  
**And** the new password is hashed and saved  
**And** the reset code is invalidated  
**And** HTTP status 200 is returned

#### Scenario: Use expired reset code
**Given** a reset code that has expired (>15 minutes old)  
**When** the user attempts to use the code  
**Then** the request fails with "Reset code expired" error  
**And** HTTP status 400 is returned

#### Scenario: Use invalid reset code
**Given** an incorrect or non-existent reset code  
**When** the user attempts to use the code  
**Then** the request fails with "Invalid reset code" error  
**And** HTTP status 400 is returned
