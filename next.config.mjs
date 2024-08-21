/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        outputFileTracingIncludes: {
            '/api/**/*': ['./node_modules/**/*.wasm', './node_modules/**/*.proto'],
        },
    },
};

export default nextConfig;