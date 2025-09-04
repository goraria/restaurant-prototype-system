# 📊 Complete GraphQL API Documentation

## 🚀 GraphQL Endpoint
- **URL**: http://localhost:8080/graphql
- **Playground**: http://localhost:8080/graphql (enabled in development)

## 📋 Database Schema Overview
Server hiện đã tích hợp đầy đủ với Prisma schema gồm:

### 🏢 Core Entities:
- **Users** (customers, staff, admins)
- **Organizations** (company level)
- **Restaurant Chains** (chain level)
- **Restaurants** (individual restaurants)

### 🍽️ Menu System:
- **Categories** (food categories)
- **Menus** (restaurant menus)
- **Menu Items** (dishes/drinks)

### 🪑 Reservation System:
- **Tables** (restaurant tables)
- **Reservations** (table bookings)
- **Table Orders** (dining sessions)

### 🛒 Order Management:
- **Orders** (customer orders)
- **Order Items** (order details)
- **Order Status History** (status tracking)

### 💳 Payment System:
- **Payments** (payment transactions)

### 👨‍💼 Staff Management:
- **Restaurant Staffs** (staff assignments)
- **Staff Schedules** (work schedules)
- **Staff Attendance** (attendance tracking)

### 🏪 Inventory:
- **Inventory Items** (stock items)
- **Inventory Transactions** (stock movements)
- **Recipes** (dish recipes)
- **Recipe Ingredients** (recipe components)

### 🎟️ Promotions:
- **Vouchers** (discount codes)
- **Voucher Usages** (usage history)
- **Promotions** (restaurant promotions)

### ⭐ Reviews:
- **Reviews** (customer reviews)

### 💬 Chat System:
- **Conversations** (chat conversations)
- **Messages** (chat messages)

### 📊 Analytics:
- **Revenue Reports** (analytics data)

## 🔍 Available GraphQL Queries

### 🏠 System Queries

#### Hello World
```graphql
query {
  hello
}
```

### 👤 User Queries

#### Get All Users (with filters)
```graphql
query GetUsers($role: String, $status: String, $search: String, $limit: Int, $offset: Int) {
  users(role: $role, status: $status, search: $search, limit: $limit, offset: $offset) {
    id
    clerk_id
    username
    email
    phone_number
    first_name
    last_name
    full_name
    avatar_url
    date_of_birth
    gender
    status
    role
    email_verified_at
    phone_verified_at
    total_orders
    total_spent
    loyalty_points
    created_at
    updated_at
  }
}
```

Variables:
```json
{
  "role": "customer",
  "status": "active",
  "search": "john",
  "limit": 20,
  "offset": 0
}
```

#### Get User by ID
```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    username
    email
    full_name
    avatar_url
    role
    status
    total_orders
    total_spent
    loyalty_points
    created_at
  }
}
```

### 🏢 Organization Queries

#### Get All Organizations
```graphql
query GetOrganizations {
  organizations {
    id
    name
    code
    description
    logo_url
    owner_id
    created_at
    updated_at
  }
}
```

#### Get Organization by ID
```graphql
query GetOrganization($id: ID!) {
  organization(id: $id) {
    id
    name
    code
    description
    logo_url
    owner_id
    created_at
    updated_at
  }
}
```

### 🏪 Restaurant Queries

#### Get All Restaurants (with filters)
```graphql
query GetRestaurants($organization_id: ID, $status: String, $search: String, $limit: Int, $offset: Int) {
  restaurants(organization_id: $organization_id, status: $status, search: $search, limit: $limit, offset: $offset) {
    id
    organization_id
    chain_id
    code
    name
    address
    phone_number
    email
    description
    logo_url
    cover_url
    opening_hours
    status
    manager_id
    created_at
    updated_at
  }
}
```

#### Get Restaurant by ID
```graphql
query GetRestaurant($id: ID!) {
  restaurant(id: $id) {
    id
    name
    address
    phone_number
    email
    description
    logo_url
    cover_url
    opening_hours
    status
    created_at
  }
}
```

