/**
 * PocketBase Admin SDK
 * 
 * Server-side PocketBase client with admin privileges.
 * Used for administrative operations, migrations, and background tasks.
 * 
 * Usage:
 *   import { pbAdmin, adminCollections } from '@/lib/pocketbase-admin';
 *   const records = await adminCollections.users.getList();
 */

import PocketBase, { RecordService } from 'pocketbase';

// ==================== CONFIGURATION ====================

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090';
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || 'admin@akhtarserve.com';
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || 'admin123';

// ==================== ADMIN CLIENT ====================

/**
 * PocketBase admin client singleton
 * 
 * This client has full admin access and bypasses collection rules.
 * Use only for server-side operations.
 */
class PocketBaseAdmin {
  private static instance: PocketBaseAdmin | null = null;
  private pb: PocketBase;
  private isAuthenticated = false;

  private constructor() {
    this.pb = new PocketBase(POCKETBASE_URL);
    this.pb.autoCancellation(false);
  }

  /**
   * Get or create admin instance
   */
  static getInstance(): PocketBaseAdmin {
    if (!PocketBaseAdmin.instance) {
      PocketBaseAdmin.instance = new PocketBaseAdmin();
    }
    return PocketBaseAdmin.instance;
  }

  /**
   * Authenticate as admin
   */
  async authenticate(): Promise<boolean> {
    if (this.isAuthenticated) {
      return true;
    }

    try {
      await this.pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
      this.isAuthenticated = true;
      return true;
    } catch (error) {
      console.error('PocketBase admin authentication failed:', error);
      return false;
    }
  }

  /**
   * Get the underlying PocketBase instance
   */
  getClient(): PocketBase {
    return this.pb;
  }

  /**
   * Check if authenticated
   */
  isAuth(): boolean {
    return this.isAuthenticated;
  }

  /**
   * Refresh authentication
   */
  async refresh(): Promise<boolean> {
    try {
      await this.pb.admins.authRefresh();
      return true;
    } catch {
      this.isAuthenticated = false;
      return this.authenticate();
    }
  }
}

// ==================== SINGLETON EXPORT ====================

const adminInstance = PocketBaseAdmin.getInstance();

/**
 * PocketBase admin client
 * Call `await pbAdmin.authenticate()` before use
 */
export const pbAdmin = adminInstance;

// ==================== ADMIN COLLECTIONS ====================

/**
 * Typed collection references for admin operations
 */
export const adminCollections = {
  // Auth & Users
  users: adminInstance.getClient().collection('users') as RecordService,

  // Organizations
  organizations: adminInstance.getClient().collection('organizations') as RecordService,
  orgMembers: adminInstance.getClient().collection('org_members') as RecordService,

  // Products
  products: adminInstance.getClient().collection('products') as RecordService,
  productVariants: adminInstance.getClient().collection('product_variants') as RecordService,
  productMedia: adminInstance.getClient().collection('product_media') as RecordService,
  productListings: adminInstance.getClient().collection('product_listings') as RecordService,

  // Orders
  orders: adminInstance.getClient().collection('orders') as RecordService,
  orderItems: adminInstance.getClient().collection('order_items') as RecordService,
  orderFulfillments: adminInstance.getClient().collection('order_fulfillments') as RecordService,
  orderReturns: adminInstance.getClient().collection('order_returns') as RecordService,

  // Inventory
  inventory: adminInstance.getClient().collection('inventory') as RecordService,
  inventoryLocations: adminInstance.getClient().collection('inventory_locations') as RecordService,
  inventoryAdjustments: adminInstance.getClient().collection('inventory_adjustments') as RecordService,

  // Pricing
  pricingRules: adminInstance.getClient().collection('pricing_rules') as RecordService,

  // Integrations
  integrations: adminInstance.getClient().collection('integrations') as RecordService,
  integrationLogs: adminInstance.getClient().collection('integration_logs') as RecordService,

  // Analytics
  dailyMetrics: adminInstance.getClient().collection('daily_metrics') as RecordService,
  analyticsEvents: adminInstance.getClient().collection('analytics_events') as RecordService,

  // Chat
  chatConversations: adminInstance.getClient().collection('chat_conversations') as RecordService,
  chatMessages: adminInstance.getClient().collection('chat_messages') as RecordService,

  // Notifications
  notifications: adminInstance.getClient().collection('notifications') as RecordService,

  // Audit
  auditLogs: adminInstance.getClient().collection('audit_logs') as RecordService,

  // API Keys
  apiKeys: adminInstance.getClient().collection('api_keys') as RecordService,
} as const;

// ==================== HELPER FUNCTIONS ====================

/**
 * Execute an admin operation with automatic authentication
 */
export async function withAdmin<T>(
  operation: (pb: PocketBase) => Promise<T>
): Promise<T> {
  const client = pbAdmin.getClient();
  
  if (!pbAdmin.isAuth()) {
    await pbAdmin.authenticate();
  }

  try {
    return await operation(client);
  } catch (error) {
    // Try to refresh auth on error
    if (await pbAdmin.refresh()) {
      return await operation(client);
    }
    throw error;
  }
}

/**
 * Get admin health status
 */
export async function getAdminHealth(): Promise<{
  status: 'healthy' | 'unhealthy';
  authenticated: boolean;
  message: string;
}> {
  try {
    const client = pbAdmin.getClient();
    await client.health.check();

    const authenticated = pbAdmin.isAuth();
    
    return {
      status: 'healthy',
      authenticated,
      message: authenticated 
        ? 'PocketBase admin client is ready'
        : 'PocketBase server is running (not authenticated)',
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      authenticated: false,
      message: String(error),
    };
  }
}

// ==================== DEFAULT EXPORT ====================

export default pbAdmin;
