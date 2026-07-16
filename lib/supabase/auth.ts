import { createClient } from "./client";

export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient();
  if (!supabase) {
    console.log("Mock Mode Auth: Signed in as", email);
    return { data: { user: { id: "mock-user-uuid", email } }, error: null };
  }
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string) {
  const supabase = createClient();
  if (!supabase) {
    return { data: { user: { id: "mock-user-uuid", email } }, error: null };
  }
  return await supabase.auth.signUp({ email, password });
}

export async function signInWithOTP(email: string) {
  const supabase = createClient();
  if (!supabase) {
    console.log("Mock Mode OTP Code Sent to", email);
    return { data: null, error: null };
  }
  return await supabase.auth.signInWithOtp({ email });
}

export async function signInWithGoogle() {
  const supabase = createClient();
  if (!supabase) {
    console.log("Mock Mode Google Auth Init");
    return { data: null, error: null };
  }
  return await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
}

export async function signOut() {
  const supabase = createClient();
  if (!supabase) {
    console.log("Mock Mode Sign Out");
    return { error: null };
  }
  return await supabase.auth.signOut();
}
