import {
  Home,
  UtensilsCrossed,
  Calendar,
  Heart,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  User,
  Settings,
  LogOut,
  Award,
  TrendingUp,
  MessageCircle,
  Bell,
  Search,
  Filter,
  ShoppingCart,
  ChefHat,
  Users,
  Package,
  CreditCard,
  Gift,
  HelpCircle,
  Info,
  Shield
} from "lucide-react-native";

export const appGlobal = {
  name: "Waddles",
  description: "Ứng dụng đặt bàn và gọi món nhà hàng",
  title: "Hệ thống quản lý nhà hàng toàn diện",
  address: "208 Main St, Hai Bà Trưng, Hà Nội, Việt Nam",
  times: "06:00 - 22:00 (Hằng ngày)",
  opening: "06:00 - 22:00 (GMT+7) (Thứ Hai - Chủ Nhật)",
  phone: "(+84) 123 456 789",
  hotline: "(028) 1876 5439",
  email: "info@gorth.org",
  website: "www.gorth.org",
  currency: "VND",
  locales: "vi-VN",
  zalo: "https://zalo.me/0123456789",
  facebook: "https://www.facebook.com/gorth.org",
  instagram: "https://www.instagram.com/gorth.org",
  twitter: "https://www.twitter.com/gorth_org",
  youtube: "https://www.youtube.com/gorth_org",
  github: "https://www.github.com/gorth_org",
  twitch: "https://www.twitch.tv/gorth_org",
  copyright: "Bản quyền © Gorth Inc. 2020 - " + (new Date().getFullYear()) + " Bảo lưu mọi quyền.",
  pro: "Copyright © 2020 - " + new Date().getFullYear() + " Gorth Inc. All rights reserved.",
  copyleft: "Bản quyền © Waddles Corp. 2020 - " + new Date().getFullYear() + " Cung cấp bởi Gorth Inc.",
  noob: "Copyright © 2020 - " + new Date().getFullYear() + " Waddles Corp. Powered by Gorth Inc.",
}

export const restaurantColors = {
  // Màu chính từ client app
  primary: {
    main: "#EC6683",      // professional-main (hồng chính)
    sub: "#F4B2BD",       // professional-sub (hồng phụ)
    light: "#FCE4E7",     // màu hồng nhạt
    dark: "#D63384",      // màu hồng đậm
  },
  
  // Màu phụ trợ
  secondary: {
    main: "#8592A3",      // professional-secondary
    light: "#F8F9FA",
    dark: "#6C757D",
  },
  
  // Màu trạng thái
  status: {
    success: "#71DD37",   // professional-success (xanh lá)
    warning: "#FFAB00",   // professional-warning (vàng)
    danger: "#FF3E1D",    // professional-danger (đỏ)
    info: "#03C3EC",      // professional-info (xanh dương)
  },
  
  // Màu chức năng
  functional: {
    orange: "#FD7E14",    // professional-orange
    blue: "#2092EC",      // professional-primary-5
    purple: "#696CFF",    // professional-primary-1
    teal: "#0D9394",      // professional-primary-2
    yellow: "#FFAB1D",    // professional-primary-3
    red: "#EB3D63",       // professional-primary-4
  },
  
  // Màu nền và text
  background: {
    white: "#FFFFFF",
    light: "#F8F9FA",
    gray: "#F5F5F5",
    dark: "#2B2C40",
  },
  
  text: {
    primary: "#22303E",   // professional-black
    secondary: "#7A838B", // professional-gray
    muted: "#8592A3",
    light: "#FFFFFF",
  },
  
  // Màu border
  border: {
    light: "#E4E4E7",
    medium: "#D1D5DB",
    dark: "#9CA3AF",
  }
}

export const navigationItems = [
  {
    title: "Trang chủ",
    href: "/",
    icon: Home,
    description: "Trang chủ nhà hàng"
  },
  {
    title: "Thực đơn",
    href: "/menu",
    icon: UtensilsCrossed,
    description: "Khám phá các món ăn ngon"
  },
  {
    title: "Đặt bàn",
    href: "/booking",
    icon: Calendar,
    description: "Đặt bàn trước để có chỗ ngồi tốt nhất"
  },
  {
    title: "Yêu thích",
    href: "/favorites",
    icon: Heart,
    description: "Xem các món ăn yêu thích của bạn"
  },
  {
    title: "Liên hệ",
    href: "/contact",
    icon: Mail,
    description: "Thông tin liên hệ và hỗ trợ"
  }
]

export const quickActions = [
  {
    title: "Đặt bàn",
    icon: Calendar,
    color: restaurantColors.functional.blue,
    bgColor: "#EBF8FF",
    href: "/(booking)/tables"
  },
  {
    title: "Gọi món",
    icon: UtensilsCrossed,
    color: restaurantColors.status.success,
    bgColor: "#F0FDF4",
    href: "/(restaurant)/menu"
  },
  {
    title: "Ưu đãi",
    icon: Award,
    color: restaurantColors.functional.purple,
    bgColor: "#F5F3FF",
    href: "/(restaurant)/promotions"
  },
  {
    title: "Lịch sử",
    icon: TrendingUp,
    color: restaurantColors.functional.yellow,
    bgColor: "#FFFBEB",
    href: "/(account)/history"
  }
]

