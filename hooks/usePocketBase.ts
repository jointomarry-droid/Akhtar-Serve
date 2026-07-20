'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { pb, collections, subscribeToCollection, subscribeToRecord } from '@/lib/pocketbase';
import type { BaseRecord, QueryOptions, PaginatedResponse } from '@/types/pocketbase';
import type { RecordService } from 'pocketbase';

/**
 * React Hooks for PocketBase
 * 
 * Provides real-time data fetching, caching, and subscription management.
 * All hooks handle cleanup, error states, and loading states automatically.
 */

// ==================== TYPES ====================

type CollectionName = keyof typeof collections;

interface UsePocketBaseState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UsePocketBaseListState<T> extends UsePocketBaseState<T[]> {
  totalItems: number;
  totalPages: number;
  page: number;
  setPage: (page: number) => void;
}

interface UseRealtimeOptions {
  enabled?: boolean;
  filter?: string;
}

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

// ==================== HOOKS ====================

/**
 * Hook to fetch a single record by ID
 * 
 * @example
 * ```tsx
 * const { data: product, isLoading } = usePocketBaseRecord('products', 'record_id');
 * ```
 */
export function usePocketBaseRecord<T extends BaseRecord>(
  collection: string,
  recordId: string | null,
  options?: {
    expand?: string[];
    fields?: string[];
    enabled?: boolean;
  }
): UsePocketBaseState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (!recordId || options?.enabled === false) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const record = await getCollection(collection).getOne(recordId, {
        expand: options?.expand?.join(','),
        fields: options?.fields?.join(','),
        requestKey: `get_${collection}_${recordId}`,
      });

      setData(record as T);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
        console.error(`Error fetching ${collection} record:`, err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [collection, recordId, options?.expand, options?.fields, options?.enabled]);

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

/**
 * Hook to fetch a list of records with pagination
 * 
 * @example
 * ```tsx
 * const { data: products, isLoading, page, setPage, totalItems } = usePocketBaseList('products', {
 *   page: 1,
 *   perPage: 20,
 *   sort: '-created',
 *   filter: 'status = "ACTIVE"',
 * });
 * ```
 */
export function usePocketBaseList<T extends BaseRecord>(
  collection: string,
  options: QueryOptions = {}
): UsePocketBaseListState<T> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(options.page || 1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const result = await getCollection(collection).getList(page, options.perPage || 20, {
        sort: options.sort,
        filter: options.filter,
        fields: options.fields?.join(','),
        expand: options.expand?.join(','),
        requestKey: `list_${collection}_${page}`,
      });

      setData(result.items as T[]);
      setTotalItems(result.totalItems);
      setTotalPages(result.totalPages);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
        console.error(`Error fetching ${collection} list:`, err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [collection, page, options.perPage, options.sort, options.filter, options.fields, options.expand]);

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  const handleSetPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    totalItems,
    totalPages,
    page,
    setPage: handleSetPage,
  };
}

/**
 * Hook to fetch all records (with automatic pagination)
 * 
 * @example
 * ```tsx
 * const { data: products, isLoading } = usePocketBaseFullList('products', {
 *   filter: 'status = "ACTIVE"',
 *   sort: '-created',
 * });
 * ```
 */
