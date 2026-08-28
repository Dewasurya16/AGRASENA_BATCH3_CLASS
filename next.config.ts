import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/admin/login",
        permanent: true,
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
    proxyClientMaxBodySize: "100mb",
  },
};

export default nextConfig;
