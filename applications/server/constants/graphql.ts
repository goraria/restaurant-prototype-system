// ================================
// 🚀 GraphQL Types & Schema Definitions
// ================================

import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLList,
  GraphQLSchema
} from 'graphql';

// ================================
// 📋 GraphQL TYPE DEFINITIONS
// ================================

// User Type Definition (Enhanced)
export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    clerk_id: { type: GraphQLString },
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    phone_code: { type: GraphQLString },
    phone_number: { type: GraphQLString },
    first_name: { type: new GraphQLNonNull(GraphQLString) },
    last_name: { type: new GraphQLNonNull(GraphQLString) },
    full_name: { type: new GraphQLNonNull(GraphQLString) },
    avatar_url: { type: GraphQLString },
    date_of_birth: { type: GraphQLString },
    gender: { type: GraphQLString },
    status: { type: new GraphQLNonNull(GraphQLString) },
    role: { type: new GraphQLNonNull(GraphQLString) },
    email_verified_at: { type: GraphQLString },
    phone_verified_at: { type: GraphQLString },
    total_orders: { type: new GraphQLNonNull(GraphQLInt) },
    total_spent: { type: new GraphQLNonNull(GraphQLFloat) },
    loyalty_points: { type: new GraphQLNonNull(GraphQLInt) },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    updated_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Address Type Definition
