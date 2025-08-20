// ================================
// ⚙️ SETTINGS CONSTANTS
// ================================
// Cài đặt mặc định cho hệ thống quản lý nhà hàng

// Application settings
export const APP_SETTINGS = {
  APP_NAME: 'Waddles Restaurant Management',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: 'Comprehensive Restaurant Management System',
  COMPANY_NAME: 'Waddles Team',
  COPYRIGHT: '© 2025 Waddles Team. All rights reserved.',
  SUPPORT_EMAIL: 'support@waddles.com',
  CONTACT_PHONE: '+84 901 234 567'
} as const;

// Default language and locale
export const LOCALE_SETTINGS = {
  DEFAULT_LANGUAGE: 'vi',
  SUPPORTED_LANGUAGES: ['vi', 'en'],
  DEFAULT_TIMEZONE: 'Asia/Ho_Chi_Minh',
  DEFAULT_CURRENCY: 'VND',
  DATE_FORMAT: 'DD/MM/YYYY',
  TIME_FORMAT: 'HH:mm',
  DATETIME_FORMAT: 'DD/MM/YYYY HH:mm'
} as const;

// Pagination settings
export const PAGINATION_SETTINGS = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 5,
  ALLOWED_PAGE_SIZES: [10, 20, 50, 100]
} as const;

// File upload settings
export const UPLOAD_SETTINGS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  IMAGE_UPLOAD_PATH: '/uploads/images',
  DOCUMENT_UPLOAD_PATH: '/uploads/documents',
  AVATAR_UPLOAD_PATH: '/uploads/avatars',
  MENU_ITEM_IMAGE_PATH: '/uploads/menu-items'
} as const;

// Security settings
export const SECURITY_SETTINGS = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBERS: true,
  PASSWORD_REQUIRE_SPECIAL_CHARS: true,
  PASSWORD_SPECIAL_CHARS: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  JWT_EXPIRY: '24h',
  REFRESH_TOKEN_EXPIRY: '7d'
} as const;

// Restaurant business settings
export const RESTAURANT_SETTINGS = {
  DEFAULT_OPERATING_HOURS: {
    monday: { open: '08:00', close: '22:00', closed: false },
    tuesday: { open: '08:00', close: '22:00', closed: false },
    wednesday: { open: '08:00', close: '22:00', closed: false },
    thursday: { open: '08:00', close: '22:00', closed: false },
    friday: { open: '08:00', close: '23:00', closed: false },
    saturday: { open: '08:00', close: '23:00', closed: false },
    sunday: { open: '09:00', close: '21:00', closed: false }
  },
  DEFAULT_TABLE_CAPACITY: 4,
  MIN_TABLE_CAPACITY: 1,
  MAX_TABLE_CAPACITY: 20,
  DEFAULT_RESERVATION_DURATION: 120, // minutes
  ADVANCE_BOOKING_LIMIT: 30, // days
  CANCELLATION_DEADLINE: 2, // hours before reservation
  DEFAULT_SERVICE_CHARGE: 0.1, // 10%
  DEFAULT_VAT_RATE: 0.1, // 10%
  MINIMUM_ORDER_AMOUNT: 50000, // 50,000 VND
  DELIVERY_RADIUS: 10 // kilometers
} as const;

// Order settings
export const ORDER_SETTINGS = {
  ORDER_CODE_PREFIX: 'WDL',
  ORDER_CODE_LENGTH: 8,
  DEFAULT_PREPARATION_TIME: 30, // minutes
  MAX_ORDER_ITEMS: 50,
  CANCELLATION_TIME_LIMIT: 15, // minutes after ordering
  AUTO_CONFIRM_TIME: 5, // minutes
  DELIVERY_TIME_BUFFER: 15, // minutes
  PICKUP_TIME_BUFFER: 10, // minutes
  ORDER_STATUS_UPDATE_INTERVAL: 30000, // 30 seconds
  PAYMENT_TIMEOUT: 15 * 60 * 1000 // 15 minutes
} as const;

