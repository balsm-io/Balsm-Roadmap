# Payment & Checkout Routing Strategy

**Balsm Healthcare Platform - Payment Processing & Billing**

---

## Overview

This document defines the routing strategy for payment processing, billing, and checkout flows across the Balsm Healthcare Platform.

---

## Payment Domains

### Primary Payment Routes (Integrated)

```
API:     api.balsm.health/v1/billing/payments/*
Portal:  portal.balsm.health/billing/pay/*
         portal.balsm.health/checkout/*
```

### Optional Dedicated Payment Domain

```
pay.balsm.health                        # Payment processing hub
checkout.balsm.health                   # Checkout flows
secure.balsm.health                     # Secure payment pages
```

**Recommendation**: Start with integrated payment routes, add dedicated subdomain only for high-volume or multi-product scenarios.

---

## Payment Routes

### Patient/Caregiver Portal (`portal.balsm.health/billing`)

```
# Invoices & Bills
/billing/invoices                       # List invoices
/billing/invoices/{invoiceId}           # Invoice details
/billing/invoices/{invoiceId}/pay       # Pay invoice
/billing/invoices/{invoiceId}/download  # Download invoice PDF

# Payment Methods
/billing/payment-methods                # Manage payment methods
/billing/payment-methods/add            # Add payment method
/billing/payment-methods/{methodId}/edit # Edit payment method
/billing/payment-methods/{methodId}/delete # Delete payment method
/billing/payment-methods/{methodId}/default # Set as default

# Payment History
/billing/payments                       # Payment history
/billing/payments/{paymentId}           # Payment details
/billing/payments/{paymentId}/receipt   # Download receipt

# Checkout
/checkout                               # Checkout landing
/checkout/appointment                   # Pay for appointment
/checkout/prescription                  # Pay for prescription
/checkout/lab-order                     # Pay for lab order
/checkout/imaging                       # Pay for imaging
/checkout/invoice/{invoiceId}           # Pay specific invoice
/checkout/donation                      # Make donation
/checkout/subscription                  # Subscribe to add-on

# Checkout Steps
/checkout/review                        # Review order
/checkout/payment                       # Enter payment details
/checkout/confirm                       # Confirm payment
/checkout/success                       # Payment success
/checkout/failed                        # Payment failed

# Insurance
/billing/insurance                      # Insurance management
/billing/insurance/policies             # List insurance policies
/billing/insurance/policies/add         # Add insurance policy
/billing/insurance/claims               # View claims
/billing/insurance/claims/{claimId}     # Claim details

# Subscriptions (Add-Ons)
/billing/subscriptions                  # Manage subscriptions
/billing/subscriptions/{subId}          # Subscription details
/billing/subscriptions/{subId}/cancel   # Cancel subscription
/billing/subscriptions/{subId}/upgrade  # Upgrade subscription
/billing/subscriptions/{subId}/downgrade # Downgrade subscription

# Payment Plans
/billing/payment-plans                  # View payment plans
/billing/payment-plans/{planId}         # Payment plan details
/billing/payment-plans/{planId}/pay     # Make payment plan installment

# Refunds & Disputes
/billing/refunds                        # Refund requests
/billing/refunds/{refundId}             # Refund details
/billing/disputes                       # Payment disputes
/billing/disputes/{disputeId}           # Dispute details
```

---

### Charitable Donations (`/charitable-donations`)

```
# Donation Flow
/charitable-donations/cases             # Browse cases
/charitable-donations/cases/{slug}      # Case details
/charitable-donations/cases/{slug}/donate # Donate to case

# Donation Checkout
/checkout/donation/{caseId}             # Donation checkout
/checkout/donation/{caseId}/amount      # Select amount
/checkout/donation/{caseId}/payment     # Payment details
/checkout/donation/{caseId}/success     # Donation success

# Donation History
/donations/my-donations                 # My donations
/donations/{donationId}                 # Donation details
/donations/{donationId}/receipt         # Tax receipt
/donations/{donationId}/certificate     # Donation certificate

# Recurring Donations
/donations/recurring                    # Manage recurring donations
/donations/recurring/{id}/cancel        # Cancel recurring donation
/donations/recurring/{id}/update        # Update amount/frequency
```

