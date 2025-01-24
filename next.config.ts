import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'scontent-lhr8-2.xx.fbcdn.net',
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        pathname: '/**', 
      },
    ],
  },
};

export default nextConfig;
