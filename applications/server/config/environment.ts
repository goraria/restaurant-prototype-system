import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface EnvironmentConfig {
  // Server Configuration
  PORT: number;
  ENV: string;
  CLIENT_URL: string;
  MOBILE_URL: string;
  
  // Authentication
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  CLERK_SECRET_KEY: string;
  CLERK_PUBLISHABLE_KEY: string;
  
  // Database
  DATABASE_URL: string;
  DIRECT_URL: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  DEMOBASE_URL: string;
  MONGODB_URI: string;
  
  // Payment Gateways - MoMo
  MOMO_ACCESS_KEY: string;
  MOMO_SECRET_KEY: string;
  MOMO_PARTNER_CODE: string;
  MOMO_PARTNER_NAME: string;
  MOMO_REDIRECT_URL: string;
  MOMO_IPN_URL: string;
  
  // Payment Gateways - ZaloPay
  ZLP_MERCHANT_APP_ID: string;
  ZLP_MERCHANT_KEY1: string;
  ZLP_MERCHANT_KEY2: string;
  ZLP_MERCHANT_ENDPOINT: string;
  ZLP_MERCHANT_CALLBACK_URL: string;
  ZLP_REDIRECT_URL: string;
  
  // Payment Gateways - VNPay
  VNP_TMN_CODE: string;
  VNP_HASH_SECRET: string;
  VNP_URL: string;
  VNP_API_URL: string;
  VNP_RETURN_URL: string;
  VNP_IPN_URL: string;
  
  // Additional VNPay aliases
  VNPAY_TMN_CODE: string;
  VNPAY_HASH_SECRET: string;
  VNPAY_URL: string;
  VNPAY_API_URL: string;
  VNPAY_RETURN_URL: string;
  VNPAY_IPN_URL: string;
}

