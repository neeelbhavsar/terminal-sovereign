/** @type {import('next').NextConfig} */
const nextConfig = {
    // Image optimization
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: '**.vercel.app',
            },
        ],
        // Enable AVIF format for modern browsers (better compression)
        formats: ['image/avif', 'image/webp'],
        // Optimize image sizes
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    // Enable compression
    compress: true,

    // Trailing slashes for consistent URLs
    trailingSlash: false,

    // Optimize for production
    productionBrowserSourceMaps: false,

    // SWR cache configuration
    onDemandEntries: {
        maxInactiveAge: 60 * 60 * 1000,
        pagesBufferLength: 5,
    },
};

export default nextConfig;
