// ================================
// 🎯 SHARED CONSTANTS INDEX
// ================================
// Export tất cả constants cho Waddles restaurant management system

// Import all modules first
import { ROUTES, buildRoute } from './routes';
import type { RouteFunction, ApiRoutes, AuthRoutes, UserRoutes, RestaurantRoutes } from './routes';

import { MESSAGES, getMessage } from './messages';
import type { 
  Language, 
  SuccessMessages, 
  ErrorMessages, 
  WarningMessages, 
  InfoMessages, 
  MessageType 
} from './messages';

import { 
  USER_ROLES, 
  ROLE_HIERARCHY, 
  PERMISSIONS, 
  ROLE_PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRoleHierarchyLevel,
  canManageUser,
  getHigherRoles,
  getLowerRoles
} from './permissions';
import type { UserRole, Permission, Resource, Action } from './permissions';

import { SETTINGS, getEnvironmentSettings } from './settings';
import type { 
  AppSettings, 
  LocaleSettings, 
  SecuritySettings, 
  RestaurantSettings, 
  EnvironmentType 
} from './settings';

import { 
  BUSINESS_RULES,
  isValidVietnamesePhone,
  isValidEmail,
  isStrongPassword,
  formatVietnamesePhone,
  isWithinDeliveryRadius,
  calculateDeliveryFee,
  isEligibleForFreeDelivery,
  isPeakHour,
  getDeliveryTime
} from './business-rules';
import type { 
  OrderBusinessRules, 
  ReservationBusinessRules, 
  MenuBusinessRules, 
  PaymentBusinessRules 
} from './business-rules';

// Re-export everything
export * from './routes';
export * from './messages';
export * from './permissions';
export * from './settings';
export * from './business-rules';

// Export specific items
export { 
  ROUTES, 
  buildRoute,
  MESSAGES, 
  getMessage,
  USER_ROLES, 
  ROLE_HIERARCHY, 
  PERMISSIONS, 
  ROLE_PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRoleHierarchyLevel,
  canManageUser,
  getHigherRoles,
  getLowerRoles,
  SETTINGS, 
  getEnvironmentSettings,
  BUSINESS_RULES,
  isValidVietnamesePhone,
  isValidEmail,
  isStrongPassword,
  formatVietnamesePhone,
  isWithinDeliveryRadius,
  calculateDeliveryFee,
  isEligibleForFreeDelivery,
  isPeakHour,
  getDeliveryTime
};

// Export types
export type { 
  RouteFunction, 
  ApiRoutes, 
  AuthRoutes, 
  UserRoutes, 
  RestaurantRoutes,
  Language, 
  SuccessMessages, 
  ErrorMessages, 
  WarningMessages, 
  InfoMessages, 
  MessageType,
  UserRole, 
  Permission, 
  Resource, 
  Action,
  AppSettings, 
  LocaleSettings, 
  SecuritySettings, 
  RestaurantSettings, 
  EnvironmentType,
  OrderBusinessRules, 
  ReservationBusinessRules, 
  MenuBusinessRules, 
  PaymentBusinessRules 
};

// ================================
// 🚀 COMMONLY USED CONSTANTS
// ================================

// Quick access to frequently used constants
export const COMMON = {
  // Application info
  APP_NAME: 'Waddles Restaurant Management',
  APP_VERSION: '1.0.0',
  
  // Default settings
  DEFAULT_LANGUAGE: 'vi',
  DEFAULT_CURRENCY: 'VND',
  DEFAULT_TIMEZONE: 'Asia/Ho_Chi_Minh',
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // File upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  
  // Security
  PASSWORD_MIN_LENGTH: 8,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  
  // Business
  MINIMUM_ORDER_AMOUNT: 50000, // 50,000 VND
  FREE_DELIVERY_THRESHOLD: 200000, // 200,000 VND
  BASE_DELIVERY_FEE: 15000, // 15,000 VND
  
  // Timing
  ORDER_TIMEOUT: 15 * 60 * 1000, // 15 minutes
  DEFAULT_PREPARATION_TIME: 30, // minutes
  CANCELLATION_WINDOW: 10 * 60 * 1000, // 10 minutes
  
  // Contact
  SUPPORT_EMAIL: 'support@waddles.com',
  SUPPORT_PHONE: '+84 901 234 567'
} as const;

// ================================
// 🛠️ UTILITY FUNCTIONS
// ================================

/**
 * Get localized message
 */
export const getLocalizedMessage = (
  type: MessageType,
  key: string,
  language: Language = 'vi'
): string => {
  return getMessage(type, key, language);
};

/**
 * Check if user has specific permission
 */
export const checkPermission = (userRole: string, permission: string): boolean => {
  return hasPermission(userRole, permission);
};

/**
 * Format Vietnamese phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  return formatVietnamesePhone(phone);
};

/**
 * Calculate order delivery fee
 */
