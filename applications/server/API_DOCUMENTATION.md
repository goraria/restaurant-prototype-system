# API Documentation - Restaurant Management System

## Overview
Complete REST API backend implementation with CRUD operations for restaurant management system using Prisma ORM, Express.js, TypeScript, and Clerk authentication.

## Architecture
```
applications/server/
├── services/           # Business logic layer
│   ├── base.service.ts     # Abstract base service with common CRUD operations
│   ├── user.service.ts     # User management (Clerk integration)
│   ├── restaurant.service.ts # Restaurant operations
│   ├── order.service.ts    # Order processing and management
│   └── menu.service.ts     # Menu and menu item management
├── controllers/        # Request handling layer
│   ├── base.controller.ts  # Abstract base controller with common functionality
│   ├── user.controller.ts  # User endpoint handlers
│   ├── restaurant.controller.ts # Restaurant endpoint handlers
│   ├── order.controller.ts # Order endpoint handlers
│   └── menu.controller.ts  # Menu endpoint handlers
├── routes/            # API route definitions
│   ├── index.ts           # Main API router (/api/v1)
│   ├── user.routes.ts     # User routes
│   ├── restaurant.routes.ts # Restaurant routes
│   ├── order.routes.ts    # Order routes
│   └── menu.routes.ts     # Menu routes
└── middlewares/       # Custom middleware
    └── error.middleware.ts # Error handling middleware
```

## Features

### Base Architecture
- **Service Layer Pattern**: Abstract base service with common CRUD operations
- **Controller Layer Pattern**: Abstract base controller with validation and response handling
- **Error Handling**: Comprehensive error middleware with custom error types
- **Validation**: Zod schema validation for all inputs
- **Pagination**: Built-in pagination support for list endpoints
- **Filtering**: Dynamic filtering capabilities
- **UUID Validation**: All IDs validated as proper UUIDs

### Authentication Integration
- **Clerk Authentication**: Integrated with Clerk for user management
- **No Password Fields**: User model designed for external auth service
- **User Roles**: Support for customer, staff, manager, admin, super_admin roles

### Advanced Features
- **Search Functionality**: Full-text search across multiple fields
- **Statistics Endpoints**: Analytics and reporting endpoints
- **Bulk Operations**: Support for bulk create/update operations
- **Relationship Handling**: Proper foreign key relationships and joins
- **Status Management**: Order status tracking, restaurant operational status
- **Inventory Management**: Menu item availability tracking

## API Endpoints

### Base URL
```
http://localhost:PORT/api/v1
```

### Users API (`/api/v1/users`)
```
GET    /users                    # List users with pagination/filtering
GET    /users/:id               # Get user by ID
GET    /users/email/:email      # Get user by email
GET    /users/clerk/:clerkId    # Get user by Clerk ID
POST   /users                   # Create new user
PUT    /users/:id               # Update user
DELETE /users/:id               # Delete user
GET    /users/search            # Search users
GET    /users/stats             # User statistics
GET    /users/me                # Get current user profile
PUT    /users/me                # Update current user profile
```

### Restaurants API (`/api/v1/restaurants`)
```
GET    /restaurants             # List restaurants with pagination/filtering
GET    /restaurants/:id         # Get restaurant by ID
POST   /restaurants             # Create new restaurant
PUT    /restaurants/:id         # Update restaurant
DELETE /restaurants/:id         # Delete restaurant
GET    /restaurants/search      # Search restaurants
GET    /restaurants/stats       # Restaurant statistics
GET    /restaurants/operational # Get operational restaurants
PUT    /restaurants/:id/status  # Update restaurant status
GET    /restaurants/:id/hours   # Get opening hours
PUT    /restaurants/:id/hours   # Update opening hours
```