export function usePocketBaseFullList<T extends BaseRecord>(
  collection: string,
  options?: {
    filter?: string;
    sort?: string;
    fields?: string[];
    expand?: string[];
    perPage?: number;
  }
): UsePocketBaseState<T[]> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const records = await getCollection(collection).getFullList({
        sort: options?.sort,
        filter: options?.filter,
        fields: options?.fields?.join(','),
        expand: options?.expand?.join(','),
        perPage: options?.perPage || 100,
      });

      setData(records as T[]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.error(`Error fetching ${collection} full list:`, err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [collection, options?.filter, options?.sort, options?.fields, options?.expand, options?.perPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

/**
 * Hook for real-time subscription to a collection
 * 
 * @example
 * ```tsx
 * const { data: products, isConnecting } = usePocketBaseRealtime('products', {
 *   filter: 'status = "ACTIVE"',
 * });
 * ```
 */
export function usePocketBaseRealtime<T extends BaseRecord>(
  collection: string,
  initialData: T[] = [],
  options: UseRealtimeOptions = {}
): {
  data: T[];
  isConnecting: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [data, setData] = useState<T[]>(initialData);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);

      const records = await getCollection(collection).getFullList({
        filter: options.filter,
      });

      setData(records as T[]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsConnecting(false);
    }
  }, [collection, options.filter]);

  useEffect(() => {
    if (options.enabled === false) return;

    // Initial fetch
    fetchData();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToCollection(collection, (event) => {
      const { action, record } = event as { action: string; record: T };

      setData((prev) => {
        switch (action) {
          case 'create':
            return [record, ...prev];
          case 'update':
            return prev.map((item) =>
              item.id === record.id ? record : item
            );
          case 'delete':
            return prev.filter((item) => item.id !== record.id);
          default:
            return prev;
        }
      });
    });

    unsubscribeRef.current = () => {
      unsubscribe.then((unsub) => unsub());
    };

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [collection, options.filter, options.enabled, fetchData]);

  return {
    data,
    isConnecting,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for real-time subscription to a single record
 * 
 * @example
 * ```tsx
 * const { data: order, isConnecting } = usePocketBaseRealtimeRecord('orders', 'order_id_123');
 * ```
 */
export function usePocketBaseRealtimeRecord<T extends BaseRecord>(
  collection: string,
  recordId: string | null,
  options?: {
    expand?: string[];
    enabled?: boolean;
  }
): {
  data: T | null;
  isConnecting: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [data, setData] = useState<T | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const fetchData = useCallback(async () => {
    if (!recordId || options?.enabled === false) {
      setIsConnecting(false);
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      const record = await getCollection(collection).getOne(recordId, {
        expand: options?.expand?.join(','),
      });

      setData(record as T);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsConnecting(false);
    }
  }, [collection, recordId, options?.expand, options?.enabled]);

  useEffect(() => {
    if (!recordId || options?.enabled === false) return;

    // Initial fetch
    fetchData();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToRecord(collection, recordId, (event) => {
      const { record } = event as { record: T };
      setData(record);
    });

    unsubscribeRef.current = () => {
      unsubscribe.then((unsub) => unsub());
    };

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [collection, recordId, options?.expand, options?.enabled, fetchData]);

  return {
    data,
    isConnecting,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for PocketBase authentication
 * 
 * @example
 * ```tsx
 * const { user, isLoading, login, logout } = usePocketBaseAuth();
 * ```
 */
export function usePocketBaseAuth() {
  const [user, setUser] = useState(() => pb.authStore.record);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen for auth changes
    const unsubscribe = pb.authStore.onChange(() => {
      setUser(pb.authStore.record);
    });

    // Check initial auth state
    setIsLoading(false);

    return () => {
      unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const authData = await collections.users.authWithPassword(email, password);
      setUser(authData.record);
      return { success: true, data: authData };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithOAuth = useCallback(async (provider: 'google' | 'github' | 'microsoft') => {
    try {
      setIsLoading(true);
      setError(null);

      const authData = await collections.users.authWithOAuth2({ provider });
      setUser(authData.record);
      return { success: true, data: authData };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    pb.authStore.clear();
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const authData = await collections.users.authRefresh();
      setUser(authData.record);
      return { success: true };
    } catch (err) {
      pb.authStore.clear();
      setUser(null);
      return { success: false };
    }
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    loginWithOAuth,
    logout,
    refresh,
  };
}

/**
 * Hook for creating records
 * 
 * @example
 * ```tsx
 * const { create, isCreating } = usePocketBaseCreate('products');
 * 
 * const handleCreate = async () => {
 *   const newProduct = await create({
 *     name: 'New Product',
 *     sku: 'PROD-001',
 *     price: 29.99,
 *   });
 * };
 * ```
 */
export function usePocketBaseCreate<T extends BaseRecord>(collection: string) {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: Partial<T>) => {
    try {
      setIsCreating(true);
      setError(null);

      const record = await getCollection(collection).create(data);
      return { success: true, data: record as T };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsCreating(false);
    }
  }, [collection]);

  return { create, isCreating, error };
}

/**
 * Hook for updating records
 * 
 * @example
 * ```tsx
 * const { update, isUpdating } = usePocketBaseUpdate('products');
 * 
 * const handleUpdate = async (id: string) => {
 *   const updated = await update(id, { name: 'Updated Name' });
 * };
 * ```
 */
export function usePocketBaseUpdate<T extends BaseRecord>(collection: string) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (id: string, data: Partial<T>) => {
    try {
      setIsUpdating(true);
      setError(null);

      const record = await getCollection(collection).update(id, data);
      return { success: true, data: record as T };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsUpdating(false);
    }
  }, [collection]);

  return { update, isUpdating, error };
}

/**
 * Hook for deleting records
 * 
 * @example
 * ```tsx
 * const { remove, isRemoving } = usePocketBaseDelete('products');
 * 
 * const handleDelete = async (id: string) => {
 *   const result = await remove(id);
 * };
 * ```
 */
export function usePocketBaseDelete(collection: string) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = useCallback(async (id: string) => {
    try {
      setIsRemoving(true);
      setError(null);

      await getCollection(collection).delete(id);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsRemoving(false);
    }
  }, [collection]);

  return { remove, isRemoving, error };
}

/**
 * Hook for searching records
 * 
 * @example
 * ```tsx
 * const { search, results, isSearching } = usePocketBaseSearch('products');
 * 
 * const handleSearch = async () => {
 *   await search('wireless headphones');
 * };
 * ```
 */
export function usePocketBaseSearch<T extends BaseRecord>(collection: string) {
  const [results, setResults] = useState<T[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, options?: { filter?: string; sort?: string }) => {
    try {
      setIsSearching(true);
      setError(null);

      const filter = options?.filter
        ? `(name ~ "${query}" || sku ~ "${query}") && ${options.filter}`
        : `name ~ "${query}" || sku ~ "${query}"`;

      const result = await getCollection(collection).getList(1, 20, {
        filter,
        sort: options?.sort || '-created',
      });

      setResults(result.items as T[]);
      return { success: true, data: result.items as T[] };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsSearching(false);
    }
  }, [collection]);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  return { search, results, isSearching, error, clearResults };
}
