import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Update server configuration
  serverRuntimeConfig: {
    port: 5173
  },

  images: {
    domains: ['images.unsplash.com', 'i.annihil.us', 'gateway.marvel.com'],
    unoptimized: true
  },

  experimental: {
    optimizePackageImports: ['lucide-react', '@tanstack/react-query']
  },

  webpack: (config, { dev, isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': join(__dirname, 'src')
    };

    config.cache = {
      type: 'filesystem',
      version: '1.0.0',
      buildDependencies: {
        config: [__filename]
      },
      name: `${dev ? 'development' : 'production'}-${isServer ? 'server' : 'client'}`,
      cacheDirectory: join(__dirname, '.next/cache/webpack')
    };

    config.experiments = {
      ...config.experiments,
      topLevelAwait: true
    };

    return config;
  }
};

export default nextConfig;