import {
  Wifi,
  Waves,
  Dumbbell,
  Car,
  PawPrint,
  Tv,
  Thermometer,
  Cigarette,
  Cable,
  Maximize,
  Bath,
  Phone,
  Sprout,
  Hammer,
  Bus,
  Mountain,
  VolumeX,
  Home,
  Warehouse,
  Building,
  Castle,
  Trees,
  LucideIcon,
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
  ArchiveX,
  Inbox,
  File,
  Send,
  Trash2,
  Banknote,
  CreditCard,
  CircleDollarSign,
  CircleCheck,
  Package,
  ShieldCheck,
  Wallet,
  Expand,
  Info,
  User,
  ChefHat,
  UtensilsCrossed,
  MenuSquare,
  Users,
  UserCheck,
  Package2,
  ClipboardList,
  BarChart3,
  Settings2,
  MessageSquare,
  TrendingUp,
  QrCode,
} from "lucide-react"; 

export const appGlobal = {
  name: "Waddles",
  description: "Design by Japtor Gorthenburg",
  title: "Comprehensive Restaurant Management System",
  address: "123 Main St, Hai Bà Trưng, Hà Nội, Việt Nam",
  phone: "+84 123 456 789",
  email: "info@gorth.org",
  website: "www.gorth.org",
  copyright: "Bản quyền © Gorth Inc. 2020 - " + (new Date().getFullYear()) + " Bảo lưu mọi quyền.",
  pro: "Copyright © &copy; 2020 - " + new Date().getFullYear() + " Gorth Inc. All rights reserved.",
  copyleft: "Bản quyền © Waddles Corp. 2020 - " + new Date().getFullYear() + " Cung cấp bởi Gorth Inc.",
  noob: "Copyright © 2020 - " + new Date().getFullYear() + " Waddles Corp. Powered by Gorth Inc.",
}

export const navigation = [
  { name: "Contact", href: "/contact" },
  { name: "About Us", href: "/about" },
  { name: "Pages", href: "/pages" },
  { name: "Components", href: "/manager" },
]

export const userDefault = {
  name: "japtor",
  email: "japtor@gorth.org",
  avatar: "/avatars/waddles.jpeg",
}

export const demoSidebar = {
  user: {
    name: "Japtor",
    email: "japtor@gorth.org",
    avatar: "/avatars/waddles.jpeg",
  },
  item: [
    {
      title: "Inbox",
      url: "/message",
      icon: Inbox,
      isActive: true,
    },
    {
      title: "Drafts",
      url: "/message/drafts",
      icon: File,
      isActive: false,
    },
    {
      title: "Sent",
      url: "/message/sent",
      icon: Send,
      isActive: false,
    },
    {
      title: "Junk",
      url: "/message/junk",
      icon: ArchiveX,
      isActive: false,
    },
    {
      title: "Trash",
      url: "/message/trash",
      icon: Trash2,
      isActive: false,
    },
  ],
}

