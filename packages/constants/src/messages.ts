// ================================
// 💬 MESSAGES CONSTANTS
// ================================
// Tất cả thông báo hệ thống bằng tiếng Việt và tiếng Anh

// Language type
export type Language = 'vi' | 'en';

// Success messages
export const SUCCESS_MESSAGES = {
  vi: {
    // Authentication
    LOGIN_SUCCESS: 'Đăng nhập thành công',
    LOGOUT_SUCCESS: 'Đăng xuất thành công',
    REGISTER_SUCCESS: 'Đăng ký tài khoản thành công',
    PASSWORD_CHANGED: 'Đổi mật khẩu thành công',
    PASSWORD_RESET: 'Đặt lại mật khẩu thành công',
    VERIFICATION_SENT: 'Email xác thực đã được gửi',
    EMAIL_VERIFIED: 'Email đã được xác thực',

    // User management
    PROFILE_UPDATED: 'Cập nhật hồ sơ thành công',
    ADDRESS_ADDED: 'Thêm địa chỉ thành công',
    ADDRESS_UPDATED: 'Cập nhật địa chỉ thành công',
    ADDRESS_DELETED: 'Xóa địa chỉ thành công',

    // Restaurant operations
    RESTAURANT_CREATED: 'Tạo nhà hàng thành công',
    RESTAURANT_UPDATED: 'Cập nhật thông tin nhà hàng thành công',
    MENU_UPDATED: 'Cập nhật thực đơn thành công',
    MENU_ITEM_ADDED: 'Thêm món ăn thành công',
    MENU_ITEM_UPDATED: 'Cập nhật món ăn thành công',
    MENU_ITEM_DELETED: 'Xóa món ăn thành công',

    // Order management
    ORDER_CREATED: 'Đặt hàng thành công',
    ORDER_UPDATED: 'Cập nhật đơn hàng thành công',
    ORDER_CANCELLED: 'Hủy đơn hàng thành công',
    ORDER_CONFIRMED: 'Xác nhận đơn hàng thành công',
    ORDER_PREPARING: 'Đơn hàng đang được chuẩn bị',
    ORDER_READY: 'Đơn hàng đã sẵn sàng',
    ORDER_DELIVERED: 'Giao hàng thành công',
    ORDER_COMPLETED: 'Hoàn thành đơn hàng',

    // Payment
    PAYMENT_SUCCESS: 'Thanh toán thành công',
    PAYMENT_CONFIRMED: 'Xác nhận thanh toán thành công',
    REFUND_PROCESSED: 'Hoàn tiền thành công',

    // Table management
    TABLE_RESERVED: 'Đặt bàn thành công',
    RESERVATION_CONFIRMED: 'Xác nhận đặt bàn thành công',
    RESERVATION_CANCELLED: 'Hủy đặt bàn thành công',
    CHECK_IN_SUCCESS: 'Check-in thành công',

    // Staff management
    STAFF_ADDED: 'Thêm nhân viên thành công',
    STAFF_UPDATED: 'Cập nhật thông tin nhân viên thành công',
    SCHEDULE_UPDATED: 'Cập nhật lịch làm việc thành công',
    TIME_TRACKED: 'Chấm công thành công',
    PAYROLL_PROCESSED: 'Xử lý lương thành công',

    // Inventory
    INVENTORY_UPDATED: 'Cập nhật kho hàng thành công',
    SUPPLIER_ADDED: 'Thêm nhà cung cấp thành công',
    PURCHASE_ORDER_CREATED: 'Tạo đơn hàng mua thành công',
    STOCK_ADJUSTED: 'Điều chỉnh tồn kho thành công',

    // Reviews and support
    REVIEW_SUBMITTED: 'Gửi đánh giá thành công',
    REVIEW_RESPONDED: 'Phản hồi đánh giá thành công',
    SUPPORT_TICKET_CREATED: 'Tạo ticket hỗ trợ thành công',
    TICKET_RESOLVED: 'Giải quyết ticket thành công',

    // General
    SAVED: 'Lưu thành công',
    DELETED: 'Xóa thành công',
    UPLOADED: 'Tải lên thành công',
    SENT: 'Gửi thành công',
    UPDATED: 'Cập nhật thành công'
  },
  en: {
    // Authentication
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    REGISTER_SUCCESS: 'Registration successful',
    PASSWORD_CHANGED: 'Password changed successfully',
    PASSWORD_RESET: 'Password reset successful',
    VERIFICATION_SENT: 'Verification email sent',
    EMAIL_VERIFIED: 'Email verified successfully',

    // User management
    PROFILE_UPDATED: 'Profile updated successfully',
    ADDRESS_ADDED: 'Address added successfully',
    ADDRESS_UPDATED: 'Address updated successfully',
    ADDRESS_DELETED: 'Address deleted successfully',

    // Restaurant operations
    RESTAURANT_CREATED: 'Restaurant created successfully',
    RESTAURANT_UPDATED: 'Restaurant updated successfully',
    MENU_UPDATED: 'Menu updated successfully',
    MENU_ITEM_ADDED: 'Menu item added successfully',
    MENU_ITEM_UPDATED: 'Menu item updated successfully',
    MENU_ITEM_DELETED: 'Menu item deleted successfully',

    // Order management
    ORDER_CREATED: 'Order created successfully',
    ORDER_UPDATED: 'Order updated successfully',
    ORDER_CANCELLED: 'Order cancelled successfully',
    ORDER_CONFIRMED: 'Order confirmed successfully',
    ORDER_PREPARING: 'Order is being prepared',
    ORDER_READY: 'Order is ready',
    ORDER_DELIVERED: 'Order delivered successfully',
    ORDER_COMPLETED: 'Order completed',

    // Payment
    PAYMENT_SUCCESS: 'Payment successful',
    PAYMENT_CONFIRMED: 'Payment confirmed successfully',
    REFUND_PROCESSED: 'Refund processed successfully',

    // Table management
    TABLE_RESERVED: 'Table reserved successfully',
    RESERVATION_CONFIRMED: 'Reservation confirmed successfully',
    RESERVATION_CANCELLED: 'Reservation cancelled successfully',
    CHECK_IN_SUCCESS: 'Check-in successful',

    // Staff management
    STAFF_ADDED: 'Staff added successfully',
    STAFF_UPDATED: 'Staff updated successfully',
    SCHEDULE_UPDATED: 'Schedule updated successfully',
    TIME_TRACKED: 'Time tracked successfully',
    PAYROLL_PROCESSED: 'Payroll processed successfully',

    // Inventory
    INVENTORY_UPDATED: 'Inventory updated successfully',
    SUPPLIER_ADDED: 'Supplier added successfully',
    PURCHASE_ORDER_CREATED: 'Purchase order created successfully',
    STOCK_ADJUSTED: 'Stock adjusted successfully',

    // Reviews and support
    REVIEW_SUBMITTED: 'Review submitted successfully',
    REVIEW_RESPONDED: 'Review responded successfully',
    SUPPORT_TICKET_CREATED: 'Support ticket created successfully',
    TICKET_RESOLVED: 'Ticket resolved successfully',

    // General
    SAVED: 'Saved successfully',
    DELETED: 'Deleted successfully',
    UPLOADED: 'Uploaded successfully',
    SENT: 'Sent successfully',
    UPDATED: 'Updated successfully'
  }
} as const;

