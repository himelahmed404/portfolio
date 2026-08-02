import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [420, 768, 1024, 1280, 1600, 2000],
    qualities: [72, 75],
  },
};

export default nextConfig;
