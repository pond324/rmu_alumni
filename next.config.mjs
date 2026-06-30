/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  images: {
    domains: ["cdn.pixabay.com", "res.cloudinary.com", "localhost"],
  },
  allowedDevOrigins: ["10.110.29.111"],
};

export default nextConfig;
