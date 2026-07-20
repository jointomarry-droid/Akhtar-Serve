'use client';

/**
 * PocketBase Session Hook
 * 
 * React hook for managing sessions in components.
 * 
 * Usage:
 *   import { useSession } from '@/hooks/usePocketBaseSession';
 *   
 *   function MyComponent() {
 *     const { session, isValid, timeUntilExpiry, refresh } = useSession();
 *     
 *     return (
 *       <div>
 *         {isValid ? <p>Session active</p> : <p>No session</p>}
 *         <p>Expires in: {timeUntilExpiry}</p>
 *         <button onClick={refresh}>Refresh Session</button>
 *       </div>
 *     );
 *   }
 */

import { useState, useEffect, useCallback } from 'react';
import { sessionManager, SessionData, setupSessionMonitoring, formatTimeRemaining } from '@/lib/pocketbase-session';

// ==================== TYPES ====================

interface SessionState {
  /** Current session data */
  session: SessionData | null;
  /** Whether session is valid */
  isValid: boolean;
  /** Whether session is being refreshed */
  isRefreshing: boolean;
  /** Time until session expires (in milliseconds) */
  timeUntilExpiry: number;
  /** Formatted time until expiry */
  timeUntilExpiryFormatted: string;
  /** Whether timeout warning is active */
  isTimeoutWarning: boolean;
}

interface UseSessionOptions {
  /** Auto-check session validity on mount */
  autoCheck?: boolean;
  /** Check interval in milliseconds */
  checkInterval?: number;
  /** Enable timeout warning */
  enableTimeoutWarning?: boolean;
  /** Callback when session expires */
  onExpired?: () => void;
  /** Callback when timeout warning occurs */
  onTimeoutWarning?: (timeLeft: number) => void;
  /** Callback when session is refreshed */
  onRefreshed?: () => void;
}

// ==================== HOOK ====================

export function useSession(options: UseSessionOptions = {}) {
  const {
    autoCheck = true,
    checkInterval = 60 * 1000, // 1 minute
    enableTimeoutWarning = true,
    onExpired,
    onTimeoutWarning,
    onRefreshed,
  } = options;

  const [state, setState] = useState<SessionState>({
    session: null,
    isValid: false,
    isRefreshing: false,
    timeUntilExpiry: 0,
    timeUntilExpiryFormatted: '',
    isTimeoutWarning: false,
  });

  // Update time until expiry
  const updateTimeUntilExpiry = useCallback(() => {
    const session = sessionManager.getSession();
    if (session) {
      const timeUntilExpiry = sessionManager.getTimeUntilExpiry();
      setState((prev) => ({
        ...prev,
        session,
        timeUntilExpiry,
        timeUntilExpiryFormatted: formatTimeRemaining(timeUntilExpiry),
      }));
    }
  }, []);

  // Check session validity
  const checkSession = useCallback(() => {
    const isValid = sessionManager.isSessionValid();
    const session = sessionManager.getSession();
    const timeUntilExpiry = sessionManager.getTimeUntilExpiry();

    setState((prev) => ({
      ...prev,
      session,
      isValid,
      timeUntilExpiry,
      timeUntilExpiryFormatted: formatTimeRemaining(timeUntilExpiry),
    }));

    return isValid;
  }, []);

  // Refresh session
  const refreshSession = useCallback(async (): Promise<boolean> => {
    setState((prev) => ({ ...prev, isRefreshing: true }));

    try {
      const success = await sessionManager.refreshSession();
      
      if (success) {
        checkSession();
        onRefreshed?.();
      }

      return success;
    } catch (error) {
      console.error('Failed to refresh session:', error);
      return false;
    } finally {
      setState((prev) => ({ ...prev, isRefreshing: false }));
    }
  }, [checkSession, onRefreshed]);

  // Clear session
  const clearSession = useCallback(async () => {
    await sessionManager.clearSession();
    setState({
      session: null,
      isValid: false,
      isRefreshing: false,
      timeUntilExpiry: 0,
      timeUntilExpiryFormatted: '',
      isTimeoutWarning: false,
    });
  }, []);

  // Set up session monitoring
  useEffect(() => {
    if (!enableTimeoutWarning) return;

    const cleanup = setupSessionMonitoring({
      onTimeoutWarning: (timeLeft) => {
        setState((prev) => ({ ...prev, isTimeoutWarning: true }));
        onTimeoutWarning?.(timeLeft);
      },
      onExpired: () => {
        setState((prev) => ({
          ...prev,
          session: null,
          isValid: false,
          isTimeoutWarning: false,
        }));
        onExpired?.();
      },
      onRefreshed: () => {
        setState((prev) => ({ ...prev, isTimeoutWarning: false }));
        onRefreshed?.();
      },
      onCleared: () => {
        setState({
          session: null,
          isValid: false,
          isRefreshing: false,
          timeUntilExpiry: 0,
          timeUntilExpiryFormatted: '',
          isTimeoutWarning: false,
        });
      },
    });

    return cleanup;
  }, [enableTimeoutWarning, onExpired, onTimeoutWarning, onRefreshed]);

  // Auto-check session on mount
  useEffect(() => {
    if (autoCheck) {
      checkSession();
    }
  }, [autoCheck, checkSession]);

  // Set up periodic check
  useEffect(() => {
    if (checkInterval <= 0) return;

    const interval = setInterval(() => {
      checkSession();
      updateTimeUntilExpiry();
    }, checkInterval);

    return () => clearInterval(interval);
  }, [checkInterval, checkSession, updateTimeUntilExpiry]);

  // Update time until expiry every second
  useEffect(() => {
    if (!state.isValid) return;

    const interval = setInterval(updateTimeUntilExpiry, 1000);
    return () => clearInterval(interval);
  }, [state.isValid, updateTimeUntilExpiry]);

  return {
    ...state,
    refresh: refreshSession,
    clear: clearSession,
    check: checkSession,
  };
}

// ==================== SIMPLIFIED HOOKS ====================

/**
 * Simple hook to check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const { isValid } = useSession({ autoCheck: true, checkInterval: 60000 });
  return isValid;
}

/**
 * Hook to get current user from session
 */
export function useSessionUser() {
  const { session } = useSession({ autoCheck: true });
  return session?.user || null;
}

/**
 * Hook to get session time remaining
 */
export function useSessionTimeRemaining() {
  const { timeUntilExpiry, timeUntilExpiryFormatted, isValid } = useSession({
    autoCheck: true,
  });
  return { timeUntilExpiry, timeUntilExpiryFormatted, isValid };
}

export default useSession;
