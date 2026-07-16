import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAdminClient } from "@/lib/supabase/admin";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    const supabase = getAdminClient();
    if (!supabase) {
      // operating in mock mode
      if (username === "gourav" && password === "Tinku@2006") {
        const response = NextResponse.json({ success: true, user: { username } });
        // Set mock cookies
        response.cookies.set("admin_session", "mock-access-token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 15 * 60, // 15 mins
          path: "/",
        });
        response.cookies.set("admin_refresh", "mock-refresh-token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60, // 7 days
          path: "/",
        });
        return response;
      }
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 1. Query admin
    const { data: admin, error } = await supabase
      .from("admins")
      .select("*")
      .eq("username", username)
      .single();

    if (error || !admin) {
      console.warn(`Auth failed: Admin user '${username}' not found.`);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 2. Compare password
    const match = bcrypt.compareSync(password, admin.password_hash);
    if (!match) {
      // Log failed attempt
      await supabase.from("audit_logs").insert({
        admin_id: null,
        action: "FAILED_LOGIN_ATTEMPT",
        details: `IP: ${ip}, User: ${username}`,
        ip_address: ip,
      });

      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 3. Create tokens
    const accessToken = await signAccessToken({ id: admin.id, username: admin.username, role: "admin" });
    const refreshToken = await signRefreshToken({ id: admin.id, username: admin.username, role: "admin" });

    // 4. Log successful login
    await supabase.from("audit_logs").insert({
      admin_id: admin.id,
      action: "SUCCESSFUL_LOGIN",
      details: `IP: ${ip}, User: ${username}`,
      ip_address: ip,
    });

    const response = NextResponse.json({ success: true, user: { id: admin.id, username: admin.username } });

    // Set secure HTTP-only cookies
    response.cookies.set("admin_session", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60, // 15 mins
      path: "/",
    });

    response.cookies.set("admin_refresh", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
