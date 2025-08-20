// ================================
// 🔐 PERMISSIONS CONSTANTS
// ================================
// Định nghĩa tất cả quyền hạn trong hệ thống quản lý nhà hàng

// User roles
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ORGANIZATION_ADMIN: 'organization_admin',
  RESTAURANT_MANAGER: 'restaurant_manager',
  ASSISTANT_MANAGER: 'assistant_manager',
  CHEF: 'chef',
  SOUS_CHEF: 'sous_chef',
  COOK: 'cook',
  WAITER: 'waiter',
  CASHIER: 'cashier',
  HOST: 'host',
  DELIVERY: 'delivery',
  CUSTOMER: 'customer'
} as const;

// Role hierarchy (higher number = more permissions)
export const ROLE_HIERARCHY = {
  [USER_ROLES.SUPER_ADMIN]: 100,
  [USER_ROLES.ORGANIZATION_ADMIN]: 90,
  [USER_ROLES.RESTAURANT_MANAGER]: 80,
  [USER_ROLES.ASSISTANT_MANAGER]: 70,
  [USER_ROLES.CHEF]: 60,
  [USER_ROLES.SOUS_CHEF]: 55,
  [USER_ROLES.COOK]: 50,
  [USER_ROLES.CASHIER]: 45,
  [USER_ROLES.WAITER]: 40,
  [USER_ROLES.HOST]: 35,
  [USER_ROLES.DELIVERY]: 30,
  [USER_ROLES.CUSTOMER]: 10
} as const;

// Resource types
export const RESOURCES = {
  ORGANIZATION: 'organization',
  RESTAURANT: 'restaurant',
  USER: 'user',
  MENU: 'menu',
  MENU_ITEM: 'menu_item',
  CATEGORY: 'category',
  ORDER: 'order',
  TABLE: 'table',
  RESERVATION: 'reservation',
  PAYMENT: 'payment',
  STAFF: 'staff',
  INVENTORY: 'inventory',
  RECIPE: 'recipe',
  SUPPLIER: 'supplier',
  ANALYTICS: 'analytics',
  REVIEW: 'review',
  SUPPORT: 'support',
  NOTIFICATION: 'notification',
  SETTINGS: 'settings'
} as const;

// Actions
export const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage',
  APPROVE: 'approve',
  REJECT: 'reject',
  EXPORT: 'export',
  IMPORT: 'import'
} as const;

