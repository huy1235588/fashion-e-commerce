# Address Management Capability

## ADDED Requirements

### Requirement: Create Shipping Address
The system MUST allow users to add shipping addresses to their account.

**Acceptance Criteria:**
- Address includes: full_name, phone, province, district, ward, detail_address
- All fields are required (Vietnamese address format)
- Users can have multiple addresses
- One address can be marked as default
- If user has no addresses, first address is automatically set as default

#### Scenario: Create first address
**Given** user has no existing addresses  
**When** user creates an address with all required fields  
**Then** address is saved to database  
**And** address.is_default = true (automatically set)  
**And** HTTP status 201 is returned

#### Scenario: Create additional address
**Given** user already has 2 addresses  
**When** user creates a new address  
**Then** address is saved  
**And** address.is_default = false (not automatic)  
**And** HTTP status 201 is returned

#### Scenario: Create address with missing required field
**Given** user provides address without province  
**When** create request is submitted  
**Then** creation fails with "Province is required" error  
**And** HTTP status 400 is returned

#### Scenario: Create address with all fields
**Given** user provides: full_name="Nguyen Van A", phone="0901234567", province="TP. HCM", district="Quận 1", ward="Phường Bến Nghé", detail_address="123 Nguyen Hue"  
**When** address is created  
**Then** all fields are saved correctly  
**And** HTTP status 201 is returned

### Requirement: List User Addresses
The system MUST allow users to view all their saved addresses.

**Acceptance Criteria:**
- Return all addresses for authenticated user
- Default address indicated (is_default flag)
- Sorted with default address first
- Include all address fields

#### Scenario: User views their addresses
**Given** user has 3 addresses, one marked as default  
**When** user requests their address list  
**Then** all 3 addresses are returned  
**And** default address is listed first  
**And** each address includes: id, full_name, phone, province, district, ward, detail_address, is_default  
**And** HTTP status 200 is returned

#### Scenario: User with no addresses
**Given** user has no saved addresses  
**When** user requests address list  
**Then** empty array is returned  
**And** HTTP status 200 is returned

### Requirement: Update Address
The system MUST allow users to modify existing addresses.

**Acceptance Criteria:**
- Users can update all address fields
- Users can only update their own addresses
- Cannot update another user's address
- Validation applies to updated fields

#### Scenario: User updates own address
**Given** user has address ID 10  
**When** user updates province to "Hà Nội" and district to "Ba Đình"  
**Then** address.province = "Hà Nội"  
**And** address.district = "Ba Đình"  
**And** HTTP status 200 is returned

#### Scenario: User cannot update another user's address
**Given** address ID 20 belongs to user B  
**And** user A is authenticated  
**When** user A attempts to update address 20  
**Then** update fails with 403 Forbidden  
**And** error message "Not authorized to modify this address" is returned

#### Scenario: Update address with invalid data
**Given** user updates address with empty phone  
**When** update request is processed  
**Then** update fails with "Phone is required" error  
**And** HTTP status 400 is returned

### Requirement: Delete Address
The system MUST allow users to remove addresses from their account.

**Acceptance Criteria:**
- Users can delete their own addresses
- Cannot delete address that is currently set as default (must set another as default first)
- If deleting the only address, deletion is allowed
- Cannot delete another user's address

#### Scenario: Delete non-default address
**Given** user has 3 addresses  
**And** address ID 15 is not default  
**When** user deletes address 15  
**Then** address 15 is deleted from database  
**And** HTTP status 200 is returned

#### Scenario: Delete default address when other addresses exist
**Given** user has 3 addresses  
**And** address ID 10 is the default  
**When** user attempts to delete address 10  
**Then** deletion fails with "Cannot delete default address. Set another address as default first" error  
**And** HTTP status 400 is returned

#### Scenario: Delete only address
**Given** user has only 1 address (which is default)  
**When** user deletes that address  
**Then** address is deleted successfully  
**And** HTTP status 200 is returned

#### Scenario: User cannot delete another user's address
**Given** address ID 25 belongs to user B  
**And** user A is authenticated  
**When** user A attempts to delete address 25  
**Then** deletion fails with 403 Forbidden  
**And** error message "Not authorized to delete this address" is returned

