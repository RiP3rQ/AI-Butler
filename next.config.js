/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "img.clerk.com",
      },
      {
        hostname: "oaidalleapiprodscus.blob.core.windows.net",
      },
      {
        hostname: "firebasestorage.googleapis.com",
      },
      {
        hostname: "xsyxpktslmdjhrcwrybw.supabase.co",
      },
    ],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
};

module.exports = nextConfig;
