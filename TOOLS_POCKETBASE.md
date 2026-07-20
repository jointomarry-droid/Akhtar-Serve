# PocketBase Tools & Utilities

This directory contains all PocketBase-related tools, scripts, and utilities for Akhtar-Serve.

## Quick Start

```bash
# 1. Start PocketBase server
npm run pocketbase:serve

# 2. Setup collections (run once)
npm run pocketbase:setup

# 3. Seed sample data (optional)
npm run pocketbase:seed

# 4. Test connection
npm run pocketbase:test

# 5. Access admin dashboard
# http://localhost:8090/_/
```

## Available Commands

### Server Management

| Command | Description |
|---------|-------------|
| `npm run pocketbase:serve` | Start PocketBase server |
| `npm run pocketbase:health` | Check server health |
| `npm run pocketbase:test` | Run comprehensive connection tests |
| `npm run pocketbase:debug` | Debug connection and configuration |

### Data Management

| Command | Description |
|---------|-------------|
| `npm run pocketbase:setup` | Create all 24 collections |
| `npm run pocketbase:seed` | Seed sample data |
| `npm run pocketbase:migrate` | Migrate from Firestore |
| `npm run pocketbase:migrate:dry` | Dry run migration |

### Backup Management

| Command | Description |
|---------|-------------|
| `npm run pocketbase:backup:create` | Create a backup |
| `npm run pocketbase:backup:list` | List all backups |
| `npm run pocketbase:backup:restore` | Restore from backup |
| `npm run pocketbase:backup:cleanup` | Delete old backups |

## File Structure

```
├── lib/
│   ├── pocketbase.ts              # Main client singleton
│   ├── pocketbase-admin.ts        # Server-side admin SDK
│   ├── pocketbase-auth.ts         # Authentication middleware
│   ├── pocketbase-config.ts       # Configuration utility
│   └── pocketbase-errors.ts       # Error handling & logging
├── hooks/
│   ├── usePocketBase.ts           # Core React hooks
│   └── usePocketBaseQuery.ts      # TanStack Query integration
├── stores/
│   └── pocketbase-store.ts        # Zustand global state
├── contexts/
│   └── pocketbase-context.tsx     # React context provider
├── types/
│   └── pocketbase.ts              # TypeScript types
├── scripts/
│   ├── setup-pocketbase-collections.ts  # Auto-create collections
│   ├── seed-pocketbase-data.ts          # Seed sample data
│   ├── test-pocketbase-connection.ts    # Connection tests
│   ├── pocketbase-backup.ts             # Backup utility
│   ├── migrate-from-firestore.ts        # Firestore migration
│   └── start-pocketbase.ps1             # Windows startup script
├── components/
│   ├── pocketbase/
│   │   └── health-dashboard.tsx   # Health monitoring UI
│   └── examples/
│       └── pocketbase-examples.tsx # Example components
├── app/api/v1/pocketbase/
│   ├── [...path]/route.ts         # API proxy
│   └── health/route.ts            # Health endpoint
└── pb/                            # PocketBase directory
    ├── pocketbase.exe             # PocketBase binary
    └── data/                      # Database files
```

## Configuration

### Environment Variables

Add to `.env.local`:

```env
# PocketBase Server
NEXT_PUBLIC_POCKETBASE_URL=http://localhost:8090
POCKETBASE_PORT=8090
POCKETBASE_HOST=127.0.0.1

# Admin Credentials
POCKETBASE_ADMIN_EMAIL=admin@akhtarserve.com
POCKETBASE_ADMIN_PASSWORD=your-admin-password

# Data Directory
POCKETBASE_DATA_DIR=./pb/data

# CORS
POCKETBASE_CORS_ORIGINS=http://localhost:3000

# Logging
POCKETBASE_LOG_LEVEL=info
```

## Usage Examples

### Basic Operations

```typescript
import { collections } from '@/lib/pocketbase';

// Get all products
const products = await collections.products.getFullList();

// Create a product
const product = await collections.products.create({
  name: 'Wireless Headphones',
  sku: 'WH-001',
  price: 99.99,
});

// Real-time subscription
collections.orders.subscribe('*', (event) => {
  console.log('New order:', event.record);
});
```

### React Hooks

```tsx
'use client';
import { usePocketBaseList, usePocketBaseRealtime } from '@/hooks/usePocketBase';

function Products() {
  const { data, isLoading } = usePocketBaseList('products');
  const { data: realtime } = usePocketBaseRealtime('products');

  return (
    <ul>
      {data.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}
```

### TanStack Query

```tsx
'use client';
import { useProductsQuery, useCreateProductMutation } from '@/hooks/usePocketBaseQuery';

function Products() {
  const { data, isLoading } = useProductsQuery({ orgId: '123' });
  const createProduct = useCreateProductMutation();

  return (
    <div>
      {data.map(p => <div key={p.id}>{p.name}</div>)}
      <button onClick={() => createProduct.mutate({ name: 'New Product' })}>
        Add Product
      </button>
    </div>
  );
}
```

### Authentication

```typescript
import { verifyPocketBaseToken, withAuth } from '@/lib/pocketbase-auth';

// Protect API routes
export const GET = withAuth(async (request, { user }) => {
  return NextResponse.json({ userId: user.id });
});
```

### Error Handling

```typescript
import { PocketBaseError, withRetry } from '@/lib/pocketbase-errors';

try {
  await withRetry(() => collections.products.create(data), {
    maxAttempts: 3,
    backoff: 'exponential',
  });
} catch (error) {
  throw new PocketBaseError('Failed to create product', error, {
    collection: 'products',
    operation: 'create',
  });
}
```

## Collections

The following 24 collections are created:

### Core
- `users` - User accounts
- `organizations` - Multi-tenant organizations
- `org_members` - Organization memberships

### Products
- `products` - Product catalog
- `product_variants` - Product variations
- `product_media` - Images, videos
- `product_listings` - Marketplace listings

### Orders
- `orders` - Customer orders
- `order_items` - Order line items
- `order_fulfillments` - Shipping tracking
- `order_returns` - Returns & refunds

### Inventory
- `inventory` - Stock levels
- `inventory_locations` - Warehouses
- `inventory_adjustments` - Stock changes

### Integrations
- `integrations` - Amazon, eBay connections
- `integration_logs` - API call logs

### Analytics
- `daily_metrics` - Daily KPIs
- `analytics_events` - User events

### Pricing
- `pricing_rules` - Dynamic pricing

### Communication
- `chat_conversations` - AI chat
- `chat_messages` - Chat messages

### System
- `notifications` - User notifications
- `audit_logs` - Audit trail
- `api_keys` - API key management

## Troubleshooting

### PocketBase won't start

```bash
# Check if port is in use
netstat -ano | findstr :8090

# Kill process using the port
taskkill /PID <PID> /F

# Try again
npm run pocketbase:serve
```

### Connection refused

```bash
# Check if PocketBase is running
curl http://localhost:8090/api/health

# Check logs
# Logs are printed to console
```

### Authentication failed

```bash
# Verify admin credentials in .env.local
cat .env.local | grep POCKETBASE_ADMIN

# Reset admin password
# Access admin dashboard: http://localhost:8090/_/
```

## Documentation

- `POCKETBASE_INTEGRATION.md` - Complete setup guide
- `POCKETBASE_DEEP_SUMMARY.md` - Architecture overview
- `lib/pocketbase-schemas.ts` - Collection schemas
- `types/pocketbase.ts` - TypeScript types
