import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "preview-chat-ec77aad5-8971-4501-9880-fb6c6868b303.space.z.ai",
  ],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
