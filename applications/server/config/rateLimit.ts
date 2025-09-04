import { environmentConfig } from './environment';

/**
 * Rate Limiting Configuration
 * Centralizes rate limiting configuration for the application
 */

export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  standardHeaders: boolean;
  legacyHeaders: boolean;
  skipSuccessfulRequests: boolean;
  skipFailedRequests: boolean;
  keyGenerator?: (req: any) => string;
  skip?: (req: any) => boolean;
}

// Default rate limiting configuration
export const defaultRateLimit: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: environmentConfig.ENV === 'production' ? 100 : 1000,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
};

// Strict rate limiting for sensitive endpoints
export const strictRateLimit: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: environmentConfig.ENV === 'production' ? 5 : 50,
  message: 'Too many requests to this endpoint, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
};

// Auth-related rate limiting
export const authRateLimit: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: environmentConfig.ENV === 'production' ? 10 : 100,
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
  skipFailedRequests: false,
  keyGenerator: (req: any) => {
    // Use IP + email/username for auth rate limiting
    return `${req.ip}_${req.body?.email || req.body?.username || 'unknown'}`;
  },
};

// Password reset rate limiting
export const passwordResetRateLimit: RateLimitConfig = {
  windowMs: 60 * 60 * 1000, // 1 hour
  max: environmentConfig.ENV === 'production' ? 3 : 10,
  message: 'Too many password reset attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
  keyGenerator: (req: any) => {
    return `${req.ip}_${req.body?.email || 'unknown'}`;
  },
};

// File upload rate limiting
export const uploadRateLimit: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: environmentConfig.ENV === 'production' ? 20 : 100,
  message: 'Too many file upload attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
};

// API rate limiting (more lenient for API usage)
export const apiRateLimit: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: environmentConfig.ENV === 'production' ? 1000 : 10000,
  message: 'API rate limit exceeded, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
};

// GraphQL rate limiting
export const graphqlRateLimit: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: environmentConfig.ENV === 'production' ? 500 : 5000,
  message: 'GraphQL rate limit exceeded, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
};

// WebSocket connection rate limiting
export const socketRateLimit = {
  maxConnections: environmentConfig.ENV === 'production' ? 10 : 100, // per IP
  connectionWindowMs: 60 * 1000, // 1 minute
  maxMessagesPerSecond: 10,
  maxMessagesPerMinute: 100,
  disconnectOnLimit: true,
  message: 'Socket connection limit exceeded',
};

// Payment-related rate limiting
export const paymentRateLimit: RateLimitConfig = {
  windowMs: 60 * 60 * 1000, // 1 hour
  max: environmentConfig.ENV === 'production' ? 10 : 100,
  message: 'Too many payment attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
};

// Search rate limiting
export const searchRateLimit: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  max: environmentConfig.ENV === 'production' ? 30 : 300,
  message: 'Too many search requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
};

// Email sending rate limiting
export const emailRateLimit: RateLimitConfig = {
  windowMs: 60 * 60 * 1000, // 1 hour
  max: environmentConfig.ENV === 'production' ? 5 : 50,
  message: 'Too many email requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
};

// Export all rate limiting configurations
export const rateLimitConfig = {
  default: defaultRateLimit,
  strict: strictRateLimit,
  auth: authRateLimit,
  passwordReset: passwordResetRateLimit,
  upload: uploadRateLimit,
  api: apiRateLimit,
  graphql: graphqlRateLimit,
  socket: socketRateLimit,
  payment: paymentRateLimit,
  search: searchRateLimit,
  email: emailRateLimit,
};

// Helper functions
export const getRateLimitForEndpoint = (endpoint: string): RateLimitConfig => {
  if (endpoint.includes('/auth/')) return authRateLimit;
  if (endpoint.includes('/password/reset')) return passwordResetRateLimit;
  if (endpoint.includes('/upload')) return uploadRateLimit;
  if (endpoint.includes('/payment/')) return paymentRateLimit;
  if (endpoint.includes('/search')) return searchRateLimit;
  if (endpoint.includes('/email/')) return emailRateLimit;
  if (endpoint.includes('/api/')) return apiRateLimit;
  if (endpoint.includes('/graphql')) return graphqlRateLimit;
  
  return defaultRateLimit;
};

export const createCustomRateLimit = (
  windowMs: number,
  max: number,
  message?: string
): RateLimitConfig => {
  return {
    windowMs,
    max,
    message: message || 'Rate limit exceeded, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
  };
};

export default rateLimitConfig;
