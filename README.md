# 🍽️ Restaurant Management System - Multi-Platform

> **Hệ thống quản lý nhà hàng đa nền tảng** với Mobile App (Expo), Web Admin/Staff (Next.js), và Express Server với cơ sở dữ liệu được tối ưu hóa cho Supabase.

## 🎯 Tổng Quan Dự Án

Đây là một hệ thống quản lý nhà hàng hoàn chỉnh hỗ trợ:

### 📱 **Mobile App (Expo - React Native)**
- Đặt bàn trực tuyến
- Quét QR code để gọi món tại bàn  
- Thanh toán qua ví điện tử (MoMo, ZaloPay, VNPay, etc.)
- Theo dõi trạng thái đơn hàng real-time
- Đánh giá món ăn và dịch vụ
- Quản lý lịch sử đơn hàng

### 💻 **Web Admin (Next.js)**
- Dashboard quản lý tổng quan
- Quản lý chuỗi nhà hàng và chi nhánh
- Báo cáo doanh thu và thống kê chi tiết
- Quản lý menu, giá cả và khuyến mãi
- Quản lý nhân viên và lịch làm việc
- Quản lý kho nguyên liệu

### 👨‍🍳 **Web Staff (Next.js)**
- Giao diện nhân viên nhà hàng
- Nhận và xử lý đơn hàng
- Cập nhật trạng thái chế biến món ăn
- Quản lý bàn ăn và đặt bàn
- Chấm công và xem lịch làm việc

### 🔧 **Backend (Express.js + Prisma)**
- API RESTful và GraphQL
- Authentication với Clerk
- Real-time updates với WebSocket
- Tích hợp payment gateways
- Background jobs cho reports

## 🗄️ Cấu Trúc Database

### **Entities Chính:**
```
🏢 Organizations → Restaurant Chains → Restaurants
├── 👥 Users & Staff Management
├── 🪑 Tables & Reservations  
├── 🍽️ Menus & Items
├── 🛒 Orders & Payments
├── 🏪 Inventory & Recipes
├── 📊 Analytics & Reports
└── 🎟️ Vouchers & Promotions
```

### **Tính Năng Nổi Bật:**
- ✅ **Multi-tenant**: Hỗ trợ nhiều tổ chức/chuỗi nhà hàng
- ✅ **Real-time**: Cập nhật trạng thái đơn hàng real-time
- ✅ **Payment Integration**: Hỗ trợ đa dạng phương thức thanh toán
- ✅ **Inventory Management**: Quản lý kho tự động với cảnh báo
- ✅ **Staff Scheduling**: Lịch làm việc và chấm công
- ✅ **Analytics**: Báo cáo doanh thu và thống kê chi tiết
- ✅ **QR Code**: Gọi món tại bàn không cần app
- ✅ **Review System**: Đánh giá món ăn và dịch vụ

## 🚀 Quick Start

### 1. **Setup Database**
```bash
# Clone repository
git clone <repository-url>
cd eindrucksvoll-lieblings-haustier

# Setup Supabase database
cd applications/server
npm install
npx prisma generate
npx prisma db push

# Run migration scripts
psql -d your-database < prisma/migrations/restaurant_management_setup.sql

# Seed demo data
npx tsx prisma/seed.ts
```

### 2. **Run Backend Server**
```bash
cd applications/server
npm run dev
# Server runs on http://localhost:3001
```

### 3. **Run Admin Web App**
```bash
cd applications/admin  
npm install
npm run dev
# Admin panel: http://localhost:3000
```

### 4. **Run Mobile App**
```bash
cd applications/mobile
npm install
npx expo start
# Use Expo Go app to scan QR code
```

### 5. **Environment Variables**
Create `.env` files in each application:

```bash
# applications/server/.env
EXPRESS_DATABASE_URL="postgresql://user:pass@host:port/db"
EXPRESS_DIRECT_URL="postgresql://user:pass@host:port/db"
CLERK_SECRET_KEY="your-clerk-secret"
JWT_SECRET="your-jwt-secret"

# applications/admin/.env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-key"
CLERK_SECRET_KEY="your-clerk-secret"
NEXT_PUBLIC_API_URL="http://localhost:3001"

# applications/mobile/.env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-key"
EXPO_PUBLIC_API_URL="http://localhost:3001"
```

## 📊 Demo Accounts

Sau khi chạy seed script, bạn có thể đăng nhập với:

