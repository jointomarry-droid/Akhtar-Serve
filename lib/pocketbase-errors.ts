/**
 * PocketBase Error Handling & Logging Utilities
 * 
 * Provides structured error handling, logging, and debugging tools
 * for PocketBase operations.
 * 
 * Usage:
 *   import { PocketBaseError, logger, withRetry } from '@/lib/pocketbase-errors';
 *   
 *   try {
 *     await collections.products.create(data);
 *   } catch (error) {
 *     throw new PocketBaseError('Failed to create product', error);
 *   }
 */

// ==================== TYPES ====================

export interface PocketBaseErrorContext {
  collection?: string;
  operation?: string;
  recordId?: string;
  userId?: string;
  orgId?: string;
  metadata?: Record<string, unknown>;
}

export interface LogContext {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context?: PocketBaseErrorContext;
  error?: Error | string;
  data?: unknown;
}

export interface RetryOptions {
  maxAttempts: number;
  delay: number;
  backoff: 'linear' | 'exponential';
  retryOn?: (error: Error) => boolean;
}

// ==================== CUSTOM ERROR CLASS ====================

/**
 * Custom PocketBase error class with structured context
 */
export class PocketBaseError extends Error {
  public readonly context: PocketBaseErrorContext;
  public readonly originalError: Error | unknown;
  public readonly timestamp: string;
  public readonly requestId: string;

  constructor(
    message: string,
    originalError: Error | unknown = null,
    context: PocketBaseErrorContext = {}
  ) {
    super(message);
    this.name = 'PocketBaseError';
    this.context = context;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
    this.requestId = crypto.randomUUID();

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PocketBaseError);
    }
  }

  /**
   * Get formatted error message with context
   */
  toFormattedString(): string {
    const parts = [`[${this.timestamp}] ${this.message}`];

    if (this.context.collection) {
      parts.push(`Collection: ${this.context.collection}`);
    }
    if (this.context.operation) {
      parts.push(`Operation: ${this.context.operation}`);
    }
    if (this.context.recordId) {
      parts.push(`Record ID: ${this.context.recordId}`);
    }
    if (this.originalError) {
      parts.push(`Original Error: ${String(this.originalError)}`);
    }

    return parts.join('\n');
  }

  /**
   * Convert to JSON for logging
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      timestamp: this.timestamp,
      requestId: this.requestId,
      context: this.context,
      stack: this.stack,
      originalError: this.originalError
        ? {
            name: this.originalError instanceof Error ? this.originalError.name : 'Unknown',
            message: String(this.originalError),
            stack: this.originalError instanceof Error ? this.originalError.stack : undefined,
          }
        : null,
    };
  }
}

// ==================== SPECIFIC ERROR TYPES ====================

/**
 * Authentication error
 */
export class PocketBaseAuthError extends PocketBaseError {
  constructor(message: string, originalError?: Error | unknown) {
    super(message, originalError, { operation: 'auth' });
    this.name = 'PocketBaseAuthError';
  }
}

/**
 * Validation error
 */
export class PocketBaseValidationError extends PocketBaseError {
  public readonly validationErrors: Record<string, string[]>;

  constructor(
    message: string,
    validationErrors: Record<string, string[]>,
    originalError?: Error | unknown
  ) {
    super(message, originalError, { operation: 'validation' });
    this.name = 'PocketBaseValidationError';
    this.validationErrors = validationErrors;
  }

  getFieldErrors(): string[] {
    return Object.values(this.validationErrors).flat();
  }
}

/**
 * Not found error
 */
export class PocketBaseNotFoundError extends PocketBaseError {
  constructor(collection: string, recordId: string, originalError?: Error | unknown) {
    super(`Record not found: ${collection}/${recordId}`, originalError, {
      collection,
      recordId,
      operation: 'read',
    });
    this.name = 'PocketBaseNotFoundError';
  }
}

/**
 * Rate limit error
 */
export class PocketBaseRateLimitError extends PocketBaseError {
  public readonly retryAfter: number;

  constructor(retryAfter: number, originalError?: Error | unknown) {
    super(`Rate limit exceeded. Retry after ${retryAfter}ms`, originalError, {
      operation: 'rateLimit',
    });
    this.name = 'PocketBaseRateLimitError';
    this.retryAfter = retryAfter;
  }
}

// ==================== LOGGER ====================

/**
 * Structured logger for PocketBase operations
 */
class PocketBaseLogger {
  private logs: LogContext[] = [];
  private maxLogs: number;

  constructor(maxLogs: number = 1000) {
    this.maxLogs = maxLogs;
  }

  private addLog(log: LogContext): void {
    this.logs.push(log);

    // Trim logs if exceeding max
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output in development
    if (process.env.NODE_ENV === 'development') {
      const prefix = `[PocketBase][${log.level.toUpperCase()}]`;
      const message = `${prefix} ${log.message}`;

      switch (log.level) {
        case 'error':
          console.error(message, log.context, log.error);
          break;
        case 'warn':
          console.warn(message, log.context);
          break;
        case 'debug':
          console.debug(message, log.context);
          break;
        default:
          console.log(message, log.context);
      }
    }
  }

