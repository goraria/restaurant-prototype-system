"use client"

import Link from "next/link"
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  Bolt
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button";
import { AppSidebarUserProps } from "@/constants/interfaces"
import { SignedIn, SignedOut, UserButton, useUser, useClerk } from "@clerk/nextjs";
import { UserResource } from "@clerk/types";

export function DropdownUser({
  user
}: {
  user: UserResource | null | undefined
}) {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(() => router.push('/'));
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: redirect to home page anyway
      router.push('/');
    }
  };

  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="h-8 w-8 rounded-md">
            <AvatarImage src={user?.imageUrl} alt={`${user?.fullName}`} />
            <AvatarFallback className="rounded-md">JG</AvatarFallback>
            {/* <AvatarImage src={nullToUndefined(user?.avatar)} alt={nullToUndefined(user?.name)} /> */}
            {/* <AvatarFallback className="rounded-md">CN</AvatarFallback> */}
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user?.username || user?.fullName}</span>
            <span className="truncate text-xs">{user?.emailAddresses?.[0]?.emailAddress}</span>
            {/* <span className="truncate font-medium">{user?.name}</span> */}
            {/* <span className="truncate text-xs">{user?.email}</span> */}
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <BadgeCheck className="mr-2 h-4 w-4" />
          <Link href="/settings/information">Tài khoản</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCard className="mr-2 h-4 w-4" />
          Thanh toán
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Bell className="mr-2 h-4 w-4" />
          Thông báo
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Bolt className="mr-2 h-4 w-4" />
          <Link href="/settings">Cài đặt</Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleLogout}>{/*   disabled={isLoggingOut} */}
        <LogOut className="mr-2 h-4 w-4" />
        {/*{isLoggingOut ? 'Logging out...' : 'Log out'}*/}
        Đăng xuất
      </DropdownMenuItem>
    </>
  );
}

export function NavUser({
  // user,
  type,
  size = "icon",
  side = "bottom",
  align = "end"
}: AppSidebarUserProps) {
  const { isMobile } = useSidebar();
  const { user } = useUser();

  // Helper function để chuyển đổi null thành undefined
  const nullToUndefined = (value: string | null | undefined): string | undefined => {
    return value === null ? undefined : value
  }

  return (
    <>
      {type === "navbar" ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 p-0 cursor-pointer"
              >
                <Avatar className="h-9 w-9 rounded-md">
                  <AvatarImage src={user?.imageUrl} alt={`${user?.fullName}`} />
                  <AvatarFallback className="rounded-md">JG</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align={align}
              sideOffset={4}
            >
              <DropdownUser user={user} />
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : type === "sidebar" ? (
        <>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {size === "lg" ? (
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar className="h-8 w-8 rounded-md">
                        <AvatarImage src={user?.imageUrl} alt={`${user?.fullName}`} />
                        <AvatarFallback className="rounded-md">JG</AvatarFallback>
                        {/* <AvatarImage src={nullToUndefined(user?.avatar)} alt={nullToUndefined(user?.name)} /> */}
                        {/* <AvatarFallback className="rounded-lg">WD</AvatarFallback> */}
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{user?.username || user?.fullName}</span>
                        <span className="truncate text-xs">{user?.emailAddresses?.[0]?.emailAddress}</span>
                        {/* <span className="truncate font-medium">{user?.name}</span> */}
                        {/* <span className="truncate text-xs">{user?.email}</span> */}
                      </div>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                  ) : size === "icon" ? (
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0"
                    >
                      <Avatar className="h-8 w-8 rounded-md">
                        <AvatarImage src={user?.imageUrl} alt={`${user?.fullName}`} />
                        <AvatarFallback className="rounded-md">JG</AvatarFallback>
                        {/* <AvatarImage src={nullToUndefined(user?.avatar)} alt={nullToUndefined(user?.name)} /> */}
                        {/* <AvatarFallback className="rounded-lg">WD</AvatarFallback> */}
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{user?.username || user?.fullName}</span>
                        <span className="truncate text-xs">{user?.emailAddresses?.[0]?.emailAddress}</span>
                        {/* <span className="truncate font-medium">{user?.name}</span> */}
                        {/* <span className="truncate text-xs">{user?.email}</span> */}
                      </div>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 p-0 cursor-pointer"
                      >
                        <Avatar className="h-9 w-9 rounded-md">
                          <AvatarImage src={user?.imageUrl} alt={`${user?.fullName}`} />
                          <AvatarFallback className="rounded-md">JG</AvatarFallback>
                        </Avatar>
                      </Button>
                    </>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  // side={isMobile ? "bottom" : "right"}
                  side={isMobile ? "bottom" : side}
                  align={align}
                  sideOffset={4}
                >
                  <DropdownUser user={user} />
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </>
      ) : (
        <></>
      )}
    </>
  )
}
