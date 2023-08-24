import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { clerkUrls } from "./src/components/Authentication/Clerk/ClerkAuthSessionChecker";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/nextjs/middleware for more information about configuring your middleware
export default authMiddleware({
  afterAuth(auth, req, evt) {
    // handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
    // redirect them to organization selection page
    if (
      auth.userId &&
      !auth.orgId &&
      req.nextUrl.pathname !== clerkUrls.organizationSwitcher &&
      req.nextUrl.pathname !== clerkUrls.createOrganization &&
      req.nextUrl.pathname !== clerkUrls.organizationProfile
    ) {
      const orgSelection = new URL(clerkUrls.organizationSwitcher, req.url);
      return NextResponse.redirect(orgSelection);
    }
  },
  publicRoutes: ["/", "/login", "/registration"]
});

const isClerkyAuth = process.env.NEXT_PUBLIC_AUTH_IS_CLERK === "true";

export const config = {
  matcher: isClerkyAuth
    ? ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
    : ["/no-paths-to-match"]
};
