import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const publicPaths = [
  "/login",
  "/registro",
  "/api/auth",
  "/api/webhook",
  "/api/cron",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir rotas publicas
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Permitir assets estaticos
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Verificar autenticacao
  const token = await getToken({ req: request });

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    // Validar que callbackUrl e um path relativo (prevenir open redirect)
    if (pathname.startsWith("/") && !pathname.startsWith("//")) {
      loginUrl.searchParams.set("callbackUrl", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Redirecionar usuarios autenticados que tentam acessar login/registro
  if (pathname === "/login" || pathname === "/registro") {
    return NextResponse.redirect(new URL("/agenda", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
