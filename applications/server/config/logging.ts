import { environmentConfig } from './environment';

/**
 * Logging Configuration
 * Centralizes logging configuration for the application
 */

export interface LoggingConfig {
  level: string;
  format: 'json' | 'simple' | 'combined' | 'dev';
  colorize: boolean;
  timestamp: boolean;
  file: {
    enabled: boolean;
    filename: string;
    maxsize: number;
    maxFiles: number;
    datePattern: string;
  };
  console: {
    enabled: boolean;
    level: string;
    handleExceptions: boolean;
    handleRejections: boolean;
  };
  database: {
    enabled: boolean;
    level: string;
    collection: string;
  };
  http: {
    enabled: boolean;
    level: string;
    endpoint?: string;
  };
}

// Create logging configuration based on environment
export const loggingConfig: LoggingConfig = {
  level: environmentConfig.ENV === 'production' ? 'info' : 'debug',
  format: environmentConfig.ENV === 'production' ? 'json' : 'simple',
  colorize: environmentConfig.ENV !== 'production',
  timestamp: true,
  
  // File logging configuration
  file: {
    enabled: environmentConfig.ENV === 'production',
    filename: 'logs/app-%DATE%.log',
    maxsize: 5242880, // 5MB
    maxFiles: 14, // Keep logs for 2 weeks
    datePattern: 'YYYY-MM-DD',
  },
  
  // Console logging configuration
  console: {
    enabled: true,
    level: environmentConfig.ENV === 'production' ? 'error' : 'debug',
    handleExceptions: true,
    handleRejections: true,
  },
  
  // Database logging configuration
  database: {
    enabled: false, // Can be enabled if needed
    level: 'error',
    collection: 'logs',
  },
  
  // HTTP logging configuration (for external log services)
  http: {
    enabled: false,
    level: 'error',
    // endpoint: 'https://your-log-service.com/api/logs'
  },
};

// Morgan configuration for HTTP request logging
export const morganConfig = {
  format: environmentConfig.ENV === 'production' ? 'combined' : 'dev',
  skip: (req: any, res: any) => {
    // Skip logging for health check endpoints
    return req.url === '/health' || req.url === '/ping';
  },
  stream: {
    // Custom stream for logging HTTP requests
    write: (message: string) => {
      // You can integrate with your logging service here
      console.log(message.trim());
    },
  },
};

// Error logging configuration
export const errorLoggingConfig = {
  // Log all errors to file in production
  logToFile: environmentConfig.ENV === 'production',
  
  // Include stack traces in development
  includeStack: environmentConfig.ENV === 'development',
  
  // Log request details with errors
  includeRequest: true,
  
  // Sensitive fields to exclude from error logs
  excludeFields: [
    'password',
    'token',
    'authorization',
    'secret',
    'key',
    'credentials',
  ],
  
  // Error codes that should be logged as warnings instead of errors
  warningCodes: [400, 401, 403, 404, 422],
  
  // Error codes that should trigger alerts
  alertCodes: [500, 502, 503, 504],
};

// Audit logging configuration
export const auditLoggingConfig = {
  enabled: environmentConfig.ENV === 'production',
  
  // Events to audit
  events: [
    'user.login',
    'user.logout',
    'user.created',
    'user.updated',
    'user.deleted',
    'order.created',
    'order.updated',
    'order.cancelled',
    'payment.created',
    'payment.completed',
    'payment.failed',
    'admin.action',
  ],
  
  // Include user context in audit logs
  includeUser: true,
  
  // Include IP address in audit logs
  includeIp: true,
  
  // Include request details
  includeRequest: true,
  
  // Storage configuration for audit logs
  storage: {
    type: 'database', // 'file' | 'database' | 'external'
    table: 'audit_logs',
    retention: 365, // days
  },
};

// Performance logging configuration
export const performanceLoggingConfig = {
  enabled: environmentConfig.ENV !== 'test',
  
  // Threshold for slow query logging (ms)
  slowQueryThreshold: 1000,
  
  // Threshold for slow request logging (ms)
  slowRequestThreshold: 5000,
  
  // Include query parameters in performance logs
  includeQuery: environmentConfig.ENV === 'development',
  
  // Include request body in performance logs (development only)
  includeBody: environmentConfig.ENV === 'development',
  
  // Sample rate for performance logging (1.0 = 100%, 0.1 = 10%)
  sampleRate: environmentConfig.ENV === 'production' ? 0.1 : 1.0,
};

// Export all logging configurations
export const allLoggingConfig = {
  main: loggingConfig,
  morgan: morganConfig,
  error: errorLoggingConfig,
  audit: auditLoggingConfig,
  performance: performanceLoggingConfig,
};

// Helper functions
export const getLogLevel = (): string => {
  return loggingConfig.level;
};

export const shouldLogToFile = (): boolean => {
  return loggingConfig.file.enabled;
};

export const shouldLogToConsole = (): boolean => {
  return loggingConfig.console.enabled;
};

export const isDebugMode = (): boolean => {
  return loggingConfig.level === 'debug';
};

export default allLoggingConfig;
