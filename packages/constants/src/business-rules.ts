// ================================
// 📋 BUSINESS RULES CONSTANTS
// ================================
// Quy tắc kinh doanh cho hệ thống quản lý nhà hàng

// Order business rules
export const ORDER_BUSINESS_RULES = {
  // Thời gian
  MIN_PREPARATION_TIME: 10, // phút
  MAX_PREPARATION_TIME: 180, // phút
  ORDER_TIMEOUT: 15 * 60 * 1000, // 15 phút (milliseconds)
  CANCELLATION_WINDOW: 10 * 60 * 1000, // 10 phút sau khi đặt
  
  // Số lượng
  MIN_ORDER_QUANTITY: 1,
  MAX_ORDER_QUANTITY: 99,
  MAX_ITEMS_PER_ORDER: 50,
  
  // Giá trị đơn hàng
  MINIMUM_DELIVERY_ORDER: 100000, // 100,000 VND
  MINIMUM_PICKUP_ORDER: 50000, // 50,000 VND
  FREE_DELIVERY_THRESHOLD: 200000, // 200,000 VND
  
  // Phí giao hàng
  BASE_DELIVERY_FEE: 15000, // 15,000 VND
  DELIVERY_FEE_PER_KM: 3000, // 3,000 VND/km
  MAX_DELIVERY_DISTANCE: 15, // km
  
  // Thời gian giao hàng
  STANDARD_DELIVERY_TIME: 45, // phút
  RUSH_HOUR_DELIVERY_TIME: 60, // phút
  PEAK_HOURS: [
    { start: '11:30', end: '13:30' },
    { start: '18:00', end: '20:00' }
  ],
  
  // Trạng thái đơn hàng
  AUTO_CONFIRM_DELAY: 2 * 60 * 1000, // 2 phút
  COOKING_STATUS_UPDATE_INTERVAL: 5 * 60 * 1000, // 5 phút
  READY_STATUS_TIMEOUT: 10 * 60 * 1000, // 10 phút
  
  // Hoàn tiền
  FULL_REFUND_WINDOW: 5 * 60 * 1000, // 5 phút
  PARTIAL_REFUND_REASONS: [
    'item_unavailable',
    'quality_issue',
    'late_delivery',
    'customer_request'
  ]
} as const;

// Reservation business rules
export const RESERVATION_BUSINESS_RULES = {
  // Thời gian đặt bàn
  MIN_ADVANCE_BOOKING: 30 * 60 * 1000, // 30 phút trước
  MAX_ADVANCE_BOOKING: 30 * 24 * 60 * 60 * 1000, // 30 ngày
  DEFAULT_RESERVATION_DURATION: 2 * 60 * 60 * 1000, // 2 giờ
  
  // Số lượng khách
  MIN_PARTY_SIZE: 1,
  MAX_PARTY_SIZE: 20,
  LARGE_PARTY_THRESHOLD: 8, // cần xác nhận đặc biệt
  
  // Check-in rules
  EARLY_ARRIVAL_BUFFER: 15 * 60 * 1000, // 15 phút sớm
  LATE_ARRIVAL_GRACE: 15 * 60 * 1000, // 15 phút muộn
  NO_SHOW_TIMEOUT: 30 * 60 * 1000, // 30 phút không đến
  
  // Cancellation rules
  FREE_CANCELLATION_WINDOW: 2 * 60 * 60 * 1000, // 2 giờ trước
  CANCELLATION_FEE: 50000, // 50,000 VND nếu hủy muộn
  
  // Special occasion rules
  HOLIDAY_ADVANCE_BOOKING: 7 * 24 * 60 * 60 * 1000, // 7 ngày cho ngày lễ
  WEEKEND_PEAK_HOURS: [
    { day: 'friday', start: '18:00', end: '22:00' },
    { day: 'saturday', start: '12:00', end: '14:00' },
    { day: 'saturday', start: '18:00', end: '22:00' },
    { day: 'sunday', start: '12:00', end: '14:00' }
  ]
} as const;