### Requirement: Set Default Address
The system MUST allow users to designate one address as their default.

**Acceptance Criteria:**
- Only one address per user can be default
- Setting new default automatically unsets previous default
- Cannot set another user's address as default for yourself
- Default address is used automatically in checkout

#### Scenario: Set address as default
**Given** user has addresses: ID 10 (default), ID 11, ID 12  
**When** user sets address 11 as default  
**Then** address 10: is_default = false  
**And** address 11: is_default = true  
**And** address 12: is_default = false (unchanged)  
**And** HTTP status 200 is returned

#### Scenario: Set already-default address as default
**Given** address ID 10 is already default  
**When** user sets address 10 as default again  
**Then** no changes occur (idempotent operation)  
**And** HTTP status 200 is returned

#### Scenario: User cannot set another user's address as their default
**Given** address ID 30 belongs to user B  
**And** user A is authenticated  
**When** user A attempts to set address 30 as default  
**Then** request fails with 403 Forbidden  
**And** error message "Not authorized to modify this address" is returned

### Requirement: Address Selection at Checkout
The system MUST require users to select shipping address during order creation.

**Acceptance Criteria:**
- Checkout requires address_id parameter
- Address must belong to the user creating the order
- Address is copied to shipping_addresses table (snapshot)
- Default address can be pre-selected in UI (frontend responsibility)

#### Scenario: Create order with selected address
**Given** user has address ID 10  
**When** user creates order with address_id = 10  
**Then** order is created  
**And** shipping_address record created with data from address 10  
**And** HTTP status 201 is returned

#### Scenario: Create order with another user's address
**Given** address ID 20 belongs to user B  
**And** user A attempts to create order  
**When** user A provides address_id = 20  
**Then** order creation fails with "Address not found or unauthorized" error  
**And** HTTP status 403 is returned

#### Scenario: Create order without address
**Given** user has items in cart  
**When** user creates order without address_id  
**Then** creation fails with "Shipping address required" error  
**And** HTTP status 400 is returned

### Requirement: Vietnamese Address Format Validation
The system MUST enforce Vietnamese address structure.

**Acceptance Criteria:**
- Required fields: province, district, ward, detail_address
- Province must be valid Vietnamese province/city name
- District must be valid within province
- Ward must be valid within district
- Detail address is free text (street number, building)
- Phone number validation (Vietnamese format)

#### Scenario: Validate complete Vietnamese address
**Given** user provides address with province, district, ward, detail_address  
**When** address is created  
**Then** all fields are validated  
**And** address is saved  
**And** HTTP status 201 is returned

#### Scenario: Reject address with missing ward
**Given** user provides address without ward field  
**When** create request is submitted  
**Then** creation fails with "Ward is required" error  
**And** HTTP status 400 is returned

#### Scenario: Validate phone number format
**Given** user provides phone = "0901234567" (valid format)  
**When** address is created  
**Then** validation passes  
**And** address is saved

#### Scenario: Reject invalid phone number
**Given** user provides phone = "123" (invalid format)  
**When** address is created  
**Then** creation fails with "Invalid phone number format" error  
**And** HTTP status 400 is returned

### Requirement: Address Ownership Verification
The system MUST ensure users can only access their own addresses.

**Acceptance Criteria:**
- All address operations check user_id matches authenticated user
- Return 403 Forbidden for unauthorized access
- Admins can view all addresses (for order management)

#### Scenario: User accesses own address
**Given** user A is authenticated  
**And** address ID 10 has user_id = A  
**When** user A requests address 10  
**Then** address details are returned  
**And** HTTP status 200 is returned

#### Scenario: User attempts to access another user's address
**Given** user A is authenticated  
**And** address ID 20 has user_id = B  
**When** user A requests address 20  
**Then** request fails with 403 Forbidden  
**And** error message "Not authorized to access this address" is returned

#### Scenario: Admin views user's address
**Given** admin is authenticated  
**And** address ID 30 belongs to any user  
**When** admin requests address 30 (in context of order management)  
**Then** address details are returned  
**And** HTTP status 200 is returned
