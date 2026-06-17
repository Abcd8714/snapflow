import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@libsql/client", "@anthropic-ai/sdk"],
  images: {
    domains: [],
  },
};

export default nextConfig;
