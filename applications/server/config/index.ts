/**
 * Configuration Index
 * Central export point for all configuration modules
 */

// Core configurations
export { default as environmentConfig } from './environment';
export { default as serverConfig, applicationConfig } from './server';
export { default as authConfig, JWTService } from './auth';
export { default as corsConfig, getCorsConfig, socketCorsConfig, graphqlCorsConfig } from './cors';

// Service configurations
export { default as paymentGatewayConfig, isPaymentGatewayEnabled, getEnabledPaymentGateways } from './payment';
export { default as prismaConfig } from './prisma';
export { clerkConfigClient } from './clerk';
export { createGraphQLMiddleware } from './graphql';
export { initializeRealtimeChat } from './realtime';
export { imageUpload, fileUpload } from './upload';
export { initializeSocketService } from './socket';

// Additional configurations
export { default as loggingConfig } from './logging';
export { default as rateLimitConfig, getRateLimitForEndpoint } from './rateLimit';

// Re-export specific items to avoid conflicts
export { 
  environmentConfig as env,
  JWT_SECRET,
  DATABASE_URL,
  CLIENT_URL,
  PORT
} from './environment';

export {
  serverConfig as server,
  isDevelopment as isDevMode,
  isProduction as isProdMode,
  getApiUrl,
  getFullUrl
} from './server';

export {
  jwtConfig,
  roles,
  permissions,
  rolePermissions
} from './auth';

export {
  momoConfig,
  zaloPayConfig,
  vnPayConfig,
  paymentConfig
} from './payment';

// Configuration validation
export const validateConfigurations = (): boolean => {
  try {
    // Check if required environment variables are set
    const required = [
      'EXPRESS_JWT_SECRET',
      'EXPRESS_DATABASE_URL'
    ];

    for (const envVar of required) {
      if (!process.env[envVar]) {
        console.error(`❌ Missing required environment variable: ${envVar}`);
        return false;
      }
    }

    console.log('✅ All configurations validated successfully');
    return true;
  } catch (error) {
    console.error('❌ Configuration validation failed:', error);
    return false;
  }
};

// Helper function to get all config status
export const getConfigStatus = () => {
  return {
    environment: !!process.env.EXPRESS_JWT_SECRET,
    database: !!process.env.EXPRESS_DATABASE_URL,
    clerk: !!process.env.EXPRESS_CLERK_SECRET_KEY,
    payment: {
      momo: !!(process.env.MOMO_ACCESS_KEY && process.env.MOMO_SECRET_KEY),
      zalopay: !!(process.env.ZLP_MERCHANT_APP_ID && process.env.ZLP_MERCHANT_KEY1),
      vnpay: !!(process.env.VNP_TMN_CODE && process.env.VNP_HASH_SECRET) || 
              !!(process.env.VNPAY_TMN_CODE && process.env.VNPAY_HASH_SECRET),
    },
  };
};
