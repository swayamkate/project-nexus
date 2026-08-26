import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deployed to Render, so full-stack API routes are enabled!
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Helps reduce memory usage during builds
    memoryBasedWorkersCount: true,
  }
};

export default nextConfig;
