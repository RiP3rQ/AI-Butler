/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    domains: ["img.clerk.com", "oaidalleapiprodscus.blob.core.windows.net", "firebasestorage.googleapis.com"],
    remotePatterns: [
      {
        hostname: "img.clerk.com"
      }
    ]
  }
};

module.exports = nextConfig;
