/** @type {import("next").NextConfig} */

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: process.env.ICSA_API_URL
          ? `${process.env.ICSA_API_URL}/v1/:path*`
          : "http://localhost:3001/v1/:path*"
      }

    ];
  },
  images: {
    domains: ['lgehxciwuxmrtcnanuxp.supabase.co'],
  },
};

export default nextConfig;