export const managerSidebar = {
  user: {
    name: "japtor",
    email: "japtor@gorth.org",
    avatar: "/avatars/waddles.jpeg",
  },
  route: "/manager",
  teams: [
    {
      name: "Gorth Inc.",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Goraria Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Waddles Restaurant",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Phân tích",
      describe: "Analytics and reporting dashboard",
      url: "#",
      icon: BarChart3,
      items: [
        {
          title: "Tổng quan",
          describe: "Overview dashboard",
          url: "/manager",
        },
        {
          title: "Thống kê",
          describe: "Analytics",
          url: "/manager/analytics",
        },
        {
          title: "Doanh thu",
          describe: "Revenue analytics",
          url: "/manager/analytics/revenue",
        },
        {
          title: "Báo cáo",
          describe: "Business reports",
          url: "/manager/analytics/reports",
        },
        {
          title: "Xu hướng",
          describe: "Trends analysis",
          url: "/manager/analytics/trends",
        },
      ],
    },
    {
      title: "Quản lý món ăn",
      describe: "Menu items and dishes management",
      url: "#",
      icon: UtensilsCrossed,
      items: [
        {
          title: "Danh sách món",
          describe: "All menu items",
          url: "/manager/menu-items",
        },
        {
          title: "Phân loại",
          describe: "Categories management",
          url: "/manager/menu-items/categories",
        },
        {
          title: "Giá cả",
          describe: "Pricing management",
          url: "/manager/menu-items/pricing",
        },
        {
          title: "Tình trạng",
          describe: "Availability status",
          url: "/manager/menu-items/status",
        },
      ],
    },
    {
      title: "Thực đơn",
      describe: "Menu management and organization",
      url: "#",
      icon: MenuSquare,
      items: [
        {
          title: "Thực đơn chính",
          describe: "Main menus",
          url: "/manager/menus",
        },
        {
          title: "Thực đơn theo thời gian",
          describe: "Time-based menus",
          url: "/manager/menus/schedule",
        },
        {
          title: "Khuyến mãi",
          describe: "Promotional menus",
          url: "/manager/menus/promotions",
        },
        {
          title: "Thiết kế",
          describe: "Menu design",
          url: "/manager/menus/design",
        },
      ],
    },
    {
      title: "Công thức",
      describe: "Recipes and cooking instructions",
      url: "#",
      icon: ChefHat,
      items: [
        {
          title: "Công thức nấu ăn",
          describe: "Recipe management",
          url: "/manager/recipes",
        },
        {
          title: "Nguyên liệu",
          describe: "Recipe ingredients",
          url: "/manager/recipes/ingredients",
        },
        {
          title: "Quy trình",
          describe: "Cooking processes",
          url: "/manager/recipes/processes",
        },
        {
          title: "Chi phí",
          describe: "Recipe costing",
          url: "/manager/recipes/costing",
        },
      ],
    },
    {
      title: "Nhân viên",
      describe: "Staff management and scheduling",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Danh sách nhân viên",
          describe: "Staff directory",
          url: "/manager/staff",
        },
        {
          title: "Lịch làm việc",
          describe: "Work schedules",
          url: "/manager/staff/schedules",
        },
        {
          title: "Chấm công",
          describe: "Attendance tracking",
          url: "/manager/staff/attendance",
        },
        {
          title: "Đánh giá",
          describe: "Performance reviews",
          url: "/manager/staff/reviews",
        },
      ],
    },
    {
      title: "Khách hàng",
      describe: "Customer management and loyalty",
      url: "#",
      icon: UserCheck,
      items: [
        {
          title: "Danh sách khách hàng",
          describe: "Customer database",
          url: "/manager/customers",
        },
        {
          title: "Đặt bàn",
          describe: "Reservations management",
          url: "/manager/customers/reservations",
        },
        {
          title: "Đơn hàng",
          describe: "Order history",
          url: "/manager/customers/orders",
        },
        {
          title: "Khách hàng thân thiết",
          describe: "Loyalty programs",
          url: "/manager/customers/loyalty",
        },
      ],
    },
    {
      title: "Quản lý kho",
      describe: "Inventory and stock management",
      url: "#",
      icon: Package2,
      items: [
        {
          title: "Tồn kho",
          describe: "Current inventory",
          url: "/manager/inventory",
        },
        {
          title: "Nhập kho",
          describe: "Stock receiving",
          url: "/manager/inventory/receiving",
        },
        {
          title: "Xuất kho",
          describe: "Stock issuing",
          url: "/manager/inventory/issuing",
        },
        {
          title: "Nhà cung cấp",
          describe: "Supplier management",
          url: "/manager/inventory/suppliers",
        },
      ],
    },
    {
      title: "Đơn hàng",
      describe: "Order processing and tracking",
      url: "#",
      icon: ClipboardList,
      items: [
        {
          title: "Đơn hàng hiện tại",
          describe: "Current orders",
          url: "/manager/orders",
        },
        {
          title: "Lịch sử",
          describe: "Order history",
          url: "/manager/orders/history",
        },
        {
          title: "Theo dõi",
          describe: "Order tracking",
          url: "/manager/orders/tracking",
        },
        {
          title: "Thanh toán",
          describe: "Payment processing",
          url: "/manager/orders/payments",
        },
      ],
    },
    {
      title: "Bàn ăn",
      describe: "Table management and QR ordering",
      url: "#",
      icon: QrCode,
      items: [
        {
          title: "Sơ đồ bàn",
          describe: "Table layout",
          url: "/manager/tables",
        },
        {
          title: "Trạng thái bàn",
          describe: "Table status",
          url: "/manager/tables/status",
        },
        {
          title: "QR Code",
          describe: "QR code management",
          url: "/manager/tables/qr-codes",
        },
        {
          title: "Đặt bàn",
          describe: "Table reservations",
          url: "/manager/tables/reservations",
        },
      ],
    },
    {
      title: "Hỗ trợ khách hàng",
      describe: "Customer support and feedback",
      url: "#",
      icon: MessageSquare,
      items: [
        {
          title: "Chat trực tiếp",
          describe: "Live chat support",
          url: "/manager/support/chat",
        },
        {
          title: "Phản hồi",
          describe: "Customer feedback",
          url: "/manager/support/feedback",
        },
        {
          title: "Đánh giá",
          describe: "Reviews and ratings",
          url: "/manager/support/reviews",
        },
        {
          title: "Khiếu nại",
          describe: "Complaint handling",
          url: "/manager/support/complaints",
        },
      ],
    },
    {
      title: "Cài đặt",
      describe: "System settings and configuration",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Thông tin nhà hàng",
          describe: "Restaurant information",
          url: "/manager/settings/restaurant",
        },
        {
          title: "Thanh toán",
          describe: "Payment settings",
          url: "/manager/settings/payments",
        },
        {
          title: "Thông báo",
          describe: "Notification settings",
          url: "/manager/settings/notifications",
        },
        {
          title: "Bảo mật",
          describe: "Security settings",
          url: "/manager/settings/security",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Quản lý thực đơn",
      url: "/manager/menus",
      icon: MenuSquare,
    },
    {
      name: "Phân tích doanh thu",
      url: "/manager/analytics/revenue",
      icon: TrendingUp,
    },
    {
      name: "Hỗ trợ khách hàng",
      url: "/manager/support/chat",
      icon: MessageSquare,
    },
  ],
}

