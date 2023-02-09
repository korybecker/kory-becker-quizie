/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    experimental: {
        appDir: true,
        serverComponentsExternalPackages: ["prisma"],
    },
};

module.exports = nextConfig;
