'use client';

/**
 * PocketBase Example Component
 * 
 * Demonstrates how to use PocketBase hooks and client in React components.
 * This is a reference implementation - remove this file after understanding the patterns.
 */

import { useState } from 'react';
import {
  usePocketBaseList,
  usePocketBaseRealtime,
  usePocketBaseCreate,
  usePocketBaseUpdate,
  usePocketBaseDelete,
  usePocketBaseSearch,
  usePocketBaseAuth,
} from '@/hooks/usePocketBase';
import { checkHealth } from '@/lib/pocketbase';
import type { ProductRecord, OrderRecord } from '@/types/pocketbase';

// ==================== HEALTH CHECK COMPONENT ====================

/**
 * Health check component - verifies PocketBase connection
 */
export function PocketBaseHealthCheck() {
  const [health, setHealth] = useState<{
    status: 'healthy' | 'unhealthy' | 'checking';
    message?: string;
    latency?: number;
  }>({ status: 'checking' });

  const checkConnection = async () => {
    setHealth({ status: 'checking' });
    const result = await checkHealth();
    setHealth({
      status: result.status,
      message: result.message,
      latency: result.latency,
    });
  };

  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-lg font-semibold">PocketBase Health Check</h3>
      <div className="mt-2 space-y-2">
        <p>
          Status:{' '}
          <span
            className={`font-medium ${
              health.status === 'healthy'
                ? 'text-green-600'
                : health.status === 'unhealthy'
                ? 'text-red-600'
                : 'text-yellow-600'
            }`}
          >
            {health.status === 'checking' ? 'Checking...' : health.status}
          </span>
        </p>
        {health.message && <p>Message: {health.message}</p>}
        {health.latency && <p>Latency: {health.latency}ms</p>}
        <button
          onClick={checkConnection}
          disabled={health.status === 'checking'}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          Check Health
        </button>
      </div>
    </div>
  );
}

// ==================== PRODUCTS LIST COMPONENT ====================

/**
 * Products list with real-time updates
 */
export function ProductsList() {
  const {
    data: products,
    isLoading,
    error,
    page,
    setPage,
    totalItems,
    totalPages,
  } = usePocketBaseList<ProductRecord>('products', {
    page: 1,
    perPage: 10,
    sort: '-created',
    filter: 'status = "ACTIVE"',
  });

  if (isLoading) {
    return <div className="animate-pulse">Loading products...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-lg font-semibold">Products (Real-time)</h3>
      <div className="mt-4 space-y-2">
        {products?.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between rounded border p-3"
          >
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-gray-500">SKU: {product.sku}</p>
            </div>
            <span
              className={`rounded-full px-2 py-1 text-xs ${
                product.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {product.status}
            </span>
          </div>
        ))}
        {(!products || products.length === 0) && (
          <p className="text-sm text-gray-500">No products found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Page {page} of {totalPages} ({totalItems} total)
        </p>
        <div className="space-x-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== CREATE PRODUCT COMPONENT ====================

/**
 * Form to create a new product
 */
export function CreateProductForm() {
  const { create, isCreating, error } = usePocketBaseCreate<ProductRecord>('products');
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    status: 'DRAFT' as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await create({
      ...formData,
      orgId: 'current-org-id', // Replace with actual org ID
    });

    if (result.success) {
      setFormData({ name: '', sku: '', status: 'DRAFT' });
      alert('Product created successfully!');
    }
  };

  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-lg font-semibold">Create Product</h3>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded border px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">SKU</label>
          <input
            type="text"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            className="mt-1 block w-full rounded border px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value as typeof formData.status })
            }
            className="mt-1 block w-full rounded border px-3 py-2"
          >
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={isCreating}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {isCreating ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}

// ==================== SEARCH COMPONENT ====================

/**
 * Search products with real-time results
 */
export function ProductSearch() {
  const { search, results, isSearching, clearResults } = usePocketBaseSearch<ProductRecord>('products');
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    if (query.trim()) {
      await search(query);
    }
  };

  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-lg font-semibold">Search Products</h3>
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or SKU..."
          className="flex-1 rounded border px-3 py-2"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
        {results.length > 0 && (
          <button
            onClick={clearResults}
            className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
          >
            Clear
          </button>
        )}
      </div>

      {results.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-500">{results.length} results found</p>
          {results.map((product) => (
            <div key={product.id} className="rounded border p-3">
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-gray-500">SKU: {product.sku}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== AUTH EXAMPLE COMPONENT ====================

/**
 * Authentication example
 */
export function AuthExample() {
  const { user, isAuthenticated, isLoading, login, logout, error } = usePocketBaseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    setEmail('');
    setPassword('');
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (isAuthenticated && user) {
    return (
      <div className="rounded-lg border p-4">
        <h3 className="text-lg font-semibold">Authenticated User</h3>
        <div className="mt-2 space-y-1">
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
        <button
          onClick={logout}
          className="mt-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-lg font-semibold">Login to PocketBase</h3>
      <form onSubmit={handleLogin} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded border px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded border px-3 py-2"
            required
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}

// ==================== MAIN EXAMPLE COMPONENT ====================

/**
 * Main PocketBase examples page
 * 
 * Usage:
 *   import { PocketBaseExamples } from '@/components/examples/pocketbase-examples';
 *   <PocketBaseExamples />
 */
export function PocketBaseExamples() {
  return (
    <div className="container mx-auto space-y-6 p-4">
      <h1 className="text-2xl font-bold">PocketBase Integration Examples</h1>
      
      <PocketBaseHealthCheck />
      
      <div className="grid gap-6 md:grid-cols-2">
        <ProductsList />
        <div className="space-y-6">
          <CreateProductForm />
          <ProductSearch />
        </div>
      </div>
      
      <AuthExample />
    </div>
  );
}

export default PocketBaseExamples;
