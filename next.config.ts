import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
images: {
  dangerouslyAllowLocalIP: true,        // ← tambahkan ini (khusus development)
  remotePatterns: [
    {
      protocol: "http",
      hostname: "localhost",
      port: "5000",
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
