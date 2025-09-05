# 🚀 API ROUTES EXAMPLES

Đây là các ví dụ API routes cho hệ thống quản lý nhà hàng, được thiết kế cho cả RESTful và GraphQL.

## 📱 Customer API Routes (Mobile App)

### 🏪 Restaurant & Menu
```typescript
// GET /api/restaurants
// Lấy danh sách nhà hàng
export async function GET() {
  const restaurants = await prisma.restaurants.findMany({
    include: {
      organizations: true,
      menus: {
        include: {
          menu_items: {
            where: { is_available: true },
            include: { categories: true }
          }
        }
      }
    }
  })
  return Response.json(restaurants)
}

// GET /api/restaurants/[id]/menu
// Lấy menu của nhà hàng
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const menu = await prisma.menus.findFirst({
    where: { restaurant_id: params.id, is_active: true },
    include: {
      menu_items: {
        where: { is_available: true },
        include: {
          categories: true,
          reviews: {
            select: {
              rating: true,
              content: true,
              customers: {
                select: { full_name: true, avatar_url: true }
              }
            }
          }
        }
      }
    }
  })
  return Response.json(menu)
}
```

### 🪑 Table Reservation
```typescript
// POST /api/reservations
// Đặt bàn
export async function POST(request: Request) {
  const data = await request.json()
  
  // Check table availability
  const table = await prisma.tables.findFirst({
    where: {
      id: data.table_id,
      status: 'available'
    }
  })
  
  if (!table) {
    return Response.json({ error: 'Table not available' }, { status: 400 })
  }
  
  const reservation = await prisma.reservations.create({
    data: {
      table_id: data.table_id,
      customer_id: data.customer_id,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      party_size: data.party_size,
      reservation_date: new Date(data.reservation_date),
      special_requests: data.special_requests,
      status: 'pending'
    }
  })
  
  // Update table status
  await prisma.tables.update({
    where: { id: data.table_id },
    data: { status: 'reserved' }
  })
  
  return Response.json(reservation)
}

// GET /api/reservations/customer/[customer_id]
// Lấy danh sách đặt bàn của khách hàng
export async function GET(request: Request, { params }: { params: { customer_id: string } }) {
  const reservations = await prisma.reservations.findMany({
    where: { customer_id: params.customer_id },
    include: {
      tables: {
        include: {
          restaurants: {
            select: { name: true, address: true, phone_number: true }
          }
        }
      }
    },
    orderBy: { reservation_date: 'desc' }
  })
  return Response.json(reservations)
}
```

### 🛒 Order Management
```typescript
// POST /api/orders
// Tạo đơn hàng
export async function POST(request: Request) {
  const data = await request.json()
  
  const order = await prisma.$transaction(async (tx) => {
    // Create order
    const newOrder = await tx.orders.create({
      data: {
        user_id: data.user_id,
        order_code: `ORD-${Date.now()}`,
        total_amount: data.total_amount,
        final_amount: data.final_amount,
        status: 'pending',
        payment_method: data.payment_method,
        payment_status: 'pending'
      }
    })
    
    // Create order items
    for (const item of data.items) {
      await tx.order_items.create({
        data: {
          order_id: newOrder.id,
          product_id: item.product_id,
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          price_at_purchase: item.price,
          product_name: item.name,
          special_instructions: item.special_instructions,
          cooking_status: 'pending'
        }
      })
    }
    
    // Create table order if dining in
    if (data.table_id) {
      await tx.table_orders.create({
        data: {
          table_id: data.table_id,
          order_id: newOrder.id,
          session_code: `TBL-${Date.now()}`,
          status: 'active'
        }
      })
      
      // Update table status
      await tx.tables.update({
        where: { id: data.table_id },
        data: { status: 'occupied' }
      })
    }
    
    return newOrder
  })
  
  return Response.json(order)
}

// GET /api/orders/[id]/status
// Theo dõi trạng thái đơn hàng
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const order = await prisma.orders.findUnique({
    where: { id: params.id },
    include: {
      order_items: {
        include: {
          menu_item: {
            select: { name: true, image_url: true }
          }
        }
      },
      order_status_history: {
        orderBy: { created_at: 'desc' }
      }
    }
  })
  return Response.json(order)
}
```

