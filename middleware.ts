import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("🔍 Middleware running for path:", request.nextUrl.pathname);

  const allCookies = request.cookies.getAll();
  console.log("🍪 All cookies:", allCookies.map(c => c.name));

  // 👇 Use the exact cookie name from your browser (e.g., 'sb-localhost-auth-token')
  const token = request.cookies.getAll().find(c => c.name.startsWith('sb-'))?.value;
  console.log("🔑 Token exists?", !!token);

  const protectedRoutes = ["/dashboard", "/analytics", "/admin"];
  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );
  console.log("🛡️ Is protected route?", isProtected);

  if (isProtected && !token) {
    console.log("⛔ No token, redirecting to /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  console.log("✅ Allowing request");
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/analytics/:path*", "/admin/:path*"],
};