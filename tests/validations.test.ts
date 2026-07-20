import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  createProductSchema,
  updateProductSchema,
  orderQuerySchema,
  updateOrderStatusSchema,
} from '@/lib/validations';

describe('loginSchema', () => {
  it('validates correct login data', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects short password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '12345',
    });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('validates correct registration data', () => {
    const result = registerSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password456',
    });
    expect(result.success).toBe(false);
  });

  it('rejects short name', () => {
    const result = registerSchema.safeParse({
      name: 'J',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects short password', () => {
    const result = registerSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      password: '1234567',
      confirmPassword: '1234567',
    });
    expect(result.success).toBe(false);
  });
});

describe('forgotPasswordSchema', () => {
  it('validates correct email', () => {
    const result = forgotPasswordSchema.safeParse({
      email: 'test@example.com',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = forgotPasswordSchema.safeParse({
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
  });
});

describe('createProductSchema', () => {
  it('validates correct product data', () => {
    const result = createProductSchema.safeParse({
      name: 'Test Product',
      sku: 'TEST-001',
    });
    expect(result.success).toBe(true);
  });

  it('validates product with optional fields', () => {
    const result = createProductSchema.safeParse({
      name: 'Test Product',
      sku: 'TEST-001',
      description: 'A test product',
      brand: 'Test Brand',
      category: 'Electronics',
      costPrice: 9.99,
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty name', () => {
    const result = createProductSchema.safeParse({
      name: '',
      sku: 'TEST-001',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty SKU', () => {
    const result = createProductSchema.safeParse({
      name: 'Test Product',
      sku: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('orderQuerySchema', () => {
  it('uses default values', () => {
    const result = orderQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
    }
  });

  it('validates with all fields', () => {
    const result = orderQuerySchema.safeParse({
      page: 1,
      limit: 10,
      status: 'PENDING',
      marketplace: 'AMAZON',
      search: 'test',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid status', () => {
    const result = orderQuerySchema.safeParse({
      status: 'INVALID_STATUS',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid marketplace', () => {
    const result = orderQuerySchema.safeParse({
      marketplace: 'SHOPIFY',
    });
    expect(result.success).toBe(false);
  });
});

describe('updateOrderStatusSchema', () => {
  it('validates correct status update', () => {
    const result = updateOrderStatusSchema.safeParse({
      status: 'SHIPPED',
    });
    expect(result.success).toBe(true);
  });

  it('validates with tracking number', () => {
    const result = updateOrderStatusSchema.safeParse({
      status: 'SHIPPED',
      trackingNumber: '1Z999AA10123456784',
      carrier: 'UPS',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid status', () => {
    const result = updateOrderStatusSchema.safeParse({
      status: 'PENDING',
    });
    expect(result.success).toBe(false);
  });
});
