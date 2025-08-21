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
import { appGlobal, customerSidebar } from "@/constants/constants"
import { createBreadcrumbs } from "@/utils/breadcrumb-utils"
import { Dashbar } from "@/components/layout/dashbar"
import { Copyright } from "@/components/layout/copyright"

export default function CustomerLayout({ children }: { children: ReactNode } ) {
  const { user } = useUser()
  const pathname = usePathname()
  const router = useRouter()
  
  const breadcrumbs = createBreadcrumbs(pathname, appGlobal.name)
  
  return (
    <SidebarProvider>
      <AppSidebar 
        sidebar={customerSidebar} 
        global={appGlobal} 
        user={{
          name: user?.fullName,
          email: user?.emailAddresses[0]?.emailAddress,
          avatar: user?.imageUrl
        }}
      />
      <SidebarInset>
        <Dashbar>
          <SidebarTrigger className="-ml-1" />
        </Dashbar>
        <main className="flex flex-1 flex-col">
          <div className="container-wrapper">
            <div className="p-6">
              {children}
            </div>
          </div>
        </main>
        <Copyright />
      </SidebarInset>
    </SidebarProvider>
  )
}
