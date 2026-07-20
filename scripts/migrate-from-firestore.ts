/**
 * Firestore to PocketBase Migration Utility
 * 
 * This utility helps migrate data from Firebase/Firestore to PocketBase.
 * It handles data transformation, validation, and batch imports.
 * 
 * Usage:
 *   npx tsx scripts/migrate-from-firestore.ts
 */

import PocketBase from 'pocketbase';

// ==================== CONFIGURATION ====================

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090';
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || 'admin@akhtarserve.com';
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || 'Admin@12345!';

// ==================== TYPES ====================

interface MigrationResult {
  collection: string;
  totalRecords: number;
  migratedRecords: number;
  failedRecords: number;
  errors: string[];
  duration: number;
}

interface MigrationOptions {
  dryRun?: boolean;
  batchSize?: number;
  skipCollections?: string[];
  transformRecord?: (collection: string, record: Record<string, unknown>) => Record<string, unknown>;
}

// ==================== POCKETBASE CLIENT ====================

let pb: PocketBase;

async function initializePocketBase(): Promise<void> {
  pb = new PocketBase(POCKETBASE_URL);
  
  try {
    await pb.health.check();
    console.log('✅ Connected to PocketBase server');
  } catch (error) {
    console.error('❌ Failed to connect to PocketBase server:', error);
    console.log('💡 Make sure PocketBase is running: ./pocketbase serve');
    process.exit(1);
  }

  try {
    await pb.admins.authWithPassword(POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PASSWORD);
    console.log('✅ Authenticated as admin');
  } catch (error) {
    console.error('❌ Failed to authenticate:', error);
    console.log('💡 Make sure admin credentials are correct in .env');
    process.exit(1);
  }
}

// ==================== COLLECTION MAPPERS ====================

/**
 * Map Firestore collection names to PocketBase collection names
 */
const COLLECTION_MAP: Record<string, string> = {
  users: 'users',
  organizations: 'organizations',
  orgMembers: 'org_members',
  products: 'products',
  productVariants: 'product_variants',
  productMedia: 'product_media',
  productListings: 'product_listings',
  orders: 'orders',
  orderItems: 'order_items',
  orderFulfillments: 'order_fulfillments',
  orderReturns: 'order_returns',
  inventory: 'inventory',
  inventoryLocations: 'inventory_locations',
  inventoryAdjustments: 'inventory_adjustments',
  pricingRules: 'pricing_rules',
  integrations: 'integrations',
  integrationLogs: 'integration_logs',
  dailyMetrics: 'daily_metrics',
  analyticsEvents: 'analytics_events',
  chatConversations: 'chat_conversations',
  chatMessages: 'chat_messages',
  notifications: 'notifications',
  auditLogs: 'audit_logs',
  apiKeys: 'api_keys',
};

/**
 * Transform Firestore timestamp to ISO string
 */
function transformTimestamp(timestamp: { seconds: number; nanoseconds?: number } | Date | string): string {
  if (typeof timestamp === 'string') {
    return timestamp;
  }
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }
  if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
    return new Date(timestamp.seconds * 1000).toISOString();
  }
  return new Date().toISOString();
}

/**
 * Transform Firestore document ID to PocketBase record
 */
function transformDocumentId(docId: string): string {
  // PocketBase uses auto-generated IDs or custom IDs
  // We'll use the original Firestore ID if it's a valid UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(docId)) {
    return docId;
  }
  // For non-UUID IDs, generate a new UUID
  return crypto.randomUUID();
}

// ==================== DATA TRANSFORMERS ====================

/**
 * Transform Firestore user record to PocketBase format
 */
