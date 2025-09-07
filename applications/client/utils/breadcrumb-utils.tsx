import { managerSidebar, settingsSidebar } from '@/constants/constants'

export interface BreadcrumbItem {
  href: string
  label: string
  isLast: boolean
}

// Type cho sidebar
interface SidebarItem {
  title: string
  url?: string
  items?: { title: string; url: string }[]
}

interface Sidebar {
  navMain: SidebarItem[]
}

// Helper function để tìm breadcrumb label từ navMain
export const findBreadcrumbLabel = (path: string, sidebar: Sidebar): string | null => {
  // Tìm trong navMain items
  for (const navItem of sidebar.navMain) {
    // Kiểm tra exact match với navItem.url
    if (navItem.url === path) {
      return navItem.title
    }
    
    // Kiểm tra trong sub items
    if (navItem.items) {
      for (const subItem of navItem.items) {
        if (subItem.url === path) {
          return subItem.title
        }
      }
    }
  }
  
  return null
}

// Helper function để tìm parent breadcrumb
export const findParentBreadcrumb = (path: string, sidebar: Sidebar): string | null => {
  for (const navItem of sidebar.navMain) {
    if (navItem.items) {
      for (const subItem of navItem.items) {
        if (subItem.url === path) {
          return navItem.title
        }
      }
    }
  }
  return null
}

// Main function để tạo breadcrumbs từ pathname
export const createBreadcrumbs = (pathname: string, appName: string): BreadcrumbItem[] => {
  const pathSegments = pathname.split('/').filter(segment => segment !== '')
  const breadcrumbItems: BreadcrumbItem[] = []
  
  // Luôn có home/app name đầu tiên
  breadcrumbItems.push({
    href: '/',
    label: appName,
    isLast: pathSegments.length === 0
  })
  
  // Lọc bỏ segments với dấu ngoặc (như (dashboard))
  const validSegments = pathSegments.filter(segment => !segment.startsWith('(') || !segment.endsWith(')'))
  
  let currentPath = ''
  
  validSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    let breadcrumbLabel = segment.charAt(0).toUpperCase() + segment.slice(1)
    
    // Xác định sidebar nào để tìm kiếm dựa trên segment đầu tiên
    let targetSidebar = managerSidebar
    if (validSegments[0] === 'settings') {
      targetSidebar = settingsSidebar
    }
    
    // Tìm label chính xác từ sidebar
    const foundLabel = findBreadcrumbLabel(currentPath, targetSidebar)
    if (foundLabel) {
      breadcrumbLabel = foundLabel
    } else {
      // Nếu không tìm thấy exact match, tìm parent để có context tốt hơn
      const parentLabel = findParentBreadcrumb(currentPath, targetSidebar)
      if (parentLabel && index === validSegments.length - 1) {
        // Nếu đây là segment cuối và có parent, có thể cải thiện label
        switch (segment) {
          case 'analytics':
            breadcrumbLabel = 'Thống kê'
            break
          case 'revenue':
            breadcrumbLabel = 'Doanh thu'
            break
          case 'reports':
            breadcrumbLabel = 'Báo cáo'
            break
          case 'trends':
            breadcrumbLabel = 'Xu hướng'
            break
          case 'menu-items':
            breadcrumbLabel = 'Danh sách món'
            break
          case 'categories':
            breadcrumbLabel = 'Phân loại'
            break
          case 'pricing':
            breadcrumbLabel = 'Giá cả'
            break
          case 'inventory':
            breadcrumbLabel = 'Tồn kho'
            break
          case 'orders':
            breadcrumbLabel = 'Đơn hàng'
            break
          case 'pending':
            breadcrumbLabel = 'Chờ xử lý'
            break
          case 'completed':
            breadcrumbLabel = 'Hoàn thành'
            break
          case 'cancelled':
            breadcrumbLabel = 'Đã hủy'
            break
          case 'customers':
            breadcrumbLabel = 'Khách hàng'
            break
          case 'staff':
            breadcrumbLabel = 'Nhân viên'
            break
          case 'roles':
            breadcrumbLabel = 'Vai trò'
            break
          case 'permissions':
            breadcrumbLabel = 'Quyền hạn'
            break
          case 'tables':
            breadcrumbLabel = 'Bàn ăn'
            break
          case 'reservations':
            breadcrumbLabel = 'Đặt bàn'
            break
          case 'schedule':
            breadcrumbLabel = 'Lịch trình'
            break
          case 'promotions':
            breadcrumbLabel = 'Khuyến mãi'
            break
          case 'coupons':
            breadcrumbLabel = 'Phiếu giảm giá'
            break
          case 'loyalty':
            breadcrumbLabel = 'Khách hàng thân thiết'
            break
          case 'notifications':
            breadcrumbLabel = 'Thông báo'
            break
          case 'reviews':
            breadcrumbLabel = 'Đánh giá'
            break
          case 'feedback':
            breadcrumbLabel = 'Phản hồi'
            break
          case 'general':
            breadcrumbLabel = 'Tổng quát'
            break
          case 'appearance':
            breadcrumbLabel = 'Giao diện'
            break
          case 'privacy':
            breadcrumbLabel = 'Quyền riêng tư'
            break
          case 'security':
            breadcrumbLabel = 'Bảo mật'
            break
          case 'integrations':
            breadcrumbLabel = 'Tích hợp'
            break
          case 'billing':
            breadcrumbLabel = 'Thanh toán'
            break
          case 'support':
            breadcrumbLabel = 'Hỗ trợ'
            break
          case 'manager':
            breadcrumbLabel = 'Tổng quan'
            break
          default:
            // Fallback: capitalize first letter và thay thế dấu gạch ngang
            breadcrumbLabel = segment
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
        }
      }
    }
    
    breadcrumbItems.push({
      href: currentPath,
      label: breadcrumbLabel,
      isLast: index === validSegments.length - 1
    })
  })
  
  return breadcrumbItems
}

