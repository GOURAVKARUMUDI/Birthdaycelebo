import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !anonKey) {
    if (typeof window !== "undefined") {
      console.warn("Supabase credentials missing. Operating in Mock Mode.");
    }
    return null;
  }

  return createBrowserClient(url, anonKey);
}