```
🔑 Admin: admin@restaurant.demo / demo123456
👨‍💼 Manager: manager@restaurant.demo / demo123456  
👤 Customer: customer@restaurant.demo / demo123456
👨‍🍳 Staff: staff@restaurant.demo / demo123456
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Admin Web     │    │   Staff Web     │
│   (Expo RN)     │    │   (Next.js)     │    │   (Next.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └─────────────────────────────────────────────────┘
                                 │
                    ┌─────────────────────────┐
                    │    Express Server       │
                    │  ┌─────────────────┐    │
                    │  │  REST API       │    │
                    │  │  GraphQL API    │    │
                    │  │  WebSocket      │    │
                    │  │  Auth (Clerk)   │    │
                    │  └─────────────────┘    │
                    └─────────────────────────┘
                                 │
                    ┌─────────────────────────┐
                    │   Supabase PostgreSQL   │
                    │  ┌─────────────────┐    │
                    │  │  Restaurant DB  │    │
                    │  │  Optimized      │    │
                    │  │  with Triggers  │    │
                    │  └─────────────────┘    │
                    └─────────────────────────┘
```

## 🔧 Tech Stack

### **Frontend**
- **Mobile**: React Native + Expo
- **Web**: Next.js 14 + TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **State**: React Query + Zustand

### **Backend**  
- **Server**: Express.js + TypeScript
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Auth**: Clerk
- **API**: REST + GraphQL (Apollo)

### **DevOps & Tools**
- **Database**: Prisma migrations
- **Testing**: Jest + Testing Library  
- **Linting**: ESLint + Prettier
- **Type Safety**: TypeScript strict mode

## 📁 Project Structure

```
eindrucksvoll-lieblings-haustier/
├── applications/
│   ├── mobile/          # Expo React Native app
│   ├── admin/           # Next.js admin web app  
│   ├── client/          # Next.js customer web app
│   ├── desktop/         # Desktop app (future)
│   └── server/          # Express.js backend
│       ├── app/         # Application logic
│       ├── controllers/ # API controllers
│       ├── middlewares/ # Custom middlewares
│       ├── models/      # Business models
│       ├── prisma/      # Database schema & migrations
│       ├── routes/      # API routes
│       └── utils/       # Helper utilities
├── packages/            # Shared packages
│   ├── config/          # Shared configuration
│   ├── core/            # Core business logic
│   ├── services/        # Shared services
│   ├── state/           # State management
│   ├── types/           # TypeScript types
│   └── utils/           # Shared utilities
├── DATABASE_ANALYSIS.md # Database design documentation
├── API_ROUTES_EXAMPLES.md # API documentation
└── README.md           # This file
```

## 🚀 Deployment

### **Database (Supabase)**
1. Create new Supabase project
2. Run Prisma migrations: `npx prisma db push`
3. Execute setup script: `restaurant_management_setup.sql`
4. Seed demo data: `npx tsx prisma/seed.ts`

### **Backend (Railway/Vercel)**
```bash
# Build and deploy
npm run build
npm start
```

### **Web Apps (Vercel)**
```bash
# Build Next.js apps
npm run build
npm run start
```

### **Mobile App (EAS Build)**
```bash
# Build for iOS/Android
npx eas build --platform all
npx eas submit
```

## 📈 Performance Optimizations

### **Database**
- ✅ Composite indexes cho queries phổ biến
- ✅ Triggers tự động cho revenue reports
- ✅ Partitioning theo restaurant_id
- ✅ Connection pooling

### **API**
- ✅ GraphQL DataLoader cho N+1 queries
- ✅ Redis caching cho menu items
- ✅ Background jobs cho heavy operations
- ✅ Rate limiting và security headers

### **Frontend**
- ✅ Code splitting với dynamic imports
- ✅ Image optimization với Next.js
- ✅ React Query cho data caching
- ✅ Virtual scrolling cho long lists

## 🔮 Roadmap

### **Phase 1 (Current)** ✅
- [x] Core database design
- [x] Basic CRUD operations
- [x] Authentication setup
- [x] Mobile app foundation

### **Phase 2 (Next)**
- [ ] Real-time order tracking
- [ ] Payment gateway integration
- [ ] Push notifications
- [ ] Advanced analytics

### **Phase 3 (Future)**
- [ ] Multi-language support
- [ ] Delivery management
- [ ] Customer loyalty program
- [ ] AI-powered recommendations

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see [LICENSE.md](LICENSE.md) for details.

## 🆘 Support

- 📧 Email: support@restaurant-system.com
- 📚 Documentation: [Detailed docs](./docs/)
- 🐛 Issues: [GitHub Issues](../../issues)
- 💬 Discussions: [GitHub Discussions](../../discussions)

---

**Made with ❤️ for Vietnamese restaurants worldwide** 🇻🇳