import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https://*.supabase.co https://images.unsplash.com https://*.googleusercontent.com https://*.kejaksaan.go.id https://drive.google.com;
  font-src 'self' data: https://fonts.gstatic.com;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.vercel-insights.com https://*.vercel-analytics.com https://vitals.vercel-insights.com https://va.vercel-scripts.com;
  frame-src 'self' blob: data: https://*.supabase.co https://drive.google.com https://docs.google.com;
  frame-ancestors 'self';
  worker-src 'self' blob:;
  child-src 'self' blob:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, " ").trim();

const securityHeaders = [
  // 1. Content Security Policy (Defence-in-depth against XSS & injection)
  {
    key: "Content-Security-Policy",
    value: cspHeader,
  },
  // 2. Prevent Clickjacking
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // 3. Prevent MIME Sniffing Attacks
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // 4. Strict Referrer Policy
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // 5. Cross-Site Scripting Protection filter
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  // 6. Restrict dangerous browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), display-capture=()",
  },
  // 7. Cross-Origin Opener Policy
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin-allow-popups",
  },
  // 8. Enforce HTTPS Strict-Transport-Security (2 years)
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
      {
        source: "/dashboard/:path*",
        destination: "/admin/dashboard",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/admin/dashboard",
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
