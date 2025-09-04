import { CorsOptions } from 'cors';
import { environmentConfig } from './environment';

/**
 * CORS Configuration
 * Configures Cross-Origin Resource Sharing for the application
 */

// Allowed origins based on environment
const getAllowedOrigins = (): string[] => {
  const origins = [
    environmentConfig.CLIENT_URL,
    environmentConfig.MOBILE_URL,
  ];

  // Add development origins if in development mode
  if (environmentConfig.ENV === 'development') {
    origins.push(
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:8080',
      'http://localhost:8081',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:8080'
    );
  }

  // Filter out empty origins
  return origins.filter(origin => origin && origin.trim() !== '');
};

// Basic CORS configuration
export const corsConfig: CorsOptions = {
  origin: getAllowedOrigins(),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-HTTP-Method-Override',
    'Set-Cookie',
    'Cookie',
  ],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400, // 24 hours
};

// Socket.IO CORS configuration
export const socketCorsConfig = {
  origin: getAllowedOrigins(),
  methods: ['GET', 'POST'],
  credentials: true,
};

// GraphQL CORS configuration
export const graphqlCorsConfig: CorsOptions = {
  origin: getAllowedOrigins(),
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Apollo-Require-Preflight',
  ],
};

// Strict CORS configuration for production
export const strictCorsConfig: CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
  ],
  maxAge: 86400,
};

// Function to get CORS config based on environment
export const getCorsConfig = (): CorsOptions => {
  return environmentConfig.ENV === 'production' ? strictCorsConfig : corsConfig;
};

export default corsConfig;