---

## API Payment Endpoints (`api.balsm.health/v1/billing`)

### Payments API

```
# Payment Processing
POST   /v1/billing/payments                    # Create payment
GET    /v1/billing/payments                    # List payments
GET    /v1/billing/payments/{paymentId}        # Get payment
POST   /v1/billing/payments/{paymentId}/refund # Refund payment
POST   /v1/billing/payments/{paymentId}/cancel # Cancel payment

# Payment Methods
GET    /v1/billing/payment-methods             # List payment methods
POST   /v1/billing/payment-methods             # Add payment method
GET    /v1/billing/payment-methods/{methodId}  # Get payment method
PATCH  /v1/billing/payment-methods/{methodId}  # Update payment method
DELETE /v1/billing/payment-methods/{methodId}  # Delete payment method
POST   /v1/billing/payment-methods/{methodId}/default # Set as default

# Checkout Sessions (Stripe-style)
POST   /v1/billing/checkout/sessions           # Create checkout session
GET    /v1/billing/checkout/sessions/{sessionId} # Get session
POST   /v1/billing/checkout/sessions/{sessionId}/complete # Complete checkout

# Payment Intents (Stripe-style)
POST   /v1/billing/payment-intents             # Create payment intent
GET    /v1/billing/payment-intents/{intentId}  # Get intent
POST   /v1/billing/payment-intents/{intentId}/confirm # Confirm payment
POST   /v1/billing/payment-intents/{intentId}/cancel # Cancel payment

# Invoices
GET    /v1/billing/invoices                    # List invoices
GET    /v1/billing/invoices/{invoiceId}        # Get invoice
POST   /v1/billing/invoices                    # Create invoice
PATCH  /v1/billing/invoices/{invoiceId}        # Update invoice
POST   /v1/billing/invoices/{invoiceId}/finalize # Finalize invoice
POST   /v1/billing/invoices/{invoiceId}/send   # Send invoice email
POST   /v1/billing/invoices/{invoiceId}/pay    # Pay invoice
GET    /v1/billing/invoices/{invoiceId}/pdf    # Download PDF

# Subscriptions (Add-Ons)
GET    /v1/billing/subscriptions               # List subscriptions
POST   /v1/billing/subscriptions               # Create subscription
GET    /v1/billing/subscriptions/{subId}       # Get subscription
PATCH  /v1/billing/subscriptions/{subId}       # Update subscription
POST   /v1/billing/subscriptions/{subId}/cancel # Cancel subscription
POST   /v1/billing/subscriptions/{subId}/pause  # Pause subscription
POST   /v1/billing/subscriptions/{subId}/resume # Resume subscription

# Payment Plans
GET    /v1/billing/payment-plans               # List payment plans
POST   /v1/billing/payment-plans               # Create payment plan
GET    /v1/billing/payment-plans/{planId}      # Get plan
PATCH  /v1/billing/payment-plans/{planId}      # Update plan
POST   /v1/billing/payment-plans/{planId}/pay  # Make installment payment

# Refunds
POST   /v1/billing/refunds                     # Create refund
GET    /v1/billing/refunds                     # List refunds
GET    /v1/billing/refunds/{refundId}          # Get refund

# Disputes
GET    /v1/billing/disputes                    # List disputes
GET    /v1/billing/disputes/{disputeId}        # Get dispute
POST   /v1/billing/disputes/{disputeId}/respond # Respond to dispute

# Insurance Claims
GET    /v1/billing/claims                      # List claims
POST   /v1/billing/claims                      # Submit claim
GET    /v1/billing/claims/{claimId}            # Get claim
PATCH  /v1/billing/claims/{claimId}            # Update claim

# Wallet & Balance
GET    /v1/billing/wallet                      # Get wallet balance
POST   /v1/billing/wallet/topup                # Top up wallet
POST   /v1/billing/wallet/withdraw             # Withdraw from wallet
GET    /v1/billing/wallet/transactions         # Wallet transactions
```