// Mapping cho các path thường dùng
export const pathToVietnamese: Record<string, string> = {
  '/manager': 'Tổng quan',
  '/manager/analytics': 'Thống kê',
  '/manager/analytics/revenue': 'Doanh thu',
  '/manager/analytics/reports': 'Báo cáo',
  '/manager/analytics/trends': 'Xu hướng',
  '/manager/menu-items': 'Danh sách món',
  '/manager/menu-items/categories': 'Phân loại',
  '/manager/menu-items/pricing': 'Giá cả',
  '/manager/menu-items/inventory': 'Tồn kho',
  '/manager/orders': 'Đơn hàng',
  '/manager/orders/pending': 'Chờ xử lý',
  '/manager/orders/completed': 'Hoàn thành',
  '/manager/orders/cancelled': 'Đã hủy',
  '/manager/customers': 'Khách hàng',
  '/manager/customers/database': 'Cơ sở dữ liệu',
  '/manager/customers/analytics': 'Phân tích khách hàng',
  '/manager/staff': 'Nhân viên',
  '/manager/staff/roles': 'Vai trò',
  '/manager/staff/permissions': 'Quyền hạn',
  '/manager/tables': 'Bàn ăn',
  '/manager/tables/reservations': 'Đặt bàn',
  '/manager/tables/schedule': 'Lịch trình',
  '/manager/promotions': 'Khuyến mãi',
  '/manager/promotions/coupons': 'Phiếu giảm giá',
  '/manager/promotions/loyalty': 'Khách hàng thân thiết',
  '/manager/notifications': 'Thông báo',
  '/manager/reviews': 'Đánh giá',
  '/manager/reviews/feedback': 'Phản hồi',
  '/settings': 'Cài đặt',
  '/settings/general': 'Tổng quát',
  '/settings/appearance': 'Giao diện',
  '/settings/privacy': 'Quyền riêng tư',
  '/settings/security': 'Bảo mật',
  '/settings/integrations': 'Tích hợp',
  '/settings/billing': 'Thanh toán',
  '/settings/support': 'Hỗ trợ'
}