export const serviceIcons = [
  {
    title: "Đặt bàn online",
    icon: Calendar,
    color: restaurantColors.functional.blue
  },
  {
    title: "Giao hàng tận nơi",
    icon: Package,
    color: restaurantColors.status.success
  },
  {
    title: "Thanh toán đa dạng",
    icon: CreditCard,
    color: restaurantColors.functional.orange
  },
  {
    title: "Tích điểm thưởng",
    icon: Gift,
    color: restaurantColors.functional.purple
  }
]

export const menuCategories = [
  { id: 'all', name: 'Tất cả', icon: UtensilsCrossed },
  { id: 'main', name: 'Món chính', icon: ChefHat },
  { id: 'appetizer', name: 'Khai vị', icon: Star },
  { id: 'soup', name: 'Canh/Súp', icon: UtensilsCrossed },
  { id: 'dessert', name: 'Tráng miệng', icon: Heart },
  { id: 'beverage', name: 'Đồ uống', icon: UtensilsCrossed },
  { id: 'salad', name: 'Salad', icon: Star }
]

export const profileMenuItems = [
  {
    section: "Tài khoản",
    items: [
      {
        title: "Thông tin cá nhân",
        subtitle: "Quản lý thông tin tài khoản",
        icon: User,
        href: "/profile/info"
      },
      {
        title: "Đặt bàn của tôi",
        subtitle: "Xem và quản lý đặt bàn",
        icon: Calendar,
        href: "/(booking)/reservations"
      },
      {
        title: "Yêu thích",
        subtitle: "Món ăn và nhà hàng yêu thích",
        icon: Heart,
        href: "/favorites"
      }
    ]
  },
  {
    section: "Dịch vụ",
    items: [
      {
        title: "Điểm thưởng",
        subtitle: "Xem điểm tích lũy và ưu đãi",
        icon: Award,
        href: "/rewards"
      },
      {
        title: "Lịch sử đơn hàng",
        subtitle: "Xem lại các đơn hàng đã đặt",
        icon: TrendingUp,
        href: "/(account)/history"
      },
      {
        title: "Tin nhắn",
        subtitle: "Trò chuyện với nhà hàng",
        icon: MessageCircle,
        href: "/(account)/chat"
      }
    ]
  },
  {
    section: "Hỗ trợ",
    items: [
      {
        title: "Trung tâm trợ giúp",
        subtitle: "Câu hỏi thường gặp và hướng dẫn",
        icon: HelpCircle,
        href: "/help"
      },
      {
        title: "Liên hệ hỗ trợ",
        subtitle: "Liên hệ đội ngũ hỗ trợ khách hàng",
        icon: Phone,
        href: "/(restaurant)/support"
      },
      {
        title: "Về chúng tôi",
        subtitle: "Thông tin về nhà hàng",
        icon: Info,
        href: "/about"
      }
    ]
  },
  {
    section: "Cài đặt",
    items: [
      {
        title: "Cài đặt ứng dụng",
        subtitle: "Tùy chỉnh thông báo và giao diện",
        icon: Settings,
        href: "/settings"
      },
      {
        title: "Chính sách bảo mật",
        subtitle: "Điều khoản sử dụng và bảo mật",
        icon: Shield,
        href: "/privacy"
      },
      {
        title: "Đăng xuất",
        subtitle: "Thoát khỏi tài khoản hiện tại",
        icon: LogOut,
        href: "/logout"
      }
    ]
  }
]

export const restaurantInfo = {
  contact: {
    address: appGlobal.address,
    phone: appGlobal.phone,
    email: appGlobal.email,
    website: appGlobal.website,
    hours: appGlobal.opening
  },
  
  social: {
    facebook: appGlobal.facebook,
    instagram: appGlobal.instagram,
    youtube: appGlobal.youtube,
    zalo: appGlobal.zalo
  },
  
  features: [
    "Phục vụ 24/7",
    "Wifi miễn phí",
    "Bãi đỗ xe rộng rãi",
    "Phòng riêng VIP",
    "Nhạc sống cuối tuần",
    "Món ăn chay đa dạng"
  ],
  
  achievements: [
    {
      title: "Top 10 nhà hàng Việt Nam 2024",
      icon: Award,
      color: restaurantColors.functional.orange
    },
    {
      title: "4.8/5 sao đánh giá khách hàng",
      icon: Star,
      color: restaurantColors.functional.yellow
    },
    {
      title: "10,000+ khách hàng hài lòng",
      icon: Heart,
      color: restaurantColors.primary.main
    }
  ]
}
