// middleware.ts (en la raíz del proyecto)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('[✅ Middleware ejecutado]', request.nextUrl.pathname)

  const token = request.cookies.get('token')?.value
  const pathname = request.nextUrl.pathname

  const isProtectedRoute = pathname.startsWith('/navegacion')

  if (!token && isProtectedRoute) {
    console.log('🔐 Sin token, redirigiendo a /forms')
    return NextResponse.redirect(new URL('/forms', request.url))
  }



  return NextResponse.next()
}

export const config = {
  matcher: [ '/navegacion/:path*'], // proteger todo lo que empieza con /navegacion
}
