"use client";

import { useState, useEffect, useCallback } from "react";

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
}

export function useApi<T>(url: string, options?: FetchOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchOptions: RequestInit = {
        method: options?.method || "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (options?.body) {
        fetchOptions.body = JSON.stringify(options.body);
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      console.error(`Error fetching ${url}:`, err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [url, options?.method, options?.body]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Hook for fetching products
export function useProducts(marketplace?: string) {
  const url = marketplace
    ? `/api/products?marketplace=${marketplace}`
    : "/api/products";

  return useApi<{ products: any[]; total: number }>(url);
}

// Hook for fetching orders
export function useOrders(status?: string) {
  const url = status ? `/api/orders?status=${status}` : "/api/orders";

  return useApi<{
    orders: any[];
    total: number;
    stats: {
      totalRevenue: number;
      pendingOrders: number;
      shippedOrders: number;
      deliveredOrders: number;
    };
  }>(url);
}
