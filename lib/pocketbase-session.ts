/**
 * PocketBase Session Management
 * 
 * Handles session persistence, refresh, timeout, and security.
 * 
 * Usage:
 *   import { sessionManager } from '@/lib/pocketbase-session';
 *   
 *   // Save session
 *   await sessionManager.saveSession(authData);
 *   
 *   // Get session
 *   const session = sessionManager.getSession();
 *   
 *   // Refresh session
 *   await sessionManager.refreshSession();
 *   
 *   // Clear session
 *   await sessionManager.clearSession();
 */

import { pb } from '@/lib/pocketbase';

// ==================== TYPES ====================

export interface SessionData {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    phone?: string;
    avatar?: string;
    created: string;
    updated: string;
  };
  expiresAt: number;
  createdAt: number;
}

export interface SessionConfig {
  /** Session storage key */
  storageKey: string;
  /** Enable automatic token refresh */
  autoRefresh: boolean;
  /** Refresh interval in milliseconds (default: 30 minutes) */
  refreshInterval: number;
  /** Session timeout in milliseconds (default: 24 hours) */
  sessionTimeout: number;
  /** Enable session persistence across page reloads */
  persistSession: boolean;
  /** Enable session timeout warning */
  enableTimeoutWarning: boolean;
  /** Timeout warning before expiry (in milliseconds, default: 5 minutes) */
  timeoutWarningBefore: number;
}

export interface SessionEvent {
  type: 'saved' | 'refreshed' | 'expired' | 'cleared' | 'error' | 'timeout_warning';
  timestamp: number;
  data?: unknown;
}

// ==================== CONSTANTS ====================

const DEFAULT_CONFIG: SessionConfig = {
  storageKey: 'pocketbase_session',
  autoRefresh: true,
  refreshInterval: 30 * 60 * 1000, // 30 minutes
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  persistSession: true,
  enableTimeoutWarning: true,
  timeoutWarningBefore: 5 * 60 * 1000, // 5 minutes
};

// ==================== SESSION MANAGER CLASS ====================

class SessionManager {
  private config: SessionConfig;
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;
  private timeoutTimer: ReturnType<typeof setTimeout> | null = null;
  private timeoutWarningTimer: ReturnType<typeof setTimeout> | null = null;
  private listeners: Map<string, Set<(event: SessionEvent) => void>> = new Map();

