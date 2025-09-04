// ================================
// 🔧 TypeScript Interfaces for GraphQL Schema
// Generated from Prisma Schema Analysis
// ================================

// ================================
// 📋 ENUMS
// ================================

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  BANNED = 'banned'
}

export enum UserRole {
  CUSTOMER = 'customer',
  STAFF = 'staff',
  MANAGER = 'manager',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export enum RestaurantStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  CLOSED = 'closed'
}

export enum TableStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  RESERVED = 'reserved',
  MAINTENANCE = 'maintenance',
  OUT_OF_ORDER = 'out_of_order'
}

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SEATED = 'seated',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

export enum OrderType {
  DINE_IN = 'dine_in',
  TAKEAWAY = 'takeaway',
  DELIVERY = 'delivery'
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  SERVED = 'served',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum CookingStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  COOKING = 'cooking',
  READY = 'ready',
  SERVED = 'served',
  CANCELLED = 'cancelled'
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
  MOMO = 'momo',
  ZALOPAY = 'zalopay',
  VIETTELPAY = 'viettelpay',
  VNPAY = 'vnpay',
  SHOPEEPAY = 'shopeepay',
  PAYPAL = 'paypal'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum StaffRole {
  STAFF = 'staff',
  SUPERVISOR = 'supervisor',
  MANAGER = 'manager',
  CHEF = 'chef',
  SOUS_CHEF = 'sous_chef',
  CASHIER = 'cashier',
  WAITER = 'waiter',
  HOST = 'host',
  CLEANER = 'cleaner',
  SECURITY = 'security'
}

export enum StaffStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
  SUSPENDED = 'suspended',
  TERMINATED = 'terminated'
}

export enum ConversationType {
  SUPPORT = 'support',
  FEEDBACK = 'feedback',
  COMPLAINT = 'complaint',
  INQUIRY = 'inquiry'
}

export enum ConversationStatus {
  ACTIVE = 'active',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  SYSTEM = 'system'
}

export enum VoucherDiscountType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount'
}

export enum PromotionType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  BUY_ONE_GET_ONE = 'buy_one_get_one',
  COMBO_DEAL = 'combo_deal',
  HAPPY_HOUR = 'happy_hour',
  SEASONAL = 'seasonal'
}

export enum ReviewStatus {
  ACTIVE = 'active',
  HIDDEN = 'hidden',
  FLAGGED = 'flagged',
  DELETED = 'deleted'
}

// ================================
// 👤 USER INTERFACES
// ================================

export interface IUser {
  id: string;
  clerk_id?: string;
  username: string;
  email: string;
  phone_code?: string;
  phone_number?: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar_url?: string;
  date_of_birth?: Date;
  gender?: string;
  status: UserStatus;
  role: UserRole;
  email_verified_at?: Date;
  phone_verified_at?: Date;
  total_orders: number;
  total_spent: number;
  loyalty_points: number;
  created_at: Date;
  updated_at: Date;
}