// Menu and pricing rules
export const MENU_BUSINESS_RULES = {
  // Giá cả
  MIN_ITEM_PRICE: 5000, // 5,000 VND
  MAX_ITEM_PRICE: 2000000, // 2,000,000 VND
  PRICE_INCREMENT: 1000, // bước nhảy 1,000 VND
  
  // Giảm giá
  MAX_DISCOUNT_PERCENTAGE: 50, // 50%
  MIN_DISCOUNT_AMOUNT: 5000, // 5,000 VND
  BULK_DISCOUNT_THRESHOLD: 5, // từ 5 món trở lên
  
  // Availability
  DAILY_STOCK_LIMIT: true,
  OUT_OF_STOCK_AUTO_HIDE: true,
  SEASONAL_MENU_ENABLED: true,
  
  // Categories
  MAX_CATEGORIES_PER_RESTAURANT: 15,
  MAX_ITEMS_PER_CATEGORY: 50,
  FEATURED_ITEMS_LIMIT: 10,
  
  // Nutrition and allergens
  ALLERGEN_WARNING_REQUIRED: true,
  NUTRITION_INFO_OPTIONAL: true,
  DIETARY_RESTRICTIONS: [
    'vegetarian',
    'vegan',
    'gluten_free',
    'dairy_free',
    'nut_free',
    'halal'
  ]
} as const;

// Payment business rules
export const PAYMENT_BUSINESS_RULES = {
  // Payment methods
  CASH_PAYMENT_ENABLED: true,
  DIGITAL_PAYMENT_ENABLED: true,
  SPLIT_PAYMENT_ENABLED: true,
  TIP_ENABLED: true,
  
  // Limits
  CASH_PAYMENT_LIMIT: 10000000, // 10 triệu VND
  DAILY_CASH_LIMIT: 50000000, // 50 triệu VND
  DIGITAL_PAYMENT_MIN: 10000, // 10,000 VND
  
  // Processing
  PAYMENT_TIMEOUT: 10 * 60 * 1000, // 10 phút
  AUTO_CAPTURE_ENABLED: true,
  MANUAL_VERIFICATION_THRESHOLD: 5000000, // 5 triệu VND
  
  // Refunds
  REFUND_PROCESSING_TIME: 3 * 24 * 60 * 60 * 1000, // 3 ngày
  PARTIAL_REFUND_ENABLED: true,
  REFUND_TO_ORIGINAL_METHOD: true,
  
  // Tips
  TIP_SUGGESTIONS: [10, 15, 20], // %
  MAX_TIP_PERCENTAGE: 25,
  TIP_DISTRIBUTION_TO_STAFF: true
} as const;

// Inventory business rules
export const INVENTORY_BUSINESS_RULES = {
  // Stock levels
  CRITICAL_STOCK_PERCENTAGE: 10, // 10% của max stock
  LOW_STOCK_PERCENTAGE: 20, // 20% của max stock
  OVERSTOCK_PERCENTAGE: 90, // 90% của max stock
  
  // Expiry management
  EXPIRY_WARNING_DAYS: 3, // cảnh báo 3 ngày trước hết hạn
  EXPIRED_ITEM_AUTO_REMOVE: true,
  NEAR_EXPIRY_DISCOUNT: true,
  
  // Ordering
  AUTO_REORDER_ENABLED: false,
  REORDER_POINT_CALCULATION: 'average_usage',
  LEAD_TIME_BUFFER_DAYS: 2,
  
  // Cost calculation
  COST_METHOD: 'weighted_average', // hoặc 'fifo', 'lifo'
  WASTE_TRACKING_REQUIRED: true,
  PORTION_COST_TRACKING: true,
  
  // Suppliers
  MIN_SUPPLIERS_PER_ITEM: 1,
  PREFERRED_SUPPLIER_PRIORITY: true,
  PRICE_COMPARISON_REQUIRED: false
} as const;

