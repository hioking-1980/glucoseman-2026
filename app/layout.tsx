import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "グルコースマン召喚計画｜ゆるキャラグランプリ2026";
const description =
  "グルコースマンをゆるキャラグランプリ優勝へ。目標120,000PT。現在の達成率をチェックして、今日の1票を。";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title,
    description,
    applicationName: "グルコースマン召喚計画",
    manifest: "/manifest.webmanifest",
    appleWebApp: { capable: true, title: "グルコースマン", statusBarStyle: "black-translucent" },
    icons: { icon: "/glucoseman.png", apple: "/glucoseman.png" },
    openGraph: { title, description, type: "website", locale: "ja_JP", images: [`${origin}/og.png`] },
    twitter: { card: "summary_large_image", title, description, images: [`${origin}/og.png`] },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#19064a",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
