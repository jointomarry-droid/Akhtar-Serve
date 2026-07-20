/**
 * PocketBase TanStack Query Integration
 * 
 * Provides query hooks for data fetching with caching, background updates,
 * and optimistic updates.
 * 
 * Usage:
 *   import { useProductsQuery, useCreateProductMutation } from '@/hooks/usePocketBaseQuery';
 *   
 *   function ProductsPage() {
 *     const { data, isLoading } = useProductsQuery({ orgId: '123' });
 *     const createProduct = useCreateProductMutation();
 *   }
 */

import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { collections } from '@/lib/pocketbase';
import type {
  ProductRecord,
  OrderRecord,
  InventoryRecord,
  BaseRecord,
  QueryOptions,
  PaginatedResponse,
} from '@/types/pocketbase';
import type { RecordService } from 'pocketbase';

// ==================== HELPERS ====================

/**
 * Get a collection service by name
 */
function getCollection(name: string): RecordService {
  if (name in collections) {
    return (collections as Record<string, RecordService>)[name];
  }
  throw new Error(`Collection "${name}" does not exist`);
}

// ==================== QUERY KEYS ====================

export const queryKeys = {
  // Products
  products: ['products'] as const,
  product: (id: string) => ['products', id] as const,
  productsList: (options: QueryOptions) => ['products', 'list', options] as const,

  // Orders
  orders: ['orders'] as const,
  order: (id: string) => ['orders', id] as const,
  ordersList: (options: QueryOptions) => ['orders', 'list', options] as const,

  // Inventory
  inventory: ['inventory'] as const,
  inventoryItem: (id: string) => ['inventory', id] as const,
  inventoryList: (options: QueryOptions) => ['inventory', 'list', options] as const,

  // Organizations
  organizations: ['organizations'] as const,
  organization: (id: string) => ['organizations', id] as const,

  // Users
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,

  // Integrations
  integrations: ['integrations'] as const,
  integration: (id: string) => ['integrations', id] as const,

  // Analytics
  dailyMetrics: ['daily_metrics'] as const,
  analytics: (orgId: string, date: string) => ['analytics', orgId, date] as const,
} as const;

// ==================== TYPES ====================

interface UseListQueryOptions extends QueryOptions {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number;
}

interface UseListQueryResult<T> {
  data: T[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  totalItems: number;
  totalPages: number;
  page: number;
  refetch: () => void;
}

interface UseSingleQueryOptions {
  expand?: string[];
  enabled?: boolean;
  staleTime?: number;
}

interface UseSingleQueryResult<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

// ==================== GENERIC QUERY HOOKS ====================

/**
 * Generic hook for fetching a list of records
 */
export function usePocketBaseListQuery<T extends BaseRecord>(
  collection: string,
  options: UseListQueryOptions = {}
): UseListQueryResult<T> {
  const {
    page = 1,
    perPage = 20,
    sort,
    filter,
    expand,
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    refetchInterval,
  } = options;

  const queryKey: QueryKey = [collection, 'list', { page, perPage, sort, filter }];

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await getCollection(collection).getList(page, perPage, {
        sort,
        filter,
        expand: expand?.join(','),
      });
      return result;
    },
    enabled,
    staleTime,
    refetchInterval,
  });

  return {
    data: (data?.items as T[]) || [],
    isLoading,
    isError,
    error: error as Error | null,
    totalItems: data?.totalItems || 0,
    totalPages: data?.totalPages || 0,
    page: data?.page || page,
    refetch,
  };
}

/**
 * Generic hook for fetching a single record
 */
export function usePocketBaseSingleQuery<T extends BaseRecord>(
  collection: string,
  id: string | null,
  options: UseSingleQueryOptions = {}
): UseSingleQueryResult<T> {
  const {
    expand,
    enabled = true,
    staleTime = 5 * 60 * 1000,
  } = options;

  const queryKey: QueryKey = [collection, id];

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!id) return null;
      return getCollection(collection).getOne(id, { expand: expand?.join(',') });
    },
    enabled: enabled && !!id,
    staleTime,
  });

  return {
    data: (data as T) || null,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  };
}

// ==================== PRODUCT QUERIES ====================

interface ProductListOptions extends UseListQueryOptions {
  orgId?: string;
  status?: ProductRecord['status'];
  search?: string;
}

/**
 * Fetch products list
 */
export function useProductsQuery(options: ProductListOptions = {}) {
  const { orgId, status, search, ...rest } = options;

  const filters: string[] = [];
  if (orgId) filters.push(`orgId = "${orgId}"`);
  if (status) filters.push(`status = "${status}"`);
  if (search) filters.push(`(name ~ "${search}" || sku ~ "${search}")`);

  return usePocketBaseListQuery<ProductRecord>('products', {
    ...rest,
    filter: filters.length > 0 ? filters.join(' && ') : rest.filter,
  });
}

/**
 * Fetch a single product
 */
