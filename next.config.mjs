/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { resolve } from 'node:path';

// Resolve the path to 'tfhe/tfhe_bg.wasm'
const __dirname = dirname(fileURLToPath(import.meta.url));
const wasmPath = resolve(__dirname, 'node_modules/tfhe/tfhe_bg.wasm');

const nextConfig = {
    webpack: config => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            'tfhe_bg.wasm': wasmPath,
        };
        return config
    }
};

export default nextConfig;