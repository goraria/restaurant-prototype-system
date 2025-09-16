import { clerkMiddleware, createRouteMatcher, auth } from '@clerk/nextjs/server'
import { UserRole } from "@/constants/interfaces";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/',                      // Trang chủ
  '/about',                 // Trang giới thiệu  
  '/contact',               // Trang liên hệ
  '/pages',                 // Trang pages
  '/public(.*)',           // Tất cả trang trong thư mục public
  '/help',                 // Trang trợ giúp
  '/privacy',              // Trang chính sách bảo mật
  '/terms',                // Trang điều khoản sử dụng
  '/pricing',              // Trang bảng giá (nếu có)
  '/features',             // Trang tính năng
  '/blog(.*)',             // Blog posts
  '/news(.*)',             // Tin tức
  '/api/clerk',            // Clerk webhook endpoint - phải public
])

// Route admin - admin application riêng biệt
const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
])

// Route protected - settings, etc cho tất cả user đã đăng nhập  
const isProtectedRoute = createRouteMatcher([
  '/settings(.*)',
  '/profile(.*)',
  '/message(.*)',
])

// Role-specific routes
const isManagerRoute = createRouteMatcher([
  '/manager(.*)',
])

const isStaffRoute = createRouteMatcher([
  '/staff(.*)',
])

const isDeliverRoute = createRouteMatcher([
  '/deliver(.*)',
])

const isCustomerRoute = createRouteMatcher([
  '/customer(.*)',
])

// Type definitions for Clerk session claims
export interface ClerkOrganizationClaims {
  id: string      // Organization ID (e.g., 'org_32VIQ0797trwqZvMZ2UaOD21AXi')
  rol: "admin" | "manager" | "staff" | "customer" | "deliver"  // User role
  slg: string     // Organization slug (e.g., 'waddles')
}

export interface ClerkSessionClaims {
  o?: ClerkOrganizationClaims  // Organization claims
  // Add other session claims here if needed
}

// Helper function to get user role from session claims
export function getUserRole(sessionClaims: unknown): ClerkOrganizationClaims['rol'] {
  const orgClaims = (sessionClaims as ClerkSessionClaims)?.o
  return orgClaims?.rol || "customer"
}

// Helper function to get organization info
export function getOrganizationInfo(sessionClaims: unknown): ClerkOrganizationClaims | null {
  const orgClaims = (sessionClaims as ClerkSessionClaims)?.o
  return orgClaims || null
}


export default clerkMiddleware(
  async (
    auth,
    req
  ) => {
    const { sessionClaims } = await auth()
    // const { userId, organizationId } = auth()
    // const role = (sessionClaims?.metadata as {
    //   role: "admin" | "manager" | "staff" | "customer" | "deliver"
    //   // role: UserRole
    // })?.role || "customer"

    // const role = sessionClaims?.o?.rol
    // console.log(sessionClaims?.o);

    // Sử dụng helper function với type safety
    const role = getUserRole(sessionClaims)
    const orgInfo = getOrganizationInfo(sessionClaims)
    
    // console.log("User role:", role);
    // console.log("Organization info:", orgInfo);

    // 1. Admin có thể truy cập tất cả
    if (role === "admin") {
      // Admin bypass all restrictions
      if (!isPublicRoute(req)) {
        await auth.protect()
      }
      return NextResponse.next()
    }

    // 2. Route protected - tất cả user đã đăng nhập được truy cập
    if (isProtectedRoute(req)) {
      await auth.protect() // Chỉ cần đăng nhập
      return NextResponse.next()
    }

    // 3. Role-specific routes - kiểm tra role cụ thể
    if (isManagerRoute(req)) {
      if (role !== "manager") {
        const url = new URL("/", req.url)
        return NextResponse.redirect(url)
      }
    }

    if (isStaffRoute(req)) {
      if (role !== "staff") {
        const url = new URL("/", req.url)
        return NextResponse.redirect(url)
      }
    }

    if (isDeliverRoute(req)) {
      if (role !== "deliver") {
        const url = new URL("/", req.url)
        return NextResponse.redirect(url)
      }
    }

    if (isCustomerRoute(req)) {
      if (role !== "customer") {
        const url = new URL("/", req.url)
        return NextResponse.redirect(url)
      }
    }

    // 4. Protect tất cả routes không public
    if (!isPublicRoute(req)) {
      await auth.protect()
    }
  }
)

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