export interface IUserStatistics {
  id: string;
  user_id: string;
  total_reservations: number;
  successful_reservations: number;
  cancelled_reservations: number;
  no_show_reservations: number;
  total_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  total_spent: number;
  loyalty_points: number;
  favorite_restaurant_id?: string;
  last_order_date?: Date;
  last_reservation_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface IAddress {
  id: string;
  user_id: string;
  recipient_name: string;
  recipient_phone: string;
  street_address: string;
  ward?: string;
  district: string;
  city: string;
  country: string;
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
}

// ================================
// 🏢 ORGANIZATION INTERFACES
// ================================

export interface IOrganization {
  id: string;
  name: string;
  code: string;
  description?: string;
  logo_url?: string;
  owner_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface IRestaurantChain {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  logo_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface IRestaurant {
  id: string;
  organization_id: string;
  chain_id?: string;
  code: string;
  name: string;
  address: string;
  phone_number?: string;
  email?: string;
  description?: string;
  logo_url?: string;
  cover_url?: string;
  opening_hours?: any; // JSON
  status: RestaurantStatus;
  manager_id?: string;
  created_at: Date;
  updated_at: Date;
}

// ================================
// 🍽️ MENU INTERFACES
// ================================

export interface ICategory {
  id: string;
  parent_id?: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface IMenu {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface IMenuItem {
  id: string;
  menu_id: string;
  category_id?: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available: boolean;
  is_featured: boolean;
  preparation_time?: number;
  calories?: number;
  allergens: string[];
  dietary_info: string[];
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

// ================================
// 🪑 TABLE & RESERVATION INTERFACES
// ================================

export interface ITable {
  id: string;
  restaurant_id: string;
  table_number: string;
  capacity: number;
  location?: string;
  status: TableStatus;
  qr_code?: string;
  created_at: Date;
  updated_at: Date;
}

export interface IReservation {
  id: string;
  table_id: string;
  customer_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  party_size: number;
  reservation_date: Date;
  duration_hours: number;
  status: ReservationStatus;
  special_requests?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ITableOrder {
  id: string;
  table_id: string;
  order_id?: string;
  session_code: string;
  status: 'active' | 'completed' | 'cancelled';
  opened_at: Date;
  closed_at?: Date;
  total_amount?: number;
  staff_id?: string;
}

// ================================
// 🛒 ORDER INTERFACES
// ================================

export interface IOrder {
  id: string;
  restaurant_id: string;
  customer_id: string;
  address_id?: string;
  order_code: string;
  order_type: OrderType;
  total_amount: number;
  delivery_fee: number;
  discount_amount: number;
  tax_amount: number;
  final_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  notes?: string;
  estimated_time?: number;
  created_at: Date;
  updated_at: Date;
}

export interface IOrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_instructions?: string;
  cooking_status: CookingStatus;
  prepared_at?: Date;
  served_at?: Date;
  created_at: Date;
}

export interface IOrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  changed_by_user_id?: string;
  notes?: string;
  created_at: Date;
}

// ================================
// 💳 PAYMENT INTERFACES
// ================================

export interface IPayment {
  id: string;
  order_id: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  provider?: string;
  transaction_id?: string;
  gateway_response?: any; // JSON
  processed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// ================================
// 👨‍💼 STAFF INTERFACES
// ================================

export interface IRestaurantStaff {
  id: string;
  restaurant_id: string;
  user_id: string;
  role: StaffRole;
  status: StaffStatus;
  hourly_rate?: number;
  joined_at: Date;
  left_at?: Date;
}

export interface IStaffSchedule {
  id: string;
  staff_id: string;
  restaurant_id: string;
  shift_date: Date;
  shift_type: 'morning' | 'afternoon' | 'evening' | 'night' | 'full_day' | 'split_shift';
  start_time: Date;
  end_time: Date;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'absent' | 'late' | 'cancelled';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface IStaffAttendance {
  id: string;
  staff_id: string;
  restaurant_id: string;
  schedule_id?: string;
  work_date: Date;
  check_in_time?: Date;
  check_out_time?: Date;
  break_duration?: number;
  overtime_hours?: number;
  total_hours?: number;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

// ================================
// 🏪 INVENTORY INTERFACES
// ================================

export interface IInventoryItem {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  unit: string;
  quantity: number;
  min_quantity?: number;
  max_quantity?: number;
  unit_cost?: number;
  supplier?: string;
  expiry_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface IInventoryTransaction {
  id: string;
  inventory_item_id: string;
  type: 'purchase' | 'usage' | 'adjustment' | 'waste' | 'return' | 'transfer';
  quantity: number;
  unit_cost?: number;
  total_cost?: number;
  supplier?: string;
  invoice_number?: string;
  notes?: string;
  created_at: Date;
}

export interface IRecipe {
  id: string;
  menu_item_id: string;
  name: string;
  description?: string;
  instructions?: string;
  prep_time?: number;
  cook_time?: number;
  serving_size?: number;
  created_at: Date;
  updated_at: Date;
}

export interface IRecipeIngredient {
  id: string;
  recipe_id: string;
  inventory_item_id: string;
  quantity: number;
  unit: string;
  notes?: string;
}

// ================================
// 🎟️ VOUCHER & PROMOTION INTERFACES
// ================================

export interface IVoucher {
  id: string;
  restaurant_id?: string;
  code: string;
  name: string;
  description?: string;
  discount_type: VoucherDiscountType;
  discount_value: number;
  min_order_value?: number;
  max_discount?: number;
  usage_limit?: number;
  used_count: number;
  start_date: Date;
  end_date: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface IVoucherUsage {
  id: string;
  voucher_id: string;
  user_id: string;
  order_id?: string;
  used_at: Date;
}

export interface IPromotion {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  type: PromotionType;
  discount_value: number;
  conditions?: any; // JSON
  applicable_items: string[];
  time_restrictions?: any; // JSON
  start_date: Date;
  end_date: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// ================================
// ⭐ REVIEW INTERFACES
// ================================

export interface IReview {
  id: string;
  customer_id: string;
  restaurant_id?: string;
  order_id?: string;
  menu_item_id?: string;
  rating: number;
  title?: string;
  content?: string;
  photos: string[];
  status: ReviewStatus;
  response?: string;
  responded_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// ================================
// 💬 CHAT INTERFACES
// ================================

export interface IConversation {
  id: string;
  restaurant_id?: string;
  customer_id?: string;
  staff_id?: string;
  type: ConversationType;
  status: ConversationStatus;
  title?: string;
  last_message_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface IMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: MessageType;
  attachments: string[];
  is_read: boolean;
  created_at: Date;
}

// ================================
// 📊 ANALYTICS INTERFACES
// ================================

export interface IRevenueReport {
  id: string;
  restaurant_id: string;
  report_date: Date;
  report_type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  avg_order_value?: number;
  dine_in_revenue?: number;
  takeaway_revenue?: number;
  delivery_revenue?: number;
  popular_items?: any; // JSON
  payment_methods_breakdown?: any; // JSON
  hourly_breakdown?: any; // JSON
  created_at: Date;
}

// ================================
// 📱 API RESPONSE INTERFACES
// ================================

export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  pagination?: IPagination;
}

// ================================
// 🔍 FILTER & SEARCH INTERFACES
// ================================

export interface IUserFilters {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
  restaurant_id?: string;
  created_from?: Date;
  created_to?: Date;
}

export interface IOrderFilters {
  restaurant_id?: string;
  customer_id?: string;
  status?: OrderStatus;
  order_type?: OrderType;
  payment_status?: PaymentStatus;
  created_from?: Date;
  created_to?: Date;
  min_amount?: number;
  max_amount?: number;
}

export interface IMenuItemFilters {
  restaurant_id?: string;
  menu_id?: string;
  category_id?: string;
  is_available?: boolean;
  is_featured?: boolean;
  min_price?: number;
  max_price?: number;
  search?: string;
}

export interface IReservationFilters {
  restaurant_id?: string;
  table_id?: string;
  customer_id?: string;
  status?: ReservationStatus;
  date_from?: Date;
  date_to?: Date;
}

export interface IConversationFilters {
  restaurant_id?: string;
  customer_id?: string;
  staff_id?: string;
  type?: ConversationType;
  status?: ConversationStatus;
  created_from?: Date;
  created_to?: Date;
}

// ================================
// 🎯 GRAPHQL INPUT TYPES
// ================================

export interface ICreateUserInput {
  username: string;
  email: string;
  phone_number?: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  date_of_birth?: Date;
  gender?: string;
  role?: UserRole;
}

export interface IUpdateUserInput {
  username?: string;
  email?: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  date_of_birth?: Date;
  gender?: string;
  status?: UserStatus;
}

export interface ICreateOrderInput {
  restaurant_id: string;
  customer_id: string;
  address_id?: string;
  order_type: OrderType;
  items: ICreateOrderItemInput[];
  notes?: string;
}

export interface ICreateOrderItemInput {
  menu_item_id: string;
  quantity: number;
  special_instructions?: string;
}

export interface ICreateReservationInput {
  table_id: string;
  customer_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  party_size: number;
  reservation_date: Date;
  duration_hours?: number;
  special_requests?: string;
}

export interface ICreateMessageInput {
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type?: MessageType;
  attachments?: string[];
}

export interface ICreateReviewInput {
  customer_id: string;
  restaurant_id?: string;
  order_id?: string;
  menu_item_id?: string;
  rating: number;
  title?: string;
  content?: string;
  photos?: string[];
}

// ================================
// 🔧 UTILITY TYPES
// ================================

export type SortOrder = 'asc' | 'desc';

export interface ISortOption {
  field: string;
  order: SortOrder;
}

export interface IPaginationInput {
  page?: number;
  limit?: number;
  sort?: ISortOption[];
}

export interface ISearchInput {
  query: string;
  filters?: Record<string, any>;
  pagination?: IPaginationInput;
}

// ================================
// 📊 DASHBOARD INTERFACES
// ================================

export interface IDashboardStats {
  restaurant_id: string;
  total_orders_today: number;
  total_revenue_today: number;
  total_customers_today: number;
  avg_order_value_today: number;
  pending_orders: number;
  preparing_orders: number;
  ready_orders: number;
  active_tables: number;
  available_tables: number;
  today_reservations: number;
  staff_present: number;
  total_staff: number;
  low_stock_items: number;
  new_messages: number;
}

export interface IAnalyticsData {
  daily_sales: Array<{ date: string; revenue: number; orders: number }>;
  popular_items: Array<{ item_name: string; quantity_sold: number; revenue: number }>;
  payment_methods: Array<{ method: PaymentMethod; count: number; percentage: number }>;
  hourly_sales: Array<{ hour: number; revenue: number; orders: number }>;
  customer_demographics: Array<{ age_group: string; count: number; percentage: number }>;
  order_types: Array<{ type: OrderType; count: number; percentage: number }>;
}

// ================================
// 🔐 AUTH INTERFACES
// ================================

export interface IAuthUser {
  id: string;
  clerk_id?: string;
  username: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  status: UserStatus;
  permissions?: string[];
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IRegisterInput {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
}

export interface IAuthResponse {
  user: IAuthUser;
  token: string;
  refresh_token?: string;
  expires_at: Date;
}

// ================================
// 🌐 SOCKET.IO INTERFACES
// ================================

export interface ISocketUser {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  status: 'online' | 'offline' | 'away';
}

export interface ISocketMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: MessageType;
  created_at: Date;
}

export interface ITypingIndicator {
  conversation_id: string;
  user: ISocketUser;
  is_typing: boolean;
}

export interface IUserStatusChange {
  user: ISocketUser;
  status: 'online' | 'offline' | 'away';
  last_seen?: Date;
}

export interface ISocketEvents {
  // Outgoing events (server to client)
  new_message: {
    message: ISocketMessage;
    user: ISocketUser;
  };
  user_joined: {
    user: ISocketUser;
    conversation_id: string;
  };
  user_left: {
    user: ISocketUser;
    conversation_id: string;
  };
  user_typing: ITypingIndicator;
  user_status_changed: IUserStatusChange;
  conversation_updated: IConversation;

  // Incoming events (client to server)
  join_conversation: {
    conversation_id: string;
  };
  leave_conversation: {
    conversation_id: string;
  };
  send_message: {
    conversation_id: string;
    content: string;
    message_type?: MessageType;
    attachments?: string[];
  };
  typing_start: {
    conversation_id: string;
  };
  typing_stop: {
    conversation_id: string;
  };
  update_status: {
    status: 'online' | 'offline' | 'away';
  };
}

// ================================
// 🎨 UI COMPONENT INTERFACES
// ================================

export interface ITableColumn {
  key: string;
  title: string;
  dataIndex: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: any) => any;
}

export interface IFormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date' | 'checkbox';
  required?: boolean;
  options?: Array<{ label: string; value: any }>;
  validation?: any;
  placeholder?: string;
}

export interface IModalProps {
  visible: boolean;
  title: string;
  onCancel: () => void;
  onOk?: () => void;
  loading?: boolean;
  width?: number;
}

// ================================
// 🎯 EXPORT ALL TYPES
// ================================

// All types are already exported individually above