### 🍽️ Menu Queries

#### Get Categories
```graphql
query GetCategories($parent_id: ID, $is_active: Boolean) {
  categories(parent_id: $parent_id, is_active: $is_active) {
    id
    parent_id
    name
    slug
    description
    image_url
    display_order
    is_active
    created_at
    updated_at
  }
}
```

#### Get Restaurant Menus
```graphql
query GetMenus($restaurant_id: ID!, $is_active: Boolean) {
  menus(restaurant_id: $restaurant_id, is_active: $is_active) {
    id
    restaurant_id
    name
    description
    image_url
    is_active
    display_order
    created_at
    updated_at
  }
}
```

#### Get Menu Items (with advanced filters)
```graphql
query GetMenuItems(
  $menu_id: ID,
  $category_id: ID,
  $is_available: Boolean,
  $is_featured: Boolean,
  $search: String,
  $min_price: Float,
  $max_price: Float,
  $limit: Int,
  $offset: Int
) {
  menuItems(
    menu_id: $menu_id,
    category_id: $category_id,
    is_available: $is_available,
    is_featured: $is_featured,
    search: $search,
    min_price: $min_price,
    max_price: $max_price,
    limit: $limit,
    offset: $offset
  ) {
    id
    menu_id
    category_id
    name
    description
    price
    image_url
    is_available
    is_featured
    preparation_time
    calories
    allergens
    dietary_info
    display_order
    created_at
    updated_at
  }
}
```

### 🪑 Table & Reservation Queries

#### Get Restaurant Tables
```graphql
query GetTables($restaurant_id: ID!, $status: String) {
  tables(restaurant_id: $restaurant_id, status: $status) {
    id
    restaurant_id
    table_number
    capacity
    location
    status
    qr_code
    created_at
    updated_at
  }
}
```

#### Get Reservations (with filters)
```graphql
query GetReservations(
  $restaurant_id: ID,
  $table_id: ID,
  $customer_id: ID,
  $status: String,
  $date_from: String,
  $date_to: String,
  $limit: Int,
  $offset: Int
) {
  reservations(
    restaurant_id: $restaurant_id,
    table_id: $table_id,
    customer_id: $customer_id,
    status: $status,
    date_from: $date_from,
    date_to: $date_to,
    limit: $limit,
    offset: $offset
  ) {
    id
    table_id
    customer_id
    customer_name
    customer_phone
    customer_email
    party_size
    reservation_date
    duration_hours
    status
    special_requests
    notes
    created_at
    updated_at
  }
}
```

### 🛒 Order Queries

#### Get Orders (with comprehensive filters)
```graphql
query GetOrders(
  $restaurant_id: ID,
  $customer_id: ID,
  $status: String,
  $order_type: String,
  $payment_status: String,
  $created_from: String,
  $created_to: String,
  $limit: Int,
  $offset: Int
) {
  orders(
    restaurant_id: $restaurant_id,
    customer_id: $customer_id,
    status: $status,
    order_type: $order_type,
    payment_status: $payment_status,
    created_from: $created_from,
    created_to: $created_to,
    limit: $limit,
    offset: $offset
  ) {
    id
    restaurant_id
    customer_id
    address_id
    order_code
    order_type
    total_amount
    delivery_fee
    discount_amount
    tax_amount
    final_amount
    status
    payment_status
    notes
    estimated_time
    created_at
    updated_at
  }
}
```

#### Get Single Order
```graphql
query GetOrder($id: ID!) {
  order(id: $id) {
    id
    restaurant_id
    customer_id
    order_code
    order_type
    total_amount
    final_amount
    status
    payment_status
    notes
    created_at
  }
}
```

#### Get Order Items
```graphql
query GetOrderItems($order_id: ID!) {
  orderItems(order_id: $order_id) {
    id
    order_id
    menu_item_id
    quantity
    unit_price
    total_price
    special_instructions
    cooking_status
    prepared_at
    served_at
    created_at
  }
}
```

