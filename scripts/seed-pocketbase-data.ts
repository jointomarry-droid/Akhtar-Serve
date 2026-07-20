/**
 * PocketBase Seed Data Script
 * 
 * Populates the database with sample data for development and testing.
 * 
 * Usage:
 *   npx tsx scripts/seed-pocketbase-data.ts
 * 
 * Requirements:
 *   - PocketBase server running on http://localhost:8090
 *   - Collections already created (run setup-pocketbase-collections.ts first)
 */

import PocketBase from 'pocketbase';

// ==================== CONFIGURATION ====================

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090';
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || 'admin@akhtarserve.com';
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || 'Admin@12345!';

// ==================== SAMPLE DATA ====================

const SAMPLE_USERS = [
  {
    username: 'admin',
    email: 'admin@akhtarserve.com',
    name: 'Admin User',
    password: 'Admin@12345!',
    passwordConfirm: 'Admin@12345!',
    role: 'OWNER',
    status: 'ACTIVE',
    verified: true,
  },
  {
    username: 'manager',
    email: 'manager@example.com',
    name: 'Manager User',
    password: 'Manager@123!',
    passwordConfirm: 'Manager@123!',
    role: 'MANAGER',
    status: 'ACTIVE',
    verified: true,
  },
  {
    username: 'member',
    email: 'member@example.com',
    name: 'Member User',
    password: 'Member@123!',
    passwordConfirm: 'Member@123!',
    role: 'MEMBER',
    status: 'ACTIVE',
    verified: true,
  },
];

const SAMPLE_ORGANIZATIONS = [
  {
    name: 'Akhtar Electronics',
    slug: 'akhtar-electronics',
    plan: 'PROFESSIONAL',
    ownerId: '', // Will be set after user creation
    settings: {
      currency: 'USD',
      timezone: 'America/New_York',
      notifications: true,
    },
    website: 'https://akhtarelectronics.com',
    industry: 'Electronics',
    employeeCount: 50,
  },
  {
    name: 'Global Trading Co',
    slug: 'global-trading',
    plan: 'ENTERPRISE',
    ownerId: '', // Will be set after user creation
    settings: {
      currency: 'EUR',
      timezone: 'Europe/London',
      notifications: true,
    },
    website: 'https://globaltrading.com',
    industry: 'General Retail',
    employeeCount: 100,
  },
];

const SAMPLE_PRODUCTS = [
  {
    name: 'Wireless Bluetooth Headphones',
    sku: 'WBH-001',
    barcode: '1234567890123',
    description: 'Premium wireless headphones with noise cancellation',
    brand: 'TechAudio',
    category: 'Electronics > Audio > Headphones',
    status: 'ACTIVE',
    costPrice: 45.99,
    weight: 0.25,
    weightUnit: 'kg',
    dimensions: {
      length: 20,
      width: 15,
      height: 8,
      unit: 'cm',
    },
    tags: ['wireless', 'bluetooth', 'headphones', 'noise-cancelling'],
  },
  {
    name: 'Smart Fitness Watch',
    sku: 'SFW-002',
    barcode: '1234567890124',
    description: 'Advanced fitness tracking smartwatch',
    brand: 'FitTech',
    category: 'Electronics > Wearables > Watches',
    status: 'ACTIVE',
    costPrice: 89.99,
    weight: 0.05,
    weightUnit: 'kg',
    dimensions: {
      length: 5,
      width: 5,
      height: 1.5,
      unit: 'cm',
    },
    tags: ['smartwatch', 'fitness', 'wearable'],
  },
  {
    name: 'Portable Bluetooth Speaker',
    sku: 'PBS-003',
    barcode: '1234567890125',
    description: 'Compact waterproof Bluetooth speaker',
    brand: 'SoundWave',
    category: 'Electronics > Audio > Speakers',
    status: 'ACTIVE',
    costPrice: 32.99,
    weight: 0.35,
    weightUnit: 'kg',
    dimensions: {
      length: 10,
      width: 10,
      height: 12,
      unit: 'cm',
    },
    tags: ['speaker', 'bluetooth', 'portable', 'waterproof'],
  },
  {
    name: 'USB-C Charging Cable',
    sku: 'UCC-004',
    barcode: '1234567890126',
    description: 'Fast charging USB-C cable (2m)',
    brand: 'ChargeMaster',
    category: 'Electronics > Accessories > Cables',
    status: 'ACTIVE',
    costPrice: 8.99,
    weight: 0.05,
    weightUnit: 'kg',
    dimensions: {
      length: 200,
      width: 1,
      height: 1,
      unit: 'cm',
    },
    tags: ['usb-c', 'charging', 'cable'],
  },
  {
    name: 'Wireless Charging Pad',
    sku: 'WCP-005',
    barcode: '1234567890127',
    description: 'Qi-compatible wireless charging pad',
    brand: 'ChargeMaster',
    category: 'Electronics > Accessories > Chargers',
    status: 'DRAFT',
    costPrice: 15.99,
    weight: 0.1,
    weightUnit: 'kg',
    dimensions: {
      length: 10,
      width: 10,
      height: 1,
      unit: 'cm',
    },
    tags: ['wireless', 'charging', 'qi'],
  },
];

