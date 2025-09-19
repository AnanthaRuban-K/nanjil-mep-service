import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up", "/services"],
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)","/describe"],
};