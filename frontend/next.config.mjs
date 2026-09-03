/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const rules = [
      {
        source: '/api/static/:path*',
        destination: '/static/:path*',
      },
    ];
    if (process.env.NEXT_PUBLIC_BACKEND_URL) {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/$/, "");
      rules.push({
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      });
    }
    return rules;
  },
};

export default nextConfig;
