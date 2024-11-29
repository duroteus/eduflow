/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3000/api/:path*", // endereço do API Gateway
      },
    ];
  },
};

module.exports = nextConfig;
