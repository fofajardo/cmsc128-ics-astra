/** @type {import("next").NextConfig} */

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: process.env.ICSA_API_URL
          ? `${process.env.ICSA_API_URL}/v1/:path*`
          : "http://localhost:3001/v1/:path*",
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lgehxciwuxmrtcnanuxp.supabase.co",
      },
      {
        protocol: "https",
        hostname: "skpodmqiwawjombgvneh.supabase.co",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
      },
    ],
  },
};

export default nextConfig;