---

## Payment Flows

### Standard Invoice Payment Flow

```
1. User views invoice: portal.balsm.health/billing/invoices/12345
2. User clicks "Pay Now"
3. Redirect to: portal.balsm.health/checkout/invoice/12345

Checkout Steps:
4. Review invoice details (amount, line items)
5. Select payment method or add new:
   - Credit/Debit Card
   - Saved card
   - Insurance (if applicable)
   - Wallet balance
   - Payment plan

6. If new card:
   - Use Stripe Elements (PCI-compliant iframe)
   - Card tokenized by Stripe (never touches Balsm servers)

7. POST /v1/billing/payments
   {
     "invoiceId": "12345",
     "paymentMethodId": "pm_abc123",
     "amount": 5000,
     "currency": "EGP"
   }

8. Backend creates Stripe Payment Intent
9. Stripe processes payment
10. Webhook: Stripe notifies Balsm of success/failure
11. Redirect to: portal.balsm.health/checkout/success?payment=pay_xyz789
12. Display receipt with download option
```

---

### Appointment Payment Flow

```
1. User books appointment (may require copay)
2. System calculates cost (base fee + insurance copay)
3. Redirect to: portal.balsm.health/checkout/appointment?appointmentId=67890

Checkout Flow:
4. Show cost breakdown:
   - Consultation fee: 200 EGP
   - Copay (if insurance): 50 EGP
   - Total: 250 EGP

5. Check insurance coverage:
   - POST /v1/billing/insurance/check-eligibility
   - Display coverage details

6. Select payment method
7. Process payment
8. Confirm appointment booking
9. Redirect to success page with appointment confirmation
```

---

### Donation Payment Flow

```
1. User visits: charitable-donations/cases/heart-surgery-for-ahmed
2. User clicks "Donate Now"
3. Redirect to: checkout/donation/{caseId}

Donation Steps:
4. Select donation amount:
   - Predefined: 100, 500, 1000, 5000 EGP
   - Custom amount

5. Optional: Make recurring (monthly/yearly)
6. Optional: Anonymous donation
7. Select payment method
8. Process payment
9. Success page with:
   - Thank you message
   - Donation receipt
   - Tax certificate (if applicable)
   - Social sharing options (QR code)

10. Send confirmation email
11. Update case funding progress
```

---

### Add-On Subscription Flow (Marketplace)

```
1. User views add-on: marketplace/addons/advanced-analytics-pro
2. User clicks "Subscribe"
3. Redirect to: checkout/subscription?addonId=analytics-pro

Subscription Flow:
4. Show pricing:
   - Monthly: $49/month
   - Yearly: $490/year (save 16%)

5. Select billing period
6. Select payment method (must support recurring)
7. Create subscription:
   POST /v1/billing/subscriptions
   {
     "addonId": "analytics-pro",
     "plan": "yearly",
     "paymentMethodId": "pm_abc123"
   }

8. Stripe creates subscription + invoice
9. First payment processed immediately
10. Future payments automated
11. Success page + email confirmation
12. Add-on activated
```

---

## Payment Methods

### Supported Payment Types

**Credit/Debit Cards** (via Stripe)
```
- Visa
- Mastercard
- American Express
- Mada (Saudi Arabia)
- Meeza (Egypt)
```

**Digital Wallets**
```
- Apple Pay
- Google Pay
- Samsung Pay
```

**Bank Transfers** (Region-Specific)
```
- Fawry (Egypt) - Instant bank transfer
- STC Pay (Saudi Arabia)
- Bank transfer (manual reconciliation)
```

**Cash On Delivery** (Pharmacy/Clinic)
```
- Pay at pharmacy when picking up prescription
- Pay at clinic reception
```

**Insurance**
```
- Direct billing to insurance
- Copay collection
- Claims submission
```

