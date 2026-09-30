import { NextRequest, NextResponse } from "next/server";

function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("tara_admin_token")?.value;

  // Allow the login page without authentication
  if (pathname === "/admin/login") {
    // If already logged in, go to dashboard
    if (token) {
      return NextResponse.redirect(
        new URL("/admin", request.url)
      );
    }

    return NextResponse.next();
  }

  // Protect all /admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
    }
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ["/admin/:path*"],
};