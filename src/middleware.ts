import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  
  const userToken = req.cookies.get("token")?.value;
  const adminToken = req.cookies.get("adminToken")?.value;
  const volunteerToken = req.cookies.get("volunteerToken")?.value;

  if (req.nextUrl.pathname === "/") {
    return userToken
      ? NextResponse.redirect(new URL("/dashboard", req.url))
      : NextResponse.redirect(new URL("/login", req.url));
  }

  if (req.nextUrl.pathname === "/admin") {
    return adminToken
      ? NextResponse.redirect(new URL("/admin/dashboard", req.url))
      : NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if (req.nextUrl.pathname === "/volunteer") {
    return volunteerToken
      ? NextResponse.redirect(new URL("/volunteer/dashboard", req.url))
      : NextResponse.redirect(new URL("/volunteer/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin", "/volunteer"],
};
