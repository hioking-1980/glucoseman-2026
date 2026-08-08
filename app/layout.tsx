import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "グルコースマン召喚計画｜ゆるキャラグランプリ2026";
const description =
  "グルコースマンをゆるキャラグランプリ優勝へ。目標120,000PT。現在の達成率をチェックして、今日の1票を。";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://glucoseman-2026.y-hioki207703.chatgpt.site";

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title,
  description,
  applicationName: "グルコースマン召喚計画",
  manifest: `${basePath}/manifest.webmanifest`,
  appleWebApp: { capable: true, title: "グルコースマン", statusBarStyle: "black-translucent" },
  icons: { icon: `${basePath}/glucoseman.png`, apple: `${basePath}/glucoseman.png` },
  openGraph: { title, description, type: "website", locale: "ja_JP", images: [`${origin}/og.png`] },
  twitter: { card: "summary_large_image", title, description, images: [`${origin}/og.png`] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#250760",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
