import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

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
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
