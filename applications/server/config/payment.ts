import { environmentConfig } from './environment';

/**
 * Payment Gateway Configuration
 * Centralizes all payment gateway configurations
 */

export interface PaymentGatewayConfig {
  enabled: boolean;
  testMode: boolean;
}

// MoMo Configuration
export interface MoMoConfig extends PaymentGatewayConfig {
  accessKey: string;
  secretKey: string;
  partnerCode: string;
  partnerName: string;
  redirectUrl: string;
  ipnUrl: string;
  endpoint: string;
  requestType: string;
}

// ZaloPay Configuration
export interface ZaloPayConfig extends PaymentGatewayConfig {
  appId: string;
  key1: string;
  key2: string;
  endpoint: string;
  callbackUrl: string;
  redirectUrl: string;
}

// VNPay Configuration
export interface VNPayConfig extends PaymentGatewayConfig {
  tmnCode: string;
  hashSecret: string;
  url: string;
  returnUrl: string;
  version: string;
  currCode: string;
  locale: string;
}

// MoMo Configuration
export const momoConfig: MoMoConfig = {
  enabled: Boolean(environmentConfig.MOMO_ACCESS_KEY && environmentConfig.MOMO_SECRET_KEY),
  testMode: environmentConfig.ENV !== 'production',
  accessKey: environmentConfig.MOMO_ACCESS_KEY,
  secretKey: environmentConfig.MOMO_SECRET_KEY,
  partnerCode: environmentConfig.MOMO_PARTNER_CODE,
  partnerName: environmentConfig.MOMO_PARTNER_NAME || 'Your Company Name',
  redirectUrl: environmentConfig.MOMO_REDIRECT_URL || `${environmentConfig.CLIENT_URL}/payment/momo/callback`,
  ipnUrl: environmentConfig.MOMO_IPN_URL || `${environmentConfig.CLIENT_URL}/api/payment/momo/ipn`,
  endpoint: environmentConfig.ENV === 'production' 
    ? 'https://payment.momo.vn/v2/gateway/api/create'
    : 'https://test-payment.momo.vn/v2/gateway/api/create',
  requestType: 'payWithMethod',
};

// ZaloPay Configuration
export const zaloPayConfig: ZaloPayConfig = {
  enabled: Boolean(environmentConfig.ZLP_MERCHANT_APP_ID && environmentConfig.ZLP_MERCHANT_KEY1),
  testMode: environmentConfig.ENV !== 'production',
  appId: environmentConfig.ZLP_MERCHANT_APP_ID,
  key1: environmentConfig.ZLP_MERCHANT_KEY1,
  key2: environmentConfig.ZLP_MERCHANT_KEY2,
  endpoint: environmentConfig.ZLP_MERCHANT_ENDPOINT || 'https://sb-openapi.zalopay.vn/v2/create',
  callbackUrl: environmentConfig.ZLP_MERCHANT_CALLBACK_URL || `${environmentConfig.CLIENT_URL}/api/payment/zalopay/callback`,
  redirectUrl: environmentConfig.ZLP_REDIRECT_URL || `${environmentConfig.CLIENT_URL}/payment/zalopay/callback`,
};

// VNPay Configuration
export const vnPayConfig: VNPayConfig = {
  enabled: Boolean(environmentConfig.VNP_TMN_CODE && environmentConfig.VNP_HASH_SECRET),
  testMode: environmentConfig.ENV !== 'production',
  tmnCode: environmentConfig.VNP_TMN_CODE,
  hashSecret: environmentConfig.VNP_HASH_SECRET,
  url: environmentConfig.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  returnUrl: environmentConfig.VNP_RETURN_URL || `${environmentConfig.CLIENT_URL}/payment/vnpay/callback`,
  version: '2.1.0',
  currCode: 'VND',
  locale: 'vn',
};

// General payment configuration
export const paymentConfig = {
  defaultCurrency: 'VND',
  timeoutMinutes: 15, // Payment timeout in minutes
  maxRetries: 3,
  allowedPaymentMethods: [
    ...(momoConfig.enabled ? ['momo'] : []),
    ...(zaloPayConfig.enabled ? ['zalopay'] : []),
    ...(vnPayConfig.enabled ? ['vnpay'] : []),
  ],
  
  // Order ID generation settings
  orderIdPrefix: environmentConfig.ENV === 'production' ? 'PROD' : 'DEV',
  orderIdLength: 12,
  
  // Amount limits (in VND)
  minAmount: 1000, // 1,000 VND
  maxAmount: 50000000, // 50,000,000 VND
};

// Webhook security configuration
export const webhookConfig = {
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 5000, // 5 seconds
  
  // Allowed IPs for webhooks (if needed)
  allowedIPs: environmentConfig.ENV === 'production' ? [
    // Add production webhook IPs here
    // MoMo IPs: ['x.x.x.x']
    // ZaloPay IPs: ['y.y.y.y']
    // VNPay IPs: ['z.z.z.z']
  ] : [], // Allow all IPs in development
};

// Export all configurations
export const paymentGatewayConfig = {
  momo: momoConfig,
  zalopay: zaloPayConfig,
  vnpay: vnPayConfig,
  general: paymentConfig,
  webhook: webhookConfig,
};

// Helper functions
export const isPaymentGatewayEnabled = (gateway: 'momo' | 'zalopay' | 'vnpay'): boolean => {
  switch (gateway) {
    case 'momo':
      return momoConfig.enabled;
    case 'zalopay':
      return zaloPayConfig.enabled;
    case 'vnpay':
      return vnPayConfig.enabled;
    default:
      return false;
  }
};

export const getEnabledPaymentGateways = (): string[] => {
  return paymentConfig.allowedPaymentMethods;
};

export default paymentGatewayConfig;
