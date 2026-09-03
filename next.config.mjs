/** @type {import('next').NextConfig} */
const nextConfig = {
      allowedDevOrigins: ['192.168.29.59'],
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.cost2costsupplement.com',
        port: '',
        pathname: '/**', // Allows all image paths from this domain
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
