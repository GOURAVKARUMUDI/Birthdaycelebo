import { type NextRequest, NextResponse } from "next/server";
import { verifyToken, signAccessToken } from "@/lib/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect admin paths (except login itself)
  const isAdminPath = path.startsWith("/admin");
  const isLoginPage = path === "/admin/login";
  
  // Protect admin API paths (except auth handlers)
  const isAuthApi = path.startsWith("/api/admin");
  const isLoginApi = path === "/api/admin/login" || path === "/api/admin/refresh" || path === "/api/admin/logout";

  if ((isAdminPath && !isLoginPage) || (isAuthApi && !isLoginApi)) {
    const sessionCookie = request.cookies.get("admin_session");
    const refreshCookie = request.cookies.get("admin_refresh");

    // Bypass in mock mode if supabase credentials don't exist
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) {
      if (sessionCookie?.value === "mock-access-token" || refreshCookie?.value === "mock-refresh-token") {
        return NextResponse.next();
      }
      if (isAuthApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // 1. If access token cookie is missing
    if (!sessionCookie?.value) {
      if (refreshCookie?.value) {
        const verifiedRefresh = await verifyToken(refreshCookie.value);
        if (verifiedRefresh) {
          const payload = verifiedRefresh.payload;
          
          // Transparently issue a new access token
          const newAccessToken = await signAccessToken({
            id: payload.id,
            username: payload.username,
            role: "admin",
          });

          const response = NextResponse.next();
          response.cookies.set("admin_session", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60, // 15 mins
            path: "/",
          });
          return response;
        }
      }

      if (isAuthApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // 2. Verify access token
    const verified = await verifyToken(sessionCookie.value);
    if (!verified) {
      // Access token expired/invalid, try refresh token
      if (refreshCookie?.value) {
        const verifiedRefresh = await verifyToken(refreshCookie.value);
        if (verifiedRefresh) {
          const payload = verifiedRefresh.payload;
          
          // Transparently issue a new access token
          const newAccessToken = await signAccessToken({
            id: payload.id,
            username: payload.username,
            role: "admin",
          });

          const response = NextResponse.next();
          response.cookies.set("admin_session", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60, // 15 mins
            path: "/",
          });
          return response;
        }
      }

      if (isAuthApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
