import { ComponentProps } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: { title: string; url: string }[];
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: { title: string; url: string }[];
}

export interface AppSidebarUser {
  name?: string | null;
  email?: string | null;
  avatar?: string | null;
}

export interface AppSidebarUserProps {
  user?: AppSidebarUser;
  type?: "sidebar" | "navbar";
  size?: "icon" | "sm" | "md" | "lg";
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

export interface AppSidebarProps extends ComponentProps<typeof Sidebar> {
  sidebar: {
    role: string;
    navMain: NavMainItem[];
    projects: { name: string; url: string; icon: LucideIcon }[];
    user: { name: string; email: string; avatar: string };
  };
  global: {
    name: string;
    description: string;
  };
  user: AppSidebarUser;
}

///////////////////////////////////////////////////////////////////////////////

// =============================================================================
// DATABASE INTERFACES - 31 bảng từ Prisma Schema
// =============================================================================

// ENUMS
export type UserStatusEnum = 
  | 'active' | 'inactive' | 'banned' | 'suspended' | 'pending_verification' | 'locked' | 'on_leave';

export type UserActivityStatusEnum = 
  | 'available' | 'busy' | 'do_not_disturb' | 'away' | 'offline' | 'invisible';

export type UserRoleEnum = 
  | 'customer' | 'staff' | 'manager' | 'admin' | 'super_admin' | 'deliver';

export type OrganizationRoleEnum = 'admin' | 'member' | 'guest';

export type RestaurantStatusEnum = 'active' | 'inactive' | 'maintenance' | 'closed';

export type TableStatusEnum = 'available' | 'occupied' | 'reserved' | 'maintenance' | 'out_of_order';

export type ReservationStatusEnum = 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show';

export type TableOrderStatusEnum = 'active' | 'completed' | 'cancelled';

export type OrderTypeEnum = 'dine_in' | 'takeaway' | 'delivery';

export type OrderStatusEnum = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';

export type CookingStatusEnum = 'pending' | 'preparing' | 'cooking' | 'ready' | 'served' | 'cancelled';

export type PaymentMethodEnum = 'cash' | 'card' | 'bank_transfer' | 'momo' | 'zalopay' | 'viettelpay' | 'vnpay' | 'shopeepay' | 'paypal';

export type PaymentStatusEnum = 'pending' | 'completed' | 'failed' | 'processing' | 'cancelled' | 'refunded';

export type RestaurantStaffRoleEnum = 'staff' | 'manager' | 'chef' | 'cashier' | 'security' | 'cleaner' | 'supervisor' | 'sous_chef' | 'waiter' | 'host';

export type StaffStatusEnum = 'active' | 'inactive' | 'on_leave' | 'suspended' | 'terminated';

export type StaffShiftTypeEnum = 'morning' | 'afternoon' | 'evening' | 'night' | 'full_day' | 'split_shift';

export type StaffScheduleStatusEnum = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'absent' | 'late' | 'cancelled';

export type InventoryTransactionTypeEnum = 'purchase' | 'usage' | 'adjustment' | 'waste' | 'return' | 'transfer';

export type VoucherDiscountTypeEnum = 'percentage' | 'fixed_amount';

export type PromotionTypeEnum = 'percentage' | 'fixed_amount' | 'buy_one_get_one' | 'combo_deal' | 'happy_hour' | 'seasonal';

export type ReviewStatusEnum = 'active' | 'hidden' | 'flagged' | 'deleted';

export type RevenueReportTypeEnum = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type ConversationTypeEnum = 'support' | 'feedback' | 'complaint' | 'inquiry';

export type ConversationStatusEnum = 'active' | 'resolved' | 'closed';

export type MessageTypeEnum = 'text' | 'image' | 'file' | 'system';

export type NotificationTypeEnum = 
  | 'order_created' | 'order_confirmed' | 'order_preparing' | 'order_ready' | 'order_delivered' | 'order_cancelled'
  | 'order_payment_success' | 'order_payment_failed' | 'reservation_created' | 'reservation_confirmed' 
  | 'reservation_cancelled' | 'reservation_reminder' | 'shift_assigned' | 'shift_reminder' | 'schedule_updated'
  | 'attendance_reminder' | 'new_review' | 'low_inventory' | 'menu_updated' | 'promotion_created'
  | 'voucher_expires_soon' | 'member_joined' | 'member_left' | 'role_changed' | 'organization_updated'
  | 'system_maintenance' | 'feature_announcement' | 'security_alert' | 'new_message' | 'conversation_started';

export type NotificationPriorityEnum = 'low' | 'medium' | 'high' | 'urgent';

export type NotificationStatusEnum = 'unread' | 'read' | 'archived';

// MAIN INTERFACES

// =============================================================================
// API Interfaces
// =============================================================================
// 1. Address Interface
export interface AddressInterface {
  id: string;
  user_id: string;
  recipient_name: string;
  recipient_phone: string;
  street_address: string;
  ward?: string;
  district: string;
  city: string;
  country: string;
  created_at: string;
  updated_at: string;
  is_default: boolean;
  user?: UserInterface;
  orders?: OrderInterface[];
}

// =============================================================================
// API Interfaces
// =============================================================================
// 2. Category Interface
export interface CategoryInterface {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  display_order: number;
  image_url?: string;
  is_active: boolean;
  parent_id?: string;
  updated_at: string;
  parent_category?: CategoryInterface;
  child_categories?: CategoryInterface[];
  menu_items?: MenuItemInterface[];
}

// =============================================================================
// API Interfaces
// =============================================================================
// 3. Conversation Interface
export interface ConversationInterface {
  id: string;
  type: ConversationTypeEnum;
  created_at: string;
  updated_at: string;
  customer_id?: string;
  last_message_at?: string;
  restaurant_id?: string;
  staff_id?: string;
  status: ConversationStatusEnum;
  title?: string;
  customer?: UserInterface;
  restaurant?: RestaurantInterface;
  staff?: UserInterface;
  messages?: MessageInterface[];
}

// =============================================================================
// API Interfaces
// =============================================================================
// 4. Message Interface
export interface MessageInterface {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: MessageTypeEnum;
  created_at: string;
  attachments: string[];
  is_read: boolean;
  conversation?: ConversationInterface;
  sender?: UserInterface;
}

// =============================================================================
// API Interfaces
// =============================================================================
// 5. Organization Interface
export interface OrganizationInterface {
  id: string;
  name: string;
  code: string;
  description?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  logo_url?: string;
  clerk_id?: string;
  clerk_slug?: string;
  owner?: UserInterface;
  chains?: RestaurantChainInterface[];
  restaurants?: RestaurantInterface[];
  memberships?: OrganizationMembershipInterface[];
}

// =============================================================================
// API Interfaces
// =============================================================================
// 6. Organization Membership Interface
export interface OrganizationMembershipInterface {
  id: string;
  clerk_id: string;
  organization_id: string;
  user_id: string;
  role: OrganizationRoleEnum;
  created_at: string;
  updated_at: string;
  joined_at?: string;
  invited_at?: string;
  organization?: OrganizationInterface;
  user?: UserInterface;
}

// =============================================================================
// API Interfaces
// =============================================================================
// 7. Restaurant Chain Interface
export interface RestaurantChainInterface {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  logo_url?: string;
  organization_id: string;
  organization?: OrganizationInterface;
  restaurants?: RestaurantInterface[];
}

// =============================================================================
// API Interfaces
// =============================================================================
// 8. Restaurant Interface
export interface RestaurantInterface {
  id: string;
  organization_id: string;
  chain_id?: string;
  code: string;
  name: string;
  address: string;
  phone_number?: string;
  description?: string;
  created_at: string;
  updated_at: string;
  manager_id?: string;
  cover_url?: string;
  email?: string;
  logo_url?: string;
  opening_hours?: Record<string, unknown>;
  status: RestaurantStatusEnum;
  chain?: RestaurantChainInterface;
  manager?: UserInterface;
  organization?: OrganizationInterface;
  conversations?: ConversationInterface[];
  inventory_items?: InventoryItemInterface[];
  menus?: MenuInterface[];
  orders?: OrderInterface[];
  promotions?: PromotionInterface[];
  staffs?: RestaurantStaffInterface[];
  revenue_reports?: RevenueReportInterface[];
  reviews?: ReviewInterface[];
  staff_attendance?: StaffAttendanceInterface[];
  staff_schedules?: StaffScheduleInterface[];
  tables?: TableInterface[];
  vouchers?: VoucherInterface[];
}

// =============================================================================
// API Interfaces
// =============================================================================
// 9. Menu Interface
export interface MenuInterface {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  display_order: number;
  image_url?: string;
  restaurant?: RestaurantInterface;
  menu_items?: MenuItemInterface[];
}

export interface Menu {
  id: string
  restaurant_id: string
  name: string
  description?: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  display_order: number
  image_url?: string | null
  restaurants: {
    id: string
    name: string
    code: string
  }
  _count?: {
    menu_items: number
  }
}

// =============================================================================
// API Interfaces
// =============================================================================
// 10. Menu Item Interface
export interface MenuItemInterface {
  id: string;
  menu_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  category_id?: string;
  allergens: string[];
  calories?: number;
  dietary_info: string[];
  display_order: number;
  is_featured: boolean;
  preparation_time?: number;
  category?: CategoryInterface;
  menu?: MenuInterface;
  order_items?: OrderItemInterface[];
  recipes?: RecipeInterface[];
  reviews?: ReviewInterface[];
}


// =============================================================================
// API Interfaces
// =============================================================================
// Legacy MenuItem for backward compatibility
export interface MenuItem {
  id: string
  menu_id: string
  name: string
  description: string
  price: string
  image_url: string | null
  is_available: boolean
  created_at: string
  updated_at: string
  category_id: string
  allergens: string[]
  calories: number | null
  dietary_info: string[]
  display_order: number
  is_featured: boolean
  preparation_time: number | null
  menus: {
    id: string
    name: string
    restaurant_id: string
    restaurants: {
      id: string
      name: string
      code: string
    }
  }
  categories: {
    id: string
    name: string
    slug: string
  }

