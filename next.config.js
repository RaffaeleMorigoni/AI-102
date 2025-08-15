/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  // Enable images from the public folder
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;