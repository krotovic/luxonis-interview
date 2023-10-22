/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    distDir: 'build',
    output: 'export',
    images: {
        unoptimized: true,
    },
}

module.exports = nextConfig
