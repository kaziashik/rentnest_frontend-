import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      { hostname: "static.vecteezy.com" },
      { hostname: "example.com" },
      { hostname: "i.ibb.co" },
      { hostname: "i.ibb.co.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "plus.unsplash.com" },
      { hostname: "api.dicebear.com" },
    ],
  },
};

export default nextConfig;
