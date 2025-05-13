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
    domains: [
      'lgehxciwuxmrtcnanuxp.supabase.co',
<<<<<<< HEAD
      'skpodmqiwawjombgvneh.supabase.co'
=======
      'skpodmqiwawjombgvneh.supabase.co',
      'lh3.googleusercontent.com',
      'cdn-icons-png.flaticon.com'
>>>>>>> 1f08d2f13346571e2d43b0a56453ddf419064fde
    ],
  },
};

export default nextConfig;