const SAMPLE_ORDERS = [
  {
    marketplace: 'AMAZON',
    marketplaceOrderId: 'AMZ-1122334455',
    status: 'DELIVERED',
    customerEmail: 'customer1@example.com',
    customerName: 'John Smith',
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'US',
      postalCode: '10001',
    },
    subtotal: 145.98,
    tax: 11.68,
    shippingCost: 9.99,
    total: 167.65,
    currency: 'USD',
    paymentMethod: 'Credit Card',
    paymentStatus: 'PAID',
    fulfillmentStatus: 'FULFILLED',
    orderedAt: '2024-01-15T10:30:00Z',
    shippedAt: '2024-01-16T14:20:00Z',
    deliveredAt: '2024-01-18T16:45:00Z',
  },
  {
    marketplace: 'EBAY',
    marketplaceOrderId: 'EBAY-9988776655',
    status: 'SHIPPED',
    customerEmail: 'customer2@example.com',
    customerName: 'Jane Doe',
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      country: 'US',
      postalCode: '90001',
    },
    subtotal: 89.99,
    tax: 7.20,
    shippingCost: 5.99,
    total: 103.18,
    currency: 'USD',
    paymentMethod: 'PayPal',
    paymentStatus: 'PAID',
    fulfillmentStatus: 'PARTIALLY_FULFILLED',
    orderedAt: '2024-01-17T09:15:00Z',
    shippedAt: '2024-01-18T11:30:00Z',
  },
  {
    marketplace: 'AMAZON',
    marketplaceOrderId: 'AMZ-5566778899',
    status: 'PROCESSING',
    customerEmail: 'customer3@example.com',
    customerName: 'Bob Johnson',
    shippingAddress: {
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      country: 'US',
      postalCode: '60601',
    },
    subtotal: 32.99,
    tax: 2.64,
    shippingCost: 4.99,
    total: 40.62,
    currency: 'USD',
    paymentMethod: 'Credit Card',
    paymentStatus: 'PAID',
    fulfillmentStatus: 'UNFULFILLED',
    orderedAt: '2024-01-19T14:45:00Z',
  },
];

const SAMPLE_INVENTORY_LOCATIONS = [
  {
    name: 'Main Warehouse',
    type: 'WAREHOUSE',
    address: {
      street: '100 Industrial Blvd',
      city: 'Newark',
      state: 'NJ',
      country: 'US',
      postalCode: '07101',
    },
    isActive: true,
    priority: 1,
  },
  {
    name: 'West Coast Distribution Center',
    type: 'WAREHOUSE',
    address: {
      street: '200 Commerce Dr',
      city: 'Los Angeles',
      state: 'CA',
      country: 'US',
      postalCode: '90001',
    },
    isActive: true,
    priority: 2,
  },
  {
    name: 'Retail Store - Manhattan',
    type: 'STORE',
    address: {
      street: '500 5th Ave',
      city: 'New York',
      state: 'NY',
      country: 'US',
      postalCode: '10001',
    },
    isActive: true,
    priority: 3,
  },
];

// ==================== SEED FUNCTIONS ====================