  constructor(config: Partial<SessionConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // ==================== SESSION STORAGE ====================

  /**
   * Save session data to storage
   */
  async saveSession(authData: {
    token: string;
    record: {
      id: string;
      email: string;
      name?: string;
      role?: string;
      phone?: string;
      avatar?: string;
      created: string;
      updated: string;
    };
  }): Promise<void> {
    try {
      const sessionData: SessionData = {
        token: authData.token,
        user: {
          id: authData.record.id,
          email: authData.record.email,
          name: authData.record.name || '',
          role: authData.record.role || 'USER',
          phone: authData.record.phone,
          avatar: authData.record.avatar,
          created: authData.record.created,
          updated: authData.record.updated,
        },
        expiresAt: Date.now() + this.config.sessionTimeout,
        createdAt: Date.now(),
      };

      if (this.config.persistSession) {
        this.saveToStorage(sessionData);
      }

      // Set up auto-refresh
      if (this.config.autoRefresh) {
        this.setupAutoRefresh();
      }

      // Set up timeout warning
      if (this.config.enableTimeoutWarning) {
        this.setupTimeoutWarning();
      }

      // Emit event
      this.emit('saved', sessionData);
    } catch (error) {
      console.error('Failed to save session:', error);
      this.emit('error', { action: 'save', error });
      throw error;
    }
  }

  /**
   * Get session data from storage
   */
  getSession(): SessionData | null {
    try {
      if (!this.config.persistSession) {
        return null;
      }

      const stored = localStorage.getItem(this.config.storageKey);
      if (!stored) {
        return null;
      }

      const sessionData: SessionData = JSON.parse(stored);

      // Check if session has expired
      if (this.isSessionExpired(sessionData)) {
        this.clearSession();
        return null;
      }

      return sessionData;
    } catch (error) {
      console.error('Failed to get session:', error);
      return null;
    }
  }

  /**
   * Clear session data from storage
   */
  async clearSession(): Promise<void> {
    try {
      // Clear timers
      this.clearTimers();

      // Clear storage
      if (this.config.persistSession) {
        localStorage.removeItem(this.config.storageKey);
      }

      // Clear PocketBase auth
      pb.authStore.clear();

      // Emit event
      this.emit('cleared');
    } catch (error) {
      console.error('Failed to clear session:', error);
      this.emit('error', { action: 'clear', error });
    }
  }

  // ==================== SESSION VALIDATION ====================

  /**
   * Check if session is valid
   */
  isSessionValid(session?: SessionData | null): boolean {
    const sessionData = session || this.getSession();
    if (!sessionData) {
      return false;
    }

    // Check if token exists
    if (!sessionData.token) {
      return false;
    }

    // Check if session has expired
    if (this.isSessionExpired(sessionData)) {
      this.clearSession();
      return false;
    }

    // Check if PocketBase auth is valid
    if (!pb.authStore.isValid) {
      return false;
    }

    return true;
  }

  /**
   * Check if session has expired
   */
  isSessionExpired(session: SessionData): boolean {
    return Date.now() > session.expiresAt;
  }

  /**
   * Get time until session expires
   */
  getTimeUntilExpiry(): number {
    const session = this.getSession();
    if (!session) {
      return 0;
    }

    return Math.max(0, session.expiresAt - Date.now());
  }

  // ==================== SESSION REFRESH ====================

  /**
   * Refresh session token
   */
  async refreshSession(): Promise<boolean> {
    try {
      if (!pb.authStore.isValid || !pb.authStore.token) {
        return false;
      }

      // Refresh token
      const refreshedAuth = await pb.collection('users').authRefresh();

      if (refreshedAuth && refreshedAuth.token) {
        // Update session with new token
        const currentSession = this.getSession();
        if (currentSession) {
          const updatedSession: SessionData = {
            ...currentSession,
            token: refreshedAuth.token,
            user: {
              id: refreshedAuth.record.id,
              email: refreshedAuth.record.email,
              name: refreshedAuth.record.name || '',
              role: refreshedAuth.record.role || 'USER',
              phone: refreshedAuth.record.phone,
              avatar: refreshedAuth.record.avatar,
              created: refreshedAuth.record.created,
              updated: refreshedAuth.record.updated,
            },
            expiresAt: Date.now() + this.config.sessionTimeout,
          };

          if (this.config.persistSession) {
            this.saveToStorage(updatedSession);
          }

          // Re-setup auto-refresh
          if (this.config.autoRefresh) {
            this.setupAutoRefresh();
          }

          // Re-setup timeout warning
          if (this.config.enableTimeoutWarning) {
            this.setupTimeoutWarning();
          }

          // Emit event
          this.emit('refreshed', updatedSession);
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to refresh session:', error);
      this.emit('error', { action: 'refresh', error });
      return false;
    }
  }

  // ==================== EVENT LISTENERS ====================

  /**
   * Subscribe to session events
   */
  on(event: string, callback: (event: SessionEvent) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  /**
   * Subscribe to all session events
   */
  onAny(callback: (event: SessionEvent) => void): () => void {
    const unsubscribes = [
      this.on('saved', callback),
      this.on('refreshed', callback),
      this.on('expired', callback),
      this.on('cleared', callback),
      this.on('error', callback),
      this.on('timeout_warning', callback),
    ];

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }

  // ==================== PRIVATE METHODS ====================

  private saveToStorage(session: SessionData): void {
    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to save session to storage:', error);
    }
  }

  private setupAutoRefresh(): void {
    this.clearTimers();

    // Set up refresh timer
    this.refreshTimer = setTimeout(async () => {
      const success = await this.refreshSession();
      if (!success) {
        console.warn('Auto-refresh failed, clearing session');
        await this.clearSession();
      }
    }, this.config.refreshInterval);
  }

  private setupTimeoutWarning(): void {
    // Clear existing timeout warning timer
    if (this.timeoutWarningTimer) {
      clearTimeout(this.timeoutWarningTimer);
    }

    const timeUntilExpiry = this.getTimeUntilExpiry();
    const warningTime = Math.max(0, timeUntilExpiry - this.config.timeoutWarningBefore);

    if (warningTime > 0) {
      this.timeoutWarningTimer = setTimeout(() => {
        this.emit('timeout_warning', {
          expiresAt: Date.now() + this.config.timeoutWarningBefore,
          timeUntilExpiry: this.config.timeoutWarningBefore,
        });
      }, warningTime);
    }
  }

  private clearTimers(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }

    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }

    if (this.timeoutWarningTimer) {
      clearTimeout(this.timeoutWarningTimer);
      this.timeoutWarningTimer = null;
    }
  }

  private emit(type: string, data?: unknown): void {
    const event: SessionEvent = {
      type: type as SessionEvent['type'],
      timestamp: Date.now(),
      data,
    };

    // Emit to specific event listeners
    this.listeners.get(type)?.forEach((callback) => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in session event listener:', error);
      }
    });