// Error messages
export const ERROR_MESSAGES = {
  vi: {
    // Authentication errors
    INVALID_CREDENTIALS: 'Email hoặc mật khẩu không chính xác',
    UNAUTHORIZED: 'Bạn không có quyền truy cập',
    TOKEN_EXPIRED: 'Phiên đăng nhập đã hết hạn',
    ACCOUNT_LOCKED: 'Tài khoản đã bị khóa',
    EMAIL_NOT_VERIFIED: 'Email chưa được xác thực',
    WEAK_PASSWORD: 'Mật khẩu quá yếu',
    PASSWORD_MISMATCH: 'Mật khẩu không khớp',

    // Validation errors
    REQUIRED_FIELD: 'Trường này là bắt buộc',
    INVALID_EMAIL: 'Email không hợp lệ',
    INVALID_PHONE: 'Số điện thoại không hợp lệ',
    INVALID_FORMAT: 'Định dạng không hợp lệ',
    TOO_SHORT: 'Quá ngắn',
    TOO_LONG: 'Quá dài',
    INVALID_NUMBER: 'Số không hợp lệ',
    INVALID_DATE: 'Ngày không hợp lệ',

    // Business logic errors
    RESTAURANT_NOT_FOUND: 'Không tìm thấy nhà hàng',
    MENU_ITEM_NOT_FOUND: 'Không tìm thấy món ăn',
    ORDER_NOT_FOUND: 'Không tìm thấy đơn hàng',
    USER_NOT_FOUND: 'Không tìm thấy người dùng',
    TABLE_NOT_AVAILABLE: 'Bàn không có sẵn',
    INSUFFICIENT_STOCK: 'Không đủ hàng tồn kho',
    ORDER_ALREADY_CONFIRMED: 'Đơn hàng đã được xác nhận',
    CANNOT_CANCEL_ORDER: 'Không thể hủy đơn hàng',
    PAYMENT_FAILED: 'Thanh toán thất bại',
    INVALID_DISCOUNT_CODE: 'Mã giảm giá không hợp lệ',
    DISCOUNT_EXPIRED: 'Mã giảm giá đã hết hạn',
    MINIMUM_ORDER_NOT_MET: 'Chưa đạt giá trị đơn hàng tối thiểu',

    // Staff errors
    STAFF_NOT_FOUND: 'Không tìm thấy nhân viên',
    SHIFT_CONFLICT: 'Xung đột lịch làm việc',
    ALREADY_CLOCKED_IN: 'Đã chấm công vào',
    NOT_CLOCKED_IN: 'Chưa chấm công vào',
    INSUFFICIENT_PERMISSIONS: 'Không đủ quyền hạn',

    // Inventory errors
    ITEM_NOT_FOUND: 'Không tìm thấy sản phẩm',
    SUPPLIER_NOT_FOUND: 'Không tìm thấy nhà cung cấp',
    LOW_STOCK_WARNING: 'Cảnh báo tồn kho thấp',
    EXPIRED_ITEMS: 'Có sản phẩm đã hết hạn',

    // File upload errors
    FILE_TOO_LARGE: 'File quá lớn',
    INVALID_FILE_TYPE: 'Loại file không được hỗ trợ',
    UPLOAD_FAILED: 'Tải lên thất bại',

    // Network errors
    NETWORK_ERROR: 'Lỗi kết nối mạng',
    SERVER_ERROR: 'Lỗi máy chủ',
    SERVICE_UNAVAILABLE: 'Dịch vụ không khả dụng',
    TIMEOUT: 'Hết thời gian chờ',

    // General errors
    SOMETHING_WENT_WRONG: 'Có lỗi xảy ra',
    ACCESS_DENIED: 'Truy cập bị từ chối',
    OPERATION_FAILED: 'Thao tác thất bại',
    INVALID_INPUT: 'Dữ liệu đầu vào không hợp lệ',
    DUPLICATE_ENTRY: 'Dữ liệu đã tồn tại'
  },
  en: {
    // Authentication errors
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'You are not authorized to access this resource',
    TOKEN_EXPIRED: 'Session has expired',
    ACCOUNT_LOCKED: 'Account has been locked',
    EMAIL_NOT_VERIFIED: 'Email has not been verified',
    WEAK_PASSWORD: 'Password is too weak',
    PASSWORD_MISMATCH: 'Passwords do not match',

    // Validation errors
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Invalid email address',
    INVALID_PHONE: 'Invalid phone number',
    INVALID_FORMAT: 'Invalid format',
    TOO_SHORT: 'Too short',
    TOO_LONG: 'Too long',
    INVALID_NUMBER: 'Invalid number',
    INVALID_DATE: 'Invalid date',

    // Business logic errors
    RESTAURANT_NOT_FOUND: 'Restaurant not found',
    MENU_ITEM_NOT_FOUND: 'Menu item not found',
    ORDER_NOT_FOUND: 'Order not found',
    USER_NOT_FOUND: 'User not found',
    TABLE_NOT_AVAILABLE: 'Table is not available',
    INSUFFICIENT_STOCK: 'Insufficient stock',
    ORDER_ALREADY_CONFIRMED: 'Order has already been confirmed',
    CANNOT_CANCEL_ORDER: 'Cannot cancel order',
    PAYMENT_FAILED: 'Payment failed',
    INVALID_DISCOUNT_CODE: 'Invalid discount code',
    DISCOUNT_EXPIRED: 'Discount code has expired',
    MINIMUM_ORDER_NOT_MET: 'Minimum order value not met',

    // Staff errors
    STAFF_NOT_FOUND: 'Staff not found',
    SHIFT_CONFLICT: 'Shift conflict detected',
    ALREADY_CLOCKED_IN: 'Already clocked in',
    NOT_CLOCKED_IN: 'Not clocked in',
    INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',

    // Inventory errors
    ITEM_NOT_FOUND: 'Item not found',
    SUPPLIER_NOT_FOUND: 'Supplier not found',
    LOW_STOCK_WARNING: 'Low stock warning',
    EXPIRED_ITEMS: 'Items have expired',

    // File upload errors
    FILE_TOO_LARGE: 'File is too large',
    INVALID_FILE_TYPE: 'File type not supported',
    UPLOAD_FAILED: 'Upload failed',

    // Network errors
    NETWORK_ERROR: 'Network error',
    SERVER_ERROR: 'Server error',
    SERVICE_UNAVAILABLE: 'Service unavailable',
    TIMEOUT: 'Request timeout',

    // General errors
    SOMETHING_WENT_WRONG: 'Something went wrong',
    ACCESS_DENIED: 'Access denied',
    OPERATION_FAILED: 'Operation failed',
    INVALID_INPUT: 'Invalid input',
    DUPLICATE_ENTRY: 'Duplicate entry'
  }
} as const;

