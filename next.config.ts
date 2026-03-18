/** config: next.config.ts for parallax assets test */
import type { NextConfig } from "next";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
    : 'your-project.supabase.co';

const nextConfig: NextConfig = {
    experimental: {
        optimizePackageImports: ['lucide-react', 'framer-motion', 'embla-carousel-react'],
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picsum.photos',
                port: '',
                pathname: '/**',
            },
            {
                // Supabase Storage CDN
                protocol: 'https',
                hostname: supabaseHostname,
                port: '',
                pathname: '/storage/v1/object/**',
            },
        ],
    },
    async headers() {
        return [
            {
                source: '/uploads/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
