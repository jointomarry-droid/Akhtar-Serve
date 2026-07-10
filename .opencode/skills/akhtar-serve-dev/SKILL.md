---
name: akhtar-serve-dev
description: Use when building, modifying, or debugging the Akhtar-Serve Amazon & eBay service provider web application. Covers Next.js 14+ App Router, TypeScript, Prisma ORM, PostgreSQL, Tailwind CSS, shadcn/ui, marketplace API integrations (Amazon SP-API, eBay API), and e-commerce feature implementation.
---

# Akhtar-Serve Development Skill

## Project Context

**Akhtar-Serve** is an enterprise-grade web application for Amazon and eBay sellers. It provides multi-channel e-commerce management including product listings, inventory, orders, pricing, analytics, and marketplace integrations.

## Technology Stack

```
Frontend:  Next.js 14+ (App Router), React 18+, TypeScript, Tailwind CSS, shadcn/ui
Backend:   Next.js API Routes, Node.js 20+ LTS
Database:  PostgreSQL 16+ via Prisma ORM
Cache:     Redis 7+
Auth:      NextAuth.js / Auth.js with OAuth 2.0
State:     TanStack Query (React Query), Zustand
Testing:   Vitest (unit), Playwright (E2E)
```

## Project Structure

```
akhtar-serve/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/              # Protected dashboard route group
│   │   ├── dashboard/page.tsx
│   │   ├── products/page.tsx
│   │   ├── listings/page.tsx
│   │   ├── inventory/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── integrations/page.tsx
│   │   ├── team/page.tsx
│   │   ├── settings/page.tsx
│   │   └── layout.tsx
│   ├── api/                      # API routes
│   │   └── v1/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── products/route.ts
│   │       ├── orders/route.ts
│   │       └── ...
│   ├── layout.tsx
│   └── page.tsx
├── components/                   # Reusable UI components
│   ├── ui/                       # shadcn/ui components
│   ├── layout/                   # Layout components
│   ├── products/                 # Product-specific components
│   ├── orders/                   # Order-specific components
│   └── dashboard/                # Dashboard-specific components
├── lib/                          # Utility libraries
│   ├── prisma.ts                 # Prisma client singleton
│   ├── auth.ts                   # NextAuth configuration
│   ├── redis.ts                  # Redis client
│   ├── validations.ts            # Zod schemas
│   └── utils.ts                  # Helper utilities
├── prisma/                       # Database schema & migrations
│   ├── schema.prisma
│   └── seed.ts
├── hooks/                        # Custom React hooks
├── types/                        # TypeScript type definitions
├── constants/                    # App constants
└── public/                       # Static assets
```

## Coding Conventions

### TypeScript
- Use strict mode (`strict: true` in tsconfig)
- Prefer `interface` over `type` for object shapes
- Use explicit return types for functions
- Avoid `any` - use `unknown` and narrow with type guards
- Use branded types for IDs: `type UserId = string & { __brand: 'UserId' }`

### React / Next.js
- Use Server Components by default, add `'use client'` only when needed
- Use App Router conventions: `layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`
- Colocate related files in route directories
- Use `@/` path alias for imports
- Prefer named exports over default exports

### API Routes
- Use Next.js Route Handlers (`route.ts`)
- Validate request bodies with Zod schemas
- Return consistent response format: `{ status, data, meta, errors, requestId }`
- Use proper HTTP status codes
- Implement rate limiting with Redis

### Database (Prisma)
- Use Prisma client singleton from `lib/prisma.ts`
- Always use transactions for multi-step operations
- Use `select` to avoid over-fetching
- Index foreign keys and frequently queried columns
- Use `@default(uuid())` for primary keys

### Styling
- Use Tailwind CSS utility classes
- Follow shadcn/ui patterns for components
- Use CSS variables for theme colors
- Implement dark mode with `next-themes`
- Mobile-first responsive design

### Testing
- Write unit tests for utility functions
- Write integration tests for API routes
- Write E2E tests for critical user flows
- Aim for 80%+ code coverage

## Common Patterns

### API Response Helper
```typescript
import { NextResponse } from 'next/server';

export function successResponse(data: any, meta?: any) {
  return NextResponse.json({
    status: 'success',
    data,
    meta,
    errors: [],
    requestId: crypto.randomUUID(),
  });
}

export function errorResponse(errors: string[], status = 400) {
  return NextResponse.json({
    status: 'error',
    data: null,
    errors,
    requestId: crypto.randomUUID(),
  }, { status });
}
```

### Prisma Client Singleton
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### Zod Validation Schema
```typescript
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  sku: z.string().min(1).max(50),
  price: z.number().positive(),
  description: z.string().optional(),
  marketplace: z.enum(['amazon', 'ebay', 'both']),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
```

## Marketplace Integration Notes

### Amazon SP-API
- Use LWA (Login with Amazon) for authorization
- Implement rate limiting (varies by API endpoint)
- Handle throttling with exponential backoff
- Store refresh tokens securely in database
- Use SQS/SNS for real-time notifications

### eBay API
- Use OAuth 2.0 client credentials + user token flow
- Implement pagination for listing endpoints
- Handle token refresh automatically
- Use eBay's bulk operations for efficiency
- Respect eBay's rate limits (varies by API call)

## Security Checklist

- [ ] Environment variables for all secrets (never hardcode)
- [ ] Input validation on all API endpoints
- [ ] SQL injection prevention via Prisma parameterized queries
- [ ] XSS protection via React's automatic escaping + CSP headers
- [ ] CSRF protection with SameSite cookies
- [ ] Rate limiting on authentication endpoints
- [ ] Secure HTTP headers (HSTS, X-Frame-Options, etc.)
- [ ] API key rotation strategy documented

## Debugging Tips

1. **Prisma queries not returning data**: Check if you're using `include` vs `select` correctly
2. **Auth issues**: Verify `NEXTAUTH_URL` and `NEXTAUTH_SECRET` env vars
3. **API 500 errors**: Check server logs, verify database connection
4. **Styling issues**: Use Tailwind's `debug` class or browser dev tools
5. **Build failures**: Run `npx prisma generate` after schema changes
