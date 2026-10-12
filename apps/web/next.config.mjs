/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  serverRuntimeConfig: {
    apiUrl: process.env.API_URL,
  },
  publicRuntimeConfig: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
    wsUrl: process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:4000",
  },
};

export default nextConfig;
