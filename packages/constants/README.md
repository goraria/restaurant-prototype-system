# @waddles/constants

Package chứa tất cả constants, quy tắc kinh doanh và cấu hình cho hệ thống quản lý nhà hàng Waddles. Package này được thiết kế để sử dụng chung trên Next.js, Express, Vite và Expo.

## 🚀 Tính năng

- **🛣️ API Routes**: Định nghĩa tất cả các route API một cách nhất quán
- **💬 Messages**: Thông báo đa ngôn ngữ (Tiếng Việt & Tiếng Anh)
- **🔐 Permissions**: Hệ thống phân quyền chi tiết cho tất cả vai trò
- **⚙️ Settings**: Cài đặt mặc định cho toàn bộ hệ thống
- **📋 Business Rules**: Quy tắc kinh doanh và validation logic
- **🎯 Type Safety**: Hoàn toàn type-safe với TypeScript

## 📦 Cài đặt

```bash
npm install @waddles/constants
# hoặc
yarn add @waddles/constants
# hoặc
pnpm add @waddles/constants
```

## 🏗️ Cấu trúc Package

### 1. **API Routes** (`routes.ts`)
Tất cả các endpoint API được tổ chức theo module:

```typescript
import { ROUTES, USER_ROUTES, ORDER_ROUTES } from '@waddles/constants';

// Sử dụng static routes
const loginUrl = ROUTES.AUTH_ROUTES.LOGIN; // '/api/auth/login'

// Sử dụng dynamic routes
const userProfile = USER_ROUTES.BY_ID('user-123'); // '/api/users/user-123'
const orderStatus = ORDER_ROUTES.STATUS('order-456'); // '/api/orders/order-456/status'
```

### 2. **Messages** (`messages.ts`)
Thông báo đa ngôn ngữ cho UI:

```typescript
import { MESSAGES, getMessage } from '@waddles/constants';

// Lấy message theo ngôn ngữ
const successMsg = getMessage('success', 'ORDER_CREATED', 'vi'); 
// "Đặt hàng thành công"

const errorMsg = getMessage('error', 'PAYMENT_FAILED', 'en');
// "Payment failed"

// Sử dụng trực tiếp
const vietnameseSuccess = MESSAGES.SUCCESS.vi.LOGIN_SUCCESS;
const englishError = MESSAGES.ERROR.en.INVALID_CREDENTIALS;
```

### 3. **Permissions** (`permissions.ts`)
Hệ thống phân quyền hoàn chỉnh:

```typescript
import { 
  USER_ROLES, 
  PERMISSIONS, 
  hasPermission,
  canManageUser 
} from '@waddles/constants';

// Check quyền của user
const canCreateMenu = hasPermission(
  USER_ROLES.RESTAURANT_MANAGER, 
  PERMISSIONS.MENU_CREATE
); // true

const canManageStaff = canManageUser(
  USER_ROLES.RESTAURANT_MANAGER,
  USER_ROLES.WAITER
); // true (manager > waiter)
```

### 4. **Settings** (`settings.ts`)
Cài đặt hệ thống:

```typescript
import { SETTINGS } from '@waddles/constants';

// Cài đặt ứng dụng
const appName = SETTINGS.APP.APP_NAME; // "Waddles Restaurant Management"
const defaultLang = SETTINGS.LOCALE.DEFAULT_LANGUAGE; // "vi"

// Cài đặt bảo mật
const minPasswordLength = SETTINGS.SECURITY.PASSWORD_MIN_LENGTH; // 8
const sessionTimeout = SETTINGS.SECURITY.SESSION_TIMEOUT; // 1800000ms

// Cài đặt nhà hàng
const minOrderAmount = SETTINGS.RESTAURANT.MINIMUM_ORDER_AMOUNT; // 50000 VND
const serviceCharge = SETTINGS.RESTAURANT.DEFAULT_SERVICE_CHARGE; // 0.1 (10%)
```

### 5. **Business Rules** (`business-rules.ts`)
Quy tắc kinh doanh và validation:

