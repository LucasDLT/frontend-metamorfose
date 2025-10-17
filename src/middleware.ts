import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const loginCookie = request.cookies.get("isLogin");
  const isLoggedIn = loginCookie?.value === "true";

  const isProtectedRoute = pathname.startsWith("/navegacion");
  const isFormRoute = pathname.startsWith("/forms");

  // aca intentamos hacer que si no está logueado y quiere ir a /navegacion se redirige a /
  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // y aca, si esta logueado y quiere ir a /forms lo mandamos  a /
  if (isLoggedIn && isFormRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/navegacion/:path*", "/forms/:path*", "/forms"],
};
