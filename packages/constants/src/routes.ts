// ================================
// 🛣️ API ROUTES CONSTANTS
// ================================
// Định nghĩa tất cả các route API cho hệ thống quản lý nhà hàng

// Base API URLs
export const API_BASE = {
  V1: '/api/v1',
  V2: '/api/v2',
  WEBHOOK: '/api/webhook',
  UPLOAD: '/api/upload'
} as const;

// Authentication routes
export const AUTH_ROUTES = {
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  REGISTER: '/api/auth/register',
  REFRESH: '/api/auth/refresh',
  VERIFY: '/api/auth/verify',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',
  CHANGE_PASSWORD: '/api/auth/change-password',
  PROFILE: '/api/auth/profile'
} as const;

// User management routes
export const USER_ROUTES = {
  BASE: '/api/users',
  BY_ID: (id: string) => `/api/users/${id}`,
  PROFILE: (id: string) => `/api/users/${id}/profile`,
  PREFERENCES: (id: string) => `/api/users/${id}/preferences`,
  ADDRESSES: (id: string) => `/api/users/${id}/addresses`,
  ORDERS: (id: string) => `/api/users/${id}/orders`,
  REVIEWS: (id: string) => `/api/users/${id}/reviews`
} as const;

// Organization routes
export const ORGANIZATION_ROUTES = {
  BASE: '/api/organizations',
  BY_ID: (id: string) => `/api/organizations/${id}`,
  RESTAURANTS: (id: string) => `/api/organizations/${id}/restaurants`,
  STAFF: (id: string) => `/api/organizations/${id}/staff`,
  ANALYTICS: (id: string) => `/api/organizations/${id}/analytics`
} as const;

// Restaurant routes
export const RESTAURANT_ROUTES = {
  BASE: '/api/restaurants',
  BY_ID: (id: string) => `/api/restaurants/${id}`,
  MENU: (id: string) => `/api/restaurants/${id}/menu`,
  MENU_ITEMS: (id: string) => `/api/restaurants/${id}/menu-items`,
  CATEGORIES: (id: string) => `/api/restaurants/${id}/categories`,
  TABLES: (id: string) => `/api/restaurants/${id}/tables`,
  ORDERS: (id: string) => `/api/restaurants/${id}/orders`,
  STAFF: (id: string) => `/api/restaurants/${id}/staff`,
  INVENTORY: (id: string) => `/api/restaurants/${id}/inventory`,
  ANALYTICS: (id: string) => `/api/restaurants/${id}/analytics`,
  REVIEWS: (id: string) => `/api/restaurants/${id}/reviews`,
  SETTINGS: (id: string) => `/api/restaurants/${id}/settings`
} as const;

// Menu management routes
export const MENU_ROUTES = {
  BASE: '/api/menus',
  BY_ID: (id: string) => `/api/menus/${id}`,
  ITEMS: (id: string) => `/api/menus/${id}/items`,
  CATEGORIES: '/api/categories',
  CATEGORY_BY_ID: (id: string) => `/api/categories/${id}`
} as const;

// Menu item routes
export const MENU_ITEM_ROUTES = {
  BASE: '/api/menu-items',
  BY_ID: (id: string) => `/api/menu-items/${id}`,
  VARIANTS: (id: string) => `/api/menu-items/${id}/variants`,
  NUTRITION: (id: string) => `/api/menu-items/${id}/nutrition`,
  REVIEWS: (id: string) => `/api/menu-items/${id}/reviews`,
  AVAILABILITY: (id: string) => `/api/menu-items/${id}/availability`
} as const;

// Order management routes
export const ORDER_ROUTES = {
  BASE: '/api/orders',
  BY_ID: (id: string) => `/api/orders/${id}`,
  ITEMS: (id: string) => `/api/orders/${id}/items`,
  STATUS: (id: string) => `/api/orders/${id}/status`,
  PAYMENT: (id: string) => `/api/orders/${id}/payment`,
  TRACK: (id: string) => `/api/orders/${id}/track`,
  CANCEL: (id: string) => `/api/orders/${id}/cancel`,
  REFUND: (id: string) => `/api/orders/${id}/refund`
} as const;

// Table management routes
export const TABLE_ROUTES = {
  BASE: '/api/tables',
  BY_ID: (id: string) => `/api/tables/${id}`,
  RESERVATIONS: (id: string) => `/api/tables/${id}/reservations`,
  CURRENT_ORDER: (id: string) => `/api/tables/${id}/current-order`,
  QR_CODE: (id: string) => `/api/tables/${id}/qr-code`
} as const;

// Reservation routes
export const RESERVATION_ROUTES = {
  BASE: '/api/reservations',
  BY_ID: (id: string) => `/api/reservations/${id}`,
  CONFIRM: (id: string) => `/api/reservations/${id}/confirm`,
  CANCEL: (id: string) => `/api/reservations/${id}/cancel`,
  CHECK_IN: (id: string) => `/api/reservations/${id}/check-in`
} as const;

// Payment routes
export const PAYMENT_ROUTES = {
  BASE: '/api/payments',
  BY_ID: (id: string) => `/api/payments/${id}`,
  PROCESS: '/api/payments/process',
  VERIFY: '/api/payments/verify',
  REFUND: '/api/payments/refund',
  METHODS: '/api/payments/methods',
  VNPAY: '/api/payments/vnpay',
  MOMO: '/api/payments/momo',
  ZALOPAY: '/api/payments/zalopay'
} as const;