export const AddressType = new GraphQLObjectType({
  name: 'Address',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    user_id: { type: new GraphQLNonNull(GraphQLID) },
    recipient_name: { type: new GraphQLNonNull(GraphQLString) },
    recipient_phone: { type: new GraphQLNonNull(GraphQLString) },
    street_address: { type: new GraphQLNonNull(GraphQLString) },
    ward: { type: GraphQLString },
    district: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    is_default: { type: new GraphQLNonNull(GraphQLBoolean) },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    updated_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Organization Type Definition
export const OrganizationType = new GraphQLObjectType({
  name: 'Organization',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    code: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    logo_url: { type: GraphQLString },
    owner_id: { type: new GraphQLNonNull(GraphQLID) },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    updated_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Restaurant Chain Type Definition
export const RestaurantChainType = new GraphQLObjectType({
  name: 'RestaurantChain',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    organization_id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    code: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    logo_url: { type: GraphQLString },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    updated_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Restaurant Type Definition
export const RestaurantType = new GraphQLObjectType({
  name: 'Restaurant',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    organization_id: { type: new GraphQLNonNull(GraphQLID) },
    chain_id: { type: GraphQLID },
    code: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    address: { type: new GraphQLNonNull(GraphQLString) },
    phone_number: { type: GraphQLString },
    email: { type: GraphQLString },
    description: { type: GraphQLString },
    logo_url: { type: GraphQLString },
    cover_url: { type: GraphQLString },
    opening_hours: { type: GraphQLString }, // JSON as string
    status: { type: new GraphQLNonNull(GraphQLString) },
    manager_id: { type: GraphQLID },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    updated_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Category Type Definition
export const CategoryType = new GraphQLObjectType({
  name: 'Category',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    parent_id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    slug: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    image_url: { type: GraphQLString },
    display_order: { type: new GraphQLNonNull(GraphQLInt) },
    is_active: { type: new GraphQLNonNull(GraphQLBoolean) },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    updated_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Menu Type Definition
export const MenuType = new GraphQLObjectType({
  name: 'Menu',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    restaurant_id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    image_url: { type: GraphQLString },
    is_active: { type: new GraphQLNonNull(GraphQLBoolean) },
    display_order: { type: new GraphQLNonNull(GraphQLInt) },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    updated_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// MenuItem Type Definition
export const MenuItemType = new GraphQLObjectType({
  name: 'MenuItem',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    menu_id: { type: new GraphQLNonNull(GraphQLID) },
    category_id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    price: { type: new GraphQLNonNull(GraphQLFloat) },
    image_url: { type: GraphQLString },
    is_available: { type: new GraphQLNonNull(GraphQLBoolean) },
    is_featured: { type: new GraphQLNonNull(GraphQLBoolean) },
    preparation_time: { type: GraphQLInt },
    calories: { type: GraphQLInt },
    allergens: { type: new GraphQLList(GraphQLString) },
    dietary_info: { type: new GraphQLList(GraphQLString) },
    display_order: { type: new GraphQLNonNull(GraphQLInt) },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    updated_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Table Type Definition
export const TableType = new GraphQLObjectType({
  name: 'Table',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    restaurant_id: { type: new GraphQLNonNull(GraphQLID) },
    table_number: { type: new GraphQLNonNull(GraphQLString) },
    capacity: { type: new GraphQLNonNull(GraphQLInt) },
    location: { type: GraphQLString },
    status: { type: new GraphQLNonNull(GraphQLString) },
    qr_code: { type: GraphQLString },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    updated_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Table Order Type Definition
export const TableOrderType = new GraphQLObjectType({
  name: 'TableOrder',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    table_id: { type: new GraphQLNonNull(GraphQLID) },
    order_id: { type: GraphQLID },
    session_code: { type: new GraphQLNonNull(GraphQLString) },
    customer_count: { type: new GraphQLNonNull(GraphQLInt) },
    status: { type: new GraphQLNonNull(GraphQLString) },
    started_at: { type: new GraphQLNonNull(GraphQLString) },
    ended_at: { type: GraphQLString },
    total_amount: { type: new GraphQLNonNull(GraphQLFloat) },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    updated_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Reservation Type Definition
export const ReservationType = new GraphQLObjectType({
  name: 'Reservation',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    table_id: { type: new GraphQLNonNull(GraphQLID) },
    customer_id: { type: GraphQLID },
    customer_name: { type: new GraphQLNonNull(GraphQLString) },
    customer_phone: { type: new GraphQLNonNull(GraphQLString) },
    customer_email: { type: GraphQLString },
    party_size: { type: new GraphQLNonNull(GraphQLInt) },
    reservation_date: { type: new GraphQLNonNull(GraphQLString) },
    duration_hours: { type: new GraphQLNonNull(GraphQLFloat) },
    status: { type: new GraphQLNonNull(GraphQLString) },
    special_requests: { type: GraphQLString },
    notes: { type: GraphQLString },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    updated_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Order Type Definition
export const OrderType = new GraphQLObjectType({
  name: 'Order',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    restaurant_id: { type: new GraphQLNonNull(GraphQLID) },
    customer_id: { type: new GraphQLNonNull(GraphQLID) },
    address_id: { type: GraphQLID },
    order_code: { type: new GraphQLNonNull(GraphQLString) },
    order_type: { type: new GraphQLNonNull(GraphQLString) },
    total_amount: { type: new GraphQLNonNull(GraphQLFloat) },
    delivery_fee: { type: new GraphQLNonNull(GraphQLFloat) },
    discount_amount: { type: new GraphQLNonNull(GraphQLFloat) },
    tax_amount: { type: new GraphQLNonNull(GraphQLFloat) },
    final_amount: { type: new GraphQLNonNull(GraphQLFloat) },
    status: { type: new GraphQLNonNull(GraphQLString) },
    payment_status: { type: new GraphQLNonNull(GraphQLString) },
    notes: { type: GraphQLString },
    estimated_time: { type: GraphQLInt },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    updated_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// OrderItem Type Definition
export const OrderItemType = new GraphQLObjectType({
  name: 'OrderItem',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    order_id: { type: new GraphQLNonNull(GraphQLID) },
    menu_item_id: { type: new GraphQLNonNull(GraphQLID) },
    quantity: { type: new GraphQLNonNull(GraphQLInt) },
    unit_price: { type: new GraphQLNonNull(GraphQLFloat) },
    total_price: { type: new GraphQLNonNull(GraphQLFloat) },
    special_instructions: { type: GraphQLString },
    cooking_status: { type: new GraphQLNonNull(GraphQLString) },
    prepared_at: { type: GraphQLString },
    served_at: { type: GraphQLString },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Order Status History Type Definition
export const OrderStatusHistoryType = new GraphQLObjectType({
  name: 'OrderStatusHistory',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    order_id: { type: new GraphQLNonNull(GraphQLID) },
    status: { type: new GraphQLNonNull(GraphQLString) },
    notes: { type: GraphQLString },
    changed_by: { type: GraphQLID },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Payment Type Definition
export const PaymentType = new GraphQLObjectType({
  name: 'Payment',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    order_id: { type: new GraphQLNonNull(GraphQLID) },
    amount: { type: new GraphQLNonNull(GraphQLFloat) },
    method: { type: new GraphQLNonNull(GraphQLString) },
    status: { type: new GraphQLNonNull(GraphQLString) },
    provider: { type: GraphQLString },
    transaction_id: { type: GraphQLString },
    gateway_response: { type: GraphQLString }, // JSON as string
    processed_at: { type: GraphQLString },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    updated_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Restaurant Staff Type Definition
export const RestaurantStaffType = new GraphQLObjectType({
  name: 'RestaurantStaff',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    restaurant_id: { type: new GraphQLNonNull(GraphQLID) },
    user_id: { type: new GraphQLNonNull(GraphQLID) },
    position: { type: new GraphQLNonNull(GraphQLString) },
    department: { type: GraphQLString },
    salary: { type: GraphQLFloat },
    start_date: { type: new GraphQLNonNull(GraphQLString) },
    end_date: { type: GraphQLString },
    status: { type: new GraphQLNonNull(GraphQLString) },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    updated_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Staff Schedule Type Definition
export const StaffScheduleType = new GraphQLObjectType({
  name: 'StaffSchedule',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    staff_id: { type: new GraphQLNonNull(GraphQLID) },
    date: { type: new GraphQLNonNull(GraphQLString) },
    shift_start: { type: new GraphQLNonNull(GraphQLString) },
    shift_end: { type: new GraphQLNonNull(GraphQLString) },
    break_duration: { type: GraphQLInt },
    status: { type: new GraphQLNonNull(GraphQLString) },
    notes: { type: GraphQLString },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    updated_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Staff Attendance Type Definition
export const StaffAttendanceType = new GraphQLObjectType({
  name: 'StaffAttendance',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    staff_id: { type: new GraphQLNonNull(GraphQLID) },
    date: { type: new GraphQLNonNull(GraphQLString) },
    check_in: { type: GraphQLString },
    check_out: { type: GraphQLString },
    break_start: { type: GraphQLString },
    break_end: { type: GraphQLString },
    total_hours: { type: GraphQLFloat },
    status: { type: new GraphQLNonNull(GraphQLString) },
    notes: { type: GraphQLString },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    updated_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Inventory Item Type Definition
export const InventoryItemType = new GraphQLObjectType({
  name: 'InventoryItem',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    restaurant_id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    unit: { type: new GraphQLNonNull(GraphQLString) },
    quantity: { type: new GraphQLNonNull(GraphQLFloat) },
    min_quantity: { type: GraphQLFloat },
    max_quantity: { type: GraphQLFloat },
    unit_cost: { type: GraphQLFloat },
    supplier: { type: GraphQLString },
    expiry_date: { type: GraphQLString },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    updated_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Inventory Transaction Type Definition
export const InventoryTransactionType = new GraphQLObjectType({
  name: 'InventoryTransaction',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    inventory_item_id: { type: new GraphQLNonNull(GraphQLID) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    quantity: { type: new GraphQLNonNull(GraphQLFloat) },
    unit_cost: { type: GraphQLFloat },
    total_cost: { type: GraphQLFloat },
    reference_type: { type: GraphQLString },
    reference_id: { type: GraphQLID },
    notes: { type: GraphQLString },
    created_by: { type: GraphQLID },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Recipe Type Definition
export const RecipeType = new GraphQLObjectType({
  name: 'Recipe',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    menu_item_id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    instructions: { type: GraphQLString },
    preparation_time: { type: GraphQLInt },
    cooking_time: { type: GraphQLInt },
    servings: { type: GraphQLInt },
    difficulty: { type: GraphQLString },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    updated_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Recipe Ingredient Type Definition
export const RecipeIngredientType = new GraphQLObjectType({
  name: 'RecipeIngredient',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    recipe_id: { type: new GraphQLNonNull(GraphQLID) },
    inventory_item_id: { type: new GraphQLNonNull(GraphQLID) },
    quantity: { type: new GraphQLNonNull(GraphQLFloat) },
    unit: { type: new GraphQLNonNull(GraphQLString) },
    notes: { type: GraphQLString },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    updated_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Voucher Type Definition
export const VoucherType = new GraphQLObjectType({
  name: 'Voucher',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    restaurant_id: { type: GraphQLID },
    code: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    discount_type: { type: new GraphQLNonNull(GraphQLString) },
    discount_value: { type: new GraphQLNonNull(GraphQLFloat) },
    min_order_value: { type: GraphQLFloat },
    max_discount: { type: GraphQLFloat },
    usage_limit: { type: GraphQLInt },
    used_count: { type: new GraphQLNonNull(GraphQLInt) },
    start_date: { type: new GraphQLNonNull(GraphQLString) },
    end_date: { type: new GraphQLNonNull(GraphQLString) },
    is_active: { type: new GraphQLNonNull(GraphQLBoolean) },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    updated_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Voucher Usage Type Definition
export const VoucherUsageType = new GraphQLObjectType({
  name: 'VoucherUsage',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    voucher_id: { type: new GraphQLNonNull(GraphQLID) },
    order_id: { type: new GraphQLNonNull(GraphQLID) },
    user_id: { type: new GraphQLNonNull(GraphQLID) },
    discount_amount: { type: new GraphQLNonNull(GraphQLFloat) },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Promotion Type Definition
export const PromotionType = new GraphQLObjectType({
  name: 'Promotion',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    restaurant_id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    type: { type: new GraphQLNonNull(GraphQLString) },
    discount_value: { type: new GraphQLNonNull(GraphQLFloat) },
    conditions: { type: GraphQLString }, // JSON as string
    applicable_items: { type: new GraphQLList(GraphQLString) },
    time_restrictions: { type: GraphQLString }, // JSON as string
    start_date: { type: new GraphQLNonNull(GraphQLString) },
    end_date: { type: new GraphQLNonNull(GraphQLString) },
    is_active: { type: new GraphQLNonNull(GraphQLBoolean) },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    updated_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Review Type Definition
export const ReviewType = new GraphQLObjectType({
  name: 'Review',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    customer_id: { type: new GraphQLNonNull(GraphQLID) },
    restaurant_id: { type: GraphQLID },
    order_id: { type: GraphQLID },
    menu_item_id: { type: GraphQLID },
    rating: { type: new GraphQLNonNull(GraphQLInt) },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    photos: { type: new GraphQLList(GraphQLString) },
    status: { type: new GraphQLNonNull(GraphQLString) },
    response: { type: GraphQLString },
    responded_at: { type: GraphQLString },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    updated_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Conversation Type Definition
export const ConversationType = new GraphQLObjectType({
  name: 'Conversation',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    restaurant_id: { type: GraphQLID },
    customer_id: { type: GraphQLID },
    staff_id: { type: GraphQLID },
    type: { type: new GraphQLNonNull(GraphQLString) },
    status: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: GraphQLString },
    last_message_at: { type: GraphQLString },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    updated_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Message Type Definition
export const MessageType = new GraphQLObjectType({
  name: 'Message',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    conversation_id: { type: new GraphQLNonNull(GraphQLID) },
    sender_id: { type: new GraphQLNonNull(GraphQLID) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    message_type: { type: new GraphQLNonNull(GraphQLString) },
    attachments: { type: new GraphQLList(GraphQLString) },
    is_read: { type: new GraphQLNonNull(GraphQLBoolean) },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Revenue Report Type Definition
export const RevenueReportType = new GraphQLObjectType({
  name: 'RevenueReport',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    restaurant_id: { type: new GraphQLNonNull(GraphQLID) },
    date: { type: new GraphQLNonNull(GraphQLString) },
    total_orders: { type: new GraphQLNonNull(GraphQLInt) },
    total_revenue: { type: new GraphQLNonNull(GraphQLFloat) },
    total_discount: { type: new GraphQLNonNull(GraphQLFloat) },
    total_tax: { type: new GraphQLNonNull(GraphQLFloat) },
    net_revenue: { type: new GraphQLNonNull(GraphQLFloat) },
    average_order_value: { type: new GraphQLNonNull(GraphQLFloat) },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    updated_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Additional Missing Types from Prisma Schema

// Driver Type Definition
export const DriverType = new GraphQLObjectType({
  name: 'Driver',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    user_id: { type: new GraphQLNonNull(GraphQLID) },
    license_number: { type: new GraphQLNonNull(GraphQLString) },
    vehicle_type: { type: new GraphQLNonNull(GraphQLString) },
    vehicle_number: { type: GraphQLString },
    status: { type: new GraphQLNonNull(GraphQLString) },
    rating: { type: GraphQLFloat },
    total_deliveries: { type: new GraphQLNonNull(GraphQLInt) },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    updated_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Delivery Type Definition
export const DeliveryType = new GraphQLObjectType({
  name: 'Delivery',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    order_id: { type: new GraphQLNonNull(GraphQLID) },
    driver_id: { type: GraphQLID },
    pickup_time: { type: GraphQLString },
    delivery_time: { type: GraphQLString },
    status: { type: new GraphQLNonNull(GraphQLString) },
    tracking_url: { type: GraphQLString },
    notes: { type: GraphQLString },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    updated_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Notification Type Definition
export const NotificationType = new GraphQLObjectType({
  name: 'Notification',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    user_id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    message: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    data: { type: GraphQLString }, // JSON as string
    is_read: { type: new GraphQLNonNull(GraphQLBoolean) },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    read_at: { type: GraphQLString },
  },
});

// User Session Type Definition
export const UserSessionType = new GraphQLObjectType({
  name: 'UserSession',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    user_id: { type: new GraphQLNonNull(GraphQLID) },
    session_token: { type: new GraphQLNonNull(GraphQLString) },
    device_info: { type: GraphQLString },
    ip_address: { type: GraphQLString },
    user_agent: { type: GraphQLString },
    expires_at: { type: new GraphQLNonNull(GraphQLString) },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    last_activity: { type: GraphQLString },
  },
});

// Audit Log Type Definition
export const AuditLogType = new GraphQLObjectType({
  name: 'AuditLog',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    user_id: { type: GraphQLID },
    action: { type: new GraphQLNonNull(GraphQLString) },
    resource_type: { type: new GraphQLNonNull(GraphQLString) },
    resource_id: { type: GraphQLString },
    old_values: { type: GraphQLString }, // JSON as string
    new_values: { type: GraphQLString }, // JSON as string
    ip_address: { type: GraphQLString },
    user_agent: { type: GraphQLString },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
  },
});
