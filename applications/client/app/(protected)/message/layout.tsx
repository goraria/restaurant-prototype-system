import { MessSidebar } from "@/components/dashboard/mess-sidebar"
import { ModeToggle } from "@/components/elements/mode-toggle"
import { Copyright } from "@/components/layout/copyright"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

export default function MessageLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "360px",
        } as React.CSSProperties
      }
    >
      <MessSidebar />
      <SidebarInset>
        {/* <header className="flex h-14 bg-background sticky top-0 shrink-0 items-center gap-2 border-b p-4 ease-linear">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Tin nhắn</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Hộp thư đến</BreadcrumbPage>
              </BreadcrumbItem>

            </BreadcrumbList>
          </Breadcrumb>
          <div className="items-center px-6">
            <div className="ml-auto flex items-center space-x-2">
              <ModeToggle />
            </div>
          </div>
        </header> */}
        <header className="flex h-14 shrink-0 border-b items-center gap-2 ease-linear">
          <div className="flex flex-1 items-center justify-between gap-2 px-6">
            <div className="container flex h-14 items-center gap-2 md:gap-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Tin nhắn</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Hộp thư đến</BreadcrumbPage>
                  </BreadcrumbItem>

                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="items-center">
              <div className="ml-auto flex items-center space-x-2">
                <ModeToggle />
              </div>
            </div>
          </div>
        </header>
        <main className="flex flex-1 flex-col">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
        <Copyright />
      </SidebarInset>
    </SidebarProvider>
  )
}