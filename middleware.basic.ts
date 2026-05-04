import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login", "/registration"];
const publicApiPaths = ["/api/auth/login"];

function isPublicPath(pathname: string): boolean {
  return (
    publicPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`)) ||
    publicApiPaths.includes(pathname)
  );
}

export default function basicMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // FIXME: Comment it out. Not sure what this for.
  // const token = request.nextUrl.searchParams.get("token");
  // if (token) {
  //   return NextResponse.next();
  // }

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
