import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? "/astro7" : "";

const nextConfig: NextConfig = {
  ...(isGithubPages ? { output: "export" as const } : {}),
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: isGithubPages,
  images: {
    unoptimized: isGithubPages,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
        pathname: "/product-images/**",
      },
    ],
  },
};

export default nextConfig;
