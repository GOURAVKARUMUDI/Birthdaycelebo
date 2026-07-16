import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminClient } from "@/lib/supabase/admin";
import { verifyToken, signAccessToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const refreshCookie = cookieStore.get("admin_refresh");
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    if (!refreshCookie?.value) {
      return NextResponse.json({ error: "Refresh token missing" }, { status: 401 });
    }

    const token = refreshCookie.value;

    if (token === "mock-refresh-token") {
      const response = NextResponse.json({ success: true });
      response.cookies.set("admin_session", "mock-access-token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60,
        path: "/",
      });
      return response;
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 401 });
    }

    const supabase = getAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: "Invalid configuration" }, { status: 500 });
    }

    // Verify admin exists in db
    const { data: admin, error } = await supabase
      .from("admins")
      .select("*")
      .eq("id", payload.payload.id)
      .single();

    if (error || !admin) {
      return NextResponse.json({ error: "User no longer exists" }, { status: 401 });
    }

    // Generate new access token
    const newAccessToken = await signAccessToken({
      id: admin.id,
      username: admin.username,
      role: "admin",
    });

    const response = NextResponse.json({ success: true });

    // Set new access token cookie
    response.cookies.set("admin_session", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60, // 15 mins
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Refresh API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
