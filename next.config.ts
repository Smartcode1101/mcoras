/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/sitemap.xml',
                destination: '/api/sitemap.xml',
            },
            {
                source: '/sitemap-posts.xml',
                destination: '/api/sitemap-posts.xml',
            },
            {
                source: '/sitemap-pages.xml',
                destination: '/api/sitemap-pages.xml',
            },
            {
                source: '/sitemap-categories.xml',
                destination: '/api/sitemap-categories.xml',
            },
            {
                source: '/sitemap-tags.xml',
                destination: '/api/sitemap-tags.xml',
            },
            {
                source: '/sitemap-news.xml',
                destination: '/api/sitemap-news.xml',
            },
            {
                source: '/robots.txt',
                destination: '/api/robots.txt',
            },
        ];
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'picsum.photos',
        },
        {
            protocol: 'http',
            hostname: 'localhost',
        },
        {
            protocol: 'http',
            hostname: 'localhost',
            pathname: '/imageuploads/**',
        },
        {
            protocol: 'https',
            hostname: 'images.unsplash.com',
        }
      ],
      formats: ['image/webp', 'image/avif'],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    experimental: {
      serverActions: {
          bodySizeLimit: '60mb',
      },
      // Optimize package imports for faster builds
      optimizePackageImports: ['lucide-react', 'recharts', '@radix-ui/react-icons'],
    },
    // Enable compression
    compress: true,
    // Trailing slash for WordPress-like URLs
    trailingSlash: true,
    // Disable preloading to avoid console warnings
    onDemandEntries: {
      maxInactiveAge: 25 * 1000,
      pagesBufferLength: 2,
    },
    // Target modern browsers to reduce polyfills
    compiler: {
      // Remove console.log in production
      removeConsole: process.env.NODE_ENV === 'production',
    },
    // Production optimizations
    productionBrowserSourceMaps: false,
    // Modern output
    output: 'standalone',
};

module.exports = nextConfig;
