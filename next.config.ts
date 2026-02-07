import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/pipe-trainer",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
