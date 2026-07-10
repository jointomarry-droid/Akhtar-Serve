import { collection, doc } from "firebase/firestore";
import { db } from "./firebase";

// ==================== COLLECTIONS ====================

// Users collection
export const usersCollection = collection(db, "users");

// Organizations collection
export const organizationsCollection = collection(db, "organizations");

// Helper to get organization subcollections
export const getOrgDoc = (orgId: string) => doc(organizationsCollection, orgId);
export const getOrgMembersCollection = (orgId: string) =>
  collection(getOrgDoc(orgId), "members");
export const getOrgProductsCollection = (orgId: string) =>
  collection(getOrgDoc(orgId), "products");
export const getOrgOrdersCollection = (orgId: string) =>
  collection(getOrgDoc(orgId), "orders");
export const getOrgIntegrationsCollection = (orgId: string) =>
  collection(getOrgDoc(orgId), "integrations");
export const getOrgInventoryCollection = (orgId: string) =>
  collection(getOrgDoc(orgId), "inventory");
export const getOrgPricingRulesCollection = (orgId: string) =>
  collection(getOrgDoc(orgId), "pricingRules");
export const getOrgAuditLogsCollection = (orgId: string) =>
  collection(getOrgDoc(orgId), "auditLogs");
export const getOrgDailyMetricsCollection = (orgId: string) =>
  collection(getOrgDoc(orgId), "dailyMetrics");
export const getOrgNotificationsCollection = (orgId: string) =>
  collection(getOrgDoc(orgId), "notifications");

// Helper to get user subcollections
export const getUserDoc = (userId: string) => doc(usersCollection, userId);
export const getUserNotificationsCollection = (userId: string) =>
  collection(getUserDoc(userId), "notifications");
export const getUserApiKeysCollection = (userId: string) =>
  collection(getUserDoc(userId), "apiKeys");

// Chat collections
export const chatConversationsCollection = collection(db, "chatConversations");
export const chatMessagesCollection = collection(db, "chatMessages");

// Helper to get chat subcollections
export const getChatConversationDoc = (conversationId: string) =>
  doc(chatConversationsCollection, conversationId);
export const getChatConversationMessagesCollection = (conversationId: string) =>
  collection(getChatConversationDoc(conversationId), "messages");

// Helper to get product subcollections
export const getProductDoc = (orgId: string, productId: string) =>
  doc(getOrgProductsCollection(orgId), productId);
export const getProductVariantsCollection = (orgId: string, productId: string) =>
  collection(getProductDoc(orgId, productId), "variants");
export const getProductMediaCollection = (orgId: string, productId: string) =>
  collection(getProductDoc(orgId, productId), "media");
export const getProductListingsCollection = (orgId: string, productId: string) =>
  collection(getProductDoc(orgId, productId), "listings");

// Helper to get order subcollections
export const getOrderDoc = (orgId: string, orderId: string) =>
  doc(getOrgOrdersCollection(orgId), orderId);
export const getOrderItemsCollection = (orgId: string, orderId: string) =>
  collection(getOrderDoc(orgId, orderId), "items");
export const getOrderFulfillmentsCollection = (orgId: string, orderId: string) =>
  collection(getOrderDoc(orgId, orderId), "fulfillments");
export const getOrderReturnsCollection = (orgId: string, orderId: string) =>
  collection(getOrderDoc(orgId, orderId), "returns");

// ==================== TYPES ====================

export interface UserData {
  uid: string;
  email: string;
  name: string | null;
  photoURL: string | null;
  phone?: string | null;
  role: "OWNER" | "ADMIN" | "MANAGER" | "MEMBER" | "VIEWER";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";
  organizationId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationData {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  plan: "FREE" | "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
  ownerId: string;
  settings?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductData {
  id: string;
  orgId: string;
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  brand?: string;
  category?: string;
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
  costPrice?: number;
  imageUrl?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderData {
  id: string;
  orgId: string;
  marketplace: "AMAZON" | "EBAY";
  marketplaceOrderId: string;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  customerEmail?: string;
  customerName?: string;
  shippingAddress?: Record<string, any>;
  billingAddress?: Record<string, any>;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  currency: string;
  paymentMethod?: string;
  paymentStatus: "PENDING" | "PAID" | "PARTIALLY_REFUNDED" | "REFUNDED" | "FAILED";
  fulfillmentStatus: "UNFULFILLED" | "PARTIALLY_FULFILLED" | "FULFILLED" | "RETURNED";
  notes?: string;
  metadata?: Record<string, any>;
  orderedAt: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryData {
  id: string;
  productId: string;
  locationId: string;
  quantity: number;
  reserved: number;
  reorderPoint?: number;
  reorderQuantity?: number;
  unitCost?: number;
  lastCountedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PricingRuleData {
  id: string;
  orgId: string;
  productId?: string;
  name: string;
  type: "COMPETITOR" | "MARGIN" | "VELOCITY" | "TIME_BASED" | "BUNDLE";
  conditions: Record<string, any>;
  action: Record<string, any>;
  isActive: boolean;
  priority: number;
  lastApplied?: Date;
  createdAt: Date;
  updatedAt: Date;
}
