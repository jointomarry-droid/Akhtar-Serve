'use client';

/**
 * PocketBase Auth Context Provider
 * 
 * Provides authentication state and methods to all child components.
 * Handles token management, user state, and session persistence.
 * 
 * Usage:
 *   import { PocketBaseAuthProvider, usePocketBaseAuth } from '@/contexts/PocketBaseAuthContext';
 *   
 *   // Wrap your app
 *   <PocketBaseAuthProvider>
 *     <App />
 *   </PocketBaseAuthProvider>
 *   
 *   // Use in components
 *   const { user, isAuthenticated, login, logout } = usePocketBaseAuth();
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { pb } from '@/lib/pocketbase';
import { sessionManager, SessionData } from '@/lib/pocketbase-session';
import type { UserRecord } from '@/types/pocketbase';

// ==================== TYPES ====================

interface AuthContextType {
  // State
  user: UserRecord | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  session: SessionData | null;
  timeUntilExpiry: number;
  
  // Methods
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithOAuth: (provider: 'google' | 'github' | 'microsoft') => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  updateProfile: (data: Partial<UserRecord>) => Promise<{ success: boolean; error?: string }>;
  
  // Utilities
  getToken: () => string | null;
  isTokenValid: () => boolean;
  getTimeUntilExpiry: () => number;
}

interface AuthProviderProps {
  children: ReactNode;
}

// ==================== CONTEXT ====================

const PocketBaseAuthContext = createContext<AuthContextType | undefined>(undefined);

// ==================== PROVIDER ====================

export function PocketBaseAuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  
  const [user, setUser] = useState<UserRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<SessionData | null>(null);

  // Check if user is authenticated
  const isAuthenticated = !!user && pb.authStore.isValid;

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if session exists
        const existingSession = sessionManager.getSession();
        
        if (existingSession && existingSession.token) {
          // Save token to PocketBase
          pb.authStore.save(existingSession.token);
          
          // Refresh auth to verify token
          const authData = await pb.collection('users').authRefresh();
          setUser(authData.record as unknown as UserRecord);
          setSession(existingSession);
          
          // Set up session monitoring
          if (existingSession.expiresAt - Date.now() > 5 * 60 * 1000) {
            // Session is valid, set up auto-refresh
            sessionManager['setupAutoRefresh']();
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        // Clear invalid session
        await sessionManager.clearSession();
        setUser(null);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Listen for auth store changes
  useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      if (pb.authStore.isValid) {
        const record = pb.authStore.record as unknown as UserRecord;
        setUser(record);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Listen for session events
  useEffect(() => {
    const cleanup = sessionManager.onAny((event) => {
      switch (event.type) {
        case 'saved':
          setSession(event.data as SessionData);
          break;
        case 'refreshed':
          setSession(event.data as SessionData);
          break;
        case 'expired':
          setUser(null);
          setSession(null);
          break;
        case 'cleared':
          setUser(null);
          setSession(null);
          break;
        case 'timeout_warning':
          // Could show a notification here
          console.warn('Session timeout warning:', event.data);
          break;
      }
    });

    return cleanup;
  }, []);

  // Login with email/password
  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      
      // Save session via session manager
      await sessionManager.saveSession(authData);
      
      // Set user
      setUser(authData.record as unknown as UserRecord);
      setSession(sessionManager.getSession());
      
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login with OAuth
  const loginWithOAuth = useCallback(async (provider: 'google' | 'github' | 'microsoft') => {
    setError(null);
    setIsLoading(true);

    try {
      const authData = await pb.collection('users').authWithOAuth2({ provider });
      
      // Save session via session manager
      await sessionManager.saveSession(authData);
      
      // Set user
      setUser(authData.record as unknown as UserRecord);
      setSession(sessionManager.getSession());
      
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    // Clear session via session manager
    await sessionManager.clearSession();
    
    // Clear user state
    setUser(null);
    setSession(null);
    setError(null);
    
    // Redirect to login
    router.push('/pocketbase-login');
  }, [router]);

  // Refresh token
  const refreshToken = useCallback(async () => {
    try {
      if (!pb.authStore.isValid) {
        return false;
      }

      const success = await sessionManager.refreshSession();
      if (success) {
        const updatedSession = sessionManager.getSession();
        setSession(updatedSession);
        
        // Update user from refreshed token
        const authData = await pb.collection('users').authRefresh();
        setUser(authData.record as unknown as UserRecord);
      }
      
      return success;
    } catch {
      // Token refresh failed
      await sessionManager.clearSession();
      setUser(null);
      setSession(null);
      return false;
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (data: Partial<UserRecord>) => {
    setError(null);

    try {
      if (!user) {
        throw new Error('Not authenticated');
      }

      const updatedRecord = await pb.collection('users').update(user.id, data);
      setUser(updatedRecord as unknown as UserRecord);
      
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      return { success: false, error: message };
    }
  }, [user]);

  // Get token
  const getToken = useCallback(() => {
    return pb.authStore.token || null;
  }, []);

  // Check if token is valid
  const isTokenValid = useCallback(() => {
    return pb.authStore.isValid;
  }, []);

  // Get time until expiry
  const getTimeUntilExpiry = useCallback(() => {
    return sessionManager.getTimeUntilExpiry();
  }, []);

  // Context value
  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    session,
    timeUntilExpiry: session ? sessionManager.getTimeUntilExpiry() : 0,
    login,
    loginWithOAuth,
    logout,
    refreshToken,
    updateProfile,
    getToken,
    isTokenValid,
    getTimeUntilExpiry,
  };

  return (
    <PocketBaseAuthContext.Provider value={value}>
      {children}
    </PocketBaseAuthContext.Provider>
  );
}

// ==================== HOOK ====================

/**
 * Hook to access PocketBase auth context
 * 
 * @example
 * ```tsx
 * const { user, isAuthenticated, login, logout } = usePocketBaseAuth();
 * ```
 */
export function usePocketBaseAuth() {
  const context = useContext(PocketBaseAuthContext);
  
  if (context === undefined) {
    throw new Error('usePocketBaseAuth must be used within a PocketBaseAuthProvider');
  }
  
  return context;
}

// ==================== EXPORTS ====================

export default PocketBaseAuthProvider;