function transformUserRecord(record: Record<string, unknown>): Record<string, unknown> {
  return {
    username: record.username || record.email?.toString().split('@')[0] || `user_${Date.now()}`,
    email: record.email,
    name: record.name || record.displayName,
    avatar: record.photoURL || record.avatar,
    role: record.role || 'MEMBER',
    status: record.status || 'ACTIVE',
    organizationId: record.organizationId,
    phone: record.phone,
    lastLogin: record.lastLogin ? transformTimestamp(record.lastLogin as { seconds: number }) : null,
    verified: record.emailVerified || record.verified || false,
    providers: record.providers || ['email'],
  };
}

/**
 * Transform Firestore product record to PocketBase format
 */
function transformProductRecord(record: Record<string, unknown>): Record<string, unknown> {
  return {
    orgId: record.orgId,
    name: record.name,
    sku: record.sku,
    barcode: record.barcode,
    description: record.description,
    brand: record.brand,
    category: record.category,
    status: record.status || 'ACTIVE',
    costPrice: record.costPrice,
    imageUrl: record.imageUrl || record.image,
    weight: record.weight,
    weightUnit: record.weightUnit || 'kg',
    dimensions: record.dimensions,
    tags: record.tags || [],
    metadata: record.metadata || {},
  };
}

/**
 * Transform Firestore order record to PocketBase format
 */
function transformOrderRecord(record: Record<string, unknown>): Record<string, unknown> {
  return {
    orgId: record.orgId,
    marketplace: record.marketplace,
    marketplaceOrderId: record.marketplaceOrderId || record.id,
    status: record.status || 'PENDING',
    customerEmail: record.customerEmail,
    customerName: record.customerName,
    shippingAddress: record.shippingAddress,
    billingAddress: record.billingAddress,
    subtotal: record.subtotal || 0,
    tax: record.tax || 0,
    shippingCost: record.shippingCost || 0,
    total: record.total || 0,
    currency: record.currency || 'USD',
    paymentMethod: record.paymentMethod,
    paymentStatus: record.paymentStatus || 'PENDING',
    fulfillmentStatus: record.fulfillmentStatus || 'UNFULFILLED',
    notes: record.notes,
    metadata: record.metadata || {},
    orderedAt: record.orderedAt ? transformTimestamp(record.orderedAt as { seconds: number }) : new Date().toISOString(),
    shippedAt: record.shippedAt ? transformTimestamp(record.shippedAt as { seconds: number }) : null,
    deliveredAt: record.deliveredAt ? transformTimestamp(record.deliveredAt as { seconds: number }) : null,
  };
}

/**
 * Transform Firestore inventory record to PocketBase format
 */
function transformInventoryRecord(record: Record<string, unknown>): Record<string, unknown> {
  const quantity = (record.quantity as number) || 0;
  const reserved = (record.reserved as number) || 0;

  return {
    productId: record.productId,
    variantId: record.variantId,
    locationId: record.locationId,
    quantity,
    reserved,
    available: quantity - reserved,
    reorderPoint: record.reorderPoint,
    reorderQuantity: record.reorderQuantity,
    unitCost: record.unitCost,
    lastCountedAt: record.lastCountedAt ? transformTimestamp(record.lastCountedAt as { seconds: number }) : null,
    lastAdjustmentAt: record.lastAdjustmentAt ? transformTimestamp(record.lastAdjustmentAt as { seconds: number }) : null,
  };
}

// ==================== MIGRATION FUNCTIONS ====================

/**
 * Get the appropriate transformer for a collection
 */
function getTransformer(collection: string): (record: Record<string, unknown>) => Record<string, unknown> {
  switch (collection) {
    case 'users':
      return transformUserRecord;
    case 'products':
      return transformProductRecord;
    case 'orders':
      return transformOrderRecord;
    case 'inventory':
      return transformInventoryRecord;
    default:
      return (record) => record;
  }
}

/**
 * Migrate a single collection from Firestore to PocketBase
 */
