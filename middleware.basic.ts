import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login", "/api/", "/registration"];

function isPublicPath(pathname: string): boolean {
  return publicPaths.some((p) => pathname.startsWith(p));
}

export default function basicMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.nextUrl.searchParams.get("token");
  if (token) {
    return NextResponse.next();
  }

  const hasSession =
    request.cookies.has("ory_kratos_session") ||
    request.cookies.has("authorization");

  if (!hasSession) {
    const returnTo = encodeURIComponent(request.url);
    return NextResponse.redirect(
      new URL(`/login?return_to=${returnTo}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"]
};
