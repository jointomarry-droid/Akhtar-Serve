/**
 * PocketBase Zustand Store
 * 
 * Global state management for PocketBase connection and auth.
 * Provides a centralized store for UI state that doesn't need real-time updates.
 * 
 * Usage:
 *   import { usePocketBaseStore } from '@/stores/pocketbase-store';
 *   const { user, isAuthenticated } = usePocketBaseStore();
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { pb } from '@/lib/pocketbase';
import type { UserRecord } from '@/types/pocketbase';

// ==================== TYPES ====================

interface PocketBaseState {
  // Connection
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  lastConnectedAt: string | null;

  // Auth
  user: UserRecord | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;

  // UI
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';

  // Actions - Connection
  setConnected: (connected: boolean) => void;
  setConnecting: (connecting: boolean) => void;
  setConnectionError: (error: string | null) => void;

  // Actions - Auth
  setUser: (user: UserRecord | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setAuthError: (error: string | null) => void;

  // Actions - UI
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // Actions - Complex
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  initialize: () => Promise<void>;
}

// ==================== STORE ====================

export const usePocketBaseStore = create<PocketBaseState>()(
  persist(
    (set, get) => ({
      // Initial state
      isConnected: false,
      isConnecting: true,
      connectionError: null,
      lastConnectedAt: null,

      user: null,
      isAuthenticated: false,
      isLoading: true,
      authError: null,

      sidebarOpen: true,
      theme: 'system',

      // Connection actions
      setConnected: (connected) =>
        set({
          isConnected: connected,
          isConnecting: false,
          connectionError: null,
          lastConnectedAt: connected ? new Date().toISOString() : get().lastConnectedAt,
        }),

      setConnecting: (connecting) =>
        set({
          isConnecting: connecting,
          connectionError: connecting ? null : get().connectionError,
        }),

      setConnectionError: (error) =>
        set({
          connectionError: error,
          isConnecting: false,
          isConnected: false,
        }),

      // Auth actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setAuthenticated: (authenticated) =>
        set({
          isAuthenticated: authenticated,
          user: authenticated ? get().user : null,
        }),

      setLoading: (loading) =>
        set({
          isLoading: loading,
        }),

      setAuthError: (error) =>
        set({
          authError: error,
          isLoading: false,
        }),

      // UI actions
      toggleSidebar: () =>
        set((state) => ({
          sidebarOpen: !state.sidebarOpen,
        })),

      setSidebarOpen: (open) =>
        set({
          sidebarOpen: open,
        }),

      setTheme: (theme) =>
        set({
          theme,
        }),

      // Complex actions
      login: async (email, password) => {
        set({ isLoading: true, authError: null });

        try {
          const authData = await pb.collection('users').authWithPassword(email, password);
          const user = authData.record as unknown as UserRecord;

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            authError: null,
          });

          return { success: true };
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            authError: message,
          });
          return { success: false, error: message };
        }
      },

      logout: () => {
        pb.authStore.clear();
        set({
          user: null,
          isAuthenticated: false,
          authError: null,
        });
      },

      refreshToken: async () => {
        try {
          if (!pb.authStore.isValid) {
            return false;
          }

          const authData = await pb.collection('users').authRefresh();
          const user = authData.record as unknown as UserRecord;

          set({
            user,
            isAuthenticated: true,
          });

          return true;
        } catch {
          set({
            user: null,
            isAuthenticated: false,
          });
          return false;
        }
      },

      initialize: async () => {
        set({ isLoading: true, isConnecting: true });

        try {
          // Check connection
          await pb.health.check();
          set({
            isConnected: true,
            isConnecting: false,
            connectionError: null,
            lastConnectedAt: new Date().toISOString(),
          });

          // Check auth state
          if (pb.authStore.isValid) {
            try {
              const authData = await pb.collection('users').authRefresh();
              const user = authData.record as unknown as UserRecord;

              set({
                user,
                isAuthenticated: true,
                isLoading: false,
              });
            } catch {
              // Auth expired
              pb.authStore.clear();
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
              });
            }
          } else {
            set({
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            isConnected: false,
            isConnecting: false,
            connectionError: error instanceof Error ? error.message : String(error),
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'pocketbase-storage',
      partialize: (state) => ({
        // Only persist UI preferences
        sidebarOpen: state.sidebarOpen,
        theme: state.theme,
      }),
    }
  )
);

// ==================== SELECTORS ====================

export const selectUser = (state: PocketBaseState) => state.user;
export const selectIsAuthenticated = (state: PocketBaseState) => state.isAuthenticated;
export const selectIsLoading = (state: PocketBaseState) => state.isLoading;
export const selectIsConnected = (state: PocketBaseState) => state.isConnected;
export const selectConnectionError = (state: PocketBaseState) => state.connectionError;
export const selectSidebarOpen = (state: PocketBaseState) => state.sidebarOpen;
export const selectTheme = (state: PocketBaseState) => state.theme;

// ==================== DEFAULT EXPORT ====================

export default usePocketBaseStore;
