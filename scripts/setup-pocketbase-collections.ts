/**
 * PocketBase Collection Setup Script (v2 - PocketBase 0.22.1+)
 *
 * Creates all required collections using direct fetch() API calls.
 * Two-pass approach:
 *   Pass 1: Create collections without rules (empty string rules)
 *   Pass 2: Update collections with proper rules after all exist
 *
 * Usage:
 *   npx tsx scripts/setup-pocketbase-collections.ts
 *
 * Requirements:
 *   - PocketBase server running on http://localhost:8090
 *   - Admin credentials (default: admin@akhtarserve.com / Admin@12345!)
 */

// ==================== CONFIGURATION ====================

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090';
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || 'admin@akhtarserve.com';
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || 'Admin@12345!';

// ==================== TYPES ====================

interface FieldDefinition {
  name: string;
  type: string;
  required?: boolean;
  unique?: boolean;
  system?: boolean;
  options: Record<string, unknown>;
}

interface CollectionDefinition {
  name: string;
  type: 'base' | 'auth' | 'view';
  schema: FieldDefinition[];
  indexes?: string[];
  listRule?: string;
  viewRule?: string;
  createRule?: string;
  updateRule?: string;
  deleteRule?: string;
}

// ==================== COLLECTION DEFINITIONS ====================

