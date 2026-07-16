import { DEFAULT_PROJECT_CONFIG, ProjectConfig, Memory } from "./mockData";
import { createClient } from "./supabase/client";

// Import local JSON mock files
import mockGallery from "../mock-data/gallery.json";
import mockTimeline from "../mock-data/timeline.json";
import mockLetters from "../mock-data/letters.json";
import mockSongs from "../mock-data/songs.json";
import mockGifts from "../mock-data/gifts.json";

const LOCAL_STORAGE_KEY = "birthday_project_config";

// Get configuration, checking localStorage first, then falling back to JSON mocks
export function getLocalConfig(): ProjectConfig {
  if (typeof window === "undefined") return DEFAULT_PROJECT_CONFIG;
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    const mockConfig: ProjectConfig = {
      ...DEFAULT_PROJECT_CONFIG,
      memories: mockGallery as Memory[],
      timeline: mockTimeline as any[],
      letterContent: mockLetters[0]?.content || DEFAULT_PROJECT_CONFIG.letterContent,
      playlist: mockSongs as any[],
      gifts: mockGifts as any[],
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockConfig));
    return mockConfig;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return DEFAULT_PROJECT_CONFIG;
  }
}

// Save configuration locally
export function saveLocalConfig(config: ProjectConfig): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
}

// Reset configuration locally
export function resetLocalConfig(): ProjectConfig {
  if (typeof window === "undefined") return DEFAULT_PROJECT_CONFIG;
  const mockConfig: ProjectConfig = {
    ...DEFAULT_PROJECT_CONFIG,
    memories: mockGallery as Memory[],
    timeline: mockTimeline as any[],
    letterContent: mockLetters[0]?.content || DEFAULT_PROJECT_CONFIG.letterContent,
    playlist: mockSongs as any[],
    gifts: mockGifts as any[],
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockConfig));
  return mockConfig;
}

// Supabase synchronization helpers
export async function getRemoteConfig(slug: string): Promise<ProjectConfig | null> {
  const supabase = createClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return null;
    
    // Parse json themes
    const { data: themeData } = await supabase
      .from("themes")
      .select("*")
      .eq("project_id", data.id)
      .single();

    return {
      recipientName: data.recipient_name,
      title: data.title,
      mascot: "giraffe",
      theme: themeData?.colors || {},
      countdownDate: data.countdown_date,
      bgMusicUrl: data.bg_music_url,
      passwords: data.passwords || {},
      letterContent: data.letter_content || mockLetters[0]?.content,
      memories: data.memories || mockGallery,
      timeline: data.timeline || mockTimeline,
      playlist: data.playlist || mockSongs,
      voiceNotes: data.voice_notes || [],
      gifts: data.gifts || mockGifts,
      chats: data.chats || [],
    };
  } catch (e) {
    console.error("Failed to load remote config", e);
    return null;
  }
}

export async function saveRemoteConfig(slug: string, config: ProjectConfig): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  try {
    const dbPayload = {
      slug,
      recipient_name: config.recipientName,
      title: config.title,
      countdown_date: config.countdownDate,
      bg_music_url: config.bgMusicUrl,
      passwords: config.passwords,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("projects")
      .upsert(dbPayload, { onConflict: "slug" })
      .select()
      .single();

    if (error || !data) return false;

    // Upsert theme config
    await supabase
      .from("themes")
      .upsert({
        project_id: data.id,
        colors: config.theme,
      });

    return true;
  } catch (e) {
    console.error("Failed to save remote config", e);
    return false;
  }
}
