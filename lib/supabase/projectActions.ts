"use server";

import { getAdminClient } from "./admin";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function fetchProjects() {
  const supabase = getAdminClient();
  if (!supabase) {
    // operating in mock mode
    return [
      { id: "1", recipient_name: "Sarah", slug: "sarah", status: "published", occasion: "birthday", created_at: new Date().toISOString() },
      { id: "2", recipient_name: "Gourav", slug: "gourav", status: "draft", occasion: "birthday", created_at: new Date().toISOString() },
    ];
  }

  const { data: projs, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }

  return projs || [];
}

export async function fetchAuditLogs() {
  const supabase = getAdminClient();
  if (!supabase) {
    // operating in mock mode
    return [
      { id: "1", action: "SUCCESSFUL_LOGIN", details: "IP: 192.168.0.1, User: gourav", created_at: new Date().toISOString(), ip_address: "192.168.0.1" },
    ];
  }

  const { data: logs, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Failed to fetch audit logs:", error);
    return [];
  }

  return logs || [];
}

export async function deleteProject(id: string) {
  const supabase = getAdminClient();
  if (!supabase) {
    return { success: true };
  }

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) {
    console.error("Failed to delete project:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/projects");
  return { success: true };
}

export async function createProject(recipientName: string, slug: string) {
  const supabase = getAdminClient();
  if (!supabase) {
    // operating in mock mode
    return { success: true, id: `mock-project-id-${Date.now()}` };
  }

  try {
    const cleanSlug = slug.trim().toLowerCase();
    
    // 1. Create project row
    const { data: project, error: projError } = await supabase
      .from("projects")
      .insert({
        recipient_name: recipientName.trim(),
        slug: cleanSlug,
        title: `${recipientName.trim()}'s Special Scrapbook`,
        status: "draft",
        occasion: "birthday",
        passwords: { relationship: "love123", friend: "friend123", family: "family123" },
        countdown_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
        bg_music_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      })
      .select()
      .single();

    if (projError) throw projError;

    // 2. Create default theme row
    const { error: themeError } = await supabase
      .from("themes")
      .insert({
        project_id: project.id,
        colors: {
          themeName: "Birthday Theme",
          primaryColor: "#FFD1DC",
          secondaryColor: "#E8DEF8",
          backgroundColor: "#FFF8F8",
          foregroundColor: "#4A3B32",
          radius: "24px",
          shadows: "md",
          cursor: "sparkle",
          loader: "cake",
          fontHeading: "Poppins",
          fontBody: "Nunito",
          fontHandwriting: "Caveat",
          backgroundAnimation: "balloons",
          stickers: ["🎈", "🎂", "🎉", "🎁"],
          icons: "outline",
          balloonsEnabled: true,
          confettiEnabled: true,
          fireworksEnabled: true,
          buttonStyle: "rounded",
          cardStyle: "shadow",
          pageTransition: "fade",
        },
        cursor: "sparkle",
        loader_type: "cake",
        radius: "24px",
        shadows: "md"
      });

    if (themeError) throw themeError;

    // 3. Create default pages (Home Dashboard, Memories, Arcade Games)
    const { data: homePage } = await supabase
      .from("pages")
      .insert({
        project_id: project.id,
        slug: "home",
        title: "Home Dashboard",
        heading: `A Special Gift For You ❤️`,
        subheading: "Happy Birthday!",
        quote: "Make a wish! Blow out the candles and let's celebrate another amazing year!",
        button_text: "Open Scrapbook",
        footer_text: "Made with love for you 🎂",
        order_index: 0,
      })
      .select()
      .single();

    if (homePage) {
      // Add default section
      const { data: section } = await supabase
        .from("sections")
        .insert({ page_id: homePage.id, order_index: 0, layout_type: "single-col" })
        .select()
        .single();

      if (section) {
        // Add default countdown and mascot blocks
        await supabase.from("blocks").insert([
          {
            section_id: section.id,
            type: "countdown",
            order_index: 0,
            properties: { targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString() },
            styles: { padding: "8px" },
            animation: { type: "scale", duration: 0.8 }
          },
          {
            section_id: section.id,
            type: "mascot",
            order_index: 1,
            properties: { type: "giraffe", state: "idle", size: 150, caption: "Tap me!" },
            styles: { padding: "16px" },
            animation: { type: "slide-up", duration: 0.6 }
          }
        ]);
      }
    }

    revalidatePath("/admin/projects");
    return { success: true, id: project.id };
  } catch (error: any) {
    console.error("Failed creating project:", error);
    return { success: false, error: error.message || error };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.set("admin_session", "", { expires: new Date(0), path: "/" });
  cookieStore.set("admin_refresh", "", { expires: new Date(0), path: "/" });
  redirect("/admin/login");
}
