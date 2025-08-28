"use client"

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { appGlobal } from "@/constants/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QuickSetting } from "@/components/elements/quick-setting";
import { ModeToggle } from "@/components/elements/mode-toggle";
import { Separator } from "@/components/ui/separator";
// import { useRouter } from "next/navigation";
// import { useDispatch } from "react-redux";
// import { logout as logoutAction } from "@/store/slices/userSlice";
// import { useLogoutMutation } from "@/state/api";
import {
  BadgeCheck,
  CreditCard,
  Search,
  Sparkles,
  Bell,
  Globe,
  LogOut,
  Bolt,
  Menu,
  User,
  LogIn,
  KeySquare,
  Phone,
  Clock,
  MapPin,
  ShoppingCart
} from "lucide-react";
import { SignedIn, SignedOut, UserButton, useUser, useClerk } from "@clerk/nextjs";
import { ClerkSignIn, ClerkSignUp } from "@/components/elements/clerk-buttons";
import { dark } from "@clerk/themes";
import { navigation } from "@/constants/constants";

export function Navbar() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut(() => router.push('/'));
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: redirect to home page anyway
      router.push('/');
    }
  };

  console.log("Navbar rendered", user);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="bg-[#EC6683] text-white py-2">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Hotline: {appGlobal.hotline}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{appGlobal.times}</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{appGlobal.address}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/customer/booking" className="hover:underline">
                Đặt bàn ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto">
        <div className="flex h-16 items-center px-6">
          {/* Logo */}
          <div className="mr-4 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                className="w-9 h-9"
                src="/logos/icon.png"
                alt={appGlobal.name}
                width={36}
                height={36}
              />
              <span className="text-lg font-bold hidden md:inline-block">{appGlobal.name}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {/* <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </nav> */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navigation.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.children ? (
                    <>
                      <NavigationMenuTrigger className="text-base">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                          {item.children.map((child) => (
                            <li key={child.title}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={child.href}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="text-sm font-medium leading-none">
                                    {child.title}
                                  </div>
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                    {child.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild className="rounded-md">
                      <Link
                        href={item.href}
                        className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                      >
                        {item.title}
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="">{/*w-[300px] sm:w-[400px]*/}
              <SheetHeader className="pb-0">
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2">
                    <Image
                      src="/logos/logo.png"
                      alt={appGlobal.name}
                      width={48}
                      height={48}
                      className="rounded-lg"
                    />
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{appGlobal.name}</span>
                      <span className="truncate text-xs">Manager</span>
                    </div>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <Separator />
              <nav className="flex flex-col space-y-0 p-4 pt-0">
                {navigation.map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="justify-start w-full"
                  >
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-sm font-medium transition-colors hover:text-primary w-full text-left"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Search */}
          <div className="ml-auto flex items-center space-x-2">
            <div className="hidden lg:flex">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-[200px] pl-8"
                />
              </div>
            </div>

            {/* Language */}
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>Spanish</DropdownMenuItem>
                <DropdownMenuItem>French</DropdownMenuItem>
                <DropdownMenuItem>German</DropdownMenuItem>
                <DropdownMenuItem>Italian</DropdownMenuItem>
                <DropdownMenuItem>Vietnamese</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}

            {/* Theme Toggle */}
            <ModeToggle />
            <QuickSetting />

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-6 w-6" />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
                    8
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[320px] overflow-auto">
                  <DropdownMenuItem className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Tin nhắn mới</span>
                      <span className="text-xs text-muted-foreground">1h ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Bạn có tin nhắn mới từ Natalie</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Tin nhắn mới</span>
                      <span className="text-xs text-muted-foreground">1h ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Bạn có tin nhắn mới từ Natalie</p>
                  </DropdownMenuItem>
                  {/* Add more notification items */}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Carts */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
                    {99}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Giỏ hàng</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[360px] overflow-auto">
                  <DropdownMenuItem className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">New Message</span>
                      <span className="text-xs text-muted-foreground">1h ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">You have new message from Natalie</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">New Message</span>
                      <span className="text-xs text-muted-foreground">1h ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">You have new message from Natalie</p>
                  </DropdownMenuItem>
                  {/* Add more notification items */}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 p-0 cursor-pointer"
                    >
                      <Avatar className="h-9 w-9 rounded-lg">
                        <AvatarImage src={user?.imageUrl} alt={`${user?.fullName}`} />
                        <AvatarFallback className="rounded-lg">JG</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  {/* <div className="flex justify-end items-center">
                    <SignedOut>
                      <ClerkSignIn
                        label="Sign in"
                        buttonProps={{
                          variant: "ghost",
                          size: "sm",
                          className: "mr-2",
                        }}
                      />
                      <ClerkSignUp
                        label="Sign Up"
                        buttonProps={{
                          size: "sm",
                          className:
                            "bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5",
                        }}
                      />
                    </SignedOut>
                    <SignedIn>
                      <UserButton 
                        userProfileMode="navigation" 
                        userProfileUrl="/settings/information"
                        appearance={{
                          baseTheme: dark
                        }}
                      />
                    </SignedIn>
                  </div> */}
                  <DropdownMenuContent
                    className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                    // side={isMobile ? "bottom" : "right"}
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage src={user?.imageUrl} alt={`${user?.fullName}`} />
                          <AvatarFallback className="rounded-lg">JG</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-medium">{user?.username || user?.fullName}</span>
                          <span className="truncate text-xs">{user?.emailAddresses?.[0]?.emailAddress}</span>
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
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <User className="h-6 w-6" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                    // side={isMobile ? "bottom" : "right"}
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          {/* <AvatarImage src={user?.imageUrl} alt={`${user?.fullName}`} /> */}
                          <AvatarFallback className="rounded-lg">VT</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-medium">user</span>
                          <span className="truncate text-xs">Visitor</span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <LogIn className="mr-2 h-4 w-4" />
                        <Link href="/sign-in">Đăng nhập</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <KeySquare className="mr-2 h-4 w-4" />
                        <Link href="/sign-up">Đăng ký</Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {/* User Menu */}


            {/*<NavUser user={data.user}/>*/}
          </div>
        </div>
      </div>
    </header>
  );
};
