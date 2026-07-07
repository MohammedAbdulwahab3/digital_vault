import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output → small self-contained Docker images
  output: "standalone",
  // The download packager reads these template trees at runtime
  outputFileTracingIncludes: {
    "/api/download/[token]": ["./product-templates/**/*"],
  },
};

export default nextConfig;