// Validate and export environment configuration
function createEnvironmentConfig(): EnvironmentConfig {
  const requiredEnvVars = [
    'EXPRESS_JWT_SECRET',
    'EXPRESS_DATABASE_URL'
  ];

  // Check for required environment variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  return {
    // Server Configuration
    PORT: parseInt(process.env.EXPRESS_PORT || '8080', 10),
    ENV: process.env.EXPRESS_ENV || 'development',
    CLIENT_URL: process.env.EXPRESS_CLIENT_URL || 'http://localhost:3000',
    MOBILE_URL: process.env.EXPRESS_MOBILE_URL || 'http://localhost:8080',
    
    // Authentication
    JWT_SECRET: process.env.EXPRESS_JWT_SECRET || process.env.JWT_SECRET || '',
    JWT_REFRESH_SECRET: process.env.EXPRESS_JWT_REFRESH_SECRET || '',
    CLERK_SECRET_KEY: process.env.EXPRESS_CLERK_SECRET_KEY || process.env.CLERK_SECRET_KEY || '',
    CLERK_PUBLISHABLE_KEY: process.env.EXPRESS_PUBLIC_CLERK_PUBLISHABLE_KEY || '',
    
    // Database
    DATABASE_URL: process.env.EXPRESS_DATABASE_URL || process.env.DATABASE_URL || '',
    DIRECT_URL: process.env.EXPRESS_DIRECT_URL || process.env.DIRECT_URL || '',
    SUPABASE_URL: process.env.EXPRESS_SUPABASE_URL || '',
    SUPABASE_ANON_KEY: process.env.EXPRESS_SUPABASE_ANON_KEY || '',
    DEMOBASE_URL: process.env.EXPRESS_DEMOBASE_URL || '',
    MONGODB_URI: process.env.MONGODB_URI || '',
    
    // Payment Gateways - MoMo
    MOMO_ACCESS_KEY: process.env.MOMO_ACCESS_KEY || '',
    MOMO_SECRET_KEY: process.env.MOMO_SECRET_KEY || '',
    MOMO_PARTNER_CODE: process.env.MOMO_PARTNER_CODE || '',
    MOMO_PARTNER_NAME: process.env.MOMO_PARTNER_NAME || '',
    MOMO_REDIRECT_URL: process.env.MOMO_REDIRECT_URL || '',
    MOMO_IPN_URL: process.env.MOMO_IPN_URL || '',
    
    // Payment Gateways - ZaloPay
    ZLP_MERCHANT_APP_ID: process.env.ZLP_MERCHANT_APP_ID || '',
    ZLP_MERCHANT_KEY1: process.env.ZLP_MERCHANT_KEY1 || '',
    ZLP_MERCHANT_KEY2: process.env.ZLP_MERCHANT_KEY2 || '',
    ZLP_MERCHANT_ENDPOINT: process.env.ZLP_MERCHANT_ENDPOINT || '',
    ZLP_MERCHANT_CALLBACK_URL: process.env.ZLP_MERCHANT_CALLBACK_URL || '',
    ZLP_REDIRECT_URL: process.env.ZLP_REDIRECT_URL || '',
    
    // Payment Gateways - VNPay
    VNP_TMN_CODE: process.env.VNP_TMN_CODE || process.env.VNPAY_TMN_CODE || '',
    VNP_HASH_SECRET: process.env.VNP_HASH_SECRET || process.env.VNPAY_HASH_SECRET || '',
    VNP_URL: process.env.VNP_URL || process.env.VNPAY_URL || '',
    VNP_API_URL: process.env.VNP_API_URL || process.env.VNPAY_API_URL || '',
    VNP_RETURN_URL: process.env.VNP_RETURN_URL || process.env.VNPAY_RETURN_URL || '',
    VNP_IPN_URL: process.env.VNP_IPN_URL || process.env.VNPAY_IPN_URL || '',
    
    // Additional VNPay aliases
    VNPAY_TMN_CODE: process.env.VNPAY_TMN_CODE || process.env.VNP_TMN_CODE || '',
    VNPAY_HASH_SECRET: process.env.VNPAY_HASH_SECRET || process.env.VNP_HASH_SECRET || '',
    VNPAY_URL: process.env.VNPAY_URL || process.env.VNP_URL || '',
    VNPAY_API_URL: process.env.VNPAY_API_URL || process.env.VNP_API_URL || '',
    VNPAY_RETURN_URL: process.env.VNPAY_RETURN_URL || process.env.VNP_RETURN_URL || '',
    VNPAY_IPN_URL: process.env.VNPAY_IPN_URL || process.env.VNP_IPN_URL || '',
  };
}

// Export the configuration
export const environmentConfig = createEnvironmentConfig();

// Helper functions
export const isDevelopment = () => environmentConfig.ENV === 'development';
export const isProduction = () => environmentConfig.ENV === 'production';
export const isTest = () => environmentConfig.ENV === 'test';

// Export individual configs for convenience
export const {
  PORT,
  ENV,
  CLIENT_URL,
  MOBILE_URL,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  CLERK_SECRET_KEY,
  CLERK_PUBLISHABLE_KEY,
  DATABASE_URL,
  DIRECT_URL,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  DEMOBASE_URL,
  MONGODB_URI,
  MOMO_ACCESS_KEY,
  MOMO_SECRET_KEY,
  MOMO_PARTNER_CODE,
  MOMO_PARTNER_NAME,
  MOMO_REDIRECT_URL,
  MOMO_IPN_URL,
  ZLP_MERCHANT_APP_ID,
  ZLP_MERCHANT_KEY1,
  ZLP_MERCHANT_KEY2,
  ZLP_MERCHANT_ENDPOINT,
  ZLP_MERCHANT_CALLBACK_URL,
  ZLP_REDIRECT_URL,
  VNP_TMN_CODE,
  VNP_HASH_SECRET,
  VNP_URL,
  VNP_API_URL,
  VNP_RETURN_URL,
  VNP_IPN_URL,
  VNPAY_TMN_CODE,
  VNPAY_HASH_SECRET,
  VNPAY_URL,
  VNPAY_API_URL,
  VNPAY_RETURN_URL,
  VNPAY_IPN_URL,
} = environmentConfig;

export default environmentConfig;
