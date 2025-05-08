import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { toast } from 'sonner';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const loginCookie = request.cookies.get('isLogin');
  const isLoggedIn = loginCookie?.value === 'true';

  console.log('🧪 Todas las cookies:', request.cookies.getAll());
  console.log('[✅ Middleware ejecutado]', pathname);
  console.log('🔑 login cookie:', loginCookie?.value);

  const isProtectedRoute = pathname.startsWith('/navegacion');
  const isFormRoute = pathname.startsWith('/forms');

  // 1. Si no está logueado y quiere ir a /navegacion → redirigir a /
  if (!isLoggedIn && isProtectedRoute) {
    console.log('🔐 No login, redirigiendo a /');
    toast.error('No estas logueado',{ 
      style:{
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
        height: "20px",
        width: "200px",
        backgroundColor: "#6666662f",
        fontFamily: " afacad",
      } }
    );
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. Si está logueado y quiere ir a /forms → redirigir a /
  if (isLoggedIn && isFormRoute) {
    console.log('⛔ Ya logueado, no se permite /forms, redirigiendo a /');
    toast.error('Ya estas logueado',{
      style:{
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
        height: "20px",
        width: "200px",
        backgroundColor: "#6666662f",
        fontFamily: " afacad",
      } 
      
    })
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/navegacion/:path*', '/forms/:path*', '/forms'],
};