export const getDeliveryFee = (distance: number, orderAmount: number): number => {
  if (isEligibleForFreeDelivery(orderAmount)) {
    return 0;
  }
  return calculateDeliveryFee(distance);
};

/**
 * Check if current time is peak hour
 */
export const isCurrentlyPeakHour = (): boolean => {
  const now = new Date();
  const timeString = now.toTimeString().slice(0, 5); // HH:mm format
  return isPeakHour(timeString);
};

/**
 * Get estimated delivery time
 */
export const getEstimatedDeliveryTime = (): number => {
  return getDeliveryTime(isCurrentlyPeakHour());
};

/**
 * Validate Vietnamese business data
 */
export const validateVietnameseData = {
  phone: isValidVietnamesePhone,
  email: isValidEmail,
  password: isStrongPassword
};

// ================================
// 📱 PLATFORM-SPECIFIC EXPORTS
// ================================

/**
 * Constants specifically organized for different platforms
 */
export const PLATFORM_CONSTANTS = {
  // Next.js specific
  NEXTJS: {
    API_ROUTES: ROUTES,
    MESSAGES: MESSAGES,
    SETTINGS: SETTINGS.APP,
    PERMISSIONS: PERMISSIONS
  },
  
  // Express.js specific
  EXPRESS: {
    API_ROUTES: ROUTES,
    BUSINESS_RULES: BUSINESS_RULES,
    SECURITY: SETTINGS.SECURITY,
    DATABASE: SETTINGS.DATABASE
  },
  
  // Vite admin panel specific
  VITE: {
    PERMISSIONS: PERMISSIONS,
    ROLE_HIERARCHY: ROLE_HIERARCHY,
    ANALYTICS: SETTINGS.ANALYTICS,
    THEME: SETTINGS.THEME
  },
  
  // Expo mobile app specific
  EXPO: {
    MESSAGES: MESSAGES,
    VALIDATION: BUSINESS_RULES.VALIDATION,
    ORDER_RULES: BUSINESS_RULES.ORDER,
    COMMON: COMMON
  }
} as const;

// ================================
// 🔍 SEARCH AND FILTER CONSTANTS
// ================================

export const SEARCH_FILTERS = {
  ORDER_STATUS: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
  PAYMENT_STATUS: ['pending', 'completed', 'failed', 'refunded'],
  USER_ROLES: Object.values(USER_ROLES),
  MENU_CATEGORIES: ['appetizer', 'main_course', 'dessert', 'beverage', 'special'],
  INVENTORY_STATUS: ['in_stock', 'low_stock', 'out_of_stock', 'expired'],
  STAFF_STATUS: ['active', 'inactive', 'terminated'],
  RESTAURANT_STATUS: ['active', 'inactive', 'maintenance']
} as const;

// ================================
// 📊 ANALYTICS CONSTANTS
// ================================

export const ANALYTICS_METRICS = {
  REVENUE: ['total_revenue', 'daily_revenue', 'monthly_revenue', 'yearly_revenue'],
  ORDERS: ['total_orders', 'completed_orders', 'cancelled_orders', 'average_order_value'],
  CUSTOMERS: ['new_customers', 'returning_customers', 'customer_lifetime_value'],
  STAFF: ['staff_productivity', 'labor_cost', 'overtime_hours'],
  INVENTORY: ['inventory_turnover', 'waste_percentage', 'stock_levels'],
  PERFORMANCE: ['table_turnover', 'service_time', 'customer_satisfaction']
} as const;

// ================================
// 🎨 UI CONSTANTS
// ================================

export const UI_CONSTANTS = {
  COLORS: {
    PRIMARY: '#3B82F6',
    SECONDARY: '#6B7280', 
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    INFO: '#3B82F6'
  },
  
  BREAKPOINTS: {
    MOBILE: '768px',
    TABLET: '1024px',
    DESKTOP: '1280px'
  },
  
  ANIMATIONS: {
    FAST: '150ms',
    NORMAL: '300ms',
    SLOW: '500ms'
  },
  
  Z_INDEX: {
    DROPDOWN: 1000,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
    TOAST: 1080
  }
} as const;

// ================================
// 📝 TYPE DEFINITIONS
// ================================

export type PlatformType = keyof typeof PLATFORM_CONSTANTS;
export type SearchFilterType = keyof typeof SEARCH_FILTERS;
export type AnalyticsMetricType = keyof typeof ANALYTICS_METRICS;

// Export everything for convenience
export default {
  ROUTES,
  MESSAGES,
  PERMISSIONS,
  SETTINGS,
  BUSINESS_RULES,
  COMMON,
  PLATFORM_CONSTANTS,
  SEARCH_FILTERS,
  ANALYTICS_METRICS,
  UI_CONSTANTS
};
