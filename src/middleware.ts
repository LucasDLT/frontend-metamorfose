import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const loginCookie = request.cookies.get("isLogin");
  const isLoggedIn = loginCookie?.value === "true";

  console.log("🧪 Todas las cookies:", request.cookies.getAll());
  console.log("[✅ Middleware ejecutado]", pathname);
  console.log("🔑 login cookie:", loginCookie?.value);

  const isProtectedRoute = pathname.startsWith("/navegacion");
  const isFormRoute = pathname.startsWith("/forms");

  // 1. Si no está logueado y quiere ir a /navegacion → redirigir a /
  if (!isLoggedIn && isProtectedRoute) {
    console.log("🔐 No login, redirigiendo a /");

    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Si está logueado y quiere ir a /forms → redirigir a /
  if (isLoggedIn && isFormRoute) {
    console.log("⛔ Ya logueado, no se permite /forms, redirigiendo a /");

    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/navegacion/:path*", "/forms/:path*", "/forms"],
};
