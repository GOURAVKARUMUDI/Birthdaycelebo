import type { Metadata } from "next";
import { Poppins, Nunito, Caveat } from "next/font/google";
import { AudioProvider } from "@/hooks/useAudio";
import CursorEffects from "@/components/CursorEffects";
import "./globals.css";

// Only load the weights we actually use — reduces font payload
const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const nunito = Nunito({
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  preload: false, // secondary font — don't block
});

const caveat = Caveat({
  variable: "--font-caveat",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "A Special Digital Gift For You ❤️",
    template: "%s | Scrapbook Builder",
  },
  description:
    "A premium interactive digital scrapbook filled with beautiful memories, interactive mini-games, custom playlist, and letters.",
  keywords: ["birthday", "scrapbook", "gift", "surprise", "digital", "memories"],
  authors: [{ name: "Scrapbook Builder" }],
  creator: "Scrapbook Builder",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "A Special Digital Gift For You ❤️",
    description: "An interactive digital scrapbook experience filled with love.",
    siteName: "Scrapbook Builder",
  },
  twitter: {
    card: "summary_large_image",
    title: "A Special Digital Gift For You ❤️",
    description: "An interactive digital scrapbook experience filled with love.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

// Fixed: removed userScalable:false and maximumScale:1 (accessibility violation)
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FADADD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${nunito.variable} ${caveat.variable} h-full antialiased`}
    >
      <head>
        {/* Preconnect to Google Fonts for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preconnect to Supabase */}
        <link rel="dns-prefetch" href="https://nrhqtzrvutgzardfxrye.supabase.co" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#FFFDF9] text-[#2C2C2C]">
        <AudioProvider>
          <CursorEffects />
          {children}
        </AudioProvider>
      </body>
    </html>
  );
}
