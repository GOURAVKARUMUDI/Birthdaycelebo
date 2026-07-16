"use server";

import { createClient } from "./server";
import { revalidatePath } from "next/cache";

export async function saveProjectConfig(slug: string, config: any) {
  const supabase = await createClient();
  if (!supabase) {
    return { data: config, error: null };
  }

  const { data, error } = await supabase
    .from("projects")
    .upsert({
      slug,
      title: config.recipientName + "'s Custom Scrapbook",
      passwords: config.passwords,
      countdown_date: config.countdownDate,
      bg_music_url: config.bgMusicUrl,
      recipient_name: config.recipientName,
    })
    .select()
    .single();

  if (error) return { data: null, error };

  // Upsert Theme tokens
  await supabase
    .from("themes")
    .upsert({
      project_id: data.id,
      colors: config.theme,
    });

  revalidatePath(`/${slug}`);
  return { data, error: null };
}

export async function logVisitorSession(slug: string, nickname: string, secondsSpent: number) {
  const supabase = await createClient();
  if (!supabase) return { error: null };

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!project) return { error: "Project not found" };

  return await supabase
    .from("sessions")
    .insert({
      project_id: project.id,
      visitor_nickname: nickname,
      time_spent_seconds: secondsSpent,
    });
}
