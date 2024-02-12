import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { clerkUrls } from "./src/components/Authentication/Clerk/ClerkAuthSessionChecker";

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

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
  debug: true
};