// Staff business rules
export const STAFF_BUSINESS_RULES = {
  // Working hours
  MIN_SHIFT_DURATION: 4 * 60 * 60 * 1000, // 4 giờ
  MAX_SHIFT_DURATION: 12 * 60 * 60 * 1000, // 12 giờ
  MIN_BREAK_DURATION: 30 * 60 * 1000, // 30 phút
  OVERTIME_THRESHOLD: 8 * 60 * 60 * 1000, // 8 giờ
  
  // Scheduling
  MIN_STAFF_PER_SHIFT: 2,
  ADVANCE_SCHEDULE_DAYS: 7, // lịch làm việc 1 tuần trước
  SHIFT_CHANGE_NOTICE_HOURS: 24, // thông báo 24h trước khi đổi ca
  
  // Performance
  PROBATION_PERIOD_DAYS: 90,
  PERFORMANCE_REVIEW_FREQUENCY_MONTHS: 6,
  TRAINING_HOURS_PER_QUARTER: 20,
  
  // Payroll
  PAYROLL_CUTOFF_DAY: 25, // ngày 25 hàng tháng
  OVERTIME_RATE_MULTIPLIER: 1.5,
  HOLIDAY_RATE_MULTIPLIER: 2.0,
  
  // Attendance
  LATE_ARRIVAL_GRACE_MINUTES: 5,
  ABSENCE_NOTIFICATION_HOURS: 2, // báo nghỉ trước 2h
  MAX_CONSECUTIVE_DAYS_OFF: 3
} as const;

// Customer business rules
export const CUSTOMER_BUSINESS_RULES = {
  // Loyalty program
  POINTS_PER_VND: 0.01, // 1 điểm cho 100 VND
  POINTS_REDEMPTION_VALUE: 100, // 1 điểm = 100 VND
  MIN_POINTS_REDEMPTION: 500,
  POINTS_EXPIRY_MONTHS: 12,
  
  // Discounts
  FIRST_ORDER_DISCOUNT: 10, // 10%
  BIRTHDAY_DISCOUNT: 15, // 15%
  LOYALTY_TIER_DISCOUNTS: {
    bronze: 5,
    silver: 10,
    gold: 15,
    platinum: 20
  },
  
  // Reviews
  REVIEW_AFTER_ORDER_HOURS: 24, // có thể review sau 24h
  REVIEW_EDIT_WINDOW_HOURS: 48, // chỉnh sửa trong 48h
  MIN_RATING: 1,
  MAX_RATING: 5,
  
  // Communication
  MARKETING_OPT_IN_DEFAULT: false,
  ORDER_UPDATES_REQUIRED: true,
  NOTIFICATION_PREFERENCES_EDITABLE: true
} as const;

// Restaurant operations rules
export const RESTAURANT_OPERATIONS_RULES = {
  // Operating hours
  MIN_OPERATING_HOURS_PER_DAY: 6, // tối thiểu 6 giờ/ngày
  MAX_OPERATING_HOURS_PER_DAY: 18, // tối đa 18 giờ/ngày
  BREAK_BETWEEN_SERVICES: 1 * 60 * 60 * 1000, // 1 giờ nghỉ giữa các ca
  
  // Capacity management
  DINE_IN_CAPACITY_LIMIT: 100, // % của sức chứa bình thường
  TAKEAWAY_CAPACITY_SEPARATE: true,
  DELIVERY_CAPACITY_SEPARATE: true,
  
  // Quality control
  FOOD_SAFETY_TEMPERATURE_LOG: true,
  CLEANING_SCHEDULE_REQUIRED: true,
  INGREDIENT_FRESHNESS_CHECK: true,
  
  // Emergency procedures
  POWER_OUTAGE_PROTOCOL: true,
  EQUIPMENT_FAILURE_BACKUP: true,
  STAFF_SHORTAGE_MINIMUM: 2,
  
  // Compliance
  HEALTH_PERMIT_REQUIRED: true,
  BUSINESS_LICENSE_REQUIRED: true,
  FOOD_HANDLER_CERTIFICATION: true
} as const;

