'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { pb } from '@/lib/pocketbase';
import { usePocketBaseAuth } from '@/hooks/usePocketBase';
import type { UserRecord } from '@/types/pocketbase';

/**
 * PocketBase Context
 * 
 * Provides PocketBase state and methods to all child components.
 * Handles authentication state, theme, and connection status.
 */

// ==================== TYPES ====================

interface PocketBaseContextType {
  // Connection
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  
  // Auth
  user: UserRecord | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  
  // Methods
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithOAuth: (provider: 'google' | 'github' | 'microsoft') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshAuth: () => Promise<{ success: boolean }>;
  
  // Utility
  getToken: () => string | null;
  refreshConnection: () => Promise<void>;
}

interface PocketBaseProviderProps {
  children: ReactNode;
}

// ==================== CONTEXT ====================

const PocketBaseContext = createContext<PocketBaseContextType | undefined>(undefined);

// ==================== PROVIDER ====================

/**
 * PocketBase Provider Component
 * 
 * Wraps the application to provide PocketBase context.
 * 
 * Usage:
 *   <PocketBaseProvider>
 *     <App />
 *   </PocketBaseProvider>
 */
export function PocketBaseProvider({ children }: PocketBaseProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const {
    user,
    isAuthenticated,
    isLoading,
    error: authError,
    login,
    loginWithOAuth,
    logout,
    refresh: refreshAuth,
  } = usePocketBaseAuth();

  // Check connection on mount
  useEffect(() => {
    async function checkConnection() {
      try {
        setIsConnecting(true);
        setConnectionError(null);
        
        await pb.health.check();
        setIsConnected(true);
      } catch (error) {
        setIsConnected(false);
        setConnectionError(String(error));
        console.error('PocketBase connection error:', error);
      } finally {
        setIsConnecting(false);
      }
    }

    checkConnection();

    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  // Refresh connection
  const refreshConnection = async () => {
    try {
      setIsConnecting(true);
      setConnectionError(null);
      
      await pb.health.check();
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
      setConnectionError(String(error));
    } finally {
      setIsConnecting(false);
    }
  };

  // Get auth token
  const getToken = () => {
    return pb.authStore.token || null;
  };

  // Context value
  const value: PocketBaseContextType = {
    isConnected,
    isConnecting,
    connectionError,
    user: user as UserRecord | null,
    isAuthenticated,
    isLoading,
    authError,
    login,
    loginWithOAuth,
    logout,
    refreshAuth,
    getToken,
    refreshConnection,
  };

  return (
    <PocketBaseContext.Provider value={value}>
      {children}
    </PocketBaseContext.Provider>
  );
}

// ==================== HOOK ====================

/**
 * Hook to access PocketBase context
 * 
 * @example
 * ```tsx
 * const { user, isAuthenticated, logout } = usePocketBase();
 * ```
 */
export function usePocketBase() {
  const context = useContext(PocketBaseContext);
  
  if (context === undefined) {
    throw new Error('usePocketBase must be used within a PocketBaseProvider');
  }
  
  return context;
}

// ==================== EXPORT ====================

export default PocketBaseProvider;
