import { createClient } from "./client";

export async function uploadAsset(bucket: string, path: string, file: File) {
  const supabase = createClient();
  if (!supabase) {
    console.log(`Mock Mode Storage: Uploaded file to bucket [${bucket}] path: ${path}`);
    return { data: { path }, error: null };
  }
  
  return await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });
}

export async function getSignedAssetUrl(bucket: string, path: string, expiresIn = 3600) {
  const supabase = createClient();
  if (!supabase) {
    return { 
      data: { 
        signedUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800" 
      }, 
      error: null 
    };
  }
  
  return await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
}

export function getPublicAssetUrl(bucket: string, path: string) {
  const supabase = createClient();
  if (!supabase) {
    return { 
      data: { 
        publicUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800" 
      } 
    };
  }
  
  return supabase.storage.from(bucket).getPublicUrl(path);
}