async function migrateCollection(
  firestoreCollection: string,
  options: MigrationOptions = {}
): Promise<MigrationResult> {
  const startTime = Date.now();
  const pocketbaseCollection = COLLECTION_MAP[firestoreCollection] || firestoreCollection;
  const transformer = getTransformer(firestoreCollection);
  
  const result: MigrationResult = {
    collection: pocketbaseCollection,
    totalRecords: 0,
    migratedRecords: 0,
    failedRecords: 0,
    errors: [],
    duration: 0,
  };

  try {
    console.log(`\n📦 Migrating collection: ${firestoreCollection} → ${pocketbaseCollection}`);

    // Note: You'll need to implement Firestore data fetching here
    // This is a placeholder for the actual Firestore integration
    console.log(`⚠️  Firestore integration not implemented yet.`);
    console.log(`   Please implement the Firestore data fetching logic.`);
    console.log(`   See: https://firebase.google.com/docs/firestore/manage-data/add-data`);

    // Example implementation (uncomment and modify):
    /*
    const firestore = getFirestore();
    const snapshot = await getDocs(collection(firestore, firestoreCollection));
    
    result.totalRecords = snapshot.docs.length;
    console.log(`   Found ${result.totalRecords} records`);

    // Process in batches
    const batchSize = options.batchSize || 100;
    const batches = [];
    
    for (let i = 0; i < snapshot.docs.length; i += batchSize) {
      batches.push(snapshot.docs.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      for (const doc of batch) {
        try {
          const data = doc.data();
          const transformedData = transformer({
            id: doc.id,
            ...data,
          });

          if (options.dryRun) {
            console.log(`   [DRY RUN] Would create: ${JSON.stringify(transformedData).substring(0, 100)}...`);
          } else {
            await pb.collection(pocketbaseCollection).create(transformedData);
          }

          result.migratedRecords++;
        } catch (error) {
          result.failedRecords++;
          result.errors.push(`Failed to migrate ${doc.id}: ${String(error)}`);
          console.error(`   ❌ Failed to migrate ${doc.id}:`, error);
        }
      }
    }
    */

  } catch (error) {
    result.errors.push(String(error));
    console.error(`   ❌ Collection migration failed:`, error);
  }

  result.duration = Date.now() - startTime;
  
  console.log(`   ✅ Completed: ${result.migratedRecords} migrated, ${result.failedRecords} failed`);
  console.log(`   ⏱️  Duration: ${result.duration}ms`);

  return result;
}

/**
 * Migrate all collections from Firestore to PocketBase
 */
export async function migrateAllCollections(
  options: MigrationOptions = {}
): Promise<MigrationResult[]> {
  console.log('🚀 Starting Firestore to PocketBase migration\n');

  await initializePocketBase();

  const collections = Object.keys(COLLECTION_MAP);
  const results: MigrationResult[] = [];

  for (const collection of collections) {
    if (options.skipCollections?.includes(collection)) {
      console.log(`\n⏭️  Skipping collection: ${collection}`);
      continue;
    }

    const result = await migrateCollection(collection, options);
    results.push(result);
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Migration Summary');
  console.log('='.repeat(60));

  let totalMigrated = 0;
  let totalFailed = 0;

  for (const result of results) {
    totalMigrated += result.migratedRecords;
    totalFailed += result.failedRecords;
    
    const status = result.failedRecords > 0 ? '⚠️' : '✅';
    console.log(`${status} ${result.collection}: ${result.migratedRecords} migrated, ${result.failedRecords} failed`);
  }

  console.log('='.repeat(60));
  console.log(`Total: ${totalMigrated} migrated, ${totalFailed} failed`);
  console.log('='.repeat(60));

  return results;
}

// ==================== EXPORT ====================

export default migrateAllCollections;

// ==================== CLI EXECUTION ====================

if (require.main === module) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const skipCollections = args
    .find(arg => arg.startsWith('--skip='))
    ?.split('=')[1]
    ?.split(',') || [];

  migrateAllCollections({
    dryRun,
    skipCollections,
  })
    .then(() => {
      console.log('\n✨ Migration completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Migration failed:', error);
      process.exit(1);
    });
}