// Menu settings
export const MENU_SETTINGS = {
  MAX_MENU_ITEMS_PER_CATEGORY: 100,
  MAX_CATEGORIES_PER_MENU: 20,
  DEFAULT_MENU_ITEM_STATUS: 'available',
  IMAGE_REQUIRED: false,
  DESCRIPTION_MAX_LENGTH: 500,
  NAME_MAX_LENGTH: 100,
  PRICE_MIN: 1000, // 1,000 VND
  PRICE_MAX: 10000000, // 10,000,000 VND
  PREP_TIME_MIN: 5, // minutes
  PREP_TIME_MAX: 180 // minutes
} as const;

// Inventory settings
export const INVENTORY_SETTINGS = {
  LOW_STOCK_THRESHOLD: 10,
  CRITICAL_STOCK_THRESHOLD: 5,
  EXPIRY_WARNING_DAYS: 7,
  AUTO_REORDER_ENABLED: false,
  STOCK_CHECK_FREQUENCY: 'daily',
  WASTE_TRACKING_ENABLED: true,
  COST_CALCULATION_METHOD: 'fifo', // first in, first out
  CURRENCY_DECIMAL_PLACES: 0 // VND không có số thập phân
} as const;

// Staff settings
export const STAFF_SETTINGS = {
  DEFAULT_WORK_HOURS_PER_DAY: 8,
  MAX_WORK_HOURS_PER_DAY: 12,
  OVERTIME_THRESHOLD: 8, // hours
  BREAK_DURATION: 60, // minutes
  SHIFT_BUFFER_TIME: 15, // minutes between shifts
  PAYROLL_FREQUENCY: 'monthly',
  PERFORMANCE_REVIEW_FREQUENCY: 'quarterly',
  TRAINING_REMINDER_DAYS: 30,
  PROBATION_PERIOD_DAYS: 90
} as const;

// Payment settings
export const PAYMENT_SETTINGS = {
  SUPPORTED_METHODS: ['cash', 'vnpay', 'momo', 'zalopay', 'bank_transfer'],
  DEFAULT_METHOD: 'cash',
  AUTO_CAPTURE: true,
  PARTIAL_PAYMENTS_ENABLED: false,
  TIP_ENABLED: true,
  TIP_SUGGESTIONS: [10, 15, 20], // percentages
  RECEIPT_AUTO_PRINT: true,
  CURRENCY: 'VND',
  REFUND_PROCESSING_DAYS: 3
} as const;

// Notification settings
export const NOTIFICATION_SETTINGS = {
  PUSH_NOTIFICATIONS_ENABLED: true,
  EMAIL_NOTIFICATIONS_ENABLED: true,
  SMS_NOTIFICATIONS_ENABLED: false,
  ORDER_UPDATES: true,
  RESERVATION_REMINDERS: true,
  PROMOTIONAL_MESSAGES: false,
  LOW_STOCK_ALERTS: true,
  STAFF_SCHEDULE_UPDATES: true,
  PAYMENT_CONFIRMATIONS: true,
  BATCH_SIZE: 100,
  RETRY_ATTEMPTS: 3,
  DELIVERY_TIMEOUT: 30000 // 30 seconds
} as const;

// Analytics settings
export const ANALYTICS_SETTINGS = {
  DATA_RETENTION_DAYS: 730, // 2 years
  REPORTING_FREQUENCY: 'daily',
  AUTOMATED_REPORTS: true,
  DASHBOARD_REFRESH_INTERVAL: 300000, // 5 minutes
  EXPORT_FORMATS: ['pdf', 'excel', 'csv'],
  CHART_COLORS: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'],
  DEFAULT_DATE_RANGE: 30, // days
  PERFORMANCE_METRICS: [
    'total_revenue',
    'order_count',
    'average_order_value',
    'customer_satisfaction',
    'table_turnover',
    'staff_productivity'
  ]
} as const;

// Cache settings
export const CACHE_SETTINGS = {
  DEFAULT_TTL: 300, // 5 minutes
  MENU_CACHE_TTL: 1800, // 30 minutes
  USER_CACHE_TTL: 600, // 10 minutes
  ANALYTICS_CACHE_TTL: 3600, // 1 hour
  STATIC_CONTENT_TTL: 86400, // 24 hours
  REDIS_KEY_PREFIX: 'waddles:',
  CACHE_ENABLED: true
} as const;