// Permission definitions
export const PERMISSIONS = {
  // Organization permissions
  ORGANIZATION_MANAGE: 'organization:manage',
  ORGANIZATION_READ: 'organization:read',
  ORGANIZATION_UPDATE: 'organization:update',
  ORGANIZATION_DELETE: 'organization:delete',

  // Restaurant permissions
  RESTAURANT_CREATE: 'restaurant:create',
  RESTAURANT_READ: 'restaurant:read',
  RESTAURANT_UPDATE: 'restaurant:update',
  RESTAURANT_DELETE: 'restaurant:delete',
  RESTAURANT_MANAGE: 'restaurant:manage',

  // User management permissions
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_MANAGE: 'user:manage',

  // Menu management permissions
  MENU_CREATE: 'menu:create',
  MENU_READ: 'menu:read',
  MENU_UPDATE: 'menu:update',
  MENU_DELETE: 'menu:delete',
  MENU_MANAGE: 'menu:manage',

  MENU_ITEM_CREATE: 'menu_item:create',
  MENU_ITEM_READ: 'menu_item:read',
  MENU_ITEM_UPDATE: 'menu_item:update',
  MENU_ITEM_DELETE: 'menu_item:delete',
  MENU_ITEM_MANAGE: 'menu_item:manage',

  CATEGORY_CREATE: 'category:create',
  CATEGORY_READ: 'category:read',
  CATEGORY_UPDATE: 'category:update',
  CATEGORY_DELETE: 'category:delete',

  // Order management permissions
  ORDER_CREATE: 'order:create',
  ORDER_READ: 'order:read',
  ORDER_UPDATE: 'order:update',
  ORDER_DELETE: 'order:delete',
  ORDER_MANAGE: 'order:manage',
  ORDER_APPROVE: 'order:approve',
  ORDER_CANCEL: 'order:cancel',
  ORDER_REFUND: 'order:refund',

  // Table and reservation permissions
  TABLE_CREATE: 'table:create',
  TABLE_READ: 'table:read',
  TABLE_UPDATE: 'table:update',
  TABLE_DELETE: 'table:delete',
  TABLE_MANAGE: 'table:manage',

  RESERVATION_CREATE: 'reservation:create',
  RESERVATION_READ: 'reservation:read',
  RESERVATION_UPDATE: 'reservation:update',
  RESERVATION_DELETE: 'reservation:delete',
  RESERVATION_MANAGE: 'reservation:manage',

  // Payment permissions
  PAYMENT_CREATE: 'payment:create',
  PAYMENT_READ: 'payment:read',
  PAYMENT_UPDATE: 'payment:update',
  PAYMENT_PROCESS: 'payment:process',
  PAYMENT_REFUND: 'payment:refund',
  PAYMENT_MANAGE: 'payment:manage',

  // Staff management permissions
  STAFF_CREATE: 'staff:create',
  STAFF_READ: 'staff:read',
  STAFF_UPDATE: 'staff:update',
  STAFF_DELETE: 'staff:delete',
  STAFF_MANAGE: 'staff:manage',
  STAFF_SCHEDULE: 'staff:schedule',
  STAFF_PAYROLL: 'staff:payroll',
  STAFF_PERFORMANCE: 'staff:performance',

  // Inventory permissions
  INVENTORY_CREATE: 'inventory:create',
  INVENTORY_READ: 'inventory:read',
  INVENTORY_UPDATE: 'inventory:update',
  INVENTORY_DELETE: 'inventory:delete',
  INVENTORY_MANAGE: 'inventory:manage',
  INVENTORY_ADJUST: 'inventory:adjust',

  RECIPE_CREATE: 'recipe:create',
  RECIPE_READ: 'recipe:read',
  RECIPE_UPDATE: 'recipe:update',
  RECIPE_DELETE: 'recipe:delete',

  SUPPLIER_CREATE: 'supplier:create',
  SUPPLIER_READ: 'supplier:read',
  SUPPLIER_UPDATE: 'supplier:update',
  SUPPLIER_DELETE: 'supplier:delete',

  // Analytics permissions
  ANALYTICS_READ: 'analytics:read',
  ANALYTICS_EXPORT: 'analytics:export',
  ANALYTICS_MANAGE: 'analytics:manage',

  // Review permissions
  REVIEW_READ: 'review:read',
  REVIEW_RESPOND: 'review:respond',
  REVIEW_MODERATE: 'review:moderate',
  REVIEW_DELETE: 'review:delete',

  // Support permissions
  SUPPORT_CREATE: 'support:create',
  SUPPORT_READ: 'support:read',
  SUPPORT_UPDATE: 'support:update',
  SUPPORT_RESOLVE: 'support:resolve',
  SUPPORT_MANAGE: 'support:manage',

  // Settings permissions
  SETTINGS_READ: 'settings:read',
  SETTINGS_UPDATE: 'settings:update',
  SETTINGS_MANAGE: 'settings:manage'
} as const;

