import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  console.log("🔹 Middleware triggered for path:", req.nextUrl.pathname);
  
  const userToken = req.cookies.get("token")?.value;
  const adminToken = req.cookies.get("adminToken")?.value;
  const volunteerToken = req.cookies.get("volunteerToken")?.value;

  if (req.nextUrl.pathname === "/") {
    console.log("🔹 Checking User Token:", userToken);
    return userToken
      ? NextResponse.redirect(new URL("/dashboard", req.url))
      : NextResponse.redirect(new URL("/login", req.url));
  }

  if (req.nextUrl.pathname === "/admin") {
    console.log("🔹 Checking Admin Token:", adminToken);
    return adminToken
      ? NextResponse.redirect(new URL("/admin/dashboard", req.url))
      : NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if (req.nextUrl.pathname === "/volunteer") {
    console.log("🔹 Checking Volunteer Token:", volunteerToken);
    return volunteerToken
      ? NextResponse.redirect(new URL("/volunteer/dashboard", req.url))
      : NextResponse.redirect(new URL("/volunteer/login", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to these paths
export const config = {
  matcher: ["/", "/admin", "/volunteer"],
};
