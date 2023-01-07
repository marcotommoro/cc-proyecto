/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BROKER_URL: "http://broker:5001",
  },
};

module.exports = nextConfig;
