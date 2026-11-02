import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,

    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "pub-955bb8a974c240839f531e19760e4c8c.r2.dev",
        pathname: "/**",
      },
    ],
  },

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/about",
          destination: "/?section=about",
        },
        {
          source: "/services",
          destination: "/?section=services",
        },
        {
          source: "/process",
          destination: "/?section=process",
        },
        {
          source: "/journal",
          destination: "/?section=journal",
        },
        {
          source: "/contact",
          destination: "/?section=contact",
        },
      ],
    };
  },
};

export default nextConfig;