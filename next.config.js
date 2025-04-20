/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "idb": require.resolve("idb"),
      "styled-jsx": require.resolve("styled-jsx"),
      "styled-jsx/style": require.resolve("styled-jsx/style"),
    };
    return config;
  },
}

module.exports = nextConfig; 