import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', 
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
