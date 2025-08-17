"use client"

import React, { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/layout/dashboard/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/elements/mode-toggle"
import { appGlobal, settingsSidebar } from "@/constants/constants";
// import { useCheckAccessQuery } from "@/state/api";
// import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: ReactNode } ) {
  const pathname = usePathname()
  // const router = useRouter();
  // const { data: access, isLoading: accessLoading } = useCheckAccessQuery('/manager');
  //
  // useEffect(() => {
  //   if (!accessLoading && access && !access.allowed) {
  //     // Nếu chưa đăng nhập -> chuyển sign-in, nếu thiếu role -> forbidden
  //     if (access.reason === 'UNAUTHENTICATED') router.replace('/sign-in');
  //     else router.replace('/'); // hoặc '/forbidden'
  //   }
  // }, [accessLoading, access, router]);
  //
  // if (accessLoading || (access && !access.allowed)) {
  //   return <div className="p-6 text-sm text-muted-foreground">Checking access...</div>;
  // }
  
  // Tạo breadcrumb items từ URL
  const createBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(segment => segment !== '')
    const breadcrumbItems = []
    
    // Luôn có home/app name đầu tiên
    breadcrumbItems.push({
      href: '/',
      label: appGlobal.name,
      isLast: pathSegments.length === 0
    })
    
    // Tìm kiếm thông tin từ managerSidebar để tạo breadcrumb chính xác
    let currentPath = ''
    const validSegments = pathSegments.filter(segment => !segment.startsWith('(') || !segment.endsWith(')'))
    
    validSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      let breadcrumbLabel = segment.charAt(0).toUpperCase() + segment.slice(1)

      // Tìm kiếm trong settingsSidebar.navMain để lấy title chính xác
      for (const navItem of settingsSidebar.navMain) {
        // Kiểm tra nếu segment này là main nav item
        if (navItem.title.toLowerCase() === segment.toLowerCase()) {
          breadcrumbLabel = navItem.title
          break
        }
        
        // Kiểm tra trong sub items
        if (navItem.items) {
          for (const subItem of navItem.items) {
            if (subItem.url === currentPath) {
              // Nếu đây là segment cuối và tìm thấy trong sub items
              if (index === validSegments.length - 1) {
                breadcrumbLabel = subItem.title
              }
              break
            }
          }
        }
      }
      
      // Xử lý các trường hợp đặc biệt
      if (segment === 'user-management') {
        breadcrumbLabel = 'User'
      } else if (segment === 'product-management') {
        breadcrumbLabel = 'Product'
      }
      
      breadcrumbItems.push({
        href: currentPath,
        label: breadcrumbLabel,
        isLast: index === validSegments.length - 1
      })
    })
    
    return breadcrumbItems
  }
  
  const breadcrumbs = createBreadcrumbs()
  
  return (
    <SidebarProvider>
      <AppSidebar sidebar={settingsSidebar} global={appGlobal} />
      <SidebarInset>
        {/* <header className="flex h-16 shrink-0 border-b items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"> */}
        <header className="flex h-14 shrink-0 border-b items-center gap-2 ease-linear">
          {/* <div className="flex items-center gap-2 px-4"> */}
          <div className="container flex h-14 items-center gap-2 md:gap-4 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((item, index) => (
                  <React.Fragment key={item.href}>
                    <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                      {item.isLast ? (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={item.href}>
                            {item.label}
                          </Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!item.isLast && (
                      <BreadcrumbSeparator className={index === 0 ? "hidden md:block" : ""} />
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ModeToggle
            className="px-4 ml-auto"
          />
        </header>
        {children}
        <footer className="border-grid border-t py-0">
          <div className="mx-auto p-4">
            <div className="text-balance text-left text-sm leading-loose">{/* text-muted-foreground text-center */}
              Copyright © 2020 - {new Date().getFullYear()} Gorth Inc. All rights reserved.
            </div>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  )
}
