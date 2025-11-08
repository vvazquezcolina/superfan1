import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cf.bstatic.com",
      },
      {
        protocol: "https",
        hostname: "content.skyscnr.com",
      },
    ],
  },
};

export default nextConfig;
