import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { pb, collections } from '@/lib/pocketbase';

/**
 * Products API Route
 * 
 * GET    /api/v1/products          - List products
 * POST   /api/v1/products          - Create product
 * GET    /api/v1/products/:id      - Get product
 * PATCH  /api/v1/products/:id      - Update product
 * DELETE /api/v1/products/:id      - Delete product
 */

// ==================== VALIDATION SCHEMAS ====================

const createProductSchema = z.object({
  orgId: z.string().min(1, 'Organization ID is required'),
  name: z.string().min(1, 'Name is required').max(255),
  sku: z.string().min(1, 'SKU is required').max(50),
  barcode: z.string().optional(),
  description: z.string().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED']).default('DRAFT'),
  costPrice: z.number().positive().optional(),
  imageUrl: z.string().url().optional(),
  weight: z.number().positive().optional(),
  weightUnit: z.enum(['kg', 'lb', 'oz', 'g']).optional(),
  dimensions: z.object({
    length: z.number().positive().optional(),
    width: z.number().positive().optional(),
    height: z.number().positive().optional(),
    unit: z.enum(['cm', 'in', 'mm', 'm']).optional(),
  }).optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.unknown()).optional(),
});

const updateProductSchema = createProductSchema.partial();

const listProductsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(20),
  sort: z.string().optional(),
  filter: z.string().optional(),
  search: z.string().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED']).optional(),
  orgId: z.string().optional(),
});

// ==================== HELPER FUNCTIONS ====================

function successResponse(data: unknown, meta?: Record<string, unknown>) {
  return NextResponse.json({
    status: 'success',
    data,
    meta,
    errors: [],
    requestId: crypto.randomUUID(),
  });
}

function errorResponse(errors: string[], status = 400) {
  return NextResponse.json(
    {
      status: 'error',
      data: null,
      errors,
      requestId: crypto.randomUUID(),
    },
    { status }
  );
}

function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

// ==================== GET HANDLER ====================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const params = {
      page: searchParams.get('page') || '1',
      perPage: searchParams.get('perPage') || '20',
      sort: searchParams.get('sort') || undefined,
      filter: searchParams.get('filter') || undefined,
      search: searchParams.get('search') || undefined,
      status: searchParams.get('status') || undefined,
      orgId: searchParams.get('orgId') || undefined,
    };

    const validatedParams = listProductsSchema.parse(params);

    // Build filter string
    const filters: string[] = [];
    
    if (validatedParams.orgId) {
      filters.push(`orgId = "${validatedParams.orgId}"`);
    }
    
    if (validatedParams.status) {
      filters.push(`status = "${validatedParams.status}"`);
    }
    
    if (validatedParams.search) {
      filters.push(`(name ~ "${validatedParams.search}" || sku ~ "${validatedParams.search}")`);
    }
    
    if (validatedParams.filter) {
      filters.push(validatedParams.filter);
    }

    const filterString = filters.length > 0 ? filters.join(' && ') : undefined;

    const result = await collections.products.getList(
      validatedParams.page,
      validatedParams.perPage,
      {
        sort: validatedParams.sort || '-created',
        filter: filterString,
      }
    );

    return successResponse(result.items, {
      page: result.page,
      perPage: result.perPage,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.errors.map((e) => e.message));
    }
    console.error('Products list error:', error);
    return errorResponse(['Failed to fetch products'], 500);
  }
}

// ==================== POST HANDLER ====================

export async function POST(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return errorResponse(['Authentication required'], 401);
    }

    // Verify auth token
    try {
      pb.authStore.save(token);
      await pb.collection('users').authRefresh();
    } catch {
      return errorResponse(['Invalid or expired token'], 401);
    }

    const body = await request.json();
    const validatedData = createProductSchema.parse(body);

    // Check if SKU already exists for this organization
    const existingProduct = await collections.products.getFirstListItem(
      `orgId = "${validatedData.orgId}" && sku = "${validatedData.sku}"`
    );

    if (existingProduct) {
      return errorResponse(['A product with this SKU already exists'], 409);
    }

    const record = await collections.products.create(validatedData);

    return successResponse(record, { message: 'Product created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.errors.map((e) => e.message));
    }
    console.error('Product create error:', error);
    return errorResponse(['Failed to create product'], 500);
  }
}