// Database settings
export const DATABASE_SETTINGS = {
  CONNECTION_POOL_SIZE: 10,
  CONNECTION_TIMEOUT: 30000,
  QUERY_TIMEOUT: 60000,
  RETRY_ATTEMPTS: 3,
  BACKUP_FREQUENCY: 'daily',
  BACKUP_RETENTION_DAYS: 30,
  SOFT_DELETE_ENABLED: true,
  AUDIT_LOG_ENABLED: true
} as const;

// API settings
export const API_SETTINGS = {
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 1000,
  REQUEST_TIMEOUT: 30000,
  MAX_REQUEST_SIZE: '10mb',
  CORS_ORIGINS: ['http://localhost:3000', 'http://localhost:3001'],
  API_VERSION: 'v1',
  WEBHOOK_RETRY_ATTEMPTS: 3,
  WEBHOOK_TIMEOUT: 10000
} as const;

// Environment-specific settings
export const ENVIRONMENT_SETTINGS = {
  DEVELOPMENT: {
    DEBUG_MODE: true,
    CONSOLE_LOGGING: true,
    DETAILED_ERRORS: true,
    HOT_RELOAD: true,
    MOCK_PAYMENTS: true
  },
  STAGING: {
    DEBUG_MODE: true,
    CONSOLE_LOGGING: false,
    DETAILED_ERRORS: true,
    HOT_RELOAD: false,
    MOCK_PAYMENTS: true
  },
  PRODUCTION: {
    DEBUG_MODE: false,
    CONSOLE_LOGGING: false,
    DETAILED_ERRORS: false,
    HOT_RELOAD: false,
    MOCK_PAYMENTS: false
  }
} as const;

// Theme settings
export const THEME_SETTINGS = {
  DEFAULT_THEME: 'light',
  AVAILABLE_THEMES: ['light', 'dark', 'auto'],
  PRIMARY_COLORS: {
    light: '#3B82F6',
    dark: '#60A5FA'
  },
  SECONDARY_COLORS: {
    light: '#6B7280',
    dark: '#9CA3AF'
  },
  ACCENT_COLORS: {
    light: '#10B981',
    dark: '#34D399'
  }
} as const;

// Export all settings
export const SETTINGS = {
  APP: APP_SETTINGS,
  LOCALE: LOCALE_SETTINGS,
  PAGINATION: PAGINATION_SETTINGS,
  UPLOAD: UPLOAD_SETTINGS,
  SECURITY: SECURITY_SETTINGS,
  RESTAURANT: RESTAURANT_SETTINGS,
  ORDER: ORDER_SETTINGS,
  MENU: MENU_SETTINGS,
  INVENTORY: INVENTORY_SETTINGS,
  STAFF: STAFF_SETTINGS,
  PAYMENT: PAYMENT_SETTINGS,
  NOTIFICATION: NOTIFICATION_SETTINGS,
  ANALYTICS: ANALYTICS_SETTINGS,
  CACHE: CACHE_SETTINGS,
  DATABASE: DATABASE_SETTINGS,
  API: API_SETTINGS,
  ENVIRONMENT: ENVIRONMENT_SETTINGS,
  THEME: THEME_SETTINGS
} as const;

// Helper function to get environment-specific settings
export const getEnvironmentSettings = (env: 'development' | 'staging' | 'production') => {
  return ENVIRONMENT_SETTINGS[env.toUpperCase() as keyof typeof ENVIRONMENT_SETTINGS];
};

// Type exports
export type AppSettings = typeof APP_SETTINGS;
export type LocaleSettings = typeof LOCALE_SETTINGS;
export type SecuritySettings = typeof SECURITY_SETTINGS;
export type RestaurantSettings = typeof RESTAURANT_SETTINGS;
export type EnvironmentType = keyof typeof ENVIRONMENT_SETTINGS;