### Orders API (`/api/v1/orders`)
```
GET    /orders                  # List orders with pagination/filtering
GET    /orders/:id              # Get order by ID
POST   /orders                  # Create new order
PUT    /orders/:id              # Update order
DELETE /orders/:id              # Delete order
GET    /orders/search           # Search orders
GET    /orders/stats            # Order statistics
PUT    /orders/:id/status       # Update order status
GET    /orders/user/:userId     # Get orders by user
GET    /orders/restaurant/:restaurantId # Get orders by restaurant
```

### Menus API (`/api/v1/menus`)
```
GET    /menus                   # List menus with pagination/filtering
GET    /menus/:id               # Get menu by ID
POST   /menus                   # Create new menu
PUT    /menus/:id               # Update menu
DELETE /menus/:id               # Delete menu
GET    /menus/search            # Search menus
GET    /menus/restaurant/:restaurantId # Get menus by restaurant
GET    /menu-items              # List menu items
GET    /menu-items/:id          # Get menu item by ID
POST   /menu-items              # Create new menu item
PUT    /menu-items/:id          # Update menu item
DELETE /menu-items/:id          # Delete menu item
GET    /menu-items/featured     # Get featured menu items
PUT    /menu-items/:id/availability # Update item availability
```

## Query Parameters

### Pagination
```
?page=1&limit=10
```

### Filtering
```
?role=customer&status=active
?search=restaurant name
?startDate=2024-01-01&endDate=2024-12-31
```

### Sorting
```
?sortBy=created_at&sortOrder=desc
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Validation error details"]
}
```

## Data Models

### User
```typescript
{
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
  role: 'customer' | 'staff' | 'manager' | 'admin' | 'super_admin';
  status: 'active' | 'inactive' | 'suspended';
  email_verified: boolean;
  phone_verified: boolean;
  created_at: Date;
  updated_at: Date;
}
```

### Restaurant
```typescript
{
  id: string;
  name: string;
  slug: string;
  description?: string;
  email?: string;
  phone_number?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  status: 'active' | 'inactive' | 'maintenance';
  logo_url?: string;
  cover_image_url?: string;
  rating?: number;
  delivery_fee?: number;
  minimum_order?: number;
  estimated_delivery_time?: number;
  organization_id?: string;
  chain_id?: string;
  manager_id?: string;
  created_at: Date;
  updated_at: Date;
}
```

### Order
```typescript
{
  id: string;
  user_id: string;
  restaurant_id: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
  cooking_status?: 'pending' | 'preparing' | 'ready';
  total_amount: number;
  subtotal: number;
  delivery_fee?: number;
  discount_amount?: number;
  tax_amount?: number;
  notes?: string;
  delivery_address?: string;
  estimated_delivery_time?: Date;
  created_at: Date;
  updated_at: Date;
}
```

### Menu & MenuItem
```typescript
// Menu
{
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  display_order?: number;
  created_at: Date;
  updated_at: Date;
}

// MenuItem
{
  id: string;
  menu_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available: boolean;
  is_featured: boolean;
  preparation_time?: number;
  calories?: number;
  category_id?: string;
  created_at: Date;
  updated_at: Date;
}
```

## Error Handling

The API uses consistent error handling with the following HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Integration Status

✅ **Completed Features:**
- Complete CRUD services for all entities
- Full controller implementation with validation
- All API routes configured
- Error handling middleware
- Integration with existing Express app
- Clerk authentication support
- TypeScript compilation successful

🔧 **Next Steps:**
- Add authentication middleware
- Implement role-based access control
- Add API rate limiting
- Set up comprehensive testing
- Add API documentation generation
- Implement caching layer

## Testing

To test the API endpoints, you can use tools like Postman, cURL, or any HTTP client:

```bash
# Example: Get all users
curl -X GET "http://localhost:PORT/api/v1/users?page=1&limit=10"

# Example: Create a new user
curl -X POST "http://localhost:PORT/api/v1/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "customer"
  }'
```

## Notes

- All endpoints return JSON responses
- All IDs must be valid UUIDs
- Pagination is supported on all list endpoints
- Search functionality is available across multiple fields
- The API is designed to work with Clerk authentication system
- Error messages are localized in Vietnamese by default