export function useProductQuery(id: string | null, options?: UseSingleQueryOptions) {
  return usePocketBaseSingleQuery<ProductRecord>('products', id, options);
}

// ==================== ORDER QUERIES ====================

interface OrderListOptions extends UseListQueryOptions {
  orgId?: string;
  marketplace?: OrderRecord['marketplace'];
  status?: OrderRecord['status'];
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Fetch orders list
 */
export function useOrdersQuery(options: OrderListOptions = {}) {
  const { orgId, marketplace, status, dateFrom, dateTo, ...rest } = options;

  const filters: string[] = [];
  if (orgId) filters.push(`orgId = "${orgId}"`);
  if (marketplace) filters.push(`marketplace = "${marketplace}"`);
  if (status) filters.push(`status = "${status}"`);
  if (dateFrom) filters.push(`orderedAt >= "${dateFrom}"`);
  if (dateTo) filters.push(`orderedAt <= "${dateTo}"`);

  return usePocketBaseListQuery<OrderRecord>('orders', {
    ...rest,
    sort: rest.sort || '-orderedAt',
    filter: filters.length > 0 ? filters.join(' && ') : rest.filter,
  });
}

/**
 * Fetch a single order
 */
export function useOrderQuery(id: string | null, options?: UseSingleQueryOptions) {
  return usePocketBaseSingleQuery<OrderRecord>('orders', id, options);
}

// ==================== INVENTORY QUERIES ====================

interface InventoryListOptions extends UseListQueryOptions {
  productId?: string;
  locationId?: string;
  lowStock?: boolean;
}

/**
 * Fetch inventory list
 */
export function useInventoryQuery(options: InventoryListOptions = {}) {
  const { productId, locationId, lowStock, ...rest } = options;

  const filters: string[] = [];
  if (productId) filters.push(`productId = "${productId}"`);
  if (locationId) filters.push(`locationId = "${locationId}"`);
  if (lowStock) filters.push('quantity <= reorderPoint');

  return usePocketBaseListQuery<InventoryRecord>('inventory', {
    ...rest,
    filter: filters.length > 0 ? filters.join(' && ') : rest.filter,
  });
}

// ==================== MUTATION HOOKS ====================

interface UseCreateMutationOptions {
  onSuccess?: (data: BaseRecord) => void;
  onError?: (error: Error) => void;
}

/**
 * Generic create mutation hook
 */
export function useCreateMutation<T extends BaseRecord>(
  collection: string,
  options?: UseCreateMutationOptions
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<T>) => {
      return getCollection(collection).create(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [collection] });
      options?.onSuccess?.(data as T);
    },
    onError: (error) => {
      options?.onError?.(error as Error);
    },
  });
}

/**
 * Generic update mutation hook
 */
export function useUpdateMutation<T extends BaseRecord>(
  collection: string,
  options?: UseCreateMutationOptions
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<T> }) => {
      return getCollection(collection).update(id, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [collection] });
      options?.onSuccess?.(data as T);
    },
    onError: (error) => {
      options?.onError?.(error as Error);
    },
  });
}

/**
 * Generic delete mutation hook
 */
export function useDeleteMutation(
  collection: string,
  options?: { onSuccess?: () => void; onError?: (error: Error) => void }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return getCollection(collection).delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [collection] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      options?.onError?.(error as Error);
    },
  });
}

// ==================== PRODUCT MUTATIONS ====================

/**
 * Create product mutation
 */
export function useCreateProductMutation(options?: UseCreateMutationOptions) {
  return useCreateMutation<ProductRecord>('products', options);
}

/**
 * Update product mutation
 */
export function useUpdateProductMutation(options?: UseCreateMutationOptions) {
  return useUpdateMutation<ProductRecord>('products', options);
}

/**
 * Delete product mutation
 */
export function useDeleteProductMutation(options?: { onSuccess?: () => void; onError?: (error: Error) => void }) {
  return useDeleteMutation('products', options);
}

// ==================== ORDER MUTATIONS ====================

/**
 * Create order mutation
 */
export function useCreateOrderMutation(options?: UseCreateMutationOptions) {
  return useCreateMutation<OrderRecord>('orders', options);
}

/**
 * Update order mutation
 */
export function useUpdateOrderMutation(options?: UseCreateMutationOptions) {
  return useUpdateMutation<OrderRecord>('orders', options);
}

// ==================== OPTIMISTIC UPDATE HELPERS ====================

/**
 * Helper for optimistic updates
 */
export function useOptimisticUpdate<T extends BaseRecord>(
  collection: string,
  queryKey: QueryKey
) {
  const queryClient = useQueryClient();

  return {
    onMutate: async (newData: Partial<T>) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update
      queryClient.setQueryData(queryKey, (old: T[] | undefined) => {
        if (!old) return old;
        return old.map((item) =>
          item.id === (newData as T).id ? { ...item, ...newData } : item
        );
      });

      return { previousData };
    },
    onError: (err: Error, newData: Partial<T>, context: { previousData: unknown } | undefined) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [collection] });
    },
  };
}
