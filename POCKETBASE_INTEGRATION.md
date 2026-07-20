# PocketBase Integration Guide for Akhtar-Serve

This guide explains how to set up and use PocketBase with your Next.js application.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Setup](#setup)
4. [Configuration](#configuration)
5. [Usage](#usage)
6. [Real-time Features](#real-time-features)
7. [Authentication](#authentication)
8. [Migration from Firestore](#migration-from-firestore)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## Overview

**PocketBase** is an open-source backend as a service (BaaS) that provides:
- SQLite-based database with real-time subscriptions
- Built-in authentication with OAuth2 support
- File storage
- Admin dashboard
- REST API with real-time capabilities

### Why PocketBase?

| Feature | PocketBase | Firebase |
|---------|------------|----------|
| **Self-hosted** | ✅ Full control | ❌ Managed service |
| **Real-time** | ✅ Built-in | ✅ Built-in |
| **Auth** | ✅ Built-in | ✅ Built-in |
| **File Storage** | ✅ Built-in | ✅ Built-in |
| **Admin Dashboard** | ✅ Built-in | ✅ Console |
| **Pricing** | ✅ Free | 💰 Pay per use |
| **Data Ownership** | ✅ Your server | ❌ Google servers |
| **Offline Support** | ❌ No | ✅ Yes |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Your Next.js App                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐              ┌──────────────────┐     │
│  │ Firebase Auth │              │   PocketBase     │     │
│  │ (Login/OAuth) │              │   (Database)     │     │
│  └──────┬───────┘              └────────┬─────────┘     │
│         │                               │                │
│         ▼                               ▼                │
│  ┌──────────────┐              ┌──────────────────┐     │
│  │  Users table  │              │  Products table   │     │
│  │  Sessions     │              │  Orders table     │     │
│  │  Tokens       │              │  Inventory table  │     │
│  └──────────────┘              │  Real-time sync   │     │
│                                └──────────────────┘     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Setup

### 1. Download PocketBase

Download the latest PocketBase for your OS from [pocketbase.io](https://pocketbase.io/docs/)

```bash
# macOS
curl -LO https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_darwin_arm64.zip
unzip pocketbase_0.22.0_darwin_arm64.zip

# Linux
curl -LO https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_linux_amd64.zip
unzip pocketbase_0.22.0_linux_amd64.zip

# Windows
# Download from: https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_windows_amd64.zip
```

### 2. Start PocketBase Server

```bash
# Create data directory
mkdir pb_data

# Start PocketBase
./pocketbase serve --dir ./pb_data --http=127.0.0.1:8090
```

### 3. Access Admin Dashboard

Open `http://localhost:8090/_/` in your browser and create your first admin account.

### 4. Install PocketBase SDK

```bash
npm install pocketbase
```

---

## Configuration

### Environment Variables

Add these to your `.env.local`:

```env
# PocketBase Server URL
NEXT_PUBLIC_POCKETBASE_URL=http://localhost:8090

# PocketBase Admin Credentials
POCKETBASE_ADMIN_EMAIL=admin@akhtarserve.com
POCKETBASE_ADMIN_PASSWORD=your-admin-password

# PocketBase Version
POCKETBASE_VERSION=0.22.0
```

### TypeScript Configuration

The integration includes comprehensive TypeScript types in `types/pocketbase.ts`.

---

## Usage

### Basic Usage

```typescript
import { pb, collections } from '@/lib/pocketbase';

// Get all products
const products = await collections.products.getFullList();

// Get a single product
const product = await collections.products.getOne('product_id');

// Create a product
const newProduct = await collections.products.create({
  name: 'Wireless Headphones',
  sku: 'WH-001',
  price: 99.99,
  status: 'ACTIVE',
});

// Update a product
await collections.products.update('product_id', {
  price: 79.99,
});

// Delete a product
await collections.products.delete('product_id');
```

### React Hooks

```tsx
'use client';
import { usePocketBaseList, usePocketBaseRealtime } from '@/hooks/usePocketBase';

function ProductsPage() {
  // Fetch with pagination
  const {
    data: products,
    isLoading,
    page,
    setPage,
    totalItems,
  } = usePocketBaseList('products', {
    page: 1,
    perPage: 20,
    sort: '-created',
  });

  // Real-time updates
  const { data: realtimeProducts } = usePocketBaseRealtime('products');

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

---

## Real-time Features

### Subscribe to Collection Changes

```typescript
import { subscribeToCollection } from '@/lib/pocketbase';

// Subscribe to all changes
const unsubscribe = subscribeToCollection('orders', (event) => {
  console.log('Action:', event.action); // 'create', 'update', 'delete'
  console.log('Record:', event.record);
});

// With filter
const unsubscribe = subscribeToCollection('orders', (event) => {
  console.log('New order:', event.record);
}, {
  filter: 'status = "PENDING"',
});

// Unsubscribe
unsubscribe();
```

### Real-time in React

```tsx
'use client';
import { usePocketBaseRealtime } from '@/hooks/usePocketBase';

function OrderNotifications() {
  const { data: notifications } = usePocketBaseRealtime('notifications', [], {
    filter: 'read = false',
  });

  return (
    <div>
      <h3>Unread Notifications ({notifications.length})</h3>
      {notifications.map(n => (
        <div key={n.id}>{n.title}</div>
      ))}
    </div>
  );
}
```

---

## Authentication

### Email/Password Auth

```typescript
import { authenticateWithEmail } from '@/lib/pocketbase';

const result = await authenticateWithEmail('user@example.com', 'password');
if (result.success) {
  console.log('Logged in:', result.data);
}
```

### OAuth2 Auth

```typescript
import { authenticateWithOAuth2 } from '@/lib/pocketbase';

const result = await authenticateWithOAuth2('google');
if (result.success) {
  console.log('Logged in:', result.data);
}
```

### React Auth Hook

```tsx
'use client';
import { usePocketBaseAuth } from '@/hooks/usePocketBase';

function LoginForm() {
  const { login, logout, isAuthenticated, user } = usePocketBaseAuth();

  if (isAuthenticated) {
    return (
      <div>
        <p>Welcome, {user?.name}</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      login('email@example.com', 'password');
    }}>
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## Migration from Firestore

### Using the Migration Script

```bash
# Dry run (no changes)
npm run pocketbase:migrate:dry

# Actual migration
npm run pocketbase:migrate

# Skip specific collections
npm run pocketbase:migrate -- --skip=chatConversations,chatMessages
```

### Manual Migration

1. Export data from Firestore
2. Transform data to match PocketBase schemas
3. Import via PocketBase admin or API

---

## Deployment

### Production Setup

1. **Deploy PocketBase to a VPS:**
   ```bash
   # On your server (e.g., DigitalOcean, Hetzner)
   # Download PocketBase
   curl -LO https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_linux_amd64.zip
   unzip pocketbase_0.22.0_linux_amd64.zip
   
   # Create systemd service
   sudo nano /etc/systemd/system/pocketbase.service
   ```

2. **Systemd Service File:**
   ```ini
   [Unit]
   Description=PocketBase Server
   After=network.target

   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/opt/pocketbase
   ExecStart=/opt/pocketbase/pocketbase serve --dir /opt/pocketbase/data --http=127.0.0.1:8090
   Restart=always
   RestartSec=5

   [Install]
   WantedBy=multi-user.target
   ```

3. **Nginx Reverse Proxy:**
   ```nginx
   server {
       listen 443 ssl http2;
       server_name pb.yourdomain.com;

       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;

       location / {
           proxy_pass http://127.0.0.1:8090;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       location /api/ {
           proxy_pass http://127.0.0.1:8090/api/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       # WebSocket for real-time
       location /api/realtime {
           proxy_pass http://127.0.0.1:8090/api/realtime;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
           proxy_set_header Host $host;
       }
   }
   ```

4. **Update Environment Variables:**
   ```env
   NEXT_PUBLIC_POCKETBASE_URL=https://pb.yourdomain.com
   ```

---

## Troubleshooting

### Common Issues

#### 1. CORS Errors

**Problem:** `Access to fetch has been blocked by CORS policy`

**Solution:** Use the API proxy route or configure CORS in PocketBase:
```bash
./pocketbase serve --cors=*
```

#### 2. Connection Refused

**Problem:** `Failed to fetch` or `Connection refused`

**Solution:**
1. Ensure PocketBase is running: `./pocketbase serve`
2. Check the URL in `.env.local`
3. Verify firewall rules

#### 3. Authentication Errors

**Problem:** `Failed to authenticate`

**Solution:**
1. Check admin credentials in `.env.local`
2. Verify the user exists in PocketBase
3. Check collection rules

#### 4. Real-time Not Working

**Problem:** Updates not appearing in real-time

**Solution:**
1. Check WebSocket connection
2. Verify collection rules allow subscription
3. Check browser console for errors

### Debug Mode

Enable debug logging:

```typescript
import { pb } from '@/lib/pocketbase';

pb.beforeSend = (url, options) => {
  console.log('PocketBase Request:', url, options);
  return { url, options };
};
```

### Health Check

```bash
# Check if PocketBase is running
curl http://localhost:8090/api/health

# Via Next.js API
curl http://localhost:3000/api/v1/pocketbase/health
```

---

## File Structure

```
lib/
├── pocketbase.ts              # PocketBase client singleton
├── pocketbase-schemas.ts      # Collection schemas documentation
└── ...

types/
├── pocketbase.ts              # TypeScript types
└── ...

hooks/
├── usePocketBase.ts           # React hooks
└── ...

contexts/
├── pocketbase-context.tsx     # React context provider
└── ...

app/api/v1/pocketbase/
├── [...path]/route.ts         # API proxy
└── health/route.ts            # Health check

components/examples/
└── pocketbase-examples.tsx    # Example components
```

---

## Additional Resources

- [PocketBase Documentation](https://pocketbase.io/docs/)
- [PocketBase JavaScript SDK](https://pocketbase.io/docs/sdk/)
- [PocketBase GitHub](https://github.com/pocketbase/pocketbase)

---

## Support

For issues specific to this integration:
1. Check the troubleshooting section above
2. Review PocketBase logs
3. Check browser console for errors
4. Verify environment variables

For PocketBase issues:
- [GitHub Issues](https://github.com/pocketbase/pocketbase/issues)
- [Discord Community](https://discord.gg/pocketbase)