async function seedUsers(pb: PocketBase): Promise<string[]> {
  console.log('\n👥 Seeding users...');
  const userIds: string[] = [];

  for (const userData of SAMPLE_USERS) {
    try {
      // Check if user already exists
      try {
        const existing = await pb.collection('users').getFirstListItem(`email = "${userData.email}"`);
        console.log(`   ⏭️  User ${userData.email} already exists`);
        userIds.push(existing.id);
        continue;
      } catch {
        // User doesn't exist, create it
      }

      const record = await pb.collection('users').create(userData);
      console.log(`   ✅ Created user: ${userData.email}`);
      userIds.push(record.id);
    } catch (error) {
      console.error(`   ❌ Failed to create user ${userData.email}:`, error);
    }
  }

  return userIds;
}

async function seedOrganizations(pb: PocketBase, userIds: string[]): Promise<string[]> {
  console.log('\n🏢 Seeding organizations...');
  const orgIds: string[] = [];

  for (let i = 0; i < SAMPLE_ORGANIZATIONS.length; i++) {
    const orgData = SAMPLE_ORGANIZATIONS[i];
    const ownerId = userIds[0]; // Use first user as owner

    try {
      // Check if organization already exists
      try {
        const existing = await pb.collection('organizations').getFirstListItem(`slug = "${orgData.slug}"`);
        console.log(`   ⏭️  Organization ${orgData.name} already exists`);
        orgIds.push(existing.id);
        continue;
      } catch {
        // Organization doesn't exist, create it
      }

      const record = await pb.collection('organizations').create({
        ...orgData,
        ownerId,
      });

      // Add owner as member
      await pb.collection('org_members').create({
        organizationId: record.id,
        userId: ownerId,
        role: 'OWNER',
        status: 'ACTIVE',
        joinedAt: new Date().toISOString(),
      });

      console.log(`   ✅ Created organization: ${orgData.name}`);
      orgIds.push(record.id);
    } catch (error) {
      console.error(`   ❌ Failed to create organization ${orgData.name}:`, error);
    }
  }

  return orgIds;
}

async function seedProducts(pb: PocketBase, orgIds: string[]): Promise<string[]> {
  console.log('\n📦 Seeding products...');
  const productIds: string[] = [];

  for (const productData of SAMPLE_PRODUCTS) {
    try {
      // Check if product already exists
      try {
        const existing = await pb.collection('products').getFirstListItem(`sku = "${productData.sku}"`);
        console.log(`   ⏭️  Product ${productData.sku} already exists`);
        productIds.push(existing.id);
        continue;
      } catch {
        // Product doesn't exist, create it
      }

      const record = await pb.collection('products').create({
        ...productData,
        orgId: orgIds[0], // Assign to first organization
      });

      console.log(`   ✅ Created product: ${productData.name}`);
      productIds.push(record.id);
    } catch (error) {
      console.error(`   ❌ Failed to create product ${productData.sku}:`, error);
    }
  }

  return productIds;
}

async function seedInventory(pb: PocketBase, productIds: string[], locationIds: string[]): Promise<void> {
  console.log('\n📊 Seeding inventory...');

  for (let i = 0; i < productIds.length; i++) {
    const productId = productIds[i];
    const locationId = locationIds[0]; // Main warehouse

    try {
      // Check if inventory already exists
      try {
        const existing = await pb.collection('inventory').getFirstListItem(
          `productId = "${productId}" && locationId = "${locationId}"`
        );
        console.log(`   ⏭️  Inventory for product ${i + 1} already exists`);
        continue;
      } catch {
        // Inventory doesn't exist, create it
      }

      const quantity = Math.floor(Math.random() * 100) + 10;
      const reserved = Math.floor(Math.random() * 10);

      await pb.collection('inventory').create({
        productId,
        locationId,
        quantity,
        reserved,
        available: quantity - reserved,
        reorderPoint: 20,
        reorderQuantity: 50,
        unitCost: Math.random() * 50 + 10,
        lastCountedAt: new Date().toISOString(),
      });

      console.log(`   ✅ Created inventory for product ${i + 1}`);
    } catch (error) {
      console.error(`   ❌ Failed to create inventory for product ${i + 1}:`, error);
    }
  }
}