// Role-based permissions mapping
export const ROLE_PERMISSIONS = {
  [USER_ROLES.SUPER_ADMIN]: [
    // All permissions - super admin có tất cả quyền
    ...Object.values(PERMISSIONS)
  ],

  [USER_ROLES.ORGANIZATION_ADMIN]: [
    // Organization management
    PERMISSIONS.ORGANIZATION_READ,
    PERMISSIONS.ORGANIZATION_UPDATE,
    PERMISSIONS.ORGANIZATION_MANAGE,

    // Restaurant management
    PERMISSIONS.RESTAURANT_CREATE,
    PERMISSIONS.RESTAURANT_READ,
    PERMISSIONS.RESTAURANT_UPDATE,
    PERMISSIONS.RESTAURANT_DELETE,
    PERMISSIONS.RESTAURANT_MANAGE,

    // User management trong organization
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.USER_MANAGE,

    // Analytics toàn organization
    PERMISSIONS.ANALYTICS_READ,
    PERMISSIONS.ANALYTICS_EXPORT,
    PERMISSIONS.ANALYTICS_MANAGE,

    // Settings
    PERMISSIONS.SETTINGS_READ,
    PERMISSIONS.SETTINGS_UPDATE,
    PERMISSIONS.SETTINGS_MANAGE
  ],

  [USER_ROLES.RESTAURANT_MANAGER]: [
    // Restaurant operations
    PERMISSIONS.RESTAURANT_READ,
    PERMISSIONS.RESTAURANT_UPDATE,

    // Menu management
    PERMISSIONS.MENU_CREATE,
    PERMISSIONS.MENU_READ,
    PERMISSIONS.MENU_UPDATE,
    PERMISSIONS.MENU_DELETE,
    PERMISSIONS.MENU_MANAGE,
    PERMISSIONS.MENU_ITEM_CREATE,
    PERMISSIONS.MENU_ITEM_READ,
    PERMISSIONS.MENU_ITEM_UPDATE,
    PERMISSIONS.MENU_ITEM_DELETE,
    PERMISSIONS.MENU_ITEM_MANAGE,
    PERMISSIONS.CATEGORY_CREATE,
    PERMISSIONS.CATEGORY_READ,
    PERMISSIONS.CATEGORY_UPDATE,
    PERMISSIONS.CATEGORY_DELETE,

    // Order management
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.ORDER_UPDATE,
    PERMISSIONS.ORDER_MANAGE,
    PERMISSIONS.ORDER_APPROVE,
    PERMISSIONS.ORDER_CANCEL,
    PERMISSIONS.ORDER_REFUND,

    // Table and reservation management
    PERMISSIONS.TABLE_CREATE,
    PERMISSIONS.TABLE_READ,
    PERMISSIONS.TABLE_UPDATE,
    PERMISSIONS.TABLE_DELETE,
    PERMISSIONS.TABLE_MANAGE,
    PERMISSIONS.RESERVATION_READ,
    PERMISSIONS.RESERVATION_UPDATE,
    PERMISSIONS.RESERVATION_MANAGE,

    // Payment management
    PERMISSIONS.PAYMENT_READ,
    PERMISSIONS.PAYMENT_PROCESS,
    PERMISSIONS.PAYMENT_REFUND,
    PERMISSIONS.PAYMENT_MANAGE,

    // Staff management
    PERMISSIONS.STAFF_CREATE,
    PERMISSIONS.STAFF_READ,
    PERMISSIONS.STAFF_UPDATE,
    PERMISSIONS.STAFF_DELETE,
    PERMISSIONS.STAFF_MANAGE,
    PERMISSIONS.STAFF_SCHEDULE,
    PERMISSIONS.STAFF_PAYROLL,
    PERMISSIONS.STAFF_PERFORMANCE,

    // Inventory management
    PERMISSIONS.INVENTORY_CREATE,
    PERMISSIONS.INVENTORY_READ,
    PERMISSIONS.INVENTORY_UPDATE,
    PERMISSIONS.INVENTORY_DELETE,
    PERMISSIONS.INVENTORY_MANAGE,
    PERMISSIONS.INVENTORY_ADJUST,
    PERMISSIONS.RECIPE_CREATE,
    PERMISSIONS.RECIPE_READ,
    PERMISSIONS.RECIPE_UPDATE,
    PERMISSIONS.RECIPE_DELETE,
    PERMISSIONS.SUPPLIER_CREATE,
    PERMISSIONS.SUPPLIER_READ,
    PERMISSIONS.SUPPLIER_UPDATE,
    PERMISSIONS.SUPPLIER_DELETE,

    // Analytics
    PERMISSIONS.ANALYTICS_READ,
    PERMISSIONS.ANALYTICS_EXPORT,

    // Reviews
    PERMISSIONS.REVIEW_READ,
    PERMISSIONS.REVIEW_RESPOND,
    PERMISSIONS.REVIEW_MODERATE,

    // Support
    PERMISSIONS.SUPPORT_READ,
    PERMISSIONS.SUPPORT_UPDATE,
    PERMISSIONS.SUPPORT_RESOLVE,
    PERMISSIONS.SUPPORT_MANAGE,

    // Settings
    PERMISSIONS.SETTINGS_READ,
    PERMISSIONS.SETTINGS_UPDATE
  ],

  [USER_ROLES.ASSISTANT_MANAGER]: [
    // Restaurant read only
    PERMISSIONS.RESTAURANT_READ,

    // Menu management (limited)
    PERMISSIONS.MENU_READ,
    PERMISSIONS.MENU_UPDATE,
    PERMISSIONS.MENU_ITEM_READ,
    PERMISSIONS.MENU_ITEM_UPDATE,

    // Order management
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.ORDER_UPDATE,
    PERMISSIONS.ORDER_APPROVE,
    PERMISSIONS.ORDER_CANCEL,

    // Table management
    PERMISSIONS.TABLE_READ,
    PERMISSIONS.TABLE_UPDATE,
    PERMISSIONS.RESERVATION_READ,
    PERMISSIONS.RESERVATION_UPDATE,

    // Staff scheduling
    PERMISSIONS.STAFF_READ,
    PERMISSIONS.STAFF_UPDATE,
    PERMISSIONS.STAFF_SCHEDULE,

    // Inventory
    PERMISSIONS.INVENTORY_READ,
    PERMISSIONS.INVENTORY_UPDATE,
    PERMISSIONS.INVENTORY_ADJUST,

    // Analytics (read only)
    PERMISSIONS.ANALYTICS_READ
  ],

  [USER_ROLES.CHEF]: [
    // Menu và recipe management
    PERMISSIONS.MENU_READ,
    PERMISSIONS.MENU_ITEM_READ,
    PERMISSIONS.MENU_ITEM_UPDATE,
    PERMISSIONS.RECIPE_CREATE,
    PERMISSIONS.RECIPE_READ,
    PERMISSIONS.RECIPE_UPDATE,
    PERMISSIONS.RECIPE_DELETE,

    // Order management (kitchen view)
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.ORDER_UPDATE,

    // Inventory (ingredient focused)
    PERMISSIONS.INVENTORY_READ,
    PERMISSIONS.INVENTORY_UPDATE
  ],

  [USER_ROLES.SOUS_CHEF]: [
    // Menu items
    PERMISSIONS.MENU_READ,
    PERMISSIONS.MENU_ITEM_READ,
    PERMISSIONS.RECIPE_READ,
    PERMISSIONS.RECIPE_UPDATE,

    // Orders
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.ORDER_UPDATE,

    // Inventory
    PERMISSIONS.INVENTORY_READ
  ],

  [USER_ROLES.COOK]: [
    // Basic menu access
    PERMISSIONS.MENU_READ,
    PERMISSIONS.MENU_ITEM_READ,
    PERMISSIONS.RECIPE_READ,

    // Order preparation
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.ORDER_UPDATE,

    // Basic inventory view
    PERMISSIONS.INVENTORY_READ
  ],

  [USER_ROLES.WAITER]: [
    // Menu for customer service
    PERMISSIONS.MENU_READ,
    PERMISSIONS.MENU_ITEM_READ,

    // Order taking and management
    PERMISSIONS.ORDER_CREATE,
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.ORDER_UPDATE,

    // Table management
    PERMISSIONS.TABLE_READ,
    PERMISSIONS.TABLE_UPDATE,
    PERMISSIONS.RESERVATION_READ,

    // Basic payment
    PERMISSIONS.PAYMENT_READ,
    PERMISSIONS.PAYMENT_PROCESS
  ],

  [USER_ROLES.CASHIER]: [
    // Menu for pricing
    PERMISSIONS.MENU_READ,
    PERMISSIONS.MENU_ITEM_READ,

    // Order and payment processing
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.ORDER_UPDATE,
    PERMISSIONS.PAYMENT_CREATE,
    PERMISSIONS.PAYMENT_READ,
    PERMISSIONS.PAYMENT_PROCESS,

    // Basic analytics
    PERMISSIONS.ANALYTICS_READ
  ],

  [USER_ROLES.HOST]: [
    // Table and reservation management
    PERMISSIONS.TABLE_READ,
    PERMISSIONS.RESERVATION_CREATE,
    PERMISSIONS.RESERVATION_READ,
    PERMISSIONS.RESERVATION_UPDATE,

    // Basic menu knowledge
    PERMISSIONS.MENU_READ,
    PERMISSIONS.MENU_ITEM_READ
  ],

  [USER_ROLES.DELIVERY]: [
    // Order delivery management
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.ORDER_UPDATE,

    // Basic menu info
    PERMISSIONS.MENU_READ,
    PERMISSIONS.MENU_ITEM_READ
  ],

  [USER_ROLES.CUSTOMER]: [
    // Public menu access
    PERMISSIONS.MENU_READ,
    PERMISSIONS.MENU_ITEM_READ,

    // Own orders only
    PERMISSIONS.ORDER_CREATE,
    PERMISSIONS.ORDER_READ, // Own orders only

    // Reservations
    PERMISSIONS.RESERVATION_CREATE,
    PERMISSIONS.RESERVATION_READ, // Own reservations only

    // Reviews
    PERMISSIONS.REVIEW_READ,

    // Support
    PERMISSIONS.SUPPORT_CREATE,
    PERMISSIONS.SUPPORT_READ // Own tickets only
  ]
} as const;

