# Payment Integration Specification

## REMOVED Requirements

### Requirement: VNPay Payment Gateway Integration
**Status**: REMOVED - Payment integration excluded from project scope. COD (Cash on Delivery) only.

#### Scenario: Exclusion rationale
**Given** the project timeline and scope constraints  
**When** evaluating payment features  
**Then** only COD (Cash on Delivery) payment method is supported  
**And** VNPay integration is excluded from this phase

### Requirement: MoMo E-Wallet Payment Integration  
**Status**: REMOVED - Payment integration excluded from project scope. COD (Cash on Delivery) only.

#### Scenario: MoMo exclusion rationale
**Given** the project timeline and scope constraints  
**When** evaluating payment features  
**Then** only COD (Cash on Delivery) payment method is supported  
**And** MoMo integration is excluded from this phase

### Requirement: Online Payment Transaction Logging
**Status**: REMOVED - Not needed for COD-only implementation.

#### Scenario: Transaction logging exclusion
**Given** only COD payment is supported  
**When** orders are placed  
**Then** standard order logging is sufficient  
**And** dedicated payment transaction logging is not required

### Requirement: Online Payment Gateway Error Handling
**Status**: REMOVED - Not needed for COD-only implementation.

#### Scenario: Payment error handling exclusion
**Given** only COD payment is supported  
**When** orders are placed  
**Then** standard error handling applies  
**And** payment gateway error handling is not required
