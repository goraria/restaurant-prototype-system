"use client"

import React, { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
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
import { appGlobal, settingsSidebar } from "@/constants/constants"
import { useUser } from "@clerk/nextjs"
import { createBreadcrumbs } from "@/utils/breadcrumb-utils"
import { Dashbar } from "@/components/layout/dashbar"
import { Copyright } from "@/components/layout/copyright"
// import { useCheckAccessQuery } from "@/state/api";
// import { useRouter } from "next/navigation";

export default function SettingsLayout({ children }: { children: ReactNode } ) {
  const { user } = useUser()
  const pathname = usePathname()
  
  const breadcrumbs = createBreadcrumbs(pathname, appGlobal.name)
  
  return (
    <SidebarProvider>
      <AppSidebar 
        sidebar={settingsSidebar} 
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
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
        <Copyright />
      </SidebarInset>
    </SidebarProvider>
  )
}
