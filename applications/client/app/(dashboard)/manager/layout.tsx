"use client"

import React, { ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { appGlobal, managerSidebar } from "@/constants/constants"
import { createBreadcrumbs } from "@/utils/breadcrumb-utils"
import { Dashbar } from "@/components/layout/dashbar"
import { Copyright } from "@/components/layout/copyright"

export default function DashboardLayout({ children }: { children: ReactNode } ) {
  const { user } = useUser()
  const pathname = usePathname()
  const router = useRouter()
  
  // Tạo breadcrumbs sử dụng utility function
  const breadcrumbs = createBreadcrumbs(pathname, appGlobal.name)
  
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
  
  return (
    <SidebarProvider>
      <AppSidebar 
        sidebar={managerSidebar} 
        global={appGlobal} 
        user={{
          name: user?.fullName,
          email: user?.emailAddresses[0]?.emailAddress,
          avatar: user?.imageUrl
        }}
      />
      <SidebarInset>
        {/* <header className="flex h-16 shrink-0 border-b items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"> */}
        {/* <div className="flex items-center gap-2 px-4"> */}
        {/* <header className="flex h-14 shrink-0 border-b items-center gap-2 ease-linear">
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
        </header> */}
        <Dashbar>
          <SidebarTrigger className="-ml-1" />
        </Dashbar>
        <main className="flex flex-1 flex-col">
          {/* <section className="border-grid border-b">
            <div className="container-wrapper">

            </div>
          </section> */}
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
        <Copyright />
        {/* <footer className="border-grid border-t py-0">
          <div className="mx-auto py-4 px-6">
            <div className="text-balance text-left text-sm leading-loose">
              text-muted-foreground text-center
              appGlobal.copyright
            </div>
          </div>
        </footer> */}
      </SidebarInset>
    </SidebarProvider>
  )
}