### 💳 Payment Queries

#### Get Payments
```graphql
query GetPayments(
  $order_id: ID,
  $status: String,
  $method: String,
  $limit: Int,
  $offset: Int
) {
  payments(
    order_id: $order_id,
    status: $status,
    method: $method,
    limit: $limit,
    offset: $offset
  ) {
    id
    order_id
    amount
    method
    status
    provider
    transaction_id
    gateway_response
    processed_at
    created_at
    updated_at
  }
}
```

### 🏪 Inventory Queries

#### Get Inventory Items
```graphql
query GetInventoryItems(
  $restaurant_id: ID!,
  $low_stock: Boolean,
  $search: String,
  $limit: Int,
  $offset: Int
) {
  inventoryItems(
    restaurant_id: $restaurant_id,
    low_stock: $low_stock,
    search: $search,
    limit: $limit,
    offset: $offset
  ) {
    id
    restaurant_id
    name
    description
    unit
    quantity
    min_quantity
    max_quantity
    unit_cost
    supplier
    expiry_date
    created_at
    updated_at
  }
}
```

### 🎟️ Voucher & Promotion Queries

#### Get Vouchers
```graphql
query GetVouchers(
  $restaurant_id: ID,
  $is_active: Boolean,
  $code: String,
  $limit: Int,
  $offset: Int
) {
  vouchers(
    restaurant_id: $restaurant_id,
    is_active: $is_active,
    code: $code,
    limit: $limit,
    offset: $offset
  ) {
    id
    restaurant_id
    code
    name
    description
    discount_type
    discount_value
    min_order_value
    max_discount
    usage_limit
    used_count
    start_date
    end_date
    is_active
    created_at
    updated_at
  }
}
```

#### Get Promotions
```graphql
query GetPromotions(
  $restaurant_id: ID!,
  $is_active: Boolean,
  $type: String,
  $limit: Int,
  $offset: Int
) {
  promotions(
    restaurant_id: $restaurant_id,
    is_active: $is_active,
    type: $type,
    limit: $limit,
    offset: $offset
  ) {
    id
    restaurant_id
    name
    description
    type
    discount_value
    conditions
    applicable_items
    time_restrictions
    start_date
    end_date
    is_active
    created_at
    updated_at
  }
}
```

### ⭐ Review Queries

#### Get Reviews
```graphql
query GetReviews(
  $restaurant_id: ID,
  $customer_id: ID,
  $menu_item_id: ID,
  $rating: Int,
  $status: String,
  $limit: Int,
  $offset: Int
) {
  reviews(
    restaurant_id: $restaurant_id,
    customer_id: $customer_id,
    menu_item_id: $menu_item_id,
    rating: $rating,
    status: $status,
    limit: $limit,
    offset: $offset
  ) {
    id
    customer_id
    restaurant_id
    order_id
    menu_item_id
    rating
    title
    content
    photos
    status
    response
    responded_at
    created_at
    updated_at
  }
}
```

### 💬 Chat Queries

#### Get Conversations
```graphql
query GetConversations(
  $userId: String,
  $restaurant_id: ID,
  $type: String,
  $status: String,
  $limit: Int,
  $offset: Int
) {
  conversations(
    userId: $userId,
    restaurant_id: $restaurant_id,
    type: $type,
    status: $status,
    limit: $limit,
    offset: $offset
  ) {
    id
    restaurant_id
    customer_id
    staff_id
    type
    status
    title
    last_message_at
    created_at
    updated_at
  }
}
```

#### Get Single Conversation
```graphql
query GetConversation($id: ID!) {
  conversation(id: $id) {
    id
    restaurant_id
    customer_id
    staff_id
    type
    status
    title
    last_message_at
    created_at
    updated_at
  }
}
```

