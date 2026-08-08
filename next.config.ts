import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = isGitHubPages
  ? {
      output: "export",
      basePath,
      assetPrefix: basePath,
      images: { unoptimized: true },
      trailingSlash: true,
      // The regular Sites build type-checks Cloudflare bindings. They are not
      // part of this static, browser-only GitHub Pages export.
      typescript: { ignoreBuildErrors: true },
    }
  : {};

export default nextConfig;
