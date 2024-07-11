import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPubliclyAccessibleRoute = createRouteMatcher([
  // all pages except the ones listed below are protected
  "/login(.*)",
  "/registration(.*)"
]);

export default clerkMiddleware(
  (auth, request) => {
    // Protect all routes except the ones listed above
    // https://clerk.com/docs/references/nextjs/clerk-middleware#protect-all-routes
    if (!isPubliclyAccessibleRoute(request)) {
      auth().protect();
    }

    return NextResponse.next();
  },
  {
    debug: true
  }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
};
