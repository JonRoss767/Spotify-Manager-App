import type { NextConfig } from "next";

const nextConfig = {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'i.scdn.co',
      pathname: '/**',
    },
  ],
};

export default nextConfig;