### 💳 Payment Processing
```typescript
// POST /api/payments/process
// Xử lý thanh toán
export async function POST(request: Request) {
  const { order_id, method, amount, provider } = await request.json()
  
  const payment = await prisma.$transaction(async (tx) => {
    // Create payment record
    const newPayment = await tx.payments.create({
      data: {
        order_id,
        amount,
        method,
        provider,
        status: 'processing',
        transaction_id: `TXN-${Date.now()}`
      }
    })
    
    // Simulate payment processing
    // In real app, integrate with MoMo, ZaloPay, VNPay, etc.
    const success = await processPaymentWithGateway(provider, amount, newPayment.transaction_id)
    
    if (success) {
      // Update payment status
      await tx.payments.update({
        where: { id: newPayment.id },
        data: { 
          status: 'completed',
          processed_at: new Date()
        }
      })
      
      // Update order status
      await tx.orders.update({
        where: { id: order_id },
        data: { 
          payment_status: 'completed',
          status: 'confirmed'
        }
      })
    } else {
      await tx.payments.update({
        where: { id: newPayment.id },
        data: { status: 'failed' }
      })
    }
    
    return newPayment
  })
  
  return Response.json(payment)
}

async function processPaymentWithGateway(provider: string, amount: number, transactionId: string) {
  // Mock payment processing
  // Replace with actual gateway integration
  switch (provider) {
    case 'momo':
      return await processMoMoPayment(amount, transactionId)
    case 'zalopay':
      return await processZaloPayment(amount, transactionId)
    case 'vnpay':
      return await processVNPayment(amount, transactionId)
    default:
      return true // Cash payment
  }
}
```

## 👨‍💼 Staff API Routes (Web Interface)

### 🍳 Kitchen Management
```typescript
// GET /api/kitchen/orders
// Lấy đơn hàng cho bếp
export async function GET() {
  const orders = await prisma.order_items.findMany({
    where: {
      cooking_status: { in: ['pending', 'preparing', 'cooking'] }
    },
    include: {
      order: {
        include: {
          table_orders: {
            include: {
              tables: {
                select: { table_number: true }
              }
            }
          }
        }
      },
      menu_item: {
        select: { name: true, description: true }
      }
    },
    orderBy: { created_at: 'asc' }
  })
  return Response.json(orders)
}

// PUT /api/kitchen/orders/[id]/status
// Cập nhật trạng thái chế biến
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { cooking_status } = await request.json()
  
  const updatedItem = await prisma.order_items.update({
    where: { id: params.id },
    data: { 
      cooking_status,
      ...(cooking_status === 'ready' && { prepared_at: new Date() }),
      ...(cooking_status === 'served' && { served_at: new Date() })
    }
  })
  
  // Check if all items in order are ready
  if (cooking_status === 'served') {
    const allItems = await prisma.order_items.findMany({
      where: { order_id: updatedItem.order_id }
    })
    
    const allServed = allItems.every(item => item.cooking_status === 'served')
    
    if (allServed) {
      await prisma.orders.update({
        where: { id: updatedItem.order_id },
        data: { status: 'completed' }
      })
    }
  }
  
  return Response.json(updatedItem)
}
```

