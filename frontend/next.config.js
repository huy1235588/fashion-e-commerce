/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**', // Chấp nhận mọi domain dùng https
            },
            {
                protocol: 'http',
                hostname: '**', // Chấp nhận mọi domain dùng http (bao gồm cả localhost)
            },
        ],
    },
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_UPLOAD_URL: process.env.NEXT_PUBLIC_UPLOAD_URL,
    },
};

module.exports = nextConfig;
