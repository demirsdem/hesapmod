/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
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

export default nextConfig;