// Validation rules
export const VALIDATION_RULES = {
  // Vietnamese phone number
  VIETNAM_PHONE_REGEX: /^(\+84|84|0)[3-9][0-9]{8}$/,
  
  // Email
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Password strength
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  
  // Vietnamese address format
  VIETNAM_ADDRESS_REGEX: /^[\p{L}\p{N}\s,.-]+$/u,
  
  // Vietnamese name format
  VIETNAM_NAME_REGEX: /^[\p{L}\s]+$/u,
  
  // Order code format
  ORDER_CODE_REGEX: /^WDL\d{8}$/,
  
  // Menu item code
  ITEM_CODE_REGEX: /^[A-Z0-9]{6,12}$/
} as const;

// Export all business rules
export const BUSINESS_RULES = {
  ORDER: ORDER_BUSINESS_RULES,
  RESERVATION: RESERVATION_BUSINESS_RULES,
  MENU: MENU_BUSINESS_RULES,
  PAYMENT: PAYMENT_BUSINESS_RULES,
  INVENTORY: INVENTORY_BUSINESS_RULES,
  STAFF: STAFF_BUSINESS_RULES,
  CUSTOMER: CUSTOMER_BUSINESS_RULES,
  OPERATIONS: RESTAURANT_OPERATIONS_RULES,
  VALIDATION: VALIDATION_RULES
} as const;

// Helper functions cho business rules
export const isValidVietnamesePhone = (phone: string): boolean => {
  return VALIDATION_RULES.VIETNAM_PHONE_REGEX.test(phone);
};

export const isValidEmail = (email: string): boolean => {
  return VALIDATION_RULES.EMAIL_REGEX.test(email);
};

export const isStrongPassword = (password: string): boolean => {
  return password.length >= 8 && VALIDATION_RULES.PASSWORD_REGEX.test(password);
};

export const formatVietnamesePhone = (phone: string): string => {
  // Convert to standard format: +84xxxxxxxxx
  let cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('84')) {
    return '+' + cleaned;
  } else if (cleaned.startsWith('0')) {
    return '+84' + cleaned.substring(1);
  } else {
    return '+84' + cleaned;
  }
};

export const isWithinDeliveryRadius = (distance: number): boolean => {
  return distance <= ORDER_BUSINESS_RULES.MAX_DELIVERY_DISTANCE;
};

export const calculateDeliveryFee = (distance: number): number => {
  if (distance <= 0) return 0;
  
  const baseFee = ORDER_BUSINESS_RULES.BASE_DELIVERY_FEE;
  const distanceFee = distance * ORDER_BUSINESS_RULES.DELIVERY_FEE_PER_KM;
  
  return baseFee + distanceFee;
};

export const isEligibleForFreeDelivery = (orderAmount: number): boolean => {
  return orderAmount >= ORDER_BUSINESS_RULES.FREE_DELIVERY_THRESHOLD;
};

export const isPeakHour = (time: string): boolean => {
  return ORDER_BUSINESS_RULES.PEAK_HOURS.some(period => {
    return time >= period.start && time <= period.end;
  });
};

export const getDeliveryTime = (isRushHour: boolean = false): number => {
  return isRushHour 
    ? ORDER_BUSINESS_RULES.RUSH_HOUR_DELIVERY_TIME 
    : ORDER_BUSINESS_RULES.STANDARD_DELIVERY_TIME;
};

// Type exports
export type OrderBusinessRules = typeof ORDER_BUSINESS_RULES;
export type ReservationBusinessRules = typeof RESERVATION_BUSINESS_RULES;
export type MenuBusinessRules = typeof MENU_BUSINESS_RULES;
export type PaymentBusinessRules = typeof PAYMENT_BUSINESS_RULES;
