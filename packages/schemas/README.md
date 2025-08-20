# @repo/schemas

A comprehensive collection of Zod validation schemas for the restaurant management system. This package provides type-safe validation schemas that can be used across Next.js, Express, Vite, and Expo applications.

## 🚀 Features

- **Type-Safe Validation**: All schemas are built with Zod for runtime type checking
- **Comprehensive Coverage**: Schemas for all database entities (Users, Orders, Inventory, Staff, etc.)
- **Cross-Platform**: Compatible with Next.js, Express, Vite, and Expo
- **Consistent API**: Standardized create/update/full schema patterns
- **Helper Utilities**: Pre-built functions for pagination, API responses, and validation

## 📦 Installation

```bash
npm install @repo/schemas
# or
yarn add @repo/schemas
# or
pnpm add @repo/schemas
```

## 🏗️ Schema Categories

### Core Schemas (`core.ts`)
Basic entities and shared utilities:
- User management (Users, Organizations, Restaurants)
- Menu structure (Categories, Menus, Menu Items)
- Table and reservation management
- Base validation schemas (UUID, Email, Phone, Decimal)
- Comprehensive enums for all status types

### Order Management (`orders.ts`)
Complete order lifecycle:
- Customer addresses
- Orders and order items
- Order status tracking
- Payment processing
- Table order sessions

### Inventory & Recipes (`inventory.ts`)
Restaurant operations:
- Inventory management
- Recipe creation and ingredient tracking
- Menu item recipe relationships
- Supplier management
- Purchase orders

### Staff Management (`staff.ts`)
Employee operations:
- Staff profiles and positions
- Scheduling and time tracking
- Payroll processing
- Performance reviews
- Training records

### Analytics & Support (`analytics.ts`)
Business intelligence:
- Customer reviews and ratings
- Support ticket system
- Analytics and metrics
- Promotions and discounts
- Notifications

## 🎯 Usage Examples

### Basic Schema Validation

```typescript
import { UserCreateSchema, UserType } from '@repo/schemas';

// Validate user input
const userData = {
  email: 'user@example.com',
  password: 'securepassword',
  full_name: 'John Doe'
};

const result = UserCreateSchema.safeParse(userData);
if (result.success) {
  // Data is valid, use result.data
  const validUser = result.data;
} else {
  // Handle validation errors
  console.error(result.error.errors);
}
```

### API Response Validation

```typescript
import { createApiResponseSchema, RestaurantSchema } from '@repo/schemas';

// Create a typed API response schema
const RestaurantApiResponse = createApiResponseSchema(RestaurantSchema);

// Use in API endpoint
async function getRestaurant(id: string) {
  const restaurant = await fetchRestaurant(id);
  return RestaurantApiResponse.parse({
    success: true,
    data: restaurant,
    timestamp: new Date().toISOString()
  });
}
```

### Pagination with Search

```typescript
import { 
  createPaginatedSchema, 
  createSearchSchema, 
  MenuItemSchema 
} from '@repo/schemas';

// Create paginated menu items response
const PaginatedMenuItems = createPaginatedSchema(MenuItemSchema);

// Create search schema with filters
const MenuItemSearch = createSearchSchema({
  category_id: z.string().uuid().optional(),
  is_available: z.boolean().optional(),
  price_min: z.number().optional(),
  price_max: z.number().optional(),
});

// Use in API endpoint
async function searchMenuItems(params: unknown) {
  const searchParams = MenuItemSearch.parse(params);
  const results = await searchMenuItemsInDB(searchParams);
  
  return PaginatedMenuItems.parse({
    data: results.items,
    meta: {
      page: searchParams.page,
      limit: searchParams.limit,
      total: results.total,
      totalPages: Math.ceil(results.total / searchParams.limit),
      hasNext: searchParams.page * searchParams.limit < results.total,
      hasPrev: searchParams.page > 1,
    }
  });
}
```

### Bulk Operations

```typescript
import { BulkCreateSchema, MenuItemCreateSchema } from '@repo/schemas';

// Bulk create menu items
const BulkMenuItemCreate = BulkCreateSchema(MenuItemCreateSchema);

const bulkData = {
  items: [
    { name: 'Pizza Margherita', price: 12.99, category_id: 'uuid-here' },
    { name: 'Caesar Salad', price: 8.99, category_id: 'uuid-here' },
    // ... more items
  ]
};

const validatedBulk = BulkMenuItemCreate.parse(bulkData);
await createMenuItemsInBulk(validatedBulk.items);
```

