import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminClient } from "@/lib/supabase/admin";
import { verifyToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session");
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    if (sessionCookie?.value && sessionCookie.value !== "mock-access-token") {
      const payload = await verifyToken(sessionCookie.value);
      if (payload) {
        const supabase = getAdminClient();
        if (supabase) {
          // Log logout audit trail
          await supabase.from("audit_logs").insert({
            admin_id: payload.payload.id,
            action: "LOGOUT",
            details: `IP: ${ip}, User: ${payload.payload.username}`,
            ip_address: ip,
          });
        }
      }
    }

    const response = NextResponse.json({ success: true });

    // Clear access and refresh cookies
    response.cookies.set("admin_session", "", { expires: new Date(0), path: "/" });
    response.cookies.set("admin_refresh", "", { expires: new Date(0), path: "/" });

    return response;
  } catch (error) {
    console.error("Logout API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
