import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

// Bundle analyzer configuration
// Enable by running: ANALYZE=true npm run build
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