// Warning messages
export const WARNING_MESSAGES = {
  vi: {
    LOW_STOCK: 'Tồn kho thấp',
    EXPIRING_SOON: 'Sắp hết hạn',
    PAYMENT_PENDING: 'Thanh toán đang chờ xử lý',
    ORDER_DELAYED: 'Đơn hàng bị trễ',
    MAINTENANCE_MODE: 'Hệ thống đang bảo trì',
    UNSAVED_CHANGES: 'Có thay đổi chưa được lưu',
    CONFIRM_DELETE: 'Bạn có chắc chắn muốn xóa?',
    CONFIRM_CANCEL: 'Bạn có chắc chắn muốn hủy?',
    DATA_WILL_BE_LOST: 'Dữ liệu sẽ bị mất',
    IRREVERSIBLE_ACTION: 'Hành động này không thể hoàn tác'
  },
  en: {
    LOW_STOCK: 'Low stock',
    EXPIRING_SOON: 'Expiring soon',
    PAYMENT_PENDING: 'Payment pending',
    ORDER_DELAYED: 'Order delayed',
    MAINTENANCE_MODE: 'System under maintenance',
    UNSAVED_CHANGES: 'You have unsaved changes',
    CONFIRM_DELETE: 'Are you sure you want to delete?',
    CONFIRM_CANCEL: 'Are you sure you want to cancel?',
    DATA_WILL_BE_LOST: 'Data will be lost',
    IRREVERSIBLE_ACTION: 'This action cannot be undone'
  }
} as const;