### Error Handling

```typescript
import { formatValidationErrors } from '@repo/schemas';

try {
  const validData = UserCreateSchema.parse(userData);
} catch (error) {
  if (error instanceof z.ZodError) {
    const fieldErrors = formatValidationErrors(error);
    // Returns: { "email": "Invalid email format", "password": "String must contain at least 8 characters" }
    return { success: false, errors: fieldErrors };
  }
}
```

## 🔧 Platform-Specific Usage

### Next.js (Client & Server)

```typescript
// app/api/users/route.ts
import { UserCreateSchema, UserSchema } from '@repo/schemas';

export async function POST(request: Request) {
  const body = await request.json();
  const userData = UserCreateSchema.parse(body);
  
  const user = await createUser(userData);
  return Response.json(UserSchema.parse(user));
}

// components/UserForm.tsx
import { UserCreateSchema } from '@repo/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export function UserForm() {
  const form = useForm({
    resolver: zodResolver(UserCreateSchema)
  });
  
  // Form automatically validates using Zod schema
}
```

### Express.js

```typescript
// middleware/validation.ts
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: result.error.errors
        }
      });
    }
    req.body = result.data;
    next();
  };
}

// routes/users.ts
import { UserCreateSchema } from '@repo/schemas';
import { validateBody } from '../middleware/validation';

router.post('/users', validateBody(UserCreateSchema), async (req, res) => {
  // req.body is now typed and validated
  const user = await createUser(req.body);
  res.json({ success: true, data: user });
});
```

### Vite (Admin Panel)

```typescript
// stores/api.ts
import { UserSchema, RestaurantSchema } from '@repo/schemas';

export const apiService = {
  async getUsers() {
    const response = await fetch('/api/users');
    const data = await response.json();
    return z.array(UserSchema).parse(data);
  },
  
  async getRestaurant(id: string) {
    const response = await fetch(`/api/restaurants/${id}`);
    const data = await response.json();
    return RestaurantSchema.parse(data);
  }
};
```

### Expo (Mobile App)

```typescript
// services/api.ts
import { MenuItemSchema, OrderCreateSchema } from '@repo/schemas';

export class ApiService {
  async getMenuItems(restaurantId: string) {
    const response = await fetch(`${API_BASE}/restaurants/${restaurantId}/menu-items`);
    const data = await response.json();
    return z.array(MenuItemSchema).parse(data.data);
  }
  
  async createOrder(orderData: unknown) {
    const validOrder = OrderCreateSchema.parse(orderData);
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validOrder)
    });
    return response.json();
  }
}
```

## 🎨 Schema Patterns

All schemas follow consistent patterns:

### Entity Schema Structure
- **BaseSchema**: Core fields without system fields
- **CreateSchema**: For creating new entities
- **UpdateSchema**: For updating existing entities (all fields optional)
- **Schema**: Full entity with system fields (id, created_at, updated_at)

### Type Exports
Each schema file exports corresponding TypeScript types:
```typescript
export type UserType = z.infer<typeof UserSchema>;
export type UserCreateType = z.infer<typeof UserCreateSchema>;
export type UserUpdateType = z.infer<typeof UserUpdateSchema>;
```

## 🔍 Available Schemas

### Core Entities
- Users, Organizations, Restaurants
- Categories, Menus, Menu Items
- Tables, Reservations

### Order Management
- Addresses, Orders, Order Items
- Order Status History, Payments
- Table Orders

### Inventory
- Inventory Items, Transactions
- Recipes, Recipe Ingredients
- Menu Item Recipes, Suppliers
- Purchase Orders

### Staff Management
- Staff, Schedules, Time Tracking
- Payroll, Performance Reviews
- Training Records

### Business Intelligence
- Reviews, Support Tickets
- Analytics, Promotions
- Notifications

## 🛠️ Development

```bash
# Build the package
npm run build

# Watch mode for development
npm run dev

# Clean build artifacts
npm run clean
```

## 📄 License

MIT - See LICENSE.md for details

## 🤝 Contributing

1. Follow the existing schema patterns
2. Include comprehensive TypeScript types
3. Add validation for all fields
4. Update this README with new schemas
5. Test across all target platforms

---

**Built with ❤️ for comprehensive restaurant management**
