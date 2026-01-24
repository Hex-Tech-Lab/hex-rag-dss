import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: false, // Reduce memory usage during build
  experimental: {
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
      '@phosphor-icons/react',
      'phosphor-react',
      '@tabler/icons-react',
      'lodash-es',
      '@mui/x-charts',
      '@mui/x-date-pickers'
    ],
  },
};

export default nextConfig;