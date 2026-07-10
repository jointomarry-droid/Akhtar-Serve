import { z } from "zod";

// ==================== AUTH SCHEMAS ====================

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// ==================== PRODUCT SCHEMAS ====================

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  sku: z.string().min(1, "SKU is required").max(50),
  barcode: z.string().max(50).optional(),
  description: z.string().optional(),
  brand: z.string().max(100).optional(),
  category: z.string().max(100).optional(),
  costPrice: z.number().positive().optional(),
  imageUrl: z.string().url().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "INACTIVE", "ARCHIVED"]).optional(),
  category: z.string().optional(),
  sortBy: z.enum(["name", "sku", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// ==================== ORDER SCHEMAS ====================

export const orderQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]).optional(),
  marketplace: z.enum(["AMAZON", "EBAY"]).optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  search: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
});

// ==================== INVENTORY SCHEMAS ====================

export const updateInventorySchema = z.object({
  locationId: z.string().uuid(),
  quantity: z.number().int(),
  type: z.enum(["RECEIVE", "SHIP", "ADJUST", "TRANSFER", "RETURN", "DAMAGE"]),
  notes: z.string().optional(),
});

export const createLocationSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  type: z.enum(["WAREHOUSE", "FBA", "STORE", "OTHER"]).default("WAREHOUSE"),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
});

// ==================== PRICING SCHEMAS ====================

export const createPricingRuleSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  type: z.enum(["COMPETITOR", "MARGIN", "VELOCITY", "TIME_BASED", "BUNDLE"]),
  productId: z.string().uuid().optional(),
  conditions: z.record(z.any()),
  action: z.record(z.any()),
  priority: z.number().int().min(0).default(0),
});

// ==================== INTEGRATION SCHEMAS ====================

export const connectMarketplaceSchema = z.object({
  marketplace: z.enum(["AMAZON", "EBAY"]),
  storeName: z.string().min(1, "Store name is required"),
  credentials: z.record(z.string()),
});

// ==================== SETTINGS SCHEMAS ====================

export const updateOrganizationSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  logo: z.string().url().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  image: z.string().url().optional(),
});

// ==================== API RESPONSE TYPES ====================

export type ApiResponse<T = any> = {
  status: "success" | "error";
  data: T | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
  errors: string[];
  requestId: string;
};

// ==================== INPUT TYPES ====================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;
export type CreateLocationInput = z.infer<typeof createLocationSchema>;
export type CreatePricingRuleInput = z.infer<typeof createPricingRuleSchema>;
export type ConnectMarketplaceInput = z.infer<typeof connectMarketplaceSchema>;
