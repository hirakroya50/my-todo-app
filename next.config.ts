import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // MetaMask and other extensions log to the browser console; Next would echo that as [browser] in the terminal.
  logging:
    process.env.NODE_ENV === "development"
      ? { browserToTerminal: false }
      : undefined,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