### 🪑 Table Management
```typescript
// GET /api/tables/restaurant/[restaurant_id]
// Lấy danh sách bàn
export async function GET(request: Request, { params }: { params: { restaurant_id: string } }) {
  const tables = await prisma.tables.findMany({
    where: { restaurant_id: params.restaurant_id },
    include: {
      reservations: {
        where: {
          status: { in: ['confirmed', 'seated'] },
          reservation_date: {
            gte: new Date(),
            lte: new Date(Date.now() + 24 * 60 * 60 * 1000)
          }
        }
      },
      table_orders: {
        where: { status: 'active' },
        include: {
          orders: {
            include: {
              order_items: {
                select: { cooking_status: true }
              }
            }
          }
        }
      }
    },
    orderBy: { table_number: 'asc' }
  })
  return Response.json(tables)
}

// PUT /api/tables/[id]/status
// Cập nhật trạng thái bàn
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { status } = await request.json()
  
  const table = await prisma.tables.update({
    where: { id: params.id },
    data: { status }
  })
  
  return Response.json(table)
}
```

## 🏢 Admin API Routes (Management Dashboard)

### 📊 Analytics & Reports
```typescript
// GET /api/analytics/revenue/[restaurant_id]
// Báo cáo doanh thu
export async function GET(request: Request, { params }: { params: { restaurant_id: string } }) {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || 'daily'
  const startDate = searchParams.get('start_date')
  const endDate = searchParams.get('end_date')
  
  const reports = await prisma.revenue_reports.findMany({
    where: {
      restaurant_id: params.restaurant_id,
      report_type: period,
      ...(startDate && endDate && {
        report_date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      })
    },
    orderBy: { report_date: 'desc' }
  })
  
  return Response.json(reports)
}

// GET /api/analytics/popular-items/[restaurant_id]
// Món ăn bán chạy
export async function GET(request: Request, { params }: { params: { restaurant_id: string } }) {
  const popularItems = await prisma.$queryRaw`
    SELECT 
      mi.id,
      mi.name,
      mi.price,
      SUM(oi.quantity) as total_sold,
      COUNT(DISTINCT oi.order_id) as order_count,
      AVG(r.rating) as avg_rating
    FROM menu_items mi
    JOIN order_items oi ON oi.menu_item_id = mi.id
    JOIN orders o ON o.id = oi.order_id
    JOIN table_orders tord ON tord.order_id = o.id
    JOIN tables t ON t.id = tord.table_id
    LEFT JOIN reviews r ON r.menu_item_id = mi.id
    WHERE t.restaurant_id = ${params.restaurant_id}
    AND o.status = 'completed'
    AND DATE(o.created_at) >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY mi.id, mi.name, mi.price
    ORDER BY total_sold DESC
    LIMIT 10
  `
  
  return Response.json(popularItems)
}
```

### 🏪 Inventory Management
```typescript
// GET /api/inventory/restaurant/[restaurant_id]
// Quản lý kho
export async function GET(request: Request, { params }: { params: { restaurant_id: string } }) {
  const inventory = await prisma.inventory_items.findMany({
    where: { restaurant_id: params.restaurant_id },
    include: {
      inventory_transactions: {
        orderBy: { created_at: 'desc' },
        take: 5
      }
    }
  })
  
  return Response.json(inventory)
}

// GET /api/inventory/low-stock/[restaurant_id]
// Cảnh báo hết hàng
export async function GET(request: Request, { params }: { params: { restaurant_id: string } }) {
  const lowStockItems = await prisma.inventory_items.findMany({
    where: {
      restaurant_id: params.restaurant_id,
      quantity: {
        lte: prisma.inventory_items.fields.min_quantity
      }
    }
  })
  
  return Response.json(lowStockItems)
}

// PUT /api/inventory/[id]/adjust
// Điều chỉnh số lượng kho
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { quantity, note } = await request.json()
  
  const item = await prisma.$transaction(async (tx) => {
    const currentItem = await tx.inventory_items.findUnique({
      where: { id: params.id }
    })
    
    if (!currentItem) throw new Error('Item not found')
    
    const updatedItem = await tx.inventory_items.update({
      where: { id: params.id },
      data: { quantity }
    })
    
    // Create transaction record
    await tx.inventory_transactions.create({
      data: {
        inventory_item_id: params.id,
        type: quantity > currentItem.quantity ? 'import' : 'export',
        quantity: Math.abs(quantity - currentItem.quantity),
        note: note || 'Manual adjustment'
      }
    })
    
    return updatedItem
  })
  
  return Response.json(item)
}
```

