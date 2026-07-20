import PocketBase, { RecordService } from 'pocketbase';

/**
 * PocketBase Type Definitions for Akhtar-Serve
 * 
 * Provides type-safe interfaces for all collections and records.
 * Use these types throughout the application for consistency.
 */

// ==================== BASE TYPES ====================

/**
 * Base record interface that all PocketBase records extend
 */
export interface BaseRecord {
  id: string;
  created: string; // ISO 8601 datetime string
  updated: string; // ISO 8601 datetime string;
  collectionId: string;
  collectionName: string;
}

/**
 * Pagination response from PocketBase
 */
export interface PaginatedResponse<T> {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}

/**
 * Sort options for queries
 */
export type SortOption = string;

/**
 * Filter options for queries
 */
export type FilterOption = string;

// ==================== USER & AUTH TYPES ====================

/**
 * User record
 */
export interface UserRecord extends BaseRecord {
  username: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'MEMBER' | 'VIEWER';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  organizationId?: string;
  phone?: string;
  lastLogin?: string;
  verified: boolean;
  providers: string[];
}

/**
 * Auth response
 */
export interface AuthResponse {
  token: string;
  record: UserRecord;
}

// ==================== ORGANIZATION TYPES ====================

/**
 * Organization record
 */
export interface OrganizationRecord extends BaseRecord {
  name: string;
  slug: string;
  logo?: string;
  plan: 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  ownerId: string;
  settings: Record<string, unknown>;
  website?: string;
  industry?: string;
  employeeCount?: number;
  address?: OrganizationAddress;
}

/**
 * Organization address
 */
export interface OrganizationAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

/**
 * Organization member record
 */
export interface OrgMemberRecord extends BaseRecord {
  organizationId: string;
  userId: string;
  role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'MEMBER' | 'VIEWER';
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED';
  invitedBy?: string;
  joinedAt: string;
}

// ==================== PRODUCT TYPES ====================

/**
 * Product record
 */
