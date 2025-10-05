import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // MPG: Transpile Konva packages for SSR compatibility
  transpilePackages: ['konva', 'react-konva'],

  // MPG: Exclude canvas from webpack bundling (browser-only)
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'canvas'];
    return config;
  }
};

export default nextConfig;
