import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

// @ts-ignore
const nextConfig: NextConfig = {
  // Add root empty turbopack config to silence next-pwa webpack warning in Next 15/16
  turbopack: {},
};

export default withPWA(nextConfig);