// Info messages
export const INFO_MESSAGES = {
  vi: {
    LOADING: 'Đang tải...',
    PROCESSING: 'Đang xử lý...',
    SAVING: 'Đang lưu...',
    SENDING: 'Đang gửi...',
    UPLOADING: 'Đang tải lên...',
    WELCOME: 'Chào mừng!',
    FIRST_TIME_USER: 'Lần đầu sử dụng?',
    TUTORIAL_AVAILABLE: 'Hướng dẫn có sẵn',
    NO_DATA: 'Không có dữ liệu',
    EMPTY_LIST: 'Danh sách trống',
    SEARCH_NO_RESULTS: 'Không tìm thấy kết quả',
    TRY_DIFFERENT_KEYWORDS: 'Thử từ khóa khác',
    MORE_FILTERS_AVAILABLE: 'Có thêm bộ lọc',
    SYSTEM_NOTIFICATION: 'Thông báo hệ thống'
  },
  en: {
    LOADING: 'Loading...',
    PROCESSING: 'Processing...',
    SAVING: 'Saving...',
    SENDING: 'Sending...',
    UPLOADING: 'Uploading...',
    WELCOME: 'Welcome!',
    FIRST_TIME_USER: 'First time here?',
    TUTORIAL_AVAILABLE: 'Tutorial available',
    NO_DATA: 'No data available',
    EMPTY_LIST: 'Empty list',
    SEARCH_NO_RESULTS: 'No results found',
    TRY_DIFFERENT_KEYWORDS: 'Try different keywords',
    MORE_FILTERS_AVAILABLE: 'More filters available',
    SYSTEM_NOTIFICATION: 'System notification'
  }
} as const;

// Helper function để lấy message theo ngôn ngữ
export const getMessage = (
  type: 'success' | 'error' | 'warning' | 'info',
  key: string,
  language: Language = 'vi'
): string => {
  const messageMap = {
    success: SUCCESS_MESSAGES,
    error: ERROR_MESSAGES,
    warning: WARNING_MESSAGES,
    info: INFO_MESSAGES
  };

  const messages = messageMap[type][language] as Record<string, string>;
  return messages[key] || `Message not found: ${type}.${key}`;
};

// Export all message types
export const MESSAGES = {
  SUCCESS: SUCCESS_MESSAGES,
  ERROR: ERROR_MESSAGES,
  WARNING: WARNING_MESSAGES,
  INFO: INFO_MESSAGES,
  getMessage
} as const;

// Type exports
export type SuccessMessages = typeof SUCCESS_MESSAGES;
export type ErrorMessages = typeof ERROR_MESSAGES;
export type WarningMessages = typeof WARNING_MESSAGES;
export type InfoMessages = typeof INFO_MESSAGES;
export type MessageType = 'success' | 'error' | 'warning' | 'info';