  info(message: string, context?: PocketBaseErrorContext, data?: unknown): void {
    this.addLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      context,
      data,
    });
  }

  warn(message: string, context?: PocketBaseErrorContext, data?: unknown): void {
    this.addLog({
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      context,
      data,
    });
  }

  error(message: string, error?: Error | string, context?: PocketBaseErrorContext): void {
    this.addLog({
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      context,
      error,
    });
  }

  debug(message: string, context?: PocketBaseErrorContext, data?: unknown): void {
    this.addLog({
      timestamp: new Date().toISOString(),
      level: 'debug',
      message,
      context,
      data,
    });
  }

  /**
   * Get recent logs
   */
  getLogs(level?: LogContext['level'], limit: number = 100): LogContext[] {
    let filtered = this.logs;
    if (level) {
      filtered = filtered.filter((log) => log.level === level);
    }
    return filtered.slice(-limit);
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new PocketBaseLogger();

// ==================== RETRY UTILITY ====================

/**
 * Retry a function with configurable options
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = 'exponential',
    retryOn = () => true,
  } = options;

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if we should retry
      if (attempt === maxAttempts || !retryOn(lastError)) {
        throw lastError;
      }

      // Calculate delay
      const retryDelay = backoff === 'exponential'
        ? delay * Math.pow(2, attempt - 1)
        : delay * attempt;

      logger.warn(`Attempt ${attempt} failed, retrying in ${retryDelay}ms...`, undefined, {
        error: lastError.message,
        attempt,
        maxAttempts,
      });

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  throw lastError;
}

// ==================== ERROR HANDLER ====================

/**
 * Handle PocketBase errors and convert to user-friendly messages
 */
export function handlePocketBaseError(error: unknown): {
  message: string;
  code: string;
  status: number;
  details?: Record<string, unknown>;
} {
  // PocketBaseError
  if (error instanceof PocketBaseError) {
    return {
      message: error.message,
      code: error.name,
      status: getStatusFromError(error),
      details: error.context as Record<string, unknown>,
    };
  }

  // PocketBase API error
  if (error && typeof error === 'object' && 'status' in error) {
    const pbError = error as { status: number; message: string; data?: Record<string, unknown> };
    return {
      message: pbError.message || 'PocketBase error',
      code: `PB_${pbError.status}`,
      status: pbError.status,
      details: pbError.data,
    };
  }

  // Standard Error
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
      status: 500,
    };
  }

  // Unknown error
  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    status: 500,
  };
}

function getStatusFromError(error: PocketBaseError): number {
  if (error instanceof PocketBaseAuthError) return 401;
  if (error instanceof PocketBaseNotFoundError) return 404;
  if (error instanceof PocketBaseValidationError) return 400;
  if (error instanceof PocketBaseRateLimitError) return 429;
  return 500;
}

// ==================== DEBUGGING TOOLS ====================

/**
 * Debug PocketBase connection and operations
 */
export async function debugPocketBase(): Promise<{
  connection: boolean;
  auth: boolean;
  collections: string[];
  errors: string[];
}> {
  const result = {
    connection: false,
    auth: false,
    collections: [] as string[],
    errors: [] as string[],
  };

  try {
    // Check connection
    const { pb } = await import('@/lib/pocketbase');
    await pb.health.check();
    result.connection = true;

    // Check auth
    if (pb.authStore.isValid) {
      result.auth = true;
    }

    // List collections (requires admin)
    try {
      const collections = await pb.collections.getList(1, 100);
      result.collections = collections.items.map((c) => c.name);
    } catch {
      result.errors.push('Cannot list collections (admin required)');
    }
  } catch (error) {
    result.errors.push(String(error));
  }

  return result;
}

/**
 * Log operation for debugging
 */
export function logOperation(
  operation: string,
  collection: string,
  details?: Record<string, unknown>
): void {
  logger.debug(`${operation} on ${collection}`, { collection, operation }, details);
}

// ==================== VALIDATION HELPERS ====================

/**
 * Validate PocketBase record data
 */
export function validateRecordData(
  data: Record<string, unknown>,
  rules: Record<string, (value: unknown) => boolean | string>
): { valid: boolean; errors: Record<string, string[]> } {
  const errors: Record<string, string[]> = {};

  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];
    const result = rule(value);

    if (result !== true) {
      errors[field] = [typeof result === 'string' ? result : `Invalid value for ${field}`];
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// ==================== EXPORTS ====================

export default {
  PocketBaseError,
  PocketBaseAuthError,
  PocketBaseValidationError,
  PocketBaseNotFoundError,
  PocketBaseRateLimitError,
  logger,
  withRetry,
  handlePocketBaseError,
  debugPocketBase,
  logOperation,
  validateRecordData,
};