**Wallet/Credits**
```
- Prepaid wallet balance
- Promotional credits
- Refund credits
```

---

## Payment Gateway Integration

### Stripe Integration (Recommended Primary)

**Why Stripe:**
✅ Best API documentation
✅ PCI DSS Level 1 compliant
✅ Strong fraud detection (Stripe Radar)
✅ Supports subscriptions
✅ Supports Middle East (EGP, SAR, AED)
✅ SCA (Strong Customer Authentication) support
✅ Webhooks for async updates

**Stripe Products to Use:**
- **Stripe Checkout**: Hosted payment page (easiest, PCI-compliant)
- **Stripe Elements**: Embedded card form (custom UI)
- **Stripe Connect**: For marketplace (pay to add-on developers)
- **Stripe Billing**: Subscription management

**Key Endpoints:**
```javascript
// Create Payment Intent
const paymentIntent = await stripe.paymentIntents.create({
  amount: 5000, // 50.00 EGP (amount in cents)
  currency: 'egp',
  payment_method_types: ['card'],
  metadata: {
    invoiceId: '12345',
    patientId: 'patient-abc'
  }
});

// Create Checkout Session (hosted page)
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'egp',
      product_data: {
        name: 'Appointment Consultation',
      },
      unit_amount: 20000, // 200.00 EGP
    },
    quantity: 1,
  }],
  mode: 'payment',
  success_url: 'https://portal.balsm.health/checkout/success?session_id={CHECKOUT_SESSION_ID}',
  cancel_url: 'https://portal.balsm.health/checkout/cancel',
});
```

---

### Regional Payment Gateway (Middle East)

**PayTabs** (Egypt, Saudi Arabia, UAE)
```yaml
Coverage: 150+ countries

Benefits:
- Local payment methods (Mada, Meeza, STC Pay)
- Arabic UI
- Local support
- Good for MENA region

Integration:
- REST API
- Hosted payment page
- Mobile SDKs

Fees:
- 2.9% + 1 SAR per transaction
```

**HyperPay** (Middle East)
```yaml
Coverage: 40+ countries

Benefits:
- Strong in MENA
- Supports local cards
- Fraud detection
- Recurring billing

Integration:
- REST API
- White-label checkout
- Mobile SDKs
```

**Fawry** (Egypt Instant Payment)
```yaml
Popular in Egypt for instant bank transfers

Benefits:
- No credit card needed
- Instant confirmation
- QR code payment
- Pay at Fawry kiosks

Use Case:
- Users without credit cards
- Cash-preferred customers
```

---

### Recommended Multi-Gateway Strategy

**Primary**: Stripe (global cards, subscriptions)
**Secondary**: PayTabs or HyperPay (MENA local payment methods)
**Tertiary**: Fawry (Egypt cash/bank transfer)

**Routing Logic:**
```
1. Check user location & payment method
2. Route to appropriate gateway:
   - International card → Stripe
   - Mada card (Saudi) → PayTabs
   - Fawry (Egypt) → Fawry API
   - Insurance → Direct billing flow

3. Fallback to Stripe if primary fails
```

---

## Webhook Handling

### Stripe Webhooks

**Endpoint**: `POST /api/webhooks/stripe`

**Events to Handle:**
```javascript
{
  // Payment succeeded
  "payment_intent.succeeded": (data) => {
    // Update invoice as paid
    // Send receipt email
    // Activate service
  },

  // Payment failed
  "payment_intent.payment_failed": (data) => {
    // Notify user
    // Retry logic
  },

  // Subscription created
  "customer.subscription.created": (data) => {
    // Activate add-on
    // Send welcome email
  },

  // Subscription cancelled
  "customer.subscription.deleted": (data) => {
    // Deactivate add-on
    // Send cancellation email
  },

  // Invoice paid
  "invoice.paid": (data) => {
    // Mark invoice as paid
    // Send receipt
  },

  // Refund issued
  "charge.refunded": (data) => {
    // Update payment status
    // Notify user
  }
}
```