// Staff management routes
export const STAFF_ROUTES = {
  BASE: '/api/staff',
  BY_ID: (id: string) => `/api/staff/${id}`,
  SCHEDULE: (id: string) => `/api/staff/${id}/schedule`,
  TIME_TRACKING: (id: string) => `/api/staff/${id}/time-tracking`,
  PAYROLL: (id: string) => `/api/staff/${id}/payroll`,
  PERFORMANCE: (id: string) => `/api/staff/${id}/performance`,
  TRAINING: (id: string) => `/api/staff/${id}/training`
} as const;

// Inventory management routes
export const INVENTORY_ROUTES = {
  BASE: '/api/inventory',
  ITEMS: '/api/inventory/items',
  ITEM_BY_ID: (id: string) => `/api/inventory/items/${id}`,
  TRANSACTIONS: '/api/inventory/transactions',
  SUPPLIERS: '/api/inventory/suppliers',
  SUPPLIER_BY_ID: (id: string) => `/api/inventory/suppliers/${id}`,
  PURCHASE_ORDERS: '/api/inventory/purchase-orders',
  PURCHASE_ORDER_BY_ID: (id: string) => `/api/inventory/purchase-orders/${id}`,
  LOW_STOCK: '/api/inventory/low-stock',
  REPORTS: '/api/inventory/reports'
} as const;

// Recipe management routes
export const RECIPE_ROUTES = {
  BASE: '/api/recipes',
  BY_ID: (id: string) => `/api/recipes/${id}`,
  INGREDIENTS: (id: string) => `/api/recipes/${id}/ingredients`,
  COST_CALCULATION: (id: string) => `/api/recipes/${id}/cost-calculation`
} as const;

// Analytics routes
export const ANALYTICS_ROUTES = {
  BASE: '/api/analytics',
  DASHBOARD: '/api/analytics/dashboard',
  SALES: '/api/analytics/sales',
  MENU_PERFORMANCE: '/api/analytics/menu-performance',
  CUSTOMER_INSIGHTS: '/api/analytics/customer-insights',
  STAFF_PERFORMANCE: '/api/analytics/staff-performance',
  INVENTORY_TURNOVER: '/api/analytics/inventory-turnover',
  FINANCIAL: '/api/analytics/financial',
  REPORTS: '/api/analytics/reports'
} as const;

// Review and rating routes
export const REVIEW_ROUTES = {
  BASE: '/api/reviews',
  BY_ID: (id: string) => `/api/reviews/${id}`,
  RESPOND: (id: string) => `/api/reviews/${id}/respond`,
  MODERATE: (id: string) => `/api/reviews/${id}/moderate`
} as const;

// Support and ticket routes
export const SUPPORT_ROUTES = {
  BASE: '/api/support',
  TICKETS: '/api/support/tickets',
  TICKET_BY_ID: (id: string) => `/api/support/tickets/${id}`,
  MESSAGES: (ticketId: string) => `/api/support/tickets/${ticketId}/messages`,
  FAQ: '/api/support/faq',
  CONTACT: '/api/support/contact'
} as const;

// Notification routes
export const NOTIFICATION_ROUTES = {
  BASE: '/api/notifications',
  BY_ID: (id: string) => `/api/notifications/${id}`,
  MARK_READ: (id: string) => `/api/notifications/${id}/mark-read`,
  MARK_ALL_READ: '/api/notifications/mark-all-read',
  PREFERENCES: '/api/notifications/preferences'
} as const;

// Upload and media routes
export const MEDIA_ROUTES = {
  UPLOAD: '/api/media/upload',
  UPLOAD_MULTIPLE: '/api/media/upload-multiple',
  DELETE: (id: string) => `/api/media/${id}`,
  RESIZE: '/api/media/resize',
  OPTIMIZE: '/api/media/optimize'
} as const;

// Webhook routes
export const WEBHOOK_ROUTES = {
  PAYMENT: '/api/webhooks/payment',
  ORDER_STATUS: '/api/webhooks/order-status',
  INVENTORY: '/api/webhooks/inventory',
  CLERK: '/api/webhooks/clerk'
} as const;

// Export all route groups
export const ROUTES = {
  API_BASE,
  AUTH_ROUTES,
  USER_ROUTES,
  ORGANIZATION_ROUTES,
  RESTAURANT_ROUTES,
  MENU_ROUTES,
  MENU_ITEM_ROUTES,
  ORDER_ROUTES,
  TABLE_ROUTES,
  RESERVATION_ROUTES,
  PAYMENT_ROUTES,
  STAFF_ROUTES,
  INVENTORY_ROUTES,
  RECIPE_ROUTES,
  ANALYTICS_ROUTES,
  REVIEW_ROUTES,
  SUPPORT_ROUTES,
  NOTIFICATION_ROUTES,
  MEDIA_ROUTES,
  WEBHOOK_ROUTES
} as const;

// Helper function để build dynamic routes
export const buildRoute = (template: string, params: Record<string, string>): string => {
  return Object.entries(params).reduce(
    (route, [key, value]) => route.replace(`{${key}}`, value),
    template
  );
};

// Route types để đảm bảo type safety
export type RouteFunction = (id: string) => string;
export type ApiRoutes = typeof ROUTES;
export type AuthRoutes = typeof AUTH_ROUTES;
export type UserRoutes = typeof USER_ROUTES;
export type RestaurantRoutes = typeof RESTAURANT_ROUTES;
