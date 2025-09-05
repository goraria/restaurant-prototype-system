# Hybrid Authentication Usage Guide

## Overview
Hệ thống hybrid authentication giải quyết vấn đề giới hạn 5 thành viên của Clerk organization bằng cách tách biệt:
- **Clerk Authentication**: Cho quản lý cấp cao (owners, managers) - tối đa 5 người
- **Database Authentication**: Cho nhân viên restaurant (staff) - không giới hạn

## API Endpoints

### 1. Staff Login (Database Authentication)
```http
POST /api/hybrid/staff/login
Content-Type: application/json

{
  "email": "staff@restaurant.com",
  "password": "staffPassword123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {...},
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "access_type": "database",
  "restaurants": [...]
}
```

### 2. Create Staff Account (Clerk Admin Only)
```http
POST /api/hybrid/staff/create
Content-Type: application/json
Authorization: Bearer <clerk-token>

{
  "clerkUserId": "user_clerk123",
  "userData": {
    "email": "newstaff@restaurant.com", 
    "password": "tempPassword123",
    "first_name": "John",
    "last_name": "Doe", 
    "username": "johndoe"
  },
  "restaurantId": "rest_123",
  "role": "server",
  "hourlyRate": 25000
}
```

### 3. Get Restaurant Staff (Clerk Admin Only)
```http
GET /api/hybrid/restaurant/{restaurantId}/staff?clerkUserId=user_clerk123
Authorization: Bearer <clerk-token>
```

### 4. Update Staff Member
```http
PUT /api/hybrid/staff/{staffId}
Content-Type: application/json

{
  "clerkUserId": "user_clerk123",
  "updates": {
    "role": "shift_manager",
    "status": "active",
    "hourly_rate": 30000
  }
}
```

## Authentication Flows

### Clerk Users (Business Management)
1. **Login through Clerk**: Frontend handles Clerk authentication
2. **Get Clerk JWT**: Extract user ID from Clerk session
3. **API Access**: Use `HybridAuthService.authenticateClerkUser(clerkUserId)`
4. **Restaurant Management**: Can create/manage staff, view reports, settings

### Staff Users (Operations)  
1. **Database Login**: Staff enters email/password on custom login form
2. **Staff JWT**: Receive database-generated JWT token
3. **Restaurant Operations**: Access POS, take orders, manage inventory
4. **Limited Scope**: Only access assigned restaurant(s)

## Integration Examples

### Frontend - Clerk User Dashboard
```typescript
// For Clerk organization owners/managers
const clerkUser = useUser(); // Clerk hook
const restaurantId = 'rest_123';

// Get restaurant staff
const getStaff = async () => {
  const response = await fetch(
    `/api/hybrid/restaurant/${restaurantId}/staff?clerkUserId=${clerkUser.id}`,
    {
      headers: {
        'Authorization': `Bearer ${await getToken()}`
      }
    }
  );
  return response.json();
};

// Create new staff member
const createStaff = async (staffData) => {
  const response = await fetch('/api/hybrid/staff/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await getToken()}`
    },
    body: JSON.stringify({
      clerkUserId: clerkUser.id,
      userData: staffData,
      restaurantId,
      role: 'server',
      hourlyRate: 25000
    })
  });
  return response.json();
};
```

### Frontend - Staff Login
```typescript
// For restaurant staff members
const StaffLogin = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const response = await fetch('/api/hybrid/staff/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    const result = await response.json();
    
    if (result.success) {
      // Store staff token
      localStorage.setItem('staffToken', result.token);
      // Redirect to staff dashboard
      window.location.href = '/staff/dashboard';
    } else {
      alert(result.error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) => setCredentials({
          ...credentials,
          email: e.target.value
        })}
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials({
          ...credentials,
          password: e.target.value
        })}
      />
      <button type="submit">Login as Staff</button>
    </form>
  );
};
```

### Backend - Protected Staff Routes
```typescript
import { verifyStaffAccess } from '../routes/authRoutes';

// Apply middleware to staff-only routes
router.use('/staff-operations/*', verifyStaffAccess);

// Staff can take orders
router.post('/staff-operations/orders', async (req, res) => {
  // Staff token already verified by middleware
  const order = await createOrder(req.body);
  res.json(order);
});
```

## Database Schema Changes

### Users Table - Added password_hash field:
```sql
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);
```

### Migration Applied:
```bash
npx prisma migrate dev --name add_password_hash_field
```

## RLS Policies

### Hybrid RLS (supabase/rls-hybrid.sql)
- Supports both Clerk JWT and database JWT authentication
- Functions: `get_current_user_id()`, `has_restaurant_access()`, `is_restaurant_staff()`
- Policies for users, organizations, restaurants, restaurant_staffs tables

### Simple RLS (supabase/rls-simple.sql)  
- Clerk-only authentication
- Basic policies for users and organizations

## Security Considerations

### Staff Password Management
- Passwords hashed with bcrypt (10 rounds)
- Staff accounts have `clerk_id = null`
- Staff JWT tokens expire in 8 hours
- Staff can only access assigned restaurants

### Access Control
- Clerk users can manage organizations and restaurants
- Staff users limited to operational tasks
- Cross-restaurant access prevented
- Role-based permissions enforced

## Deployment Checklist

1. ✅ **Database Migration**: Applied password_hash field
2. ✅ **Prisma Client**: Regenerated with new schema
3. ✅ **RLS Policies**: Deployed hybrid policies to Supabase
4. ✅ **Service Layer**: HybridAuthService completed
5. ✅ **API Routes**: authRoutes.ts created
6. 🔄 **Frontend Integration**: Update login flows
7. 🔄 **Environment Variables**: Set JWT_SECRET
8. 🔄 **Testing**: Test both auth flows

## Example Restaurant Setup

### Organization Structure:
```
Clerk Organization: "Pizza Palace Chain"
├── Owner: john@pizzapalace.com (Clerk)
├── Manager: mary@pizzapalace.com (Clerk)
└── Restaurants:
    ├── "Pizza Palace Downtown"
    │   ├── Staff: alice@staff.com (Database)
    │   ├── Staff: bob@staff.com (Database)
    │   └── Staff: charlie@staff.com (Database)
    └── "Pizza Palace Mall"
        ├── Staff: david@staff.com (Database)
        └── Staff: eve@staff.com (Database)
```

### Access Patterns:
- **john@pizzapalace.com**: Can manage both restaurants, create staff accounts
- **mary@pizzapalace.com**: Can manage both restaurants, create staff accounts  
- **alice@staff.com**: Can only access Downtown location POS/operations
- **david@staff.com**: Can only access Mall location POS/operations

Hệ thống này cho phép scaling unlimited staff members while keeping Clerk for business management!
