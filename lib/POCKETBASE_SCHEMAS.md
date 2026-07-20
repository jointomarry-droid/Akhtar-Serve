# PocketBase Collection Schemas

This document defines all collection schemas for Akhtar-Serve PocketBase integration.

## Table of Contents

1. [Users Collection](#users-collection)
2. [Organizations Collection](#organizations-collection)
3. [Organization Members](#organization-members)
4. [Products Collection](#products-collection)
5. [Product Variants](#product-variants)
6. [Product Media](#product-media)
7. [Product Listings](#product-listings)
8. [Orders Collection](#orders-collection)
9. [Order Items](#order-items)
10. [Order Fulfillments](#order-fulfillments)
11. [Order Returns](#order-returns)
12. [Inventory Collection](#inventory-collection)
13. [Inventory Locations](#inventory-locations)
14. [Inventory Adjustments](#inventory-adjustments)
15. [Pricing Rules](#pricing-rules)
16. [Integrations](#integrations)
17. [Integration Logs](#integration-logs)
18. [Daily Metrics](#daily-metrics)
19. [Analytics Events](#analytics-events)
20. [Chat Conversations](#chat-conversations)
21. [Chat Messages](#chat-messages)
22. [Notifications](#notifications)
23. [Audit Logs](#audit-logs)
24. [API Keys](#api-keys)

---

## Users Collection

**Collection Name:** `users`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| username | text | yes | Unique username |
| email | email | yes | User email (unique) |
| name | text | no | Full name |
| avatar | file | no | Profile picture |
| role | select | yes | User role (OWNER, ADMIN, MANAGER, MEMBER, VIEWER) |
| status | select | yes | Account status (ACTIVE, INACTIVE, SUSPENDED, PENDING_VERIFICATION) |
| organizationId | relation | no | Linked organization |
| phone | text | no | Phone number |
| lastLogin | date | no | Last login timestamp |
| verified | bool | yes | Email verified status |
| providers | json | no | Auth providers used |

---

## Organizations Collection

**Collection Name:** `organizations`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | text | yes | Organization name |
| slug | text | yes | URL-friendly identifier |
| logo | file | no | Company logo |
| plan | select | yes | Subscription plan (FREE, STARTER, PROFESSIONAL, ENTERPRISE) |
| ownerId | text | yes | Owner user ID |
| settings | json | no | Organization settings |
| website | url | no | Company website |
| industry | text | no | Industry type |
| employeeCount | number | no | Number of employees |
| address | json | no | Organization address |

---

## Organization Members

**Collection Name:** `org_members`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| organizationId | relation | yes | Parent organization |
| userId | relation | yes | Member user |
| role | select | yes | Member role |
| status | select | yes | Membership status (ACTIVE, INVITED, SUSPENDED) |
| invitedBy | relation | no | Who invited this member |
| joinedAt | date | yes | When member joined |

---

## Products Collection

**Collection Name:** `products`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| orgId | relation | yes | Parent organization |
| name | text | yes | Product name |
| sku | text | yes | Stock Keeping Unit |
| barcode | text | no | Product barcode (UPC, EAN, ISBN) |
| description | text | no | Product description |
| brand | text | no | Brand name |
| category | text | no | Product category |
| status | select | yes | Product status (DRAFT, ACTIVE, INACTIVE, ARCHIVED) |
| costPrice | number | no | Cost price |
| imageUrl | url | no | Primary image URL |
| weight | number | no | Product weight |
| weightUnit | select | no | Weight unit (kg, lb, oz, g) |
| dimensions | json | no | Product dimensions |
| tags | json | no | Product tags array |
| metadata | json | no | Additional metadata |

**Indexes:**
- `orgId` (ascending)
- `sku` (unique per org)
- `status` (ascending)
- `name` (full-text search)

---

## Product Variants

**Collection Name:** `product_variants`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| productId | relation | yes | Parent product |
| name | text | yes | Variant name (e.g., "Red / Large") |
| sku | text | yes | Variant SKU |
| barcode | text | no | Variant barcode |
| price | number | yes | Selling price |
| compareAtPrice | number | no | Original/compare price |
| costPrice | number | no | Cost price |
| inventoryQuantity | number | yes | Current stock level |
| options | json | yes | Variant options (e.g., {color: "red", size: "L"}) |
| imageUrl | url | no | Variant image |
| weight | number | no | Variant weight |
| isDefault | bool | yes | Is this the default variant |
| status | select | yes | Variant status (ACTIVE, INACTIVE) |

---

## Product Media

**Collection Name:** `product_media`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| productId | relation | yes | Parent product |
| variantId | relation | no | Linked variant (optional) |
| type | select | yes | Media type (IMAGE, VIDEO, DOCUMENT) |
| url | url | yes | Media URL |
| filename | text | yes | Original filename |
| size | number | yes | File size in bytes |
| alt | text | no | Alt text for accessibility |
| sortOrder | number | yes | Display order |
| isPrimary | bool | yes | Is this the primary media |

---

## Product Listings

**Collection Name:** `product_listings`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| productId | relation | yes | Parent product |
| variantId | relation | no | Linked variant |
| marketplace | select | yes | Marketplace (AMAZON, EBAY) |
| marketplaceId | text | yes | Marketplace seller ID |
| listingId | text | yes | Marketplace listing ID |
| title | text | yes | Listing title |
| description | text | no | Listing description |
| price | number | yes | Listing price |
| currency | text | yes | Currency code (USD, EUR, etc.) |
| status | select | yes | Listing status |
| url | url | no | Listing URL |
| lastSyncedAt | date | no | Last sync timestamp |
| syncStatus | select | yes | Sync status (SYNCED, PENDING, ERROR) |
| marketplaceData | json | no | Additional marketplace data |

---

## Orders Collection

**Collection Name:** `orders`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| orgId | relation | yes | Parent organization |
| marketplace | select | yes | Marketplace (AMAZON, EBAY) |
| marketplaceOrderId | text | yes | Marketplace order ID |
| status | select | yes | Order status |
| customerEmail | text | no | Customer email |
| customerName | text | no | Customer name |
| shippingAddress | json | no | Shipping address |
| billingAddress | json | no | Billing address |
| subtotal | number | yes | Subtotal amount |
| tax | number | yes | Tax amount |
| shippingCost | number | yes | Shipping cost |
| total | number | yes | Total amount |
| currency | text | yes | Currency code |
| paymentMethod | text | no | Payment method |
| paymentStatus | select | yes | Payment status |
| fulfillmentStatus | select | yes | Fulfillment status |
| notes | text | no | Order notes |
| metadata | json | no | Additional metadata |
| orderedAt | date | yes | When order was placed |
| shippedAt | date | no | When order was shipped |
| deliveredAt | date | no | When order was delivered |

**Indexes:**
- `orgId` (ascending)
- `marketplaceOrderId` (unique)
- `status` (ascending)
- `orderedAt` (descending)

---

## Order Items

**Collection Name:** `order_items`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| orderId | relation | yes | Parent order |
| productId | relation | yes | Product |
| variantId | relation | no | Product variant |
| name | text | yes | Item name |
| sku | text | yes | Item SKU |
| quantity | number | yes | Quantity ordered |
| unitPrice | number | yes | Unit price |
| total | number | yes | Line total |
| marketplaceItemId | text | no | Marketplace item ID |
| metadata | json | no | Additional metadata |

---

## Order Fulfillments

**Collection Name:** `order_fulfillments`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| orderId | relation | yes | Parent order |
| status | select | yes | Fulfillment status |
| carrier | text | no | Shipping carrier |
| trackingNumber | text | no | Tracking number |
| trackingUrl | url | no | Tracking URL |
| estimatedDelivery | date | no | Estimated delivery date |
| shippedAt | date | no | Ship date |
| deliveredAt | date | no | Delivery date |
| items | json | yes | Array of order item IDs |

---

## Order Returns

**Collection Name:** `order_returns`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| orderId | relation | yes | Parent order |
| status | select | yes | Return status (PENDING, APPROVED, REJECTED, COMPLETED) |
| reason | text | yes | Return reason |
| items | json | yes | Return items array |
| refundAmount | number | no | Refund amount |
| notes | text | no | Return notes |

---

## Inventory Collection

**Collection Name:** `inventory`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| productId | relation | yes | Product |
| variantId | relation | no | Product variant |
| locationId | relation | yes | Storage location |
| quantity | number | yes | Current quantity |
| reserved | number | yes | Reserved quantity |
| available | number | yes | Available quantity (computed) |
| reorderPoint | number | no | Reorder threshold |
| reorderQuantity | number | no | Quantity to reorder |
| unitCost | number | no | Unit cost |
| lastCountedAt | date | no | Last inventory count |
| lastAdjustmentAt | date | no | Last adjustment |

---

## Inventory Locations

**Collection Name:** `inventory_locations`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| orgId | relation | yes | Parent organization |
| name | text | yes | Location name |
| type | select | yes | Location type (WAREHOUSE, STORE, SUPPLIER, OTHER) |
| address | json | no | Location address |
| isActive | bool | yes | Is location active |
| priority | number | yes | Priority for fulfillment |

---

## Inventory Adjustments

**Collection Name:** `inventory_adjustments`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| inventoryId | relation | yes | Parent inventory record |
| type | select | yes | Adjustment type (INCREASE, DECREASE, SET, RESERVE, UNRESERVE) |
| quantity | number | yes | Adjustment quantity |
| reason | text | yes | Adjustment reason |
| reference | text | no | Reference ID (order, purchase, etc.) |
| notes | text | no | Additional notes |
| performedBy | relation | yes | User who made adjustment |

---

## Pricing Rules

**Collection Name:** `pricing_rules`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| orgId | relation | yes | Parent organization |
| productId | relation | no | Specific product (optional) |
| name | text | yes | Rule name |
| type | select | yes | Rule type (COMPETITOR, MARGIN, VELOCITY, TIME_BASED, BUNDLE) |
| conditions | json | yes | Rule conditions |
| action | json | yes | Rule action |
| isActive | bool | yes | Is rule active |
| priority | number | yes | Rule priority (higher = more priority) |
| lastApplied | date | no | Last time rule was applied |

---

## Integrations

**Collection Name:** `integrations`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| orgId | relation | yes | Parent organization |
| type | select | yes | Integration type (AMAZON, EBAY, SHOPIFY, WOO, CUSTOM) |
| name | text | yes | Integration name |
| status | select | yes | Integration status |
| config | json | yes | Configuration settings |
| credentials | json | yes | Encrypted credentials |
| lastSyncAt | date | no | Last sync timestamp |
| syncStatus | select | yes | Sync status |
| errorMessage | text | no | Last error message |

---

## Integration Logs

**Collection Name:** `integration_logs`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| integrationId | relation | yes | Parent integration |
| action | text | yes | Action performed |
| status | select | yes | Log status (SUCCESS, ERROR, WARNING) |
| request | json | no | Request data |
| response | json | no | Response data |
| duration | number | no | Request duration in ms |
| errorMessage | text | no | Error message |

---

## Daily Metrics

**Collection Name:** `daily_metrics`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| orgId | relation | yes | Parent organization |
| date | text | yes | Date (YYYY-MM-DD) |
| marketplace | text | yes | Marketplace name |
| revenue | number | yes | Total revenue |
| orders | number | yes | Total orders |
| units | number | yes | Units sold |
| returns | number | yes | Returns count |
| refunds | number | yes | Refund amount |
| fees | number | yes | Marketplace fees |
| profit | number | yes | Net profit |
| conversionRate | number | no | Conversion rate |
| views | number | no | Product views |
| sessions | number | no | Sessions count |

---

## Analytics Events

**Collection Name:** `analytics_events`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| orgId | relation | yes | Parent organization |
| userId | relation | no | User who triggered event |
| event | text | yes | Event name |
| properties | json | no | Event properties |
| timestamp | date | yes | Event timestamp |

---

## Chat Conversations

**Collection Name:** `chat_conversations`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| orgId | relation | yes | Parent organization |
| userId | relation | yes | Conversation owner |
| title | text | no | Conversation title |
| status | select | yes | Status (ACTIVE, ARCHIVED) |
| lastMessageAt | date | no | Last message timestamp |
| messageCount | number | yes | Total messages |

---

## Chat Messages

**Collection Name:** `chat_messages`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| conversationId | relation | yes | Parent conversation |
| role | select | yes | Message role (USER, ASSISTANT, SYSTEM) |
| content | text | yes | Message content |
| tokens | number | no | Token count |
| model | text | no | AI model used |
| metadata | json | no | Additional metadata |

---

## Notifications

**Collection Name:** `notifications`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | relation | yes | Recipient user |
| orgId | relation | no | Related organization |
| type | select | yes | Notification type (INFO, SUCCESS, WARNING, ERROR) |
| title | text | yes | Notification title |
| message | text | yes | Notification message |
| read | bool | yes | Is read |
| actionUrl | url | no | Action URL |
| metadata | json | no | Additional metadata |

---

## Audit Logs

**Collection Name:** `audit_logs`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| orgId | relation | yes | Parent organization |
| userId | relation | yes | User who performed action |
| action | text | yes | Action performed |
| entity | text | yes | Entity type |
| entityId | text | yes | Entity ID |
| changes | json | no | Change details |
| metadata | json | no | Additional metadata |
| ipAddress | text | no | IP address |
| userAgent | text | no | User agent |

---

## API Keys

**Collection Name:** `api_keys`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | relation | yes | Key owner |
| orgId | relation | yes | Parent organization |
| name | text | yes | Key name |
| key | text | yes | API key (hashed) |
| permissions | json | yes | Allowed permissions |
| expiresAt | date | no | Expiration date |
| lastUsedAt | date | no | Last used timestamp |
| isActive | bool | yes | Is key active |

---

## PocketBase Admin Setup

### Create Collections via Admin UI

1. Start PocketBase: `./pocketbase serve`
2. Open admin: `http://localhost:8090/_/`
3. Create each collection using the schemas above

### Import Collections via API

Use the PocketBase management API to create collections programmatically.

### Recommended Order for Creation

1. `users` (auth collection)
2. `organizations`
3. `org_members`
4. `products`
5. `product_variants`
6. `product_media`
7. `product_listings`
8. `orders`
9. `order_items`
10. `order_fulfillments`
11. `order_returns`
12. `inventory_locations`
13. `inventory`
14. `inventory_adjustments`
15. `pricing_rules`
16. `integrations`
17. `integration_logs`
18. `daily_metrics`
19. `analytics_events`
20. `chat_conversations`
21. `chat_messages`
22. `notifications`
23. `audit_logs`
24. `api_keys`

---

## Security Rules

### Collection Rules

Each collection should have appropriate access rules:

```javascript
// Example: Products collection rules
{
  "viewRule": "orgId = @request.auth.orgId",
  "createRule": "orgId = @request.auth.orgId && (@request.auth.role = 'OWNER' || @request.auth.role = 'ADMIN')",
  "updateRule": "orgId = @request.auth.orgId && (@request.auth.role = 'OWNER' || @request.auth.role = 'ADMIN' || @request.auth.role = 'MANAGER')",
  "deleteRule": "orgId = @request.auth.orgId && (@request.auth.role = 'OWNER' || @request.auth.role = 'ADMIN')"
}
```

### API Rules

- Users can only view/update their own profile
- Organization members can view organization data
- Only admins/owners can create/update/delete
- All writes are logged to audit_logs
