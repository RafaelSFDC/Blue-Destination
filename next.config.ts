import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true, // Adiciona / no final das URLs
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