// Helper functions
export const hasPermission = (userRole: string, permission: string): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS];
  if (!rolePermissions) return false;
  return (rolePermissions as readonly string[]).includes(permission);
};

export const hasAnyPermission = (userRole: string, permissions: string[]): boolean => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

export const hasAllPermissions = (userRole: string, permissions: string[]): boolean => {
  return permissions.every(permission => hasPermission(userRole, permission));
};

export const getRoleHierarchyLevel = (role: string): number => {
  return ROLE_HIERARCHY[role as keyof typeof ROLE_HIERARCHY] || 0;
};

export const canManageUser = (managerRole: string, targetRole: string): boolean => {
  const managerLevel = getRoleHierarchyLevel(managerRole);
  const targetLevel = getRoleHierarchyLevel(targetRole);
  return managerLevel > targetLevel;
};

export const getHigherRoles = (currentRole: string): string[] => {
  const currentLevel = getRoleHierarchyLevel(currentRole);
  return Object.entries(ROLE_HIERARCHY)
    .filter(([, level]) => level > currentLevel)
    .map(([role]) => role);
};

export const getLowerRoles = (currentRole: string): string[] => {
  const currentLevel = getRoleHierarchyLevel(currentRole);
  return Object.entries(ROLE_HIERARCHY)
    .filter(([, level]) => level < currentLevel)
    .map(([role]) => role);
};

// Type exports
export type UserRole = keyof typeof USER_ROLES;
export type Permission = keyof typeof PERMISSIONS;
export type Resource = keyof typeof RESOURCES;
export type Action = keyof typeof ACTIONS;