async function seedOrders(pb: PocketBase, orgIds: string[], productIds: string[]): Promise<void> {
  console.log('\n🛒 Seeding orders...');

  for (let i = 0; i < SAMPLE_ORDERS.length; i++) {
    const orderData = SAMPLE_ORDERS[i];

    try {
      // Check if order already exists
      try {
        const existing = await pb.collection('orders').getFirstListItem(
          `marketplaceOrderId = "${orderData.marketplaceOrderId}"`
        );
        console.log(`   ⏭️  Order ${orderData.marketplaceOrderId} already exists`);
        continue;
      } catch {
        // Order doesn't exist, create it
      }

      const record = await pb.collection('orders').create({
        ...orderData,
        orgId: orgIds[0], // Assign to first organization
      });

      // Add order items
      const numItems = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < numItems; j++) {
        const productId = productIds[Math.floor(Math.random() * productIds.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const unitPrice = Math.random() * 100 + 10;

        await pb.collection('order_items').create({
          orderId: record.id,
          productId,
          name: `Item ${j + 1}`,
          sku: `SKU-${j + 1}`,
          quantity,
          unitPrice,
          total: unitPrice * quantity,
        });
      }

      console.log(`   ✅ Created order: ${orderData.marketplaceOrderId}`);
    } catch (error) {
      console.error(`   ❌ Failed to create order ${orderData.marketplaceOrderId}:`, error);
    }
  }
}

async function seedInventoryLocations(pb: PocketBase, orgIds: string[]): Promise<string[]> {
  console.log('\n🏭 Seeding inventory locations...');
  const locationIds: string[] = [];

  for (const locationData of SAMPLE_INVENTORY_LOCATIONS) {
    try {
      // Check if location already exists
      try {
        const existing = await pb.collection('inventory_locations').getFirstListItem(
          `name = "${locationData.name}"`
        );
        console.log(`   ⏭️  Location ${locationData.name} already exists`);
        locationIds.push(existing.id);
        continue;
      } catch {
        // Location doesn't exist, create it
      }

      const record = await pb.collection('inventory_locations').create({
        ...locationData,
        orgId: orgIds[0], // Assign to first organization
      });

      console.log(`   ✅ Created location: ${locationData.name}`);
      locationIds.push(record.id);
    } catch (error) {
      console.error(`   ❌ Failed to create location ${locationData.name}:`, error);
    }
  }

  return locationIds;
}

// ==================== MAIN FUNCTION ====================

async function seedDatabase(): Promise<void> {
  console.log('\n' + '='.repeat(60));
  console.log('🌱 PocketBase Seed Data Script');
  console.log('='.repeat(60));

  const pb = new PocketBase(POCKETBASE_URL);

  // Check connection
  console.log('\n📡 Checking PocketBase connection...');
  try {
    await pb.health.check();
    console.log('✅ Connected to PocketBase');
  } catch (error) {
    console.error('❌ Failed to connect to PocketBase:', error);
    console.log('💡 Make sure PocketBase is running: npm run pocketbase:serve');
    process.exit(1);
  }

  // Authenticate using direct HTTP (SDK/admins endpoint mismatch)
  console.log('\n🔐 Authenticating as admin...');
  try {
    const authRes = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    if (!authRes.ok) throw new Error('Auth failed');
    const authData = await authRes.json() as { token: string };
    pb.authStore.save(authData.token);
    console.log('✅ Authenticated successfully');
  } catch (error) {
    console.error('❌ Failed to authenticate:', error);
    console.log('💡 Check your admin credentials in .env.local');
    process.exit(1);
  }

  // Seed data
  const userIds = await seedUsers(pb);
  const orgIds = await seedOrganizations(pb, userIds);
  const locationIds = await seedInventoryLocations(pb, orgIds);
  const productIds = await seedProducts(pb, orgIds);
  await seedInventory(pb, productIds, locationIds);
  await seedOrders(pb, orgIds, productIds);

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('✨ Seed data created successfully!');
  console.log('='.repeat(60));
  console.log('\nYou can now:');
  console.log('1. Access the admin dashboard: http://localhost:8090/_/');
  console.log('2. Login with: admin@akhtarserve.com / Admin@12345!');
  console.log('3. View the seeded data');
  console.log('');
}

// ==================== RUN ====================

seedDatabase().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
