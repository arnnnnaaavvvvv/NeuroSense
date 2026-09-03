/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    if (process.env.NEXT_PUBLIC_BACKEND_URL) {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/$/, "");
      return [
        {
          source: '/api/:path*',
          destination: `${backendUrl}/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
