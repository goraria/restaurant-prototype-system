# 🎯 CLERK WEBHOOK SETUP & NEXTJS/EXPO INTEGRATION GUIDE

## 📋 **TRẠNG THÁI HIỆN TẠI**

### ✅ **ĐÃ SETUP:**
- ✅ Webhook Controller (webhookController.ts) - HOÀN CHỈNH
- ✅ Routes (/api/clerk/webhooks/advanced) - ACTIVE
- ✅ Svix signature verification - CONFIGURED  
- ✅ Database sync handlers - ALL EVENTS
- ✅ Supabase Realtime - 30 TABLES SUBSCRIBED

### 🔧 **CẦN SETUP:**
1. Clerk Dashboard webhook endpoint
2. NextJS frontend Clerk config
3. Expo mobile Clerk config
4. Test data flow

---

## 🚀 **BƯỚC 1: CẤU HÌNH CLERK DASHBOARD**

### **1.1 Tạo Webhook Endpoint**
1. Đăng nhập **Clerk Dashboard**: https://dashboard.clerk.com
2. Chọn project của bạn
3. Vào **Webhooks** → **Create Endpoint**

### **1.2 Webhook Configuration**
```
Endpoint URL: https://YOUR_DOMAIN.com/api/clerk/webhooks/advanced
Description: Restaurant Management System - User Sync
```

⚠️ **LÚU Ý**: Thay `YOUR_DOMAIN.com` bằng domain thực của bạn (ngrok cho development)

### **1.3 Chọn Events (COPY PASTE)**
```
✅ user.created
✅ user.updated  
✅ user.deleted
✅ organization.created
✅ organization.updated
✅ organization.deleted
✅ organizationMembership.created
✅ organizationMembership.updated
✅ organizationMembership.deleted
✅ session.created
✅ session.ended
✅ session.removed
✅ session.revoked
```

### **1.4 Copy Webhook Secret**
```bash
# Copy từ Clerk Dashboard và paste vào .env
EXPRESS_CLERK_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
```

---

## 💻 **BƯỚC 2: NEXTJS CLIENT SETUP**

### **2.1 Install Dependencies**
```bash
npm install @clerk/nextjs
# hoặc
yarn add @clerk/nextjs
```

### **2.2 NextJS Environment Variables**
```env
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# API Endpoint
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### **2.3 Clerk Provider Setup**
```typescript
// app/layout.tsx hoặc pages/_app.tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

### **2.4 API Client với Auth**
```typescript
// lib/api.ts
import { auth } from '@clerk/nextjs';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const { getToken } = auth();
  const token = await getToken();

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  return response.json();
}

// Usage trong component
export async function getRestaurants() {
  return apiCall('/restaurants');
}
```

---

## 📱 **BƯỚC 3: EXPO CLIENT SETUP**

### **3.1 Install Dependencies**
```bash
npx expo install @clerk/expo expo-secure-store expo-web-browser
```

### **3.2 Expo Environment Variables**
```env
# .env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
EXPO_PUBLIC_API_URL=http://localhost:8080
```

### **3.3 Clerk Provider Setup**
```typescript
// App.tsx
import { ClerkProvider, ClerkLoaded } from '@clerk/expo';
import * as SecureStore from 'expo-secure-store';

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function App() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>
        {/* Your app components */}
      </ClerkLoaded>
    </ClerkProvider>
  );
}
```

### **3.4 API Client cho Expo**
```typescript
// lib/api.ts
import { useAuth } from '@clerk/expo';

export function useApiClient() {
  const { getToken } = useAuth();

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = await getToken();
    
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    return response.json();
  };

  return { apiCall };
}
```

---

## 🧪 **BƯỚC 4: TEST WEBHOOK FLOW**

### **4.1 Setup Ngrok cho Development**
```bash
# Install ngrok
npm install -g ngrok

# Expose local server
ngrok http 8080

# Copy URL (vd: https://abc123.ngrok.io)
# Update Clerk webhook URL: https://abc123.ngrok.io/api/clerk/webhooks/advanced
```

### **4.2 Test User Registration**
```typescript
// NextJS: pages/sign-up.tsx
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div>
      <h1>Đăng ký tài khoản</h1>
      <SignUp 
        afterSignUpUrl="/dashboard"
        redirectUrl="/dashboard"
      />
    </div>
  );
}
```

### **4.3 Monitor Webhook Logs**
Check server logs khi user đăng ký:
```bash
# Trong terminal server
# Sẽ thấy:
✅ User created via webhook: user_xxxxx
✅ Saved to database: {userId: "...", email: "..."}
✅ Realtime notification sent
```

### **4.4 Verify Database Sync**
```sql
-- Check trong Supabase Dashboard
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;
```

---

## 🔄 **DATA FLOW KHI USER ĐĂNG KÝ/ĐĂNG NHẬP**

### **Flow Diagram:**
```
📱 NextJS/Expo Client
    ↓ User signs up/in
🔐 Clerk Authentication
    ↓ Webhook fired
🌐 Your Server (/api/clerk/webhooks/advanced)
    ↓ Process event
💾 Supabase Database (INSERT/UPDATE user)
    ↓ Database trigger
📡 Supabase Realtime (NOTIFY all subscribers)
    ↓ Live update
⚡ All connected clients (NextJS/Expo) receive update
```

### **Events sẽ được xử lý:**

#### **📝 User Registration:**
1. `user.created` → Tạo user trong database
2. `session.created` → Log user session
3. Realtime notification → All clients update

#### **🔑 User Login:**
1. `session.created` → Track login
2. `user.updated` → Update last_seen
3. Realtime notification → Status update

#### **🏢 Organization Join:**
1. `organizationMembership.created` → Add user to restaurant
2. Role assignment → Update permissions
3. Realtime notification → Team members notified

---

## ✅ **KIỂM TRA HOẠT ĐỘNG**

### **Test Checklist:**
- [ ] Webhook endpoint accessible via ngrok
- [ ] User đăng ký từ NextJS → xuất hiện trong DB
- [ ] User đăng ký từ Expo → xuất hiện trong DB  
- [ ] User login → session logged
- [ ] Organization invite → membership created
- [ ] Realtime updates working

### **Debug Commands:**
```bash
# Check webhook logs
curl -X POST https://your-ngrok.ngrok.io/api/clerk/webhooks/test

# Monitor server logs
tail -f server.log

# Check Supabase realtime
# Trong browser console
supabase.channel('users').on('INSERT', (payload) => console.log('New user:', payload))
```

---

## 🎉 **KẾT LUẬN**

Với setup này, khi user **đăng ký/đăng nhập** từ **NextJS** hoặc **Expo**:

1. ✅ **Clerk** sẽ fire webhook
2. ✅ **Server** nhận và xử lý event  
3. ✅ **Database** được cập nhật
4. ✅ **Supabase Realtime** broadcast changes
5. ✅ **All clients** nhận live updates

**Data sẽ 100% đồng bộ realtime!** 🔄⚡
