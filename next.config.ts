import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images : {
    remotePatterns:[
      {
        hostname: "static.vecteezy.com"
      },
      {
        hostname: "example.com"
      },
      {
        hostname: "i.ibb.co"
      }
    ]
  }
};

export default nextConfig;