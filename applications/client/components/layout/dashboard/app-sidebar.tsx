"use client"

import React, { ComponentProps } from "react"
import Link from "next/link"
import Image from "next/image"
import { NavMain } from "@/components/layout/dashboard/nav-main"
import { NavProjects } from "@/components/layout/dashboard/nav-projects"
import { NavUser } from "@/components/elements/nav-user"
// import { TeamSwitcher } from "@/app/(dashboard)/settings/components/team-switcher"
import { type LucideIcon } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
// import { appGlobal } from "@/constants/constants";
import { AppSidebarProps } from "@/constants/types"

export function AppSidebar({ sidebar, global, ...props }: AppSidebarProps) {
// export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                {/* <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"> */}
                  {/* <Command className="size-4" /> */}
                {/* </div> */}
                <Image src="/logos/logo.png" alt={global.name} width={36} height={36} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{global.name}</span>
                  <span className="truncate text-xs">Settings</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebar.navMain} />
        <NavProjects projects={sidebar.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebar.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
