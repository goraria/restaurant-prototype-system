import { environmentConfig } from './environment';

/**
 * Server Configuration
 * Centralizes server-related configurations
 */

export interface ServerConfig {
  port: number;
  env: string;
  clientUrl: string;
  mobileUrl: string;
  apiPrefix: string;
  apiVersion: string;
  timeout: number;
  bodyLimit: string;
  uploadLimit: string;
  rateLimit: {
    windowMs: number;
    max: number;
    message: string;
  };
  session: {
    secret: string;
    resave: boolean;
    saveUninitialized: boolean;
    cookie: {
      secure: boolean;
      httpOnly: boolean;
      maxAge: number;
    };
  };
  security: {
    helmet: boolean;
    csrf: boolean;
    compression: boolean;
    morgan: string;
  };
}

// Create server configuration
export const serverConfig: ServerConfig = {
  port: environmentConfig.PORT,
  env: environmentConfig.ENV,
  clientUrl: environmentConfig.CLIENT_URL,
  mobileUrl: environmentConfig.MOBILE_URL,
  apiPrefix: '/api',
  apiVersion: 'v1',
  timeout: 30000, // 30 seconds
  bodyLimit: '50mb',
  uploadLimit: '100mb',
  
  // Rate limiting configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: environmentConfig.ENV === 'production' ? 100 : 1000, // requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
  },
  
  // Session configuration
  session: {
    secret: environmentConfig.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: environmentConfig.ENV === 'production', // HTTPS only in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  },
  
  // Security configuration
  security: {
    helmet: true,
    csrf: environmentConfig.ENV === 'production',
    compression: true,
    morgan: environmentConfig.ENV === 'production' ? 'combined' : 'dev',
  },
};

// Socket.IO configuration
export const socketConfig = {
  cors: {
    origin: [environmentConfig.CLIENT_URL, environmentConfig.MOBILE_URL],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  maxHttpBufferSize: 1e6, // 1MB
  transports: ['websocket', 'polling'],
};

// GraphQL configuration
export const graphqlConfig = {
  path: '/graphql',
  playground: environmentConfig.ENV !== 'production',
  introspection: environmentConfig.ENV !== 'production',
  debug: environmentConfig.ENV === 'development',
  subscriptions: {
    path: '/graphql',
    keepAlive: 30000,
  },
  uploads: {
    maxFileSize: 10000000, // 10MB
    maxFiles: 10,
  },
};

// Logging configuration
export const loggingConfig = {
  level: environmentConfig.ENV === 'production' ? 'info' : 'debug',
  format: environmentConfig.ENV === 'production' ? 'json' : 'simple',
  file: {
    enabled: environmentConfig.ENV === 'production',
    filename: 'logs/app.log',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  },
  console: {
    enabled: true,
    level: environmentConfig.ENV === 'production' ? 'error' : 'debug',
  },
};

// Health check configuration
export const healthCheckConfig = {
  path: '/health',
  timeout: 5000,
  checks: {
    database: true,
    redis: false, // Enable if using Redis
    external: false, // Enable for external service checks
  },
};

// Static files configuration
export const staticConfig = {
  publicPath: '/public',
  uploadsPath: '/uploads',
  avatarPath: '/avatar',
  imagesPath: '/images',
  filesPath: '/files',
  maxAge: environmentConfig.ENV === 'production' ? '1d' : '0',
  etag: environmentConfig.ENV === 'production',
};

// Export all configurations
export const applicationConfig = {
  server: serverConfig,
  socket: socketConfig,
  graphql: graphqlConfig,
  logging: loggingConfig,
  healthCheck: healthCheckConfig,
  static: staticConfig,
};

// Helper functions
export const isDevelopment = () => serverConfig.env === 'development';
export const isProduction = () => serverConfig.env === 'production';
export const isTest = () => serverConfig.env === 'test';

export const getApiUrl = (path: string = '') => {
  return `${serverConfig.apiPrefix}/${serverConfig.apiVersion}${path}`;
};

export const getFullUrl = (path: string = '') => {
  const baseUrl = isProduction() ? serverConfig.clientUrl : `http://localhost:${serverConfig.port}`;
  return `${baseUrl}${path}`;
};

export default applicationConfig;