export const settingsSidebar = {
  user: {
    name: "japtor",
    email: "japtor@gorth.org",
    avatar: "/avatars/waddles.jpeg",
  },
  route: "/settings",
  teams: [
    {
      name: "Gorth Inc.",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Goraria Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Waddles Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Cài đặt tài khoản",
      describe: "Account settings and preferences",
      url: "#",
      icon: User,
      items: [
        {
          title: "Thông tin cá nhân",
          describe: "Personal information",
          url: "/settings",
        },
        {
          title: "Thông tin liên hệ",
          describe: "Contact information",
          url: "/settings/information",
        },
        {
          title: "Bảo mật",
          describe: "Security settings",
          url: "/settings/information/security",
        },
        {
          title: "Quyền riêng tư",
          describe: "Privacy settings",
          url: "/settings/privacy",
        },
      ],
    },
    {
      title: "Cài đặt nhà hàng",
      describe: "Restaurant configuration and setup",
      url: "#",
      icon: Building,
      items: [
        {
          title: "Thông tin cơ bản",
          describe: "Basic restaurant info",
          url: "/settings/restaurant",
        },
        {
          title: "Giờ hoạt động",
          describe: "Operating hours",
          url: "/settings/restaurant/hours",
        },
        {
          title: "Vị trí",
          describe: "Location settings",
          url: "/settings/restaurant/location",
        },
        {
          title: "Hình ảnh",
          describe: "Restaurant images",
          url: "/settings/restaurant/images",
        },
      ],
    },
    {
      title: "Thanh toán",
      describe: "Payment methods and billing",
      url: "#",
      icon: CreditCard,
      items: [
        {
          title: "Phương thức thanh toán",
          describe: "Payment methods",
          url: "/settings/payments",
        },
        {
          title: "Cổng thanh toán",
          describe: "Payment gateways",
          url: "/settings/payments/gateways",
        },
        {
          title: "Hóa đơn",
          describe: "Billing settings",
          url: "/settings/payments/billing",
        },
        {
          title: "Thuế",
          describe: "Tax configuration",
          url: "/settings/payments/taxes",
        },
      ],
    },
    {
      title: "Thông báo",
      describe: "Notification preferences",
      url: "#",
      icon: MessageSquare,
      items: [
        {
          title: "Thông báo email",
          describe: "Email notifications",
          url: "/settings/notifications/email",
        },
        {
          title: "Thông báo SMS",
          describe: "SMS notifications",
          url: "/settings/notifications/sms",
        },
        {
          title: "Thông báo push",
          describe: "Push notifications",
          url: "/settings/notifications/push",
        },
        {
          title: "Tùy chỉnh",
          describe: "Custom notifications",
          url: "/settings/notifications/custom",
        },
      ],
    },
    {
      title: "Tích hợp",
      describe: "Third-party integrations",
      url: "#",
      icon: Package,
      items: [
        {
          title: "API Keys",
          describe: "API key management",
          url: "/settings/integrations/api",
        },
        {
          title: "Webhook",
          describe: "Webhook configuration",
          url: "/settings/integrations/webhook",
        },
        {
          title: "Ứng dụng bên thứ ba",
          describe: "Third-party apps",
          url: "/settings/integrations/apps",
        },
        {
          title: "Đồng bộ dữ liệu",
          describe: "Data synchronization",
          url: "/settings/integrations/sync",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Restaurant Analytics",
      url: "#",
      icon: BarChart3,
    },
    {
      name: "Customer Support",
      url: "#",
      icon: MessageSquare,
    },
    {
      name: "Staff Management",
      url: "#",
      icon: Users,
    },
  ],
}

// Staff/Employee Sidebar Configuration
export const staffSidebar = {
  user: {
    name: "Nhân viên",
    email: "staff@waddles.com",
    avatar: "/avatars/staff.jpeg",
  },
  route: "/staff",
  navMain: [
    {
      title: "Tổng quan",
      describe: "Dashboard for staff overview",
      url: "/staff",
      icon: BarChart3,
      items: [],
    },
    {
      title: "Đơn hàng",
      describe: "Order management and processing",
      url: "#",
      icon: ClipboardList,
      items: [
        {
          title: "Đơn hàng hiện tại",
          describe: "Current active orders",
          url: "/staff/orders",
        },
        {
          title: "Nhận đơn mới",
          describe: "Take new orders",
          url: "/staff/orders/new",
        },
        {
          title: "Theo dõi bếp",
          describe: "Kitchen order tracking",
          url: "/staff/orders/kitchen",
        },
      ],
    },
    {
      title: "Quản lý bàn",
      describe: "Table service and management",
      url: "#",
      icon: QrCode,
      items: [
        {
          title: "Sơ đồ bàn",
          describe: "Table layout and status",
          url: "/staff/tables",
        },
        {
          title: "Đặt bàn",
          describe: "Table reservations",
          url: "/staff/tables/reservations",
        },
        {
          title: "Dọn bàn",
          describe: "Table cleaning status",
          url: "/staff/tables/cleaning",
        },
      ],
    },
    {
      title: "Thanh toán",
      describe: "Point of Sale system",
      url: "#",
      icon: CreditCard,
      items: [
        {
          title: "Thu ngân",
          describe: "Cashier interface",
          url: "/staff/pos",
        },
        {
          title: "Hóa đơn",
          describe: "Invoice management",
          url: "/staff/pos/invoices",
        },
      ],
    },
    {
      title: "Cá nhân",
      describe: "Personal information and schedule",
      url: "#",
      icon: User,
      items: [
        {
          title: "Hồ sơ",
          describe: "Personal profile",
          url: "/staff/profile",
        },
        {
          title: "Lịch làm việc",
          describe: "Work schedule",
          url: "/staff/schedule",
        },
        {
          title: "Công việc",
          describe: "Assigned tasks",
          url: "/staff/tasks",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Quản lý thực đơn",
      url: "/manager/menus",
      icon: MenuSquare,
    },
    {
      name: "Phân tích doanh thu",
      url: "/manager/analytics/revenue",
      icon: TrendingUp,
    },
    {
      name: "Hỗ trợ khách hàng",
      url: "/manager/support/chat",
      icon: MessageSquare,
    },
  ],
}

// Customer Sidebar Configuration
export const customerSidebar = {
  user: {
    name: "Khách hàng",
    email: "customer@example.com",
    avatar: "/avatars/customer.jpeg",
  },
  route: "/customer",
  teams: [],
  navMain: [
    {
      title: "Trang chủ",
      describe: "Customer dashboard",
      url: "/customer",
      icon: Home,
      items: [],
    },
    {
      title: "Đặt bàn",
      describe: "Table reservation system",
      url: "#",
      icon: QrCode,
      items: [
        {
          title: "Đặt bàn mới",
          describe: "Make new reservation",
          url: "/customer/reservations",
        },
        {
          title: "Lịch sử đặt bàn",
          describe: "Reservation history",
          url: "/customer/reservations/history",
        },
        {
          title: "Hủy/Sửa đặt bàn",
          describe: "Modify reservations",
          url: "/customer/reservations/manage",
        },
      ],
    },
    {
      title: "Đơn hàng",
      describe: "Order history and tracking",
      url: "#",
      icon: ClipboardList,
      items: [
        {
          title: "Lịch sử đơn hàng",
          describe: "Order history",
          url: "/customer/orders",
        },
        {
          title: "Đặt lại",
          describe: "Reorder previous items",
          url: "/customer/orders/reorder",
        },
        {
          title: "Theo dõi đơn hàng",
          describe: "Track current orders",
          url: "/customer/orders/tracking",
        },
      ],
    },
    {
      title: "Thành viên",
      describe: "Loyalty program and rewards",
      url: "#",
      icon: CircleDollarSign,
      items: [
        {
          title: "Điểm tích lũy",
          describe: "Loyalty points",
          url: "/customer/loyalty",
        },
        {
          title: "Ưu đãi",
          describe: "Available offers",
          url: "/customer/loyalty/offers",
        },
        {
          title: "Ví điện tử",
          describe: "Digital wallet",
          url: "/customer/wallet",
        },
      ],
    },
    {
      title: "Cá nhân",
      describe: "Personal preferences and settings",
      url: "#",
      icon: User,
      items: [
        {
          title: "Hồ sơ",
          describe: "Personal profile",
          url: "/customer/profile",
        },
        {
          title: "Món yêu thích",
          describe: "Favorite dishes",
          url: "/customer/favorites",
        },
        {
          title: "Đánh giá",
          describe: "My reviews",
          url: "/customer/reviews",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Quản lý thực đơn",
      url: "/manager/menus",
      icon: MenuSquare,
    },
    {
      name: "Phân tích doanh thu",
      url: "/manager/analytics/revenue",
      icon: TrendingUp,
    },
    {
      name: "Hỗ trợ khách hàng",
      url: "/manager/support/chat",
      icon: MessageSquare,
    },
  ],
}

// Shared/Public Routes Configuration
export const sharedRoutes = {
  public: [
    { path: "/", title: "Trang chủ" },
    { path: "/about", title: "Giới thiệu" },
    { path: "/contact", title: "Liên hệ" },
    { path: "/pages", title: "Tất cả trang" },
    { path: "/privacy-policy", title: "Chính sách bảo mật" },
    { path: "/terms-of-service", title: "Điều khoản sử dụng" },
  ],
  auth: [
    { path: "/sign-in", title: "Đăng nhập" },
    { path: "/sign-up", title: "Đăng ký" },
  ],
}

export const footerLinks = {
  paymentIcons: [
    { id: 1, name: "Banking", icon: CircleDollarSign, link: "#" },
    { id: 2, name: "Cash", icon: Banknote, link: "#" },
    { id: 3, name: "ATM Card", icon: CreditCard, link: "#" },
    { id: 4, name: "PayPal", box: "paypal", link: "#" },
    // { id: 5, name: "VISA Card", box: "bxl-visa", link: "#" },
    // { id: 6, name: "Mastercard", box: "bx-credit-card", link: "#" },
  ],

  usefulInfo: [
    { id: 1, name: "Warranty Policy", icon: CircleCheck, link: "#" },
    { id: 2, name: "Return Policy", box: "bx-rotate-left", link: "#" },
    { id: 3, name: "Shipping Policy", icon: Package, link: "#" },
    { id: 4, name: "Privacy Policy", icon: ShieldCheck, link: "#" },
    { id: 5, name: "Payment Policy", icon: Wallet, link: "#" },
    { id: 6, name: "Inspection Policy", icon: Expand, link: "#" },
    { id: 7, name: "Online Shopping Guide", box: "bx-planet", link: "#" },
    { id: 8, name: "About Us", icon: Info, link: "/about" }
  ],

  socialIcons: [
    { id: 1, name: "Github", box: "github", link: "https://github.com/goraria/e-commerce" },
    { id: 2, name: "Facebook", box: "facebook-circle", link: "#" },
    { id: 3, name: "Youtube", box: "youtube", link: "#" },
    { id: 4, name: "Tiktok", box: "tiktok", link: "#" },
    { id: 5, name: "Twitter", box: "twitter", link: "#" },
    // { id: 6, name: "Threads" box: "thread", link: "#" },
    { id: 7, name: "Instagram", box: "instagram", link: "#" },
    // { id: 8, name: "Pinterest", box: "pinterest", link: "#" },
    // { id: 9, name: "Whatsapp", box: "whatsapp", link: "#" },
    { id: 10, name: "Reddit", box: "reddit", link: "#" },
    // { id: 11, name: "Steam", box: "steam", link: "#" },
    // { id: 12, name: "Snapchat", box: "snapchat", link: "#" },
    { id: 13, name: "Telegram", box: "telegram", link: "#" }
  ],
}

export enum AmenityEnum {
  WasherDryer = "WasherDryer",
  AirConditioning = "AirConditioning",
  Dishwasher = "Dishwasher",
  HighSpeedInternet = "HighSpeedInternet",
  HardwoodFloors = "HardwoodFloors",
  WalkInClosets = "WalkInClosets",
  Microwave = "Microwave",
  Refrigerator = "Refrigerator",
  Pool = "Pool",
  Gym = "Gym",
  Parking = "Parking",
  PetsAllowed = "PetsAllowed",
  WiFi = "WiFi",
}

export const AmenityIcons: Record<AmenityEnum, LucideIcon> = {
  WasherDryer: Waves,
  AirConditioning: Thermometer,
  Dishwasher: Waves,
  HighSpeedInternet: Wifi,
  HardwoodFloors: Home,
  WalkInClosets: Maximize,
  Microwave: Tv,
  Refrigerator: Thermometer,
  Pool: Waves,
  Gym: Dumbbell,
  Parking: Car,
  PetsAllowed: PawPrint,
  WiFi: Wifi,
};

export enum HighlightEnum {
  HighSpeedInternetAccess = "HighSpeedInternetAccess",
  WasherDryer = "WasherDryer",
  AirConditioning = "AirConditioning",
  Heating = "Heating",
  SmokeFree = "SmokeFree",
  CableReady = "CableReady",
  SatelliteTV = "SatelliteTV",
  DoubleVanities = "DoubleVanities",
  TubShower = "TubShower",
  Intercom = "Intercom",
  SprinklerSystem = "SprinklerSystem",
  RecentlyRenovated = "RecentlyRenovated",
  CloseToTransit = "CloseToTransit",
  GreatView = "GreatView",
  QuietNeighborhood = "QuietNeighborhood",
}

export const HighlightIcons: Record<HighlightEnum, LucideIcon> = {
  HighSpeedInternetAccess: Wifi,
  WasherDryer: Waves,
  AirConditioning: Thermometer,
  Heating: Thermometer,
  SmokeFree: Cigarette,
  CableReady: Cable,
  SatelliteTV: Tv,
  DoubleVanities: Maximize,
  TubShower: Bath,
  Intercom: Phone,
  SprinklerSystem: Sprout,
  RecentlyRenovated: Hammer,
  CloseToTransit: Bus,
  GreatView: Mountain,
  QuietNeighborhood: VolumeX,
};

export enum PropertyTypeEnum {
  Rooms = "Rooms",
  Tinyhouse = "Tinyhouse",
  Apartment = "Apartment",
  Villa = "Villa",
  Townhouse = "Townhouse",
  Cottage = "Cottage",
}

export const PropertyTypeIcons: Record<PropertyTypeEnum, LucideIcon> = {
  Rooms: Home,
  Tinyhouse: Warehouse,
  Apartment: Building,
  Villa: Castle,
  Townhouse: Home,
  Cottage: Trees,
};

// Add this constant at the end of the file
export const NAVBAR_HEIGHT = 52; // in pixels

// Test users for development
export const testUsers = {
  tenant: {
    username: "Carol White",
    userId: "us-east-2:76543210-90ab-cdef-1234-567890abcdef",
    signInDetails: {
      loginId: "carol.white@example.com",
      authFlowType: "USER_SRP_AUTH",
    },
  },
  tenantRole: "tenant",
  manager: {
    username: "John Smith",
    userId: "us-east-2:12345678-90ab-cdef-1234-567890abcdef",
    signInDetails: {
      loginId: "john.smith@example.com",
      authFlowType: "USER_SRP_AUTH",
    },
  },
  managerRole: "manager",
  staff: {
    username: "Alice Johnson",
    userId: "us-east-2:11111111-2222-3333-4444-555555555555",
    signInDetails: {
      loginId: "alice.staff@waddles.com",
      authFlowType: "USER_SRP_AUTH",
    },
  },
  staffRole: "staff",
  customer: {
    username: "Bob Customer",
    userId: "us-east-2:99999999-8888-7777-6666-555555555555",
    signInDetails: {
      loginId: "bob.customer@example.com",
      authFlowType: "USER_SRP_AUTH",
    },
  },
  customerRole: "customer",
};