## 🔄 GraphQL Schema Example

```graphql
type Restaurant {
  id: ID!
  name: String!
  address: String!
  phone_number: String
  tables: [Table!]!
  menus: [Menu!]!
  revenue_reports: [RevenueReport!]!
}

type Table {
  id: ID!
  table_number: String!
  capacity: Int!
  status: TableStatus!
  reservations: [Reservation!]!
  current_order: TableOrder
}

type Menu {
  id: ID!
  name: String!
  items: [MenuItem!]!
}

type MenuItem {
  id: ID!
  name: String!
  description: String
  price: Float!
  image_url: String
  is_available: Boolean!
  category: Category
  reviews: [Review!]!
  avg_rating: Float
}

type Order {
  id: ID!
  order_code: String!
  status: OrderStatus!
  total_amount: Float!
  items: [OrderItem!]!
  payment: Payment
  table_order: TableOrder
}

type Query {
  restaurants: [Restaurant!]!
  restaurant(id: ID!): Restaurant
  menu(restaurant_id: ID!): Menu
  orders(customer_id: ID!): [Order!]!
  order(id: ID!): Order
  tables(restaurant_id: ID!): [Table!]!
  popularItems(restaurant_id: ID!, days: Int = 30): [PopularItem!]!
}

type Mutation {
  createReservation(input: ReservationInput!): Reservation!
  createOrder(input: OrderInput!): Order!
  updateOrderStatus(id: ID!, status: OrderStatus!): Order!
  updateCookingStatus(order_item_id: ID!, status: CookingStatus!): OrderItem!
  processPayment(input: PaymentInput!): Payment!
}

type Subscription {
  orderStatusUpdated(restaurant_id: ID!): Order!
  newOrder(restaurant_id: ID!): Order!
  tableStatusChanged(restaurant_id: ID!): Table!
}
```

## 🚀 Usage Examples

### Mobile App - Order Flow
```typescript
// 1. Browse menu
const menu = await fetch('/api/restaurants/123/menu')

// 2. Create order
const order = await fetch('/api/orders', {
  method: 'POST',
  body: JSON.stringify({
    user_id: 'customer-id',
    table_id: 'table-id', // if dining in
    items: [
      { menu_item_id: 'item1', quantity: 2, price: 85000 }
    ],
    total_amount: 170000,
    final_amount: 170000,
    payment_method: 'momo'
  })
})

// 3. Process payment
const payment = await fetch('/api/payments/process', {
  method: 'POST',
  body: JSON.stringify({
    order_id: order.id,
    method: 'momo',
    amount: 170000,
    provider: 'momo'
  })
})

// 4. Track order status
const status = await fetch(`/api/orders/${order.id}/status`)
```

### Staff App - Kitchen Management
```typescript
// Get pending orders
const orders = await fetch('/api/kitchen/orders')

// Update cooking status
await fetch(`/api/kitchen/orders/${itemId}/status`, {
  method: 'PUT',
  body: JSON.stringify({ cooking_status: 'cooking' })
})
```

### Admin Dashboard - Analytics
```typescript
// Get revenue report
const revenue = await fetch('/api/analytics/revenue/restaurant-id?period=daily')

// Get popular items
const popular = await fetch('/api/analytics/popular-items/restaurant-id')

// Check low stock
const lowStock = await fetch('/api/inventory/low-stock/restaurant-id')
```

---

✨ **Kết luận**: Các API routes được thiết kế toàn diện cho tất cả các use cases của hệ thống quản lý nhà hàng, từ khách hàng đặt món đến quản lý kho và báo cáo doanh thu.
