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
      {
        protocol: "https",
        hostname: "www.unicaribe.mx",
      },
      {
        protocol: "https",
        hostname: "mnt.inba.gob.mx",
      },
    ],
  },
};

export default nextConfig;
