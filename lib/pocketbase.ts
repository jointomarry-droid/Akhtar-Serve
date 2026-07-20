import PocketBase, { RecordService } from 'pocketbase';
import type { TypedPocketBase } from '@/types/pocketbase';

/**
 * PocketBase Client Singleton
 * 
 * Provides a single, shared PocketBase instance across the application.
 * In development, attaches to globalThis to survive HMR (Hot Module Replacement).
 * 
 * Usage:
 *   import { pb, collections } from '@/lib/pocketbase';
 *   const products = await collections.products.getFullList();
 */

// ==================== POCKETBASE INSTANCE ====================

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090';

// Singleton pattern for PocketBase client
const globalForPocketbase = globalThis as unknown as {
  pocketbase: TypedPocketBase | undefined;
};

function createPocketBaseInstance(): TypedPocketBase {
  const pb = new PocketBase(POCKETBASE_URL) as TypedPocketBase;

  // Configure authentication store
  pb.autoCancellation(false);

  // Set up request timeout (30 seconds)
  pb.beforeSend = (url, options) => {
    const timeout = 30000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    return {
      url,
      options: {
        ...options,
        signal: controller.signal,
      },
    };
  };

  return pb;
}

/**
 * Main PocketBase instance
 * Use this for all database operations
 */
export const pb: TypedPocketBase = globalForPocketbase.pocketbase || createPocketBaseInstance();

if (process.env.NODE_ENV !== 'production') {
  globalForPocketbase.pocketbase = pb;
}

// ==================== COLLECTION REFERENCES ====================

/**
 * Typed collection references for type-safe queries
 * 
 * Usage:
 *   import { collections } from '@/lib/pocketbase';
 *   const product = await collections.products.getOne('record_id');
 */
export const collections = {
  // Auth & Users
  users: pb.collection('users') as RecordService,

  // Organizations
  organizations: pb.collection('organizations') as RecordService,
  orgMembers: pb.collection('org_members') as RecordService,

  // Products
  products: pb.collection('products') as RecordService,
  productVariants: pb.collection('product_variants') as RecordService,
  productMedia: pb.collection('product_media') as RecordService,
  productListings: pb.collection('product_listings') as RecordService,

  // Orders
  orders: pb.collection('orders') as RecordService,
  orderItems: pb.collection('order_items') as RecordService,
  orderFulfillments: pb.collection('order_fulfillments') as RecordService,
  orderReturns: pb.collection('order_returns') as RecordService,

  // Inventory
  inventory: pb.collection('inventory') as RecordService,
  inventoryLocations: pb.collection('inventory_locations') as RecordService,
  inventoryAdjustments: pb.collection('inventory_adjustments') as RecordService,

  // Pricing
  pricingRules: pb.collection('pricing_rules') as RecordService,

  // Integrations
  integrations: pb.collection('integrations') as RecordService,
  integrationLogs: pb.collection('integration_logs') as RecordService,

  // Analytics
  dailyMetrics: pb.collection('daily_metrics') as RecordService,
  analyticsEvents: pb.collection('analytics_events') as RecordService,

  // Chat
  chatConversations: pb.collection('chat_conversations') as RecordService,
  chatMessages: pb.collection('chat_messages') as RecordService,

  // Notifications
  notifications: pb.collection('notifications') as RecordService,

  // Audit
  auditLogs: pb.collection('audit_logs') as RecordService,

  // API Keys
  apiKeys: pb.collection('api_keys') as RecordService,
} as const;

// ==================== AUTH HELPERS ====================

/**
 * Authenticate with email and password
 */
export async function authenticateWithEmail(email: string, password: string) {
  try {
    const authData = await pb.collection('users').authWithPassword(email, password);
    return { success: true, data: authData };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Authenticate with OAuth2 provider
 */
export async function authenticateWithOAuth2(provider: 'google' | 'github' | 'microsoft') {
  try {
    const authData = await pb.collection('users').authWithOAuth2({ provider });
    return { success: true, data: authData };
  } catch (error) {
    console.error('OAuth authentication error:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Refresh authentication token
 */
export async function refreshAuth() {
  try {
    const authData = await pb.collection('users').authRefresh();
    return { success: true, data: authData };
  } catch (error) {
    console.error('Auth refresh error:', error);
    pb.authStore.clear();
    return { success: false, error: String(error) };
  }
}

/**
 * Sign out current user
 */
export function signOut() {
  pb.authStore.clear();
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return pb.authStore.isValid;
}

/**
 * Get current user
 */
export function getCurrentUser() {
  if (!pb.authStore.isValid) return null;
  return pb.authStore.record;
}

// ==================== REALTIME HELPERS ====================

/**
 * Subscribe to collection changes
 * 
 * Usage:
 *   const unsubscribe = subscribeToCollection('products', '*', (e) => {
 *     console.log('Change:', e.action, e.record);
 *   });
 */
export function subscribeToCollection(
  collection: string,
  callback: (event: { action: string; record: unknown }) => void,
  options?: { filter?: string }
) {
  return pb.collection(collection).subscribe('*', callback, options);
}

/**
 * Subscribe to a single record changes
 */
export function subscribeToRecord(
  collection: string,
  recordId: string,
  callback: (event: { action: string; record: unknown }) => void
) {
  return pb.collection(collection).subscribe(recordId, callback);
}

// ==================== HEALTH CHECK ====================

/**
 * Check PocketBase server health
 */
export async function checkHealth(): Promise<{
  status: 'healthy' | 'unhealthy';
  message: string;
  latency?: number;
}> {
  try {
    const start = Date.now();
    await pb.health.check();
    const latency = Date.now() - start;

    return {
      status: 'healthy',
      message: 'PocketBase server is running',
      latency,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: String(error),
    };
  }
}

// ==================== BATCH OPERATIONS ====================

/**
 * Execute multiple operations in a single request
 * 
 * Usage:
 *   const results = await batch([
 *     pb.collection('products').create({ ... }),
 *     pb.collection('inventory').create({ ... }),
 *   ]);
 */
export async function batch(requests: Promise<unknown>[]) {
  try {
    const results = await Promise.allSettled(requests);
    return {
      success: true,
      results,
    };
  } catch (error) {
    console.error('Batch operation error:', error);
    return {
      success: false,
      error: String(error),
    };
  }
}

// ==================== FILE UPLOAD HELPERS ====================

/**
 * Upload a file to a record
 */
export async function uploadFile(
  collection: string,
  recordId: string,
  fieldName: string,
  file: File | Blob
) {
  try {
    const formData = new FormData();
    formData.append(fieldName, file);

    const record = await pb.collection(collection).update(recordId, formData);
    return { success: true, data: record };
  } catch (error) {
    console.error('File upload error:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Get file URL for a record
 */
export function getFileUrl(collection: string, recordId: string, filename: string) {
  return pb.files.getURL(
    { id: recordId, collectionId: collection } as never,
    filename
  );
}

// ==================== EXPORT ====================

export default pb;
