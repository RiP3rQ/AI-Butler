/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    domains: ["img.clerk.com", "oaidalleapiprodscus.blob.core.windows.net", "firebasestorage.googleapis.com"],
    remotePatterns: [
      {
        hostname: "img.clerk.com"
      }
    ]
  },
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, webpack }
  ) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  }
};

module.exports = nextConfig;
