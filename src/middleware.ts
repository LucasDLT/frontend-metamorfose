// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const isLoginPage = request.nextUrl.pathname === '/forms'

  // Si NO hay token y NO estás en la página de login => redirigir a /forms
  if (!token && !isLoginPage) {
    const loginUrl = new URL('/forms', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Si HAY token y estás tratando de ir a /forms => redirigir al panel (o a donde quieras)
  if (token && isLoginPage) {
    const panelUrl = new URL('/navegacion', request.url)
    return NextResponse.redirect(panelUrl)
  }

  // Si todo está bien, continuar
  return NextResponse.next()
}

export const config = {
  matcher: ['/forms', '/navegacion/:path*'], // protege forms y todo lo debajo de /navegacion
}
