import type { NextConfig } from "next";

const securityHeaders = [
  // 1. Prevent Clickjacking
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // 2. Prevent MIME Sniffing Attacks
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // 3. Strict Referrer Policy
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // 4. Cross-Site Scripting Protection filter
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  // 5. Restrict dangerous browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), display-capture=()",
  },
  // 6. Cross-Origin Opener Policy
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin-allow-popups",
  },
  // 7. Enforce HTTPS Strict-Transport-Security (2 years)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
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