export interface ProductRecord extends BaseRecord {
  orgId: string;
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  brand?: string;
  category?: string;
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  costPrice?: number;
  imageUrl?: string;
  weight?: number;
  weightUnit?: 'kg' | 'lb' | 'oz' | 'g';
  dimensions?: ProductDimensions;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

/**
 * Product dimensions
 */
export interface ProductDimensions {
  length?: number;
  width?: number;
  height?: number;
  unit?: 'cm' | 'in' | 'mm' | 'm';
}

/**
 * Product variant record
 */
export interface ProductVariantRecord extends BaseRecord {
  productId: string;
  name: string;
  sku: string;
  barcode?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  inventoryQuantity: number;
  options: Record<string, string>;
  imageUrl?: string;
  weight?: number;
  isDefault: boolean;
  status: 'ACTIVE' | 'INACTIVE';
}

/**
 * Product media record
 */
export interface ProductMediaRecord extends BaseRecord {
  productId: string;
  variantId?: string;
  type: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  url: string;
  filename: string;
  size: number;
  alt?: string;
  sortOrder: number;
  isPrimary: boolean;
}

/**
 * Product listing record (marketplace listings)
 */
export interface ProductListingRecord extends BaseRecord {
  productId: string;
  variantId?: string;
  marketplace: 'AMAZON' | 'EBAY';
  marketplaceId: string;
  listingId: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'ENDED' | 'ERROR';
  url?: string;
  lastSyncedAt?: string;
  syncStatus: 'SYNCED' | 'PENDING' | 'ERROR';
  marketplaceData?: Record<string, unknown>;
}

// ==================== ORDER TYPES ====================

/**
 * Order record
 */
export interface OrderRecord extends BaseRecord {
  orgId: string;
  marketplace: 'AMAZON' | 'EBAY';
  marketplaceOrderId: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  customerEmail?: string;
  customerName?: string;
  shippingAddress?: Address;
  billingAddress?: Address;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  currency: string;
  paymentMethod?: string;
  paymentStatus: 'PENDING' | 'PAID' | 'PARTIALLY_REFUNDED' | 'REFUNDED' | 'FAILED';
  fulfillmentStatus: 'UNFULFILLED' | 'PARTIALLY_FULFILLED' | 'FULFILLED' | 'RETURNED';
  notes?: string;
  metadata?: Record<string, unknown>;
  orderedAt: string;
  shippedAt?: string;
  deliveredAt?: string;
}

/**
 * Address
 */
export interface Address {
  street?: string;
  street2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  name?: string;
}

/**
 * Order item record
 */
export interface OrderItemRecord extends BaseRecord {
  orderId: string;
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
  marketplaceItemId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Order fulfillment record
 */
export interface OrderFulfillmentRecord extends BaseRecord {
  orderId: string;
  status: 'PENDING' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED' | 'RETURNED';
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  shippedAt?: string;
  deliveredAt?: string;
  items: string[]; // Order item IDs
}

/**
 * Order return record
 */
export interface OrderReturnRecord extends BaseRecord {
  orderId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  reason: string;
  items: ReturnItem[];
  refundAmount?: number;
  notes?: string;
  createdAt: string;
}

/**
 * Return item
 */
export interface ReturnItem {
  orderItemId: string;
  quantity: number;
  reason?: string;
  condition?: 'NEW' | 'USED' | 'DAMAGED' | 'DEFECTIVE';
}

// ==================== INVENTORY TYPES ====================

/**
 * Inventory record
 */
export interface InventoryRecord extends BaseRecord {
  productId: string;
  variantId?: string;
  locationId: string;
  quantity: number;
  reserved: number;
  available: number;
  reorderPoint?: number;
  reorderQuantity?: number;
  unitCost?: number;
  lastCountedAt?: string;
  lastAdjustmentAt?: string;
}

/**
 * Inventory location record
 */
export interface InventoryLocationRecord extends BaseRecord {
  orgId: string;
  name: string;
  type: 'WAREHOUSE' | 'STORE' | 'SUPPLIER' | 'OTHER';
  address?: Address;
  isActive: boolean;
  priority: number;
}

/**
 * Inventory adjustment record
 */
export interface InventoryAdjustmentRecord extends BaseRecord {
  inventoryId: string;
  type: 'INCREASE' | 'DECREASE' | 'SET' | 'RESERVE' | 'UNRESERVE';
  quantity: number;
  reason: string;
  reference?: string;
  notes?: string;
  performedBy: string;
}

// ==================== PRICING TYPES ====================

/**
 * Pricing rule record
 */
export interface PricingRuleRecord extends BaseRecord {
  orgId: string;
  productId?: string;
  name: string;
  type: 'COMPETITOR' | 'MARGIN' | 'VELOCITY' | 'TIME_BASED' | 'BUNDLE';
  conditions: PricingConditions;
  action: PricingAction;
  isActive: boolean;
  priority: number;
  lastApplied?: string;
}

/**
 * Pricing conditions
 */
export interface PricingConditions {
  marketplace?: string[];
  category?: string[];
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
  maxQuantity?: number;
  daysSinceLastSale?: number;
  competitorPriceBelow?: number;
  competitorPriceAbove?: number;
}

/**
 * Pricing action
 */
export interface PricingAction {
  type: 'FIXED' | 'PERCENTAGE' | 'MATCH_COMPETITOR' | 'MARGIN_BASED';
  value: number;
  minPrice?: number;
  maxPrice?: number;
  roundTo?: number;
}

// ==================== INTEGRATION TYPES ====================

/**
 * Integration record
 */
export interface IntegrationRecord extends BaseRecord {
  orgId: string;
  type: 'AMAZON' | 'EBAY' | 'SHOPIFY' | 'WOO' | 'CUSTOM';
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'PENDING';
  config: IntegrationConfig;
  credentials: IntegrationCredentials;
  lastSyncAt?: string;
  syncStatus: 'SYNCED' | 'PENDING' | 'ERROR';
  errorMessage?: string;
}

/**
 * Integration config
 */
export interface IntegrationConfig {
  marketplaceId?: string;
  sellerId?: string;
  storeId?: string;
  region?: string;
  autoSync?: boolean;
  syncInterval?: number;
}

/**
 * Integration credentials (encrypted in database)
 */
export interface IntegrationCredentials {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  apiKey?: string;
  apiSecret?: string;
  [key: string]: unknown;
}

/**
 * Integration log record
 */
export interface IntegrationLogRecord extends BaseRecord {
  integrationId: string;
  action: string;
  status: 'SUCCESS' | 'ERROR' | 'WARNING';
  request?: Record<string, unknown>;
  response?: Record<string, unknown>;
  duration?: number;
  errorMessage?: string;
}

// ==================== ANALYTICS TYPES ====================

/**
 * Daily metrics record
 */
export interface DailyMetricsRecord extends BaseRecord {
  orgId: string;
  date: string; // YYYY-MM-DD
  marketplace: string;
  revenue: number;
  orders: number;
  units: number;
  returns: number;
  refunds: number;
  fees: number;
  profit: number;
  conversionRate?: number;
  views?: number;
  sessions?: number;
}

/**
 * Analytics event record
 */
export interface AnalyticsEventRecord extends BaseRecord {
  orgId: string;
  userId?: string;
  event: string;
  properties?: Record<string, unknown>;
  timestamp: string;
}

// ==================== CHAT TYPES ====================

/**
 * Chat conversation record
 */
export interface ChatConversationRecord extends BaseRecord {
  orgId: string;
  userId: string;
  title?: string;
  status: 'ACTIVE' | 'ARCHIVED';
  lastMessageAt?: string;
  messageCount: number;
}

/**
 * Chat message record
 */
export interface ChatMessageRecord extends BaseRecord {
  conversationId: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  tokens?: number;
  model?: string;
  metadata?: Record<string, unknown>;
}

// ==================== NOTIFICATION TYPES ====================

/**
 * Notification record
 */
export interface NotificationRecord extends BaseRecord {
  userId: string;
  orgId?: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

// ==================== AUDIT TYPES ====================

/**
 * Audit log record
 */
export interface AuditLogRecord extends BaseRecord {
  orgId: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  changes?: Record<string, { old: unknown; new: unknown }>;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

// ==================== API KEY TYPES ====================

/**
 * API key record
 */
export interface ApiKeyRecord extends BaseRecord {
  userId: string;
  orgId: string;
  name: string;
  key: string;
  permissions: string[];
  expiresAt?: string;
  lastUsedAt?: string;
  isActive: boolean;
}

// ==================== POCKETBASE TYPED INSTANCE ====================

/**
 * Typed PocketBase instance with collection-specific types
 */
export interface TypedPocketBase extends PocketBase {
  collection(idOrName: string): RecordService;
  collection(idOrName: 'users'): RecordService<UserRecord>;
  collection(idOrName: 'organizations'): RecordService<OrganizationRecord>;
  collection(idOrName: 'org_members'): RecordService<OrgMemberRecord>;
  collection(idOrName: 'products'): RecordService<ProductRecord>;
  collection(idOrName: 'product_variants'): RecordService<ProductVariantRecord>;
  collection(idOrName: 'product_media'): RecordService<ProductMediaRecord>;
  collection(idOrName: 'product_listings'): RecordService<ProductListingRecord>;
  collection(idOrName: 'orders'): RecordService<OrderRecord>;
  collection(idOrName: 'order_items'): RecordService<OrderItemRecord>;
  collection(idOrName: 'order_fulfillments'): RecordService<OrderFulfillmentRecord>;
  collection(idOrName: 'order_returns'): RecordService<OrderReturnRecord>;
  collection(idOrName: 'inventory'): RecordService<InventoryRecord>;
  collection(idOrName: 'inventory_locations'): RecordService<InventoryLocationRecord>;
  collection(idOrName: 'inventory_adjustments'): RecordService<InventoryAdjustmentRecord>;
  collection(idOrName: 'pricing_rules'): RecordService<PricingRuleRecord>;
  collection(idOrName: 'integrations'): RecordService<IntegrationRecord>;
  collection(idOrName: 'integration_logs'): RecordService<IntegrationLogRecord>;
  collection(idOrName: 'daily_metrics'): RecordService<DailyMetricsRecord>;
  collection(idOrName: 'analytics_events'): RecordService<AnalyticsEventRecord>;
  collection(idOrName: 'chat_conversations'): RecordService<ChatConversationRecord>;
  collection(idOrName: 'chat_messages'): RecordService<ChatMessageRecord>;
  collection(idOrName: 'notifications'): RecordService<NotificationRecord>;
  collection(idOrName: 'audit_logs'): RecordService<AuditLogRecord>;
  collection(idOrName: 'api_keys'): RecordService<ApiKeyRecord>;
}

// ==================== QUERY OPTION TYPES ====================

/**
 * Query options for PocketBase
 */
export interface QueryOptions {
  page?: number;
  perPage?: number;
  sort?: string;
  filter?: string;
  fields?: string[];
  expand?: string[];
  requestKey?: string | null;
}

/**
 * Real-time subscription options
 */
export interface RealtimeOptions {
  filter?: string;
  sort?: string;
  fields?: string[];
  expand?: string[];
}

// ==================== HELPER TYPES ====================

/**
 * Create input type (without auto-generated fields)
 */
export type CreateInput<T extends BaseRecord> = Omit<T, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>;

/**
 * Update input type (partial, without auto-generated fields)
 */
export type UpdateInput<T extends BaseRecord> = Partial<CreateInput<T>>;

/**
 * Record with expanded relations
 */
export type ExpandedRecord<T, E extends Record<string, unknown>> = T & {
  expand: E;
};