#### Get Messages
```graphql
query GetMessages(
  $conversationId: ID!,
  $limit: Int,
  $offset: Int
) {
  messages(
    conversationId: $conversationId,
    limit: $limit,
    offset: $offset
  ) {
    id
    conversation_id
    sender_id
    content
    message_type
    attachments
    is_read
    created_at
  }
}
```

## 🎯 Example Complex Queries

### Restaurant Dashboard Data
```graphql
query RestaurantDashboard($restaurant_id: ID!) {
  restaurant(id: $restaurant_id) {
    id
    name
    status
  }
  
  tables(restaurant_id: $restaurant_id) {
    id
    table_number
    capacity
    status
  }
  
  orders(restaurant_id: $restaurant_id, limit: 10) {
    id
    order_code
    status
    final_amount
    created_at
  }
  
  menuItems(menu_id: null, limit: 5, is_featured: true) {
    id
    name
    price
    is_available
  }
  
  inventoryItems(restaurant_id: $restaurant_id, low_stock: true, limit: 5) {
    id
    name
    quantity
    min_quantity
  }
}
```

### Customer Profile Data
```graphql
query CustomerProfile($customer_id: ID!) {
  user(id: $customer_id) {
    id
    username
    email
    full_name
    avatar_url
    total_orders
    total_spent
    loyalty_points
  }
  
  orders(customer_id: $customer_id, limit: 5) {
    id
    order_code
    status
    final_amount
    created_at
  }
  
  reservations(customer_id: $customer_id, limit: 5) {
    id
    customer_name
    party_size
    reservation_date
    status
  }
  
  conversations(userId: $customer_id, limit: 5) {
    id
    type
    status
    last_message_at
  }
  
  reviews(customer_id: $customer_id, limit: 5) {
    id
    rating
    title
    content
    created_at
  }
}
```

### Menu with Items
```graphql
query MenuWithItems($restaurant_id: ID!) {
  restaurant(id: $restaurant_id) {
    id
    name
  }
  
  categories(is_active: true) {
    id
    name
    image_url
  }
  
  menus(restaurant_id: $restaurant_id, is_active: true) {
    id
    name
    description
  }
  
  menuItems(limit: 50, is_available: true) {
    id
    name
    description
    price
    image_url
    is_featured
    preparation_time
    calories
    allergens
    dietary_info
  }
}
```

## 🔧 Available Filters & Arguments

### Common Arguments:
- `id: ID!` - Unique identifier
- `limit: Int` - Maximum results (default: 50)
- `offset: Int` - Skip results (default: 0)
- `search: String` - Text search
- `is_active: Boolean` - Active status filter

### Date Filters:
- `created_from: String` - Start date (ISO format)
- `created_to: String` - End date (ISO format)
- `date_from: String` - Start date
- `date_to: String` - End date

### Status Filters:
- `status: String` - Entity status
- `order_type: String` - Order type filter
- `payment_status: String` - Payment status
- `cooking_status: String` - Cooking status

### Numeric Filters:
- `min_price: Float` - Minimum price
- `max_price: Float` - Maximum price
- `rating: Int` - Review rating (1-5)

## 🚀 Next Steps

1. **Test Queries**: Sử dụng GraphQL Playground tại http://localhost:8080/graphql
2. **Add Mutations**: Implement CREATE, UPDATE, DELETE operations
3. **Add Subscriptions**: Real-time updates for orders, chat, etc.
4. **Authentication**: Add Clerk authentication to resolvers
5. **Pagination**: Implement cursor-based pagination
6. **Caching**: Add Redis caching for frequently accessed data
7. **Rate Limiting**: Implement query complexity analysis
8. **File Uploads**: Add file upload support for images

## 📚 Resources

- **GraphQL Playground**: http://localhost:8080/graphql
- **Socket.IO Chat**: ws://localhost:8080
- **Prisma Schema**: `/prisma/schema.prisma`
- **TypeScript Interfaces**: `/constants/interfaces.ts`
