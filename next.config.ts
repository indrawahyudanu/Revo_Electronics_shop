import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    dangerouslyAllowLocalIP: true, // khusus development (localhost)
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/static/**",
      },
      {
        protocol: "https",
        hostname: "backend-electronic-indra.onrender.com",
        pathname: "/static/**",
      },
    ],
  },

  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