    // Emit to wildcard listeners
    this.listeners.get('*')?.forEach((callback) => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in session event listener:', error);
      }
    });
  }
}

// ==================== SINGLETON INSTANCE ====================

export const sessionManager = new SessionManager();

// ==================== HELPER FUNCTIONS ====================

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return sessionManager.isSessionValid();
}

/**
 * Get current user from session
 */
export function getCurrentUser(): SessionData['user'] | null {
  const session = sessionManager.getSession();
  return session?.user || null;
}

/**
 * Get authentication token
 */
export function getAuthToken(): string | null {
  const session = sessionManager.getSession();
  return session?.token || null;
}

/**
 * Set up session monitoring
 * 
 * @example
 * ```ts
 * const cleanup = setupSessionMonitoring({
 *   onTimeoutWarning: (timeLeft) => {
 *     showWarning(`Session expires in ${timeLeft} seconds`);
 *   },
 *   onExpired: () => {
 *     redirectToLogin();
 *   },
 *   onRefreshed: () => {
 *     showNotification('Session refreshed');
 *   },
 * });
 * 
 * // Cleanup on unmount
 * cleanup();
 * ```
 */
export function setupSessionMonitoring(callbacks: {
  onTimeoutWarning?: (timeLeft: number) => void;
  onExpired?: () => void;
  onRefreshed?: () => void;
  onCleared?: () => void;
  onError?: (error: unknown) => void;
}): () => void {
  const unsubscribes: (() => void)[] = [];

  if (callbacks.onTimeoutWarning) {
    unsubscribes.push(
      sessionManager.on('timeout_warning', (event) => {
        const timeLeft = Math.ceil(
          ((event.data as { expiresAt: number })?.expiresAt - Date.now()) / 1000
        );
        callbacks.onTimeoutWarning!(timeLeft);
      })
    );
  }

  if (callbacks.onExpired) {
    unsubscribes.push(
      sessionManager.on('expired', () => callbacks.onExpired!())
    );
  }

  if (callbacks.onRefreshed) {
    unsubscribes.push(
      sessionManager.on('refreshed', () => callbacks.onRefreshed!())
    );
  }

  if (callbacks.onCleared) {
    unsubscribes.push(
      sessionManager.on('cleared', () => callbacks.onCleared!())
    );
  }

  if (callbacks.onError) {
    unsubscribes.push(
      sessionManager.on('error', (event) => callbacks.onError!(event.data))
    );
  }

  return () => {
    unsubscribes.forEach((unsubscribe) => unsubscribe());
  };
}

/**
 * Format time remaining for display
 */
export function formatTimeRemaining(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

export default sessionManager;
