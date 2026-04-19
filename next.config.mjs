import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public",
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    swcMinify: true,
    disable: process.env.NODE_ENV === "development",
    workboxOptions: {
        disableDevLogs: true,
    },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=31536000; includeSubDomains',
                    }
                ],
            },
        ];
    },
    async redirects() {
        return [
            {
                source: '/zaman-hesaplama/yas-hesaplama',
                destination: '/zaman-hesaplama/yas-hesaplama-detayli',
                permanent: true,
            },
            {
                source: '/zaman-hesaplama/yas-hesaplama-gun-ay-yil',
                destination: '/zaman-hesaplama/yas-hesaplama-detayli',
                permanent: true,
            },
            {
                source: '/zaman-hesaplama/iki-tarih-arasi-fark-gun-hesaplama',
                destination: '/zaman-hesaplama/iki-tarih-arasindaki-gun-sayisi-hesaplama',
                permanent: true,
            },
            {
                source: '/finansal-hesaplamalar/kredi-karti-asgari-odeme-tutari-hesaplama',
                destination: '/finansal-hesaplamalar/kredi-karti-asgari-odeme',
                permanent: true,
            },
            {
                source: '/:path*',
                has: [{ type: 'host', value: 'hesapmod.com' }],
                destination: 'https://www.hesapmod.com/:path*',
                permanent: true,
            },
            {
                source: '/finans/:path*',
                destination: '/finansal-hesaplamalar/:path*',
                permanent: true,
            },
            {
                source: '/saglik/:path*',
                destination: '/yasam-hesaplama/:path*',
                permanent: true,
            },
            {
                source: '/gunluk/:path*',
                destination: '/yasam-hesaplama/:path*',
                permanent: true,
            },
            {
                source: '/matematik/:path*',
                destination: '/matematik-hesaplama/:path*',
                permanent: true,
            },
            {
                source: '/kategori/finans',
                destination: '/kategori/finansal-hesaplamalar',
                permanent: true,
            },
            {
                source: '/kategori/saglik',
                destination: '/kategori/yasam-hesaplama',
                permanent: true,
            },
            {
                source: '/kategori/matematik',
                destination: '/kategori/matematik-hesaplama',
                permanent: true,
            },
        ];
    },
};

export default withPWA(nextConfig);
