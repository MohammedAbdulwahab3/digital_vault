import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output → small self-contained Docker images
  output: "standalone",
};

export default nextConfig;
