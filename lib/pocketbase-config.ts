/**
 * PocketBase Configuration Utility
 * 
 * Manages PocketBase configuration, environment variables,
 * and provides utilities for different environments.
 * 
 * Usage:
 *   import { pbConfig, getConfigForEnvironment } from '@/lib/pocketbase-config';
 *   console.log(pbConfig.url);
 */

import path from 'path';

// ==================== TYPES ====================

export interface PocketBaseConfig {
  // Server
  url: string;
  adminUrl: string;
  adminEmail: string;
  adminPassword: string;

  // Paths
  dataDir: string;
  pbExecutable: string;

  // Server options
  port: number;
  host: string;
  corsOrigins: string[];

  // Auth options
  authTokenDuration: number; // hours
  adminTokenDuration: number; // hours

  // Storage
  maxFileSize: number; // bytes
  allowedFileTypes: string[];

  // Rate limiting
  rateLimit: {
    requests: number;
    window: number; // seconds
  };

  // Logging
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  logFile?: string;
}

export type Environment = 'development' | 'production' | 'test';

// ==================== DEFAULT CONFIGURATION ====================

const defaultConfig: PocketBaseConfig = {
  // Server
  url: process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090',
  adminUrl: process.env.NEXT_PUBLIC_POCKETBASE_URL ? `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/_/` : 'http://localhost:8090/_/',
  adminEmail: process.env.POCKETBASE_ADMIN_EMAIL || 'admin@akhtarserve.com',
  adminPassword: process.env.POCKETBASE_ADMIN_PASSWORD || 'admin123',

  // Paths
  dataDir: process.env.POCKETBASE_DATA_DIR || path.join(process.cwd(), 'pb', 'data'),
  pbExecutable: process.env.POCKETBASE_EXECUTABLE || path.join(process.cwd(), 'pb', 'pocketbase.exe'),

  // Server options
  port: parseInt(process.env.POCKETBASE_PORT || '8090', 10),
  host: process.env.POCKETBASE_HOST || '127.0.0.1',
  corsOrigins: (process.env.POCKETBASE_CORS_ORIGINS || 'http://localhost:3000').split(','),

  // Auth options
  authTokenDuration: parseInt(process.env.POCKETBASE_AUTH_TOKEN_DURATION || '720', 10), // 30 days
  adminTokenDuration: parseInt(process.env.POCKETBASE_ADMIN_TOKEN_DURATION || '720', 10), // 30 days

  // Storage
  maxFileSize: parseInt(process.env.POCKETBASE_MAX_FILE_SIZE || '52428800', 10), // 50MB
  allowedFileTypes: (process.env.POCKETBASE_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp,application/pdf').split(','),

  // Rate limiting
  rateLimit: {
    requests: parseInt(process.env.POCKETBASE_RATE_LIMIT_REQUESTS || '60', 10),
    window: parseInt(process.env.POCKETBASE_RATE_LIMIT_WINDOW || '60', 10),
  },

  // Logging
  logLevel: (process.env.POCKETBASE_LOG_LEVEL as PocketBaseConfig['logLevel']) || 'info',
  logFile: process.env.POCKETBASE_LOG_FILE,
};

// ==================== ENVIRONMENT-SPECIFIC CONFIG ====================

const developmentConfig: Partial<PocketBaseConfig> = {
  url: 'http://localhost:8090',
  adminUrl: 'http://localhost:8090/_/',
  port: 8090,
  host: '127.0.0.1',
  logLevel: 'debug',
  rateLimit: {
    requests: 1000, // Higher limit for development
    window: 60,
  },
};

const productionConfig: Partial<PocketBaseConfig> = {
  logLevel: 'warn',
  rateLimit: {
    requests: 60,
    window: 60,
  },
};

const testConfig: Partial<PocketBaseConfig> = {
  url: 'http://localhost:8091',
  adminUrl: 'http://localhost:8091/_/',
  port: 8091,
  dataDir: path.join(process.cwd(), 'pb', 'test-data'),
  logLevel: 'error',
};

// ==================== CONFIGURATION MANAGER ====================

class PocketBaseConfigManager {
  private config: PocketBaseConfig;
  private environment: Environment;

  constructor() {
    this.environment = (process.env.NODE_ENV as Environment) || 'development';
    this.config = this.loadConfig();
  }

  private loadConfig(): PocketBaseConfig {
    let envConfig: Partial<PocketBaseConfig> = {};

    switch (this.environment) {
      case 'development':
        envConfig = developmentConfig;
        break;
      case 'production':
        envConfig = productionConfig;
        break;
      case 'test':
        envConfig = testConfig;
        break;
    }

    return {
      ...defaultConfig,
      ...envConfig,
    };
  }

  /**
   * Get the full configuration
   */
  getConfig(): PocketBaseConfig {
    return { ...this.config };
  }

  /**
   * Get a specific config value
   */
  get<K extends keyof PocketBaseConfig>(key: K): PocketBaseConfig[K] {
    return this.config[key];
  }

  /**
   * Get the current environment
   */
  getEnvironment(): Environment {
    return this.environment;
  }

  /**
   * Get server URL for API calls
   */
  getApiUrl(): string {
    return `${this.config.url}/api`;
  }

  /**
   * Get admin dashboard URL
   */
  getAdminUrl(): string {
    return this.config.adminUrl;
  }

  /**
   * Get CORS configuration
   */
  getCorsConfig(): { origin: string | string[]; credentials: boolean } {
    return {
      origin: this.config.corsOrigins,
      credentials: true,
    };
  }

  /**
   * Get PocketBase command line arguments
   */
  getCommandLineArgs(): string[] {
    const args = [
      'serve',
      '--dir', this.config.dataDir,
      '--http', `${this.config.host}:${this.config.port}`,
    ];

    // Add CORS origins
    if (this.config.corsOrigins.length > 0) {
      args.push('--cors', this.config.corsOrigins.join(','));
    }

    // Add log level
    if (this.config.logLevel === 'debug') {
      args.push('--debug');
    }

    return args;
  }

  /**
   * Validate configuration
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate URL
    try {
      new URL(this.config.url);
    } catch {
      errors.push(`Invalid PocketBase URL: ${this.config.url}`);
    }

    // Validate port
    if (this.config.port < 1 || this.config.port > 65535) {
      errors.push(`Invalid port: ${this.config.port}`);
    }

    // Validate admin email
    if (!this.config.adminEmail.includes('@')) {
      errors.push(`Invalid admin email: ${this.config.adminEmail}`);
    }

    // Validate admin password
    if (this.config.adminPassword.length < 6) {
      errors.push('Admin password must be at least 6 characters');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get configuration as environment variables for .env.local
   */
  toEnvVariables(): string {
    return `# PocketBase Configuration
NEXT_PUBLIC_POCKETBASE_URL=${this.config.url}
POCKETBASE_ADMIN_EMAIL=${this.config.adminEmail}
POCKETBASE_ADMIN_PASSWORD=${this.config.adminPassword}
POCKETBASE_PORT=${this.config.port}
POCKETBASE_HOST=${this.config.host}
POCKETBASE_DATA_DIR=${this.config.dataDir}
POCKETBASE_CORS_ORIGINS=${this.config.corsOrigins.join(',')}
POCKETBASE_LOG_LEVEL=${this.config.logLevel}
POCKETBASE_MAX_FILE_SIZE=${this.config.maxFileSize}
`;
  }

  /**
   * Print configuration summary
   */
  printSummary(): void {
    console.log('\n' + '='.repeat(50));
    console.log('PocketBase Configuration');
    console.log('='.repeat(50));
    console.log(`Environment: ${this.environment}`);
    console.log(`URL: ${this.config.url}`);
    console.log(`Admin URL: ${this.config.adminUrl}`);
    console.log(`Port: ${this.config.port}`);
    console.log(`Host: ${this.config.host}`);
    console.log(`Data Directory: ${this.config.dataDir}`);
    console.log(`Log Level: ${this.config.logLevel}`);
    console.log('='.repeat(50) + '\n');
  }
}

// ==================== SINGLETON EXPORT ====================

export const pbConfig = new PocketBaseConfigManager();

/**
 * Get configuration for a specific environment
 */
export function getConfigForEnvironment(env: Environment): PocketBaseConfig {
  const manager = new PocketBaseConfigManager();
  return manager.getConfig();
}

/**
 * Validate current configuration
 */
export function validateConfig() {
  return pbConfig.validate();
}

/**
 * Get environment variables for .env.local
 */
export function generateEnvFile(): string {
  return pbConfig.toEnvVariables();
}

/**
 * Print configuration summary
 */
export function printConfigSummary(): void {
  pbConfig.printSummary();
}

// ==================== DEFAULT EXPORT ====================

export default pbConfig;
