import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { STRAPI_BASE_URL } from "./lib/strapi"

const protectedRoutes = ['/dashboard', '/dashboard/:path*']

function isProtectedRoute(pathname: string) {
  return protectedRoutes.includes(pathname)
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next()
  }

  try {
    // 1. Validar si el usuario esta autenticado
    const cookieStore = await cookies()
    const jwt = cookieStore.get('jwt')?.value

    if (!jwt) {
      console.info('No estas autenticado')
      return NextResponse.redirect(new URL('/signin', request.url))
    }

    // 2- Validar si el usuario existe
    const response = await fetch(`${STRAPI_BASE_URL}/api/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
    })

    const userResponse = await response.json()

    if (!userResponse?.username) {
      console.info('No existe el usuario')
      return NextResponse.redirect(new URL('/signin', request.url))
    }

    return NextResponse.next()

  } catch (error) {
    console.error('Error validating token', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/dashboard",
    "/dashboard/:path*",
  ]
}