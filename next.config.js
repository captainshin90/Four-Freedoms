/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    // This is needed to handle the private class fields in undici
    config.module.rules.push({
      test: /node_modules\/undici\/lib\/web\/fetch\/util\.js$/,
      use: {
        loader: 'string-replace-loader',
        options: {
          search: /\!\(#target in this\)/g,
          replace: '!Object.prototype.hasOwnProperty.call(this, "#target")',
        },
      },
    });
    return config;
  },
};

module.exports = nextConfig;