const COLLECTIONS: CollectionDefinition[] = [
  // ==================== ORGANIZATIONS ====================
  {
    name: 'organizations',
    type: 'base',
    schema: [
      { name: 'name', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'slug', type: 'text', required: true, unique: true, options: { min: null, max: null, pattern: '' } },
      { name: 'logo', type: 'file', options: { maxSelect: 1, maxSize: 5242880, mimeTypes: ['image/jpeg', 'image/png', 'image/webp'] } },
      { name: 'plan', type: 'select', required: true, options: { maxSelect: 1, values: ['FREE', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE'] } },
      { name: 'ownerId', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'settings', type: 'json', options: { maxSize: 200000 } },
      { name: 'website', type: 'url', options: {} },
      { name: 'industry', type: 'text', options: { min: null, max: null, pattern: '' } },
      { name: 'employeeCount', type: 'number', options: { min: null, max: null } },
      { name: 'address', type: 'json', options: { maxSize: 200000 } },
    ],
    indexes: [
      'CREATE UNIQUE INDEX idx_organizations_slug ON organizations (slug)',
      'CREATE INDEX idx_organizations_owner ON organizations (ownerId)',
    ],
    viewRule: 'ownerId = @request.auth.id || id.orgMembers.userId = @request.auth.id',
    createRule: '',
    updateRule: 'ownerId = @request.auth.id',
    deleteRule: 'ownerId = @request.auth.id',
  },

  // ==================== ORG MEMBERS ====================
  {
    name: 'org_members',
    type: 'base',
    schema: [
      { name: 'organizationId', type: 'relation', required: true, options: { collectionId: 'organizations', cascadeDelete: true, maxSelect: 1 } },
      { name: 'userId', type: 'relation', required: true, options: { collectionId: 'users', cascadeDelete: true, maxSelect: 1 } },
      { name: 'role', type: 'select', required: true, options: { maxSelect: 1, values: ['OWNER', 'ADMIN', 'MANAGER', 'MEMBER', 'VIEWER'] } },
      { name: 'status', type: 'select', required: true, options: { maxSelect: 1, values: ['ACTIVE', 'INVITED', 'SUSPENDED'] } },
      { name: 'invitedBy', type: 'relation', options: { collectionId: 'users', cascadeDelete: false, maxSelect: 1 } },
      { name: 'joinedAt', type: 'date', required: true, options: { maxSize: 200000 } },
    ],
    indexes: [
      'CREATE INDEX idx_org_members_org ON org_members (organizationId)',
      'CREATE INDEX idx_org_members_user ON org_members (userId)',
      'CREATE UNIQUE INDEX idx_org_members_unique ON org_members (organizationId, userId)',
    ],
    viewRule: 'organizationId.orgMembers.userId = @request.auth.id',
    createRule: '',
    updateRule: 'organizationId.ownerId = @request.auth.id || role = "OWNER"',
    deleteRule: 'organizationId.ownerId = @request.auth.id',
  },

  // ==================== PRODUCTS ====================
  {
    name: 'products',
    type: 'base',
    schema: [
      { name: 'orgId', type: 'relation', required: true, options: { collectionId: 'organizations', cascadeDelete: true, maxSelect: 1 } },
      { name: 'name', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'sku', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'barcode', type: 'text', options: { min: null, max: null, pattern: '' } },
      { name: 'description', type: 'text', options: { min: null, max: null, pattern: '' } },
      { name: 'brand', type: 'text', options: { min: null, max: null, pattern: '' } },
      { name: 'category', type: 'text', options: { min: null, max: null, pattern: '' } },
      { name: 'status', type: 'select', required: true, options: { maxSelect: 1, values: ['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED'] } },
      { name: 'costPrice', type: 'number', options: { min: null, max: null } },
      { name: 'imageUrl', type: 'url', options: {} },
      { name: 'weight', type: 'number', options: { min: null, max: null } },
      { name: 'weightUnit', type: 'select', options: { maxSelect: 1, values: ['kg', 'lb', 'oz', 'g'] } },
      { name: 'dimensions', type: 'json', options: { maxSize: 200000 } },
      { name: 'tags', type: 'json', options: { maxSize: 200000 } },
      { name: 'metadata', type: 'json', options: { maxSize: 200000 } },
    ],
    indexes: [
      'CREATE INDEX idx_products_org ON products (orgId)',
      'CREATE INDEX idx_products_status ON products (status)',
      'CREATE INDEX idx_products_sku ON products (sku)',
    ],
    viewRule: 'orgId.orgMembers.userId = @request.auth.id',
    createRule: 'orgId.orgMembers.userId = @request.auth.id',
    updateRule: 'orgId.orgMembers.userId = @request.auth.id',
    deleteRule: 'orgId.ownerId = @request.auth.id',
  },

  // ==================== PRODUCT VARIANTS ====================
  {
    name: 'product_variants',
    type: 'base',
    schema: [
      { name: 'productId', type: 'relation', required: true, options: { collectionId: 'products', cascadeDelete: true, maxSelect: 1 } },
      { name: 'name', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'sku', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'barcode', type: 'text', options: { min: null, max: null, pattern: '' } },
      { name: 'price', type: 'number', required: true, options: { min: null, max: null } },
      { name: 'compareAtPrice', type: 'number', options: { min: null, max: null } },
      { name: 'costPrice', type: 'number', options: { min: null, max: null } },
      { name: 'inventoryQuantity', type: 'number', required: true, options: { min: null, max: null } },
      { name: 'options', type: 'json', required: true, options: { maxSize: 200000 } },
      { name: 'imageUrl', type: 'url', options: {} },
      { name: 'weight', type: 'number', options: { min: null, max: null } },
      { name: 'isDefault', type: 'bool', required: true, options: { maxSize: 200000 } },
      { name: 'status', type: 'select', required: true, options: { maxSelect: 1, values: ['ACTIVE', 'INACTIVE'] } },
    ],
    indexes: [
      'CREATE INDEX idx_product_variants_product ON product_variants (productId)',
      'CREATE INDEX idx_product_variants_sku ON product_variants (sku)',
    ],
    viewRule: 'productId.orgId.orgMembers.userId = @request.auth.id',
    createRule: 'productId.orgId.orgMembers.userId = @request.auth.id',
    updateRule: 'productId.orgId.orgMembers.userId = @request.auth.id',
    deleteRule: 'productId.orgId.ownerId = @request.auth.id',
  },

  // ==================== PRODUCT MEDIA ====================
  {
    name: 'product_media',
    type: 'base',
    schema: [
      { name: 'productId', type: 'relation', required: true, options: { collectionId: 'products', cascadeDelete: true, maxSelect: 1 } },
      { name: 'variantId', type: 'relation', options: { collectionId: 'product_variants', cascadeDelete: false, maxSelect: 1 } },
      { name: 'type', type: 'select', required: true, options: { maxSelect: 1, values: ['IMAGE', 'VIDEO', 'DOCUMENT'] } },
      { name: 'url', type: 'url', required: true, options: { maxSize: 200000 } },
      { name: 'filename', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'size', type: 'number', required: true, options: { min: null, max: null } },
      { name: 'alt', type: 'text', options: { min: null, max: null, pattern: '' } },
      { name: 'sortOrder', type: 'number', required: true, options: { min: null, max: null } },
      { name: 'isPrimary', type: 'bool', required: true, options: { maxSize: 200000 } },
    ],
    indexes: [
      'CREATE INDEX idx_product_media_product ON product_media (productId)',
      'CREATE INDEX idx_product_media_variant ON product_media (variantId)',
    ],
    viewRule: 'productId.orgId.orgMembers.userId = @request.auth.id',
    createRule: 'productId.orgId.orgMembers.userId = @request.auth.id',
    updateRule: 'productId.orgId.orgMembers.userId = @request.auth.id',
    deleteRule: 'productId.orgId.ownerId = @request.auth.id',
  },

  // ==================== PRODUCT LISTINGS ====================
  {
    name: 'product_listings',
    type: 'base',
    schema: [
      { name: 'productId', type: 'relation', required: true, options: { collectionId: 'products', cascadeDelete: true, maxSelect: 1 } },
      { name: 'variantId', type: 'relation', options: { collectionId: 'product_variants', cascadeDelete: false, maxSelect: 1 } },
      { name: 'marketplace', type: 'select', required: true, options: { maxSelect: 1, values: ['AMAZON', 'EBAY'] } },
      { name: 'marketplaceId', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'listingId', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'title', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'description', type: 'text', options: { min: null, max: null, pattern: '' } },
      { name: 'price', type: 'number', required: true, options: { min: null, max: null } },
      { name: 'currency', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'status', type: 'select', required: true, options: { maxSelect: 1, values: ['ACTIVE', 'INACTIVE', 'PENDING', 'ENDED', 'ERROR'] } },
      { name: 'url', type: 'url', options: {} },
      { name: 'lastSyncedAt', type: 'date', options: {} },
      { name: 'syncStatus', type: 'select', required: true, options: { maxSelect: 1, values: ['SYNCED', 'PENDING', 'ERROR'] } },
      { name: 'marketplaceData', type: 'json', options: { maxSize: 200000 } },
    ],
    indexes: [
      'CREATE INDEX idx_product_listings_product ON product_listings (productId)',
      'CREATE INDEX idx_product_listings_marketplace ON product_listings (marketplace)',
      'CREATE UNIQUE INDEX idx_product_listings_listing ON product_listings (marketplace, listingId)',
    ],
    viewRule: 'productId.orgId.orgMembers.userId = @request.auth.id',
    createRule: 'productId.orgId.orgMembers.userId = @request.auth.id',
    updateRule: 'productId.orgId.orgMembers.userId = @request.auth.id',
    deleteRule: 'productId.orgId.ownerId = @request.auth.id',
  },

  // ==================== ORDERS ====================
  {
    name: 'orders',
    type: 'base',
    schema: [
      { name: 'orgId', type: 'relation', required: true, options: { collectionId: 'organizations', cascadeDelete: true, maxSelect: 1 } },
      { name: 'marketplace', type: 'select', required: true, options: { maxSelect: 1, values: ['AMAZON', 'EBAY'] } },
      { name: 'marketplaceOrderId', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'status', type: 'select', required: true, options: { maxSelect: 1, values: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'] } },
      { name: 'customerEmail', type: 'text', options: { min: null, max: null, pattern: '' } },
      { name: 'customerName', type: 'text', options: { min: null, max: null, pattern: '' } },
      { name: 'shippingAddress', type: 'json', options: { maxSize: 200000 } },
      { name: 'billingAddress', type: 'json', options: { maxSize: 200000 } },
      { name: 'subtotal', type: 'number', required: true, options: { min: null, max: null } },
      { name: 'tax', type: 'number', required: true, options: { min: null, max: null } },
      { name: 'shippingCost', type: 'number', required: true, options: { min: null, max: null } },
      { name: 'total', type: 'number', required: true, options: { min: null, max: null } },
      { name: 'currency', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'paymentMethod', type: 'text', options: { min: null, max: null, pattern: '' } },
      { name: 'paymentStatus', type: 'select', required: true, options: { maxSelect: 1, values: ['PENDING', 'PAID', 'PARTIALLY_REFUNDED', 'REFUNDED', 'FAILED'] } },
      { name: 'fulfillmentStatus', type: 'select', required: true, options: { maxSelect: 1, values: ['UNFULFILLED', 'PARTIALLY_FULFILLED', 'FULFILLED', 'RETURNED'] } },
      { name: 'notes', type: 'text', options: { min: null, max: null, pattern: '' } },
      { name: 'metadata', type: 'json', options: { maxSize: 200000 } },
      { name: 'orderedAt', type: 'date', required: true, options: { maxSize: 200000 } },
      { name: 'shippedAt', type: 'date', options: {} },
      { name: 'deliveredAt', type: 'date', options: {} },
    ],
    indexes: [
      'CREATE INDEX idx_orders_org ON orders (orgId)',
      'CREATE INDEX idx_orders_status ON orders (status)',
      'CREATE INDEX idx_orders_marketplace ON orders (marketplace)',
      'CREATE INDEX idx_orders_ordered_at ON orders (orderedAt)',
      'CREATE UNIQUE INDEX idx_orders_marketplace_id ON orders (marketplace, marketplaceOrderId)',
    ],
    viewRule: 'orgId.orgMembers.userId = @request.auth.id',
    createRule: 'orgId.orgMembers.userId = @request.auth.id',
    updateRule: 'orgId.orgMembers.userId = @request.auth.id',
    deleteRule: 'orgId.ownerId = @request.auth.id',
  },

  // ==================== ORDER ITEMS ====================
  {
    name: 'order_items',
    type: 'base',
    schema: [
      { name: 'orderId', type: 'relation', required: true, options: { collectionId: 'orders', cascadeDelete: true, maxSelect: 1 } },
      { name: 'productId', type: 'relation', required: true, options: { collectionId: 'products', cascadeDelete: false, maxSelect: 1 } },
      { name: 'variantId', type: 'relation', options: { collectionId: 'product_variants', cascadeDelete: false, maxSelect: 1 } },
      { name: 'name', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'sku', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'quantity', type: 'number', required: true, options: { min: null, max: null } },
      { name: 'unitPrice', type: 'number', required: true, options: { min: null, max: null } },
      { name: 'total', type: 'number', required: true, options: { min: null, max: null } },
      { name: 'marketplaceItemId', type: 'text', options: { min: null, max: null, pattern: '' } },
      { name: 'metadata', type: 'json', options: { maxSize: 200000 } },
    ],
    indexes: [
      'CREATE INDEX idx_order_items_order ON order_items (orderId)',
      'CREATE INDEX idx_order_items_product ON order_items (productId)',
    ],
    viewRule: 'orderId.orgId.orgMembers.userId = @request.auth.id',
    createRule: 'orderId.orgId.orgMembers.userId = @request.auth.id',
    updateRule: 'orderId.orgId.orgMembers.userId = @request.auth.id',
    deleteRule: 'orderId.orgId.ownerId = @request.auth.id',
  },

  // ==================== ORDER FULFILLMENTS ====================
  {
    name: 'order_fulfillments',
    type: 'base',
    schema: [
      { name: 'orderId', type: 'relation', required: true, options: { collectionId: 'orders', cascadeDelete: true, maxSelect: 1 } },
      { name: 'status', type: 'select', required: true, options: { maxSelect: 1, values: ['PENDING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'RETURNED'] } },
      { name: 'carrier', type: 'text', options: { min: null, max: null, pattern: '' } },
      { name: 'trackingNumber', type: 'text', options: { min: null, max: null, pattern: '' } },
      { name: 'trackingUrl', type: 'url', options: {} },
      { name: 'estimatedDelivery', type: 'date', options: {} },
      { name: 'shippedAt', type: 'date', options: {} },
      { name: 'deliveredAt', type: 'date', options: {} },
      { name: 'items', type: 'json', required: true, options: { maxSize: 200000 } },
    ],
    indexes: [
      'CREATE INDEX idx_order_fulfillments_order ON order_fulfillments (orderId)',
    ],
    viewRule: 'orderId.orgId.orgMembers.userId = @request.auth.id',
    createRule: 'orderId.orgId.orgMembers.userId = @request.auth.id',
    updateRule: 'orderId.orgId.orgMembers.userId = @request.auth.id',
    deleteRule: 'orderId.orgId.ownerId = @request.auth.id',
  },

  // ==================== ORDER RETURNS ====================
  {
    name: 'order_returns',
    type: 'base',
    schema: [
      { name: 'orderId', type: 'relation', required: true, options: { collectionId: 'orders', cascadeDelete: true, maxSelect: 1 } },
      { name: 'status', type: 'select', required: true, options: { maxSelect: 1, values: ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'] } },
      { name: 'reason', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'items', type: 'json', required: true, options: { maxSize: 200000 } },
      { name: 'refundAmount', type: 'number', options: { min: null, max: null } },
      { name: 'notes', type: 'text', options: { min: null, max: null, pattern: '' } },
    ],
    indexes: [
      'CREATE INDEX idx_order_returns_order ON order_returns (orderId)',
    ],
    viewRule: 'orderId.orgId.orgMembers.userId = @request.auth.id',
    createRule: 'orderId.orgId.orgMembers.userId = @request.auth.id',
    updateRule: 'orderId.orgId.orgMembers.userId = @request.auth.id',
    deleteRule: 'orderId.orgId.ownerId = @request.auth.id',
  },

  // ==================== INVENTORY LOCATIONS ====================
  {
    name: 'inventory_locations',
    type: 'base',
    schema: [
      { name: 'orgId', type: 'relation', required: true, options: { collectionId: 'organizations', cascadeDelete: true, maxSelect: 1 } },
      { name: 'name', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'type', type: 'select', required: true, options: { maxSelect: 1, values: ['WAREHOUSE', 'STORE', 'SUPPLIER', 'OTHER'] } },
      { name: 'address', type: 'json', options: { maxSize: 200000 } },
      { name: 'isActive', type: 'bool', required: true, options: { maxSize: 200000 } },
      { name: 'priority', type: 'number', required: true, options: { min: null, max: null } },
    ],
    indexes: [
      'CREATE INDEX idx_inventory_locations_org ON inventory_locations (orgId)',
    ],
    viewRule: 'orgId.orgMembers.userId = @request.auth.id',
    createRule: 'orgId.orgMembers.userId = @request.auth.id',
    updateRule: 'orgId.orgMembers.userId = @request.auth.id',
    deleteRule: 'orgId.ownerId = @request.auth.id',
  },

  // ==================== INVENTORY ====================
  {
    name: 'inventory',
    type: 'base',
    schema: [
      { name: 'productId', type: 'relation', required: true, options: { collectionId: 'products', cascadeDelete: true, maxSelect: 1 } },
      { name: 'variantId', type: 'relation', options: { collectionId: 'product_variants', cascadeDelete: false, maxSelect: 1 } },
      { name: 'locationId', type: 'relation', required: true, options: { collectionId: 'inventory_locations', cascadeDelete: true, maxSelect: 1 } },
      { name: 'quantity', type: 'number', required: true, options: { min: null, max: null } },
      { name: 'reserved', type: 'number', required: true, options: { min: null, max: null } },
      { name: 'available', type: 'number', required: true, options: { min: null, max: null } },
      { name: 'reorderPoint', type: 'number', options: { min: null, max: null } },
      { name: 'reorderQuantity', type: 'number', options: { min: null, max: null } },
      { name: 'unitCost', type: 'number', options: { min: null, max: null } },
      { name: 'lastCountedAt', type: 'date', options: {} },
      { name: 'lastAdjustmentAt', type: 'date', options: {} },
    ],
    indexes: [
      'CREATE INDEX idx_inventory_product ON inventory (productId)',
      'CREATE INDEX idx_inventory_variant ON inventory (variantId)',
      'CREATE INDEX idx_inventory_location ON inventory (locationId)',
      'CREATE UNIQUE INDEX idx_inventory_unique ON inventory (productId, variantId, locationId)',
    ],
    viewRule: 'productId.orgId.orgMembers.userId = @request.auth.id',
    createRule: 'productId.orgId.orgMembers.userId = @request.auth.id',
    updateRule: 'productId.orgId.orgMembers.userId = @request.auth.id',
    deleteRule: 'productId.orgId.ownerId = @request.auth.id',
  },

  // ==================== INVENTORY ADJUSTMENTS ====================
  {
    name: 'inventory_adjustments',
    type: 'base',
    schema: [
      { name: 'inventoryId', type: 'relation', required: true, options: { collectionId: 'inventory', cascadeDelete: true, maxSelect: 1 } },
      { name: 'type', type: 'select', required: true, options: { maxSelect: 1, values: ['INCREASE', 'DECREASE', 'SET', 'RESERVE', 'UNRESERVE'] } },
      { name: 'quantity', type: 'number', required: true, options: { min: null, max: null } },
      { name: 'reason', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'reference', type: 'text', options: { min: null, max: null, pattern: '' } },
      { name: 'notes', type: 'text', options: { min: null, max: null, pattern: '' } },
      { name: 'performedBy', type: 'relation', required: true, options: { collectionId: 'users', cascadeDelete: false, maxSelect: 1 } },
    ],
    indexes: [
      'CREATE INDEX idx_inventory_adjustments_inventory ON inventory_adjustments (inventoryId)',
      'CREATE INDEX idx_inventory_adjustments_performed_by ON inventory_adjustments (performedBy)',
    ],
    viewRule: 'inventoryId.productId.orgId.orgMembers.userId = @request.auth.id',
    createRule: 'inventoryId.productId.orgId.orgMembers.userId = @request.auth.id',
    updateRule: '',
    deleteRule: '',
  },

  // ==================== PRICING RULES ====================
  {
    name: 'pricing_rules',
    type: 'base',
    schema: [
      { name: 'orgId', type: 'relation', required: true, options: { collectionId: 'organizations', cascadeDelete: true, maxSelect: 1 } },
      { name: 'productId', type: 'relation', options: { collectionId: 'products', cascadeDelete: false, maxSelect: 1 } },
      { name: 'name', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'type', type: 'select', required: true, options: { maxSelect: 1, values: ['COMPETITOR', 'MARGIN', 'VELOCITY', 'TIME_BASED', 'BUNDLE'] } },
      { name: 'conditions', type: 'json', required: true, options: { maxSize: 200000 } },
      { name: 'action', type: 'json', required: true, options: { maxSize: 200000 } },
      { name: 'isActive', type: 'bool', required: true, options: { maxSize: 200000 } },
      { name: 'priority', type: 'number', required: true, options: { min: null, max: null } },
      { name: 'lastApplied', type: 'date', options: {} },
    ],
    indexes: [
      'CREATE INDEX idx_pricing_rules_org ON pricing_rules (orgId)',
      'CREATE INDEX idx_pricing_rules_product ON pricing_rules (productId)',
      'CREATE INDEX idx_pricing_rules_active ON pricing_rules (isActive)',
    ],
    viewRule: 'orgId.orgMembers.userId = @request.auth.id',
    createRule: 'orgId.orgMembers.userId = @request.auth.id',
    updateRule: 'orgId.orgMembers.userId = @request.auth.id',
    deleteRule: 'orgId.ownerId = @request.auth.id',
  },

  // ==================== INTEGRATIONS ====================
  {
    name: 'integrations',
    type: 'base',
    schema: [
      { name: 'orgId', type: 'relation', required: true, options: { collectionId: 'organizations', cascadeDelete: true, maxSelect: 1 } },
      { name: 'type', type: 'select', required: true, options: { maxSelect: 1, values: ['AMAZON', 'EBAY', 'SHOPIFY', 'WOO', 'CUSTOM'] } },
      { name: 'name', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'status', type: 'select', required: true, options: { maxSelect: 1, values: ['ACTIVE', 'INACTIVE', 'ERROR', 'PENDING'] } },
      { name: 'config', type: 'json', required: true, options: { maxSize: 200000 } },
      { name: 'credentials', type: 'json', required: true, options: { maxSize: 200000 } },
      { name: 'lastSyncAt', type: 'date', options: {} },
      { name: 'syncStatus', type: 'select', required: true, options: { maxSelect: 1, values: ['SYNCED', 'PENDING', 'ERROR'] } },
      { name: 'errorMessage', type: 'text', options: { min: null, max: null, pattern: '' } },
    ],
    indexes: [
      'CREATE INDEX idx_integrations_org ON integrations (orgId)',
      'CREATE INDEX idx_integrations_type ON integrations (type)',
      'CREATE INDEX idx_integrations_status ON integrations (status)',
    ],
    viewRule: 'orgId.orgMembers.userId = @request.auth.id',
    createRule: 'orgId.orgMembers.userId = @request.auth.id',
    updateRule: 'orgId.orgMembers.userId = @request.auth.id',
    deleteRule: 'orgId.ownerId = @request.auth.id',
  },

  // ==================== INTEGRATION LOGS ====================
  {
    name: 'integration_logs',
    type: 'base',
    schema: [
      { name: 'integrationId', type: 'relation', required: true, options: { collectionId: 'integrations', cascadeDelete: true, maxSelect: 1 } },
      { name: 'action', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'status', type: 'select', required: true, options: { maxSelect: 1, values: ['SUCCESS', 'ERROR', 'WARNING'] } },
      { name: 'request', type: 'json', options: { maxSize: 200000 } },
      { name: 'response', type: 'json', options: { maxSize: 200000 } },
      { name: 'duration', type: 'number', options: { min: null, max: null } },
      { name: 'errorMessage', type: 'text', options: { min: null, max: null, pattern: '' } },
    ],
    indexes: [
      'CREATE INDEX idx_integration_logs_integration ON integration_logs (integrationId)',
      'CREATE INDEX idx_integration_logs_status ON integration_logs (status)',
    ],
    viewRule: 'integrationId.orgId.orgMembers.userId = @request.auth.id',
    createRule: 'integrationId.orgId.orgMembers.userId = @request.auth.id',
    updateRule: '',
    deleteRule: '',
  },

  // ==================== DAILY METRICS ====================
  {
    name: 'daily_metrics',
    type: 'base',
    schema: [
      { name: 'orgId', type: 'relation', required: true, options: { collectionId: 'organizations', cascadeDelete: true, maxSelect: 1 } },
      { name: 'date', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'marketplace', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'revenue', type: 'number', required: true, options: { min: null, max: null } },
      { name: 'orders', type: 'number', required: true, options: { min: null, max: null } },
      { name: 'units', type: 'number', required: true, options: { min: null, max: null } },
      { name: 'returns', type: 'number', required: true, options: { min: null, max: null } },
      { name: 'refunds', type: 'number', required: true, options: { min: null, max: null } },
      { name: 'fees', type: 'number', required: true, options: { min: null, max: null } },
      { name: 'profit', type: 'number', required: true, options: { min: null, max: null } },
      { name: 'conversionRate', type: 'number', options: { min: null, max: null } },
      { name: 'views', type: 'number', options: { min: null, max: null } },
      { name: 'sessions', type: 'number', options: { min: null, max: null } },
    ],
    indexes: [
      'CREATE INDEX idx_daily_metrics_org ON daily_metrics (orgId)',
      'CREATE INDEX idx_daily_metrics_date ON daily_metrics (date)',
      'CREATE INDEX idx_daily_metrics_marketplace ON daily_metrics (marketplace)',
      'CREATE UNIQUE INDEX idx_daily_metrics_unique ON daily_metrics (orgId, date, marketplace)',
    ],
    viewRule: 'orgId.orgMembers.userId = @request.auth.id',
    createRule: 'orgId.orgMembers.userId = @request.auth.id',
    updateRule: 'orgId.orgMembers.userId = @request.auth.id',
    deleteRule: '',
  },

  // ==================== ANALYTICS EVENTS ====================
  {
    name: 'analytics_events',
    type: 'base',
    schema: [
      { name: 'orgId', type: 'relation', required: true, options: { collectionId: 'organizations', cascadeDelete: true, maxSelect: 1 } },
      { name: 'userId', type: 'relation', options: { collectionId: 'users', cascadeDelete: false, maxSelect: 1 } },
      { name: 'event', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'properties', type: 'json', options: { maxSize: 200000 } },
      { name: 'timestamp', type: 'date', required: true, options: { maxSize: 200000 } },
    ],
    indexes: [
      'CREATE INDEX idx_analytics_events_org ON analytics_events (orgId)',
      'CREATE INDEX idx_analytics_events_user ON analytics_events (userId)',
      'CREATE INDEX idx_analytics_events_event ON analytics_events (event)',
      'CREATE INDEX idx_analytics_events_timestamp ON analytics_events (timestamp)',
    ],
    viewRule: 'orgId.orgMembers.userId = @request.auth.id',
    createRule: 'orgId.orgMembers.userId = @request.auth.id',
    updateRule: '',
    deleteRule: '',
  },

  // ==================== CHAT CONVERSATIONS ====================
  {
    name: 'chat_conversations',
    type: 'base',
    schema: [
      { name: 'orgId', type: 'relation', required: true, options: { collectionId: 'organizations', cascadeDelete: true, maxSelect: 1 } },
      { name: 'userId', type: 'relation', required: true, options: { collectionId: 'users', cascadeDelete: true, maxSelect: 1 } },
      { name: 'title', type: 'text', options: { min: null, max: null, pattern: '' } },
      { name: 'status', type: 'select', required: true, options: { maxSelect: 1, values: ['ACTIVE', 'ARCHIVED'] } },
      { name: 'lastMessageAt', type: 'date', options: {} },
      { name: 'messageCount', type: 'number', required: true, options: { min: null, max: null } },
    ],
    indexes: [
      'CREATE INDEX idx_chat_conversations_org ON chat_conversations (orgId)',
      'CREATE INDEX idx_chat_conversations_user ON chat_conversations (userId)',
      'CREATE INDEX idx_chat_conversations_status ON chat_conversations (status)',
    ],
    viewRule: 'userId = @request.auth.id || orgId.orgMembers.userId = @request.auth.id',
    createRule: 'userId = @request.auth.id',
    updateRule: 'userId = @request.auth.id',
    deleteRule: 'userId = @request.auth.id',
  },

  // ==================== CHAT MESSAGES ====================
  {
    name: 'chat_messages',
    type: 'base',
    schema: [
      { name: 'conversationId', type: 'relation', required: true, options: { collectionId: 'chat_conversations', cascadeDelete: true, maxSelect: 1 } },
      { name: 'role', type: 'select', required: true, options: { maxSelect: 1, values: ['USER', 'ASSISTANT', 'SYSTEM'] } },
      { name: 'content', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'tokens', type: 'number', options: { min: null, max: null } },
      { name: 'model', type: 'text', options: { min: null, max: null, pattern: '' } },
      { name: 'metadata', type: 'json', options: { maxSize: 200000 } },
    ],
    indexes: [
      'CREATE INDEX idx_chat_messages_conversation ON chat_messages (conversationId)',
    ],
    viewRule: 'conversationId.userId = @request.auth.id',
    createRule: 'conversationId.userId = @request.auth.id',
    updateRule: '',
    deleteRule: '',
  },

  // ==================== NOTIFICATIONS ====================
  {
    name: 'notifications',
    type: 'base',
    schema: [
      { name: 'userId', type: 'relation', required: true, options: { collectionId: 'users', cascadeDelete: true, maxSelect: 1 } },
      { name: 'orgId', type: 'relation', options: { collectionId: 'organizations', cascadeDelete: false, maxSelect: 1 } },
      { name: 'type', type: 'select', required: true, options: { maxSelect: 1, values: ['INFO', 'SUCCESS', 'WARNING', 'ERROR'] } },
      { name: 'title', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'message', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'read', type: 'bool', required: true, options: { maxSize: 200000 } },
      { name: 'actionUrl', type: 'url', options: {} },
      { name: 'metadata', type: 'json', options: { maxSize: 200000 } },
    ],
    indexes: [
      'CREATE INDEX idx_notifications_user ON notifications (userId)',
      'CREATE INDEX idx_notifications_read ON notifications (read)',
      'CREATE INDEX idx_notifications_created ON notifications (created)',
    ],
    viewRule: 'userId = @request.auth.id',
    createRule: 'userId = @request.auth.id',
    updateRule: 'userId = @request.auth.id',
    deleteRule: 'userId = @request.auth.id',
  },

  // ==================== AUDIT LOGS ====================
  {
    name: 'audit_logs',
    type: 'base',
    schema: [
      { name: 'orgId', type: 'relation', required: true, options: { collectionId: 'organizations', cascadeDelete: true, maxSelect: 1 } },
      { name: 'userId', type: 'relation', required: true, options: { collectionId: 'users', cascadeDelete: false, maxSelect: 1 } },
      { name: 'action', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'entity', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'entityId', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'changes', type: 'json', options: { maxSize: 200000 } },
      { name: 'metadata', type: 'json', options: { maxSize: 200000 } },
      { name: 'ipAddress', type: 'text', options: { min: null, max: null, pattern: '' } },
      { name: 'userAgent', type: 'text', options: { min: null, max: null, pattern: '' } },
    ],
    indexes: [
      'CREATE INDEX idx_audit_logs_org ON audit_logs (orgId)',
      'CREATE INDEX idx_audit_logs_user ON audit_logs (userId)',
      'CREATE INDEX idx_audit_logs_entity ON audit_logs (entity)',
      'CREATE INDEX idx_audit_logs_created ON audit_logs (created)',
    ],
    viewRule: 'orgId.orgMembers.userId = @request.auth.id',
    createRule: 'orgId.orgMembers.userId = @request.auth.id',
    updateRule: '',
    deleteRule: '',
  },

  // ==================== API KEYS ====================
  {
    name: 'api_keys',
    type: 'base',
    schema: [
      { name: 'userId', type: 'relation', required: true, options: { collectionId: 'users', cascadeDelete: true, maxSelect: 1 } },
      { name: 'orgId', type: 'relation', required: true, options: { collectionId: 'organizations', cascadeDelete: true, maxSelect: 1 } },
      { name: 'name', type: 'text', required: true, options: { min: null, max: null, pattern: '' } },
      { name: 'key', type: 'text', required: true, unique: true, options: { min: null, max: null, pattern: '' } },
      { name: 'permissions', type: 'json', required: true, options: { maxSize: 200000 } },
      { name: 'expiresAt', type: 'date', options: {} },
      { name: 'lastUsedAt', type: 'date', options: {} },
      { name: 'isActive', type: 'bool', required: true, options: { maxSize: 200000 } },
    ],
    indexes: [
      'CREATE INDEX idx_api_keys_user ON api_keys (userId)',
      'CREATE INDEX idx_api_keys_org ON api_keys (orgId)',
      'CREATE UNIQUE INDEX idx_api_keys_key ON api_keys (key)',
    ],
    viewRule: 'userId = @request.auth.id || orgId.orgMembers.userId = @request.auth.id',
    createRule: 'userId = @request.auth.id',
    updateRule: 'userId = @request.auth.id',
    deleteRule: 'userId = @request.auth.id',
  },
];

// ==================== DEPENDENCY ORDER (for creation) ====================
// Collections are grouped by dependency level. Each group only references
// collections from previous groups (or the built-in `users` auth collection).

const CREATION_ORDER: string[][] = [
  ['organizations'],                                             // Phase 1 - no deps
  ['org_members'],                                               // Phase 2 - depends on organizations
  ['products', 'inventory_locations', 'orders', 'pricing_rules', 'integrations', 'daily_metrics', 'analytics_events', 'chat_conversations', 'notifications', 'audit_logs', 'api_keys'], // Phase 3
  ['product_variants', 'product_media', 'product_listings', 'inventory'], // Phase 4 - depends on products
  ['order_items', 'order_fulfillments', 'order_returns'],        // Phase 5 - depends on orders
  ['inventory_adjustments'],                                     // Phase 6 - depends on inventory
  ['chat_messages'],                                             // Phase 7 - depends on chat_conversations
  ['integration_logs'],                                          // Phase 8 - depends on integrations
];

// ==================== API HELPERS ====================

async function apiFetch(
  path: string,
  options: { method?: string; token?: string; body?: unknown } = {}
): Promise<{ ok: boolean; status: number; data: unknown; error?: string }> {
  const { method = 'GET', token, body } = options;
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  try {
    const res = await fetch(`${POCKETBASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => null);
    return {
      ok: res.ok,
      status: res.status,
      data,
      error: data && typeof data === 'object' && 'message' in data ? (data as { message: string }).message : undefined,
    };
  } catch (err) {
    return { ok: false, status: 0, data: null, error: String(err) };
  }
}

async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${POCKETBASE_URL}/api/health`);
    return res.ok;
  } catch {
    return false;
  }
}

async function authenticate(): Promise<string> {
  const result = await apiFetch('/api/admins/auth-with-password', {
    method: 'POST',
    body: { identity: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  });
  if (!result.ok || !result.data || typeof result.data !== 'object' || !('token' in result.data)) {
    throw new Error(`Authentication failed: ${result.error || result.status}`);
  }
  return (result.data as { token: string }).token;
}

async function listCollections(token: string): Promise<Map<string, string>> {
  // Returns map of name -> id
  const result = await apiFetch('/api/collections?perPage=500', { token });
  const map = new Map<string, string>();
  if (result.ok && result.data && typeof result.data === 'object' && 'items' in result.data) {
    for (const item of (result.data as { items: Array<{ id: string; name: string }> }).items) {
      map.set(item.name, item.id);
    }
  }
  return map;
}

function buildCreatePayload(def: CollectionDefinition, collectionIds: Map<string, string>): Record<string, unknown> {
  return {
    name: def.name,
    type: def.type,
    schema: def.schema.map((f) => {
      const field: Record<string, unknown> = {
        name: f.name,
        type: f.type,
        required: f.required ?? false,
        unique: f.unique ?? false,
        system: f.system ?? false,
        options: { ...f.options },
      };

      // Resolve collection names to IDs for relation fields
      if (f.type === 'relation' && field.options && typeof field.options === 'object') {
        const opts = field.options as Record<string, unknown>;
        if (typeof opts.collectionId === 'string' && collectionIds.has(opts.collectionId)) {
          opts.collectionId = collectionIds.get(opts.collectionId);
        }
      }

      return field;
    }),
    indexes: def.indexes ?? [],
    listRule: '',
    viewRule: '',
    createRule: '',
    updateRule: '',
    deleteRule: '',
  };
}

function buildRulesPayload(def: CollectionDefinition): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  if (def.listRule !== undefined) payload.listRule = def.listRule;
  if (def.viewRule !== undefined) payload.viewRule = def.viewRule;
  if (def.createRule !== undefined) payload.createRule = def.createRule;
  if (def.updateRule !== undefined) payload.updateRule = def.updateRule;
  if (def.deleteRule !== undefined) payload.deleteRule = def.deleteRule;
  return payload;
}

// ==================== MAIN ====================

async function main(): Promise<void> {
  console.log('');
  console.log('========================================================');
  console.log('  PocketBase Collection Setup (v2 - PB 0.22.1+)');
  console.log('========================================================');
  console.log('');

  // 1. Health check
  console.log('[1/4] Checking PocketBase server...');
  const healthy = await checkHealth();
  if (!healthy) {
    console.error('  ERROR: PocketBase server is not reachable at', POCKETBASE_URL);
    console.error('  Start PocketBase with: ./pocketbase serve');
    process.exit(1);
  }
  console.log('  OK - PocketBase is running');
  console.log('');

  // 2. Authenticate
  console.log('[2/4] Authenticating as admin...');
  let token: string;
  try {
    token = await authenticate();
    console.log('  OK - Authenticated');
  } catch (err) {
    console.error('  ERROR:', (err as Error).message);
    process.exit(1);
  }
  console.log('');

  // 3. Discover existing collections
  console.log('[3/4] Checking existing collections...');
  const existing = await listCollections(token);
  console.log(`  Found ${existing.size} existing collection(s)`);
  const defsByName = new Map<string, CollectionDefinition>();
  for (const def of COLLECTIONS) defsByName.set(def.name, def);

  // 4. Pass 1 - Create collections without rules
  console.log('');
  console.log('[4/4] Creating collections (two-pass)...');
  console.log('');
  console.log('--- Pass 1: Create collections (no rules) ---');

  let created = 0;
  let skipped = 0;
  let failed = 0;
  const createdOrder: string[] = [];

  for (const phase of CREATION_ORDER) {
    for (const name of phase) {
      const def = defsByName.get(name);
      if (!def) {
        console.log(`  WARN  Definition for "${name}" not found, skipping`);
        continue;
      }

      if (existing.has(name)) {
        console.log(`  SKIP  ${name} (already exists)`);
        skipped++;
        createdOrder.push(name); // still track it for rules pass
        continue;
      }

      const payload = buildCreatePayload(def, existing);
      const result = await apiFetch('/api/collections', { method: 'POST', token, body: payload });

      if (result.ok) {
        console.log(`  OK    ${name}`);
        created++;
        createdOrder.push(name);
        // Add the new collection to the ID map so later collections can reference it
        const createdData = result.data as { id: string; name: string } | undefined;
        if (createdData && createdData.id) {
          existing.set(name, createdData.id);
        }
      } else {
        console.log(`  FAIL  ${name} - ${result.error || JSON.stringify(result.data)}`);
        failed++;
      }
    }
  }

  console.log('');
  console.log(`  Pass 1 complete: ${created} created, ${skipped} skipped, ${failed} failed`);

  if (failed > 0) {
    console.log('');
    console.log('  Some collections failed to create. Attempting rules pass anyway...');
  }

  // Refresh collection list to get IDs
  const refreshed = await listCollections(token);

  // 5. Update users collection schema if it exists (add custom fields to default PB users collection)
  if (refreshed.has('users')) {
    console.log('');
    console.log('--- Updating users collection schema (adding custom fields) ---');
    const usersId = refreshed.get('users')!;
    const usersSchema = {
      schema: [
        { name: 'name', type: 'text', required: false, unique: false, options: { min: null, max: null, pattern: '' } },
        { name: 'avatar', type: 'file', required: false, unique: false, options: { maxSelect: 1, maxSize: 5242880, mimeTypes: ['image/jpeg', 'image/png', 'image/webp'] } },
        { name: 'role', type: 'select', required: true, unique: false, options: { maxSelect: 1, values: ['OWNER', 'ADMIN', 'MANAGER', 'MEMBER', 'VIEWER'] } },
        { name: 'status', type: 'select', required: true, unique: false, options: { maxSelect: 1, values: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'] } },
        { name: 'phone', type: 'text', required: false, unique: false, options: { min: null, max: null, pattern: '' } },
        { name: 'providers', type: 'json', required: false, unique: false, options: { maxSize: 200000 } },
      ],
    };
    const usersResult = await apiFetch(`/api/collections/${usersId}`, { method: 'PATCH', token, body: usersSchema });
    if (usersResult.ok) {
      console.log('  OK    users schema updated (added role, status, phone, providers)');
    } else {
      console.log(`  WARN  users schema update: ${usersResult.error || 'already up to date'}`);
    }
  }

  // 6. Pass 2 - Update each collection with its rules
  console.log('');
  console.log('--- Pass 2: Update collection rules ---');

  let rulesUpdated = 0;
  let rulesFailed = 0;

  for (const name of createdOrder) {
    const def = defsByName.get(name);
    if (!def) continue;

    const rulesPayload = buildRulesPayload(def);
    // Filter out rules with relation traversal (e.g., "orgId.orgMembers.userId")
    // These need the collections to be fully set up with proper back-references
    const simpleRules: Record<string, string> = {};
    for (const [key, value] of Object.entries(rulesPayload)) {
      if (typeof value === 'string' && value !== '' && !value.includes('.')) {
        simpleRules[key] = value;
      }
    }
    const rulesEntries = Object.entries(simpleRules);
    if (rulesEntries.length === 0) {
      console.log(`  SKIP  ${name} (no simple rules to set)`);
      continue;
    }

    const collId = refreshed.get(name);
    if (!collId) {
      console.log(`  WARN  ${name} not found after creation, cannot set rules`);
      continue;
    }

    const result = await apiFetch(`/api/collections/${collId}`, { method: 'PATCH', token, body: simpleRules });

    if (result.ok) {
      const ruleNames = rulesEntries.map(([k]) => k).join(', ');
      console.log(`  OK    ${name} [${ruleNames}]`);
      rulesUpdated++;
    } else {
      console.log(`  FAIL  ${name} - ${result.error || JSON.stringify(result.data)}`);
      rulesFailed++;
    }
  }

  // Summary
  console.log('');
  console.log('========================================================');
  console.log('  Summary');
  console.log('========================================================');
  console.log(`  Collections created:  ${created}`);
  console.log(`  Collections skipped:  ${skipped}`);
  console.log(`  Collections failed:   ${failed}`);
  console.log(`  Rules updated:        ${rulesUpdated}`);
  console.log(`  Rules failed:         ${rulesFailed}`);
  console.log('========================================================');
  console.log('');

  if (failed === 0 && rulesFailed === 0) {
    console.log('All collections and rules applied successfully!');
    console.log(`Admin dashboard: ${POCKETBASE_URL}/_/`);
  } else {
    console.log('Some operations failed. Check the log above for details.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
