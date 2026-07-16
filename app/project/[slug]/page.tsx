import type { Metadata } from "next";
import { loadProjectData } from "@/lib/supabase/editorDb";
import PublicProjectClient from "./client";

// Server-side metadata generation for SEO
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const data = await loadProjectData(slug);
    const name = data?.recipientName || "Someone Special";
    return {
      title: `${name}'s Birthday Surprise 🎂`,
      description: `A special interactive digital scrapbook made just for ${name}. Open to discover memories, games, letters, and more.`,
      openGraph: {
        title: `${name}'s Birthday Surprise 🎂`,
        description: `A special interactive digital scrapbook made just for ${name}.`,
        type: "website",
      },
      twitter: {
        card: "summary",
        title: `${name}'s Birthday Surprise 🎂`,
        description: `A special interactive digital scrapbook made just for ${name}.`,
      },
      // Don't index personal surprise pages
      robots: { index: false, follow: false },
    };
  } catch {
    return {
      title: "Birthday Surprise 🎂",
      description: "A special interactive digital scrapbook.",
      robots: { index: false, follow: false },
    };
  }
}

// Server Component shell — fetches data server-side to avoid client waterfall
export default async function PublicProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch data on the server — eliminates the client-side loading waterfall
  let initialConfig: any = null;
  let initialError: string | null = null;

  try {
    const data = await loadProjectData(slug);
    if (data) {
      initialConfig = data;
    } else {
      initialError = "This scrapbook surprise does not exist or has been deleted.";
    }
  } catch {
    initialError = "An error occurred while loading this scrapbook.";
  }

  return (
    <PublicProjectClient
      slug={slug}
      initialConfig={initialConfig}
      initialError={initialError}
    />
  );
}
