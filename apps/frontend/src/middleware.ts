import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Simple middleware that just passes everything through
  // Clerk will handle auth on the client side
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};