**Webhook Security:**
```javascript
// Verify Stripe signature
const sig = request.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(
  request.body,
  sig,
  process.env.STRIPE_WEBHOOK_SECRET
);
```

---

## Payment Security & PCI Compliance

### PCI DSS Compliance Strategy

**Level**: PCI DSS SAQ A (Stripe hosted fields)

**How to Achieve:**
1. **Never store card data** - Use Stripe tokenization
2. **Use Stripe Elements** - PCI-compliant card input fields
3. **HTTPS only** - All payment pages served over TLS 1.2+
4. **Secure webhooks** - Validate Stripe signatures
5. **Log access** - Audit all payment transactions

**Card Data Flow (PCI-Compliant):**
```
1. User enters card on Balsm page
2. Card data goes directly to Stripe (via Stripe.js)
3. Stripe returns token: tok_abc123
4. Balsm sends token to backend (NOT card number)
5. Backend uses token to create payment
6. Card number never touches Balsm servers ✅
```

### 3D Secure (SCA - Strong Customer Authentication)

**Required in:**
- Europe (PSD2)
- Middle East (increasingly required)

**Stripe Handles Automatically:**
```javascript
// Stripe automatically triggers 3DS when needed
const paymentIntent = await stripe.paymentIntents.create({
  amount: 5000,
  currency: 'egp',
  payment_method: 'pm_abc123',
  confirm: true,
  return_url: 'https://portal.balsm.health/checkout/return'
});

// If 3DS required:
// → Stripe redirects user to bank's 3DS page
// → User authenticates (SMS code, biometric)
// → Bank redirects back to return_url
// → Payment completes
```

---

## Refund & Dispute Handling

### Refund Flow

**User Requests Refund:**
```
1. User navigates to: billing/payments/{paymentId}
2. User clicks "Request Refund"
3. POST /v1/billing/refunds
   {
     "paymentId": "pay_12345",
     "amount": 5000, // Full or partial
     "reason": "Service not provided"
   }

4. Admin reviews refund request
5. Admin approves/denies
6. If approved:
   - POST to Stripe: stripe.refunds.create()
   - Refund processed (5-10 business days)
   - User notified

7. Update payment status to "refunded"
```

**Automatic Refunds:**
- Cancelled appointments (if policy allows)
- Duplicate charges (detected by system)
- Service errors (clinical records not accessible)

---

### Dispute Handling (Chargebacks)

**When User Disputes Payment:**
```
1. Stripe webhook: charge.dispute.created
2. Balsm receives notification
3. Admin investigates:
   - Check service was provided
   - Gather evidence (appointment records, prescriptions)

4. Submit evidence to Stripe:
   POST /v1/billing/disputes/{disputeId}/respond
   {
     "evidence": {
       "serviceDate": "2026-03-21",
       "serviceDescription": "Consultation with Dr. Smith",
       "receiptUrl": "https://...",
       "customerCommunication": "Email confirmation sent"
     }
   }

5. Stripe forwards to card issuer
6. Card issuer rules in favor of merchant or customer
7. If merchant wins: Payment retained
8. If customer wins: Payment refunded (+ dispute fee)
```

**Preventing Disputes:**
- Clear billing descriptors
- Send receipts immediately
- Customer service contact on receipts
- Proactive refund for legitimate issues

---

## Subscription Management

### Subscription Lifecycle

**Create Subscription:**
```
POST /v1/billing/subscriptions
{
  "addonId": "analytics-pro",
  "plan": "monthly",
  "paymentMethodId": "pm_abc123"
}

Response:
{
  "id": "sub_xyz789",
  "status": "active",
  "currentPeriodStart": "2026-03-21T00:00:00Z",
  "currentPeriodEnd": "2026-04-21T00:00:00Z",
  "nextPaymentDate": "2026-04-21T00:00:00Z",
  "amount": 4900,
  "currency": "usd"
}
```

**Cancel Subscription:**
```
POST /v1/billing/subscriptions/sub_xyz789/cancel

Options:
- Immediate cancellation (user loses access now)
- End of period (user retains access until period end)
```

**Upgrade/Downgrade:**
```
PATCH /v1/billing/subscriptions/sub_xyz789
{
  "plan": "yearly" // Upgrade from monthly to yearly
}

Stripe Behavior:
- Prorate charges
- Adjust next billing date
- Issue credit/charge difference
```

**Failed Payment Retry:**
```
1. Stripe attempts charge on renewal date
2. If fails (insufficient funds, expired card):
   - Retry after 3 days
   - Retry after 5 days
   - Retry after 7 days
3. If all retries fail:
   - Subscription cancelled
   - User notified via email
   - Grace period (7 days) to update payment method
```

---

## Invoice Management

### Invoice Creation

**Automatic Invoicing:**
- After appointment completion
- After lab result delivered
- After prescription dispensed
- Monthly subscription renewal

**Manual Invoicing (Admin):**
```
POST /v1/billing/invoices
{
  "patientId": "patient-12345",
  "lineItems": [
    {
      "description": "Consultation - Dr. Smith",
      "amount": 20000,
      "quantity": 1
    },
    {
      "description": "Lab Test - CBC",
      "amount": 15000,
      "quantity": 1
    }
  ],
  "dueDate": "2026-04-21",
  "notes": "Payment due within 30 days"
}
```

### Invoice States

```
draft → finalized → sent → paid/unpaid → overdue → cancelled/refunded
```

**State Transitions:**
- `draft`: Editable, not sent to patient
- `finalized`: Locked, ready to send
- `sent`: Email sent to patient
- `paid`: Payment received
- `unpaid`: Past due date
- `overdue`: Overdue + late fees (if applicable)
- `cancelled`: Voided invoice
- `refunded`: Payment refunded

---

## Payment Analytics & Reporting

### Key Metrics Dashboard

**For Admin (`admin.balsm.health/billing/analytics`):**
```
- Total revenue (daily, weekly, monthly, yearly)
- Payment success rate
- Average transaction value
- Payment method distribution (card, wallet, insurance)
- Refund rate
- Chargeback rate
- Outstanding invoices (AR aging)
- Subscription MRR (Monthly Recurring Revenue)
- Subscription churn rate
```

### Financial Reports

```
/billing/reports/revenue                # Revenue report
/billing/reports/transactions           # Transaction report
/billing/reports/refunds                # Refunds report
/billing/reports/ar-aging               # Accounts receivable aging
/billing/reports/insurance-claims       # Insurance claims report
/billing/reports/subscriptions          # Subscription report
/billing/reports/tax                    # Tax report (for VAT/sales tax)
```

**Export Formats:**
- PDF
- CSV
- Excel
- QuickBooks integration (future)

---

## Implementation Roadmap

### Phase 1: Foundation (Month 1)
- ✅ Stripe integration (cards only)
- ✅ Basic invoice generation
- ✅ Single payment flow (pay invoice)
- ✅ Payment method management
- ✅ Receipt generation

### Phase 2: Core Features (Month 2)
- Appointment payment flow
- Prescription payment flow
- Lab/imaging payment flow
- Donation payment flow
- Insurance integration (basic)
- Payment plans

### Phase 3: Advanced Features (Month 3)
- Subscription management (add-ons)
- Regional payment gateways (PayTabs, Fawry)
- Apple Pay / Google Pay
- Refund management
- Dispute handling
- Wallet/credits system

### Phase 4: Optimization (Month 4)
- Failed payment retry logic
- Automatic late fee calculation
- Advanced analytics dashboard
- Bulk invoicing
- Accounting system integration (QuickBooks, Xero)
- Multi-currency support

---

## Related Documentation

- [api-routing-strategy.md](./api-routing-strategy.md) — API endpoint definitions (Billing & Finance context)
- [authentication-routing-strategy.md](./authentication-routing-strategy.md) — Authentication for payment flows
- [subdomain-route-mapping.md](./subdomain-route-mapping.md) — Quick reference mapping

---

*Last updated: 2026-03-21*
