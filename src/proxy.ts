import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  const isProd = process.env.NODE_ENV === "production";
  const cookieName = isProd ? "__Secure-better-auth.session_token" : "better-auth.session_token";
  const sessionCookie = request.cookies.get(cookieName);

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");

  if (!sessionCookie && !isAuthPage && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (sessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/transacciones/:path*",
    "/prestamos/:path*",
    "/reportes/:path*",
    "/alertas/:path*",
    "/login",
    "/register",
  ],
};