```typescript
import { 
  BUSINESS_RULES,
  isValidVietnamesePhone,
  calculateDeliveryFee,
  isEligibleForFreeDelivery 
} from '@waddles/constants';

// Validation
const validPhone = isValidVietnamesePhone('+84901234567'); // true
const validPhone2 = isValidVietnamesePhone('0901234567'); // true

// Tính phí giao hàng
const deliveryFee = calculateDeliveryFee(5); // 30000 VND (15000 + 5*3000)
const isFreeDelivery = isEligibleForFreeDelivery(250000); // true (>= 200000)

// Business rules
const maxOrderItems = BUSINESS_RULES.ORDER.MAX_ITEMS_PER_ORDER; // 50
const cancellationWindow = BUSINESS_RULES.ORDER.CANCELLATION_WINDOW; // 600000ms
```

## 🎯 Sử dụng theo Platform

### Next.js Client
```typescript
import { MESSAGES, PERMISSIONS, hasPermission } from '@waddles/constants';

export function OrderButton({ userRole }: { userRole: string }) {
  const canCreateOrder = hasPermission(userRole, PERMISSIONS.ORDER_CREATE);
  
  return (
    <button disabled={!canCreateOrder}>
      {MESSAGES.SUCCESS.vi.ORDER_CREATED}
    </button>
  );
}
```

### Express.js Server
```typescript
import { ROUTES, BUSINESS_RULES, hasPermission } from '@waddles/constants';

app.post(ROUTES.ORDER_ROUTES.BASE, async (req, res) => {
  // Check permissions
  if (!hasPermission(req.user.role, PERMISSIONS.ORDER_CREATE)) {
    return res.status(403).json({ 
      error: MESSAGES.ERROR.vi.ACCESS_DENIED 
    });
  }
  
  // Validate business rules
  if (req.body.items.length > BUSINESS_RULES.ORDER.MAX_ITEMS_PER_ORDER) {
    return res.status(400).json({
      error: 'Quá nhiều món trong đơn hàng'
    });
  }
});
```

### Vite Admin Panel
```typescript
import { 
  PERMISSIONS, 
  ROLE_HIERARCHY, 
  getRoleHierarchyLevel 
} from '@waddles/constants';

// Role management component
export function RoleSelector({ currentUserRole }: { currentUserRole: string }) {
  const currentLevel = getRoleHierarchyLevel(currentUserRole);
  
  const availableRoles = Object.entries(ROLE_HIERARCHY)
    .filter(([, level]) => level < currentLevel)
    .map(([role]) => role);
    
  return (
    <select>
      {availableRoles.map(role => (
        <option key={role} value={role}>{role}</option>
      ))}
    </select>
  );
}
```

### Expo Mobile App
```typescript
import { 
  BUSINESS_RULES, 
  formatVietnamesePhone, 
  MESSAGES 
} from '@waddles/constants';

export function OrderForm() {
  const [phone, setPhone] = useState('');
  
  const handlePhoneChange = (value: string) => {
    const formatted = formatVietnamesePhone(value);
    setPhone(formatted);
  };
  
  const validateOrder = (items: any[]) => {
    if (items.length > BUSINESS_RULES.ORDER.MAX_ITEMS_PER_ORDER) {
      Alert.alert('Lỗi', MESSAGES.ERROR.vi.TOO_MANY_ITEMS);
      return false;
    }
    return true;
  };
}
```

## 🔧 Utility Functions

### Phone Number Validation & Formatting
```typescript
import { 
  isValidVietnamesePhone, 
  formatVietnamesePhone 
} from '@waddles/constants';

// Validate
isValidVietnamesePhone('0901234567'); // true
isValidVietnamesePhone('+84901234567'); // true
isValidVietnamesePhone('84901234567'); // true

// Format
formatVietnamesePhone('0901234567'); // '+84901234567'
formatVietnamesePhone('84901234567'); // '+84901234567'
```

### Delivery Calculations
```typescript
import { 
  calculateDeliveryFee,
  isEligibleForFreeDelivery,
  getDeliveryTime,
  isPeakHour 
} from '@waddles/constants';

// Tính phí ship
const fee = calculateDeliveryFee(3); // 24000 VND
const freeShip = isEligibleForFreeDelivery(250000); // true

// Thời gian giao hàng
const estimatedTime = getDeliveryTime(isPeakHour('19:00')); // 60 phút (rush hour)
```

### Permission Checking
```typescript
import { 
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canManageUser 
} from '@waddles/constants';

const userRole = 'restaurant_manager';

// Single permission
const canCreateMenu = hasPermission(userRole, 'menu:create'); // true

// Any of multiple permissions
const canManageOrders = hasAnyPermission(userRole, [
  'order:create', 
  'order:update', 
  'order:delete'
]); // true

// All permissions required
const isAdmin = hasAllPermissions(userRole, [
  'restaurant:manage',
  'staff:manage',
  'menu:manage'
]); // true

// User hierarchy
const canManage = canManageUser('restaurant_manager', 'waiter'); // true
```

## 📊 Constants Groups

### Quick Access
```typescript
import { COMMON } from '@waddles/constants';

// Frequently used values
const appName = COMMON.APP_NAME;
const minOrder = COMMON.MINIMUM_ORDER_AMOUNT;
const supportPhone = COMMON.SUPPORT_PHONE;
```

### Platform Specific
```typescript
import { PLATFORM_CONSTANTS } from '@waddles/constants';

// Next.js constants
const nextjsConstants = PLATFORM_CONSTANTS.NEXTJS;

// Express constants  
const expressConstants = PLATFORM_CONSTANTS.EXPRESS;

// Mobile constants
const mobileConstants = PLATFORM_CONSTANTS.EXPO;
```

### Search Filters
```typescript
import { SEARCH_FILTERS } from '@waddles/constants';

// Available order statuses for filters
const orderStatuses = SEARCH_FILTERS.ORDER_STATUS;
// ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']

// User roles for admin filtering
const userRoles = SEARCH_FILTERS.USER_ROLES;
```

## 🎨 UI Constants
```typescript
import { UI_CONSTANTS } from '@waddles/constants';

// Colors
const primaryColor = UI_CONSTANTS.COLORS.PRIMARY; // '#3B82F6'
const successColor = UI_CONSTANTS.COLORS.SUCCESS; // '#10B981'

// Breakpoints
const mobileBreakpoint = UI_CONSTANTS.BREAKPOINTS.MOBILE; // '768px'

// Z-index values
const modalZIndex = UI_CONSTANTS.Z_INDEX.MODAL; // 1050
```

## 📱 Integration Examples

### Form Validation với React Hook Form
```typescript
import { isValidVietnamesePhone, isStrongPassword } from '@waddles/constants';
import { useForm } from 'react-hook-form';

const schema = z.object({
  phone: z.string().refine(isValidVietnamesePhone, 'Số điện thoại không hợp lệ'),
  password: z.string().refine(isStrongPassword, 'Mật khẩu quá yếu')
});
```

### API Client với axios
```typescript
import { ROUTES } from '@waddles/constants';

const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL
});

// Get user orders
const getUserOrders = (userId: string) =>
  apiClient.get(USER_ROUTES.ORDERS(userId));

// Create order
const createOrder = (orderData: any) =>
  apiClient.post(ORDER_ROUTES.BASE, orderData);
```

### State Management với Redux
```typescript
import { PERMISSIONS, hasPermission } from '@waddles/constants';

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    checkPermission: (state, action) => {
      const { permission } = action.payload;
      state.hasPermission = hasPermission(state.role, permission);
    }
  }
});
```

## 🚀 Development

```bash
# Build package
npm run build

# Watch mode for development  
npm run dev

# Type checking
npm run type-check

# Clean build
npm run clean
```

## 📄 License

MIT - See LICENSE.md for details

---

**Built with ❤️ for Waddles Restaurant Management System**

Được thiết kế để đảm bảo tính nhất quán và type safety across tất cả platforms! 🇻🇳