  // id: string
  // restaurant_id?: string
  // menu_id: string
  // category_id?: string
  // name: string
  // description?: string
  // price: number | string
  // image_url?: string
  // preparation_time?: number
  // calories?: number
  // allergens?: string[]
  // dietary_info?: string[]
  // is_vegetarian?: boolean
  // is_vegan?: boolean
  // is_available: boolean
  // is_featured?: boolean
  // display_order: number
  // created_at: string
  // updated_at: string
  // menus?: {
  //   id: string
  //   name: string
  //   restaurant_id?: string
  // }
  // categories?: {
  //   id: string
  //   name: string
  //   slug?: string
  // }
}

// =============================================================================
// API Interfaces
// =============================================================================
// 11. Table Interface
export interface TableInterface {
  id: string;
  restaurant_id: string;
  table_number: string;
  capacity: number;
  location?: string;
  status: TableStatusEnum;
  qr_code?: string;
  created_at: string;
  updated_at: string;
  restaurant?: RestaurantInterface;
  reservations?: ReservationInterface[];
  table_orders?: TableOrderInterface[];
}

// =============================================================================
// API Interfaces
// =============================================================================
// 12. Reservation Interface
export interface ReservationInterface {
  id: string;
  table_id: string;
  customer_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  party_size: number;
  reservation_date: string;
  duration_hours: number;
  status: ReservationStatusEnum;
  special_requests?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  customer?: UserInterface;
  table?: TableInterface;
}

// =============================================================================
// API Interfaces
// =============================================================================
// 13. Table Order Interface
export interface TableOrderInterface {
  id: string;
  table_id: string;
  order_id?: string;
  session_code: string;
  status: TableOrderStatusEnum;
  opened_at: string;
  closed_at?: string;
  total_amount?: number;
  staff_id?: string;
  table?: TableInterface;
  order?: OrderInterface;
  staff?: UserInterface;
}

// =============================================================================
// API Interfaces
// =============================================================================
// 14. Order Interface
export interface OrderInterface {
  id: string;
  order_code: string;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  status: OrderStatusEnum;
  payment_status: PaymentStatusEnum;
  notes?: string;
  created_at: string;
  updated_at: string;
  address_id?: string;
  customer_id: string;
  delivery_fee: number;
  estimated_time?: number;
  order_type: OrderTypeEnum;
  restaurant_id: string;
  tax_amount: number;
  address?: AddressInterface;
  customer?: UserInterface;
  restaurant?: RestaurantInterface;
  order_items?: OrderItemInterface[];
  order_history?: OrderStatusHistoryInterface[];
  payments?: PaymentInterface[];
  reviews?: ReviewInterface[];
  table_orders?: TableOrderInterface[];
  voucher_usages?: VoucherUsageInterface[];
}

// =============================================================================
// API Interfaces
// =============================================================================
// 15. Order Item Interface
export interface OrderItemInterface {
  id: string;
  order_id: string;
  quantity: number;
  created_at: string;
  menu_item_id: string;
  cooking_status: CookingStatusEnum;
  prepared_at?: string;
  served_at?: string;
  special_instructions?: string;
  total_price: number;
  unit_price: number;
  order?: OrderInterface;
  menu_item?: MenuItemInterface;
}

// =============================================================================
// API Interfaces
// =============================================================================
// 16. Order Status History Interface
export interface OrderStatusHistoryInterface {
  id: string;
  order_id: string;
  status: OrderStatusEnum;
  changed_by_user_id?: string;
  notes?: string;
  created_at: string;
  order?: OrderInterface;
  user?: UserInterface;
}

// =============================================================================
// API Interfaces
// =============================================================================
// 17. Payment Interface
export interface PaymentInterface {
  id: string;
  order_id: string;
  amount: number;
  method: PaymentMethodEnum;
  status: PaymentStatusEnum;
  provider?: string;
  transaction_id?: string;
  gateway_response?: Record<string, unknown>;
  processed_at?: string;
  created_at: string;
  updated_at: string;
  order?: OrderInterface;
}

// =============================================================================
// API Interfaces
// =============================================================================
// 18. Restaurant Staff Interface
export interface RestaurantStaffInterface {
  id: string;
  restaurant_id: string;
  user_id: string;
  role: RestaurantStaffRoleEnum;
  status: StaffStatusEnum;
  joined_at: string;
  left_at?: string;
  hourly_rate?: number;
  restaurant?: RestaurantInterface;
  user?: UserInterface;
}

// =============================================================================
// API Interfaces
// =============================================================================
// 19. Staff Schedule Interface
export interface StaffScheduleInterface {
  id: string;
  staff_id: string;
  restaurant_id: string;
  shift_date: string;
  shift_type: StaffShiftTypeEnum;
  start_time: string;
  end_time: string;
  status: StaffScheduleStatusEnum;
  notes?: string;
  created_at: string;
  updated_at: string;
  restaurant?: RestaurantInterface;
  staff?: UserInterface;
  attendance?: StaffAttendanceInterface[];
}

// =============================================================================
// API Interfaces
// =============================================================================
// 20. Staff Attendance Interface
export interface StaffAttendanceInterface {
  id: string;
  staff_id: string;
  restaurant_id: string;
  schedule_id?: string;
  work_date: string;
  check_in_time?: string;
  check_out_time?: string;
  break_duration?: number;
  overtime_hours?: number;
  total_hours?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  restaurant?: RestaurantInterface;
  schedule?: StaffScheduleInterface;
  staff?: UserInterface;
}

// =============================================================================
// API Interfaces
// =============================================================================
// 21. Inventory Item Interface
export interface InventoryItemInterface {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  unit: string;
  quantity: number;
  min_quantity?: number;
  max_quantity?: number;
  created_at: string;
  updated_at: string;
  expiry_date?: string;
  supplier?: string;
  unit_cost?: number;
  restaurant?: RestaurantInterface;
  transactions?: InventoryTransactionInterface[];
  recipe_ingredients?: RecipeIngredientInterface[];
}

// =============================================================================
// API Interfaces
// =============================================================================
// 22. Inventory Transaction Interface
export interface InventoryTransactionInterface {
  id: string;
  inventory_item_id: string;
  type: InventoryTransactionTypeEnum;
  quantity: number;
  created_at: string;
  invoice_number?: string;
  notes?: string;
  supplier?: string;
  total_cost?: number;
  unit_cost?: number;
  inventory_item?: InventoryItemInterface;
}

// =============================================================================
// API Interfaces
// =============================================================================
// 23. Recipe Interface
export interface RecipeInterface {
  id: string;
  menu_item_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  cook_time?: number;
  instructions?: string;
  prep_time?: number;
  serving_size?: number;
  menu_item?: MenuItemInterface;
  ingredients?: RecipeIngredientInterface[];
}

// =============================================================================
// API Interfaces
// =============================================================================
// 24. Recipe Ingredient Interface
export interface RecipeIngredientInterface {
  id: string;
  recipe_id: string;
  inventory_item_id: string;
  quantity: number;
  unit: string;
  notes?: string;
  recipe?: RecipeInterface;
  inventory_item?: InventoryItemInterface;
}

// =============================================================================
// API Interfaces
// =============================================================================
// 25. Voucher Interface
export interface VoucherInterface {
  id: string;
  code: string;
  description?: string;
  discount_type: VoucherDiscountTypeEnum;
  discount_value: number;
  min_order_value?: number;
  max_discount?: number;
  start_date: string;
  end_date: string;
  usage_limit?: number;
  used_count: number;
  is_active: boolean;
  restaurant_id?: string;
  created_at: string;
  name: string;
  updated_at: string;
  restaurant?: RestaurantInterface;
  usages?: VoucherUsageInterface[];
}

// =============================================================================
// API Interfaces
// =============================================================================
// 26. Voucher Usage Interface
export interface VoucherUsageInterface {
  id: string;
  voucher_id: string;
  user_id: string;
  order_id?: string;
  used_at: string;
  voucher?: VoucherInterface;
  user?: UserInterface;
  order?: OrderInterface;
}

// =============================================================================
// API Interfaces
// =============================================================================
// 27. Promotion Interface
export interface PromotionInterface {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  type: PromotionTypeEnum;
  discount_value: number;
  conditions?: Record<string, unknown>;
  applicable_items: string[];
  time_restrictions?: Record<string, unknown>;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  restaurant?: RestaurantInterface;
}

// =============================================================================
// API Interfaces
// =============================================================================
// 28. Review Interface
export interface ReviewInterface {
  id: string;
  customer_id: string;
  restaurant_id?: string;
  order_id?: string;
  menu_item_id?: string;
  rating: number;
  title?: string;
  content?: string;
  photos: string[];
  status: ReviewStatusEnum;
  response?: string;
  responded_at?: string;
  created_at: string;
  updated_at: string;
  customer?: UserInterface;
  restaurant?: RestaurantInterface;
  order?: OrderInterface;
  menu_item?: MenuItemInterface;
}

// =============================================================================
// API Interfaces
// =============================================================================
// 29. Revenue Report Interface
export interface RevenueReportInterface {
  id: string;
  restaurant_id: string;
  report_date: string;
  report_type: RevenueReportTypeEnum;
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  avg_order_value?: number;
  dine_in_revenue?: number;
  takeaway_revenue?: number;
  delivery_revenue?: number;
  popular_items?: Record<string, unknown>;
  payment_methods_breakdown?: Record<string, unknown>;
  hourly_breakdown?: Record<string, unknown>;
  created_at: string;
  restaurant?: RestaurantInterface;
}

// =============================================================================
// API Interfaces
// =============================================================================
// 30. User Interface
export interface UserInterface {
  id: string;
  username?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  phone_code?: string;
  phone_number?: string;
  avatar_url?: string;
  email_verified_at?: string;
  phone_verified_at?: string;
  status: UserStatusEnum;
  role: UserRoleEnum;
  created_at: string;
  updated_at: string;
  clerk_id?: string;
  date_of_birth?: string;
  gender?: string;
  loyalty_points: number;
  total_orders: number;
  total_spent: number;
  password_hash?: string;
  activity_status: UserActivityStatusEnum;
  is_online?: boolean;
  last_activity_at?: string;
  last_seen_at?: string;
  // Clerk fields
  has_image?: boolean;
  primary_email_address_id?: string;
  password_enabled?: boolean;
  two_factor_enabled?: boolean;
  totp_enabled?: boolean;
  backup_code_enabled?: boolean;
  banned?: boolean;
  locked?: boolean;
  lockout_expires_in_seconds?: number;
  delete_self_enabled?: boolean;
  create_organization_enabled?: boolean;
  create_organizations_limit?: number;
  legal_accepted_at?: string;
  last_sign_in_at?: string;
  public_metadata?: Record<string, unknown>;
  private_metadata?: Record<string, unknown>;
  unsafe_metadata?: Record<string, unknown>;
  email_addresses?: Record<string, unknown>[];
  phone_numbers?: Record<string, unknown>[];
  web3_wallets?: Record<string, unknown>[];
  external_accounts?: Record<string, unknown>[];
  enterprise_accounts?: Record<string, unknown>[];
  passkeys?: Record<string, unknown>[];
  // Relations
  addresses?: AddressInterface[];
  conversations_as_customer?: ConversationInterface[];
  conversations_as_staff?: ConversationInterface[];
  messages_sent?: MessageInterface[];
  order_status_history?: OrderStatusHistoryInterface[];
  orders?: OrderInterface[];
  organizations_owned?: OrganizationInterface[];
  organization_memberships?: OrganizationMembershipInterface[];
  reservations?: ReservationInterface[];
  restaurant_staffs?: RestaurantStaffInterface[];
  restaurants_managed?: RestaurantInterface[];
  reviews_written?: ReviewInterface[];
  staff_attendance?: StaffAttendanceInterface[];
  staff_schedules?: StaffScheduleInterface[];
  table_orders_staffed?: TableOrderInterface[];
  user_statistics?: UserStatisticsInterface;
  voucher_usages?: VoucherUsageInterface[];
  notifications?: NotificationInterface[];
}

// =============================================================================
// API Interfaces
// =============================================================================
// 31. User Statistics Interface
export interface UserStatisticsInterface {
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
  last_order_date?: string;
  last_reservation_date?: string;
  created_at: string;
  updated_at: string;
  user?: UserInterface;
}

// =============================================================================
// API Interfaces
// =============================================================================
// 32. Notification Interface
export interface NotificationInterface {
  id: string;
  title: string;
  message: string;
  type: NotificationTypeEnum;
  priority: NotificationPriorityEnum;
  status: NotificationStatusEnum;
  user_id: string;
  related_id?: string;
  related_type?: string;
  action_url?: string;
  metadata?: Record<string, unknown>;
  read_at?: string;
  scheduled_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  user?: UserInterface;
}

// =============================================================================
// UTILITY INTERFACES
// =============================================================================

export interface PaginationInterface {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponseInterface<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: PaginationInterface;
  errors?: string[];
}

// Create/Update types
export type CreateUserInterface = Omit<UserInterface, 'id' | 'created_at' | 'updated_at'>;
export type UpdateUserInterface = Partial<Omit<UserInterface, 'id'>> & { id: string };
export type CreateOrderInterface = Omit<OrderInterface, 'id' | 'created_at' | 'updated_at'>;
export type UpdateOrderInterface = Partial<Omit<OrderInterface, 'id'>> & { id: string };
export type CreateMenuItemInterface = Omit<MenuItemInterface, 'id' | 'created_at' | 'updated_at'>;
export type UpdateMenuItemInterface = Partial<Omit<MenuItemInterface, 'id'>> & { id: string };
export type CreateRestaurantInterface = Omit<RestaurantInterface, 'id' | 'created_at' | 'updated_at'>;
export type UpdateRestaurantInterface = Partial<Omit<RestaurantInterface, 'id'>> & { id: string };

// Filter interfaces
export interface UserFiltersInterface {
  role?: UserRoleEnum;
  status?: UserStatusEnum;
  search?: string;
  is_online?: boolean;
}

export interface OrderFiltersInterface {
  status?: OrderStatusEnum;
  order_type?: OrderTypeEnum;
  restaurant_id?: string;
  customer_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface MenuItemFiltersInterface {
  category_id?: string;
  is_available?: boolean;
  is_featured?: boolean;
  restaurant_id?: string;
  search?: string;
  price_min?: number;
  price_max?: number;
}

// Statistics interfaces
export interface RestaurantStatsInterface {
  total_orders: number;
  total_revenue: number;
  avg_order_value: number;
  popular_items: MenuItemInterface[];
  rating_average: number;
  total_reviews: number;
}

export interface UserOrderStatsInterface {
  total_orders: number;
  total_spent: number;
  favorite_items: MenuItemInterface[];
  recent_orders: OrderInterface[];
}
