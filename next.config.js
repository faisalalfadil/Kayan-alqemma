/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    // لا تغييرات، هذا مجرد إعداد Webpack افتراضي
    return config
  },
  experimental: {
    turbo: false, // تعطيل Turbopack نهائيًا
  },
}

module.exports = nextConfig