/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['hebbkx1anhila5yf.public.blob.vercel-storage.com', "cht5tbydosgkcqlb.public.blob.vercel-storage.com"],
      },
      env: {
        CAPTCHA_SITE_KEY: process.env.CAPTCHA_SITE_KEY,
        CAPTCHA_SECRET_KEY: process.env.CAPTCHA_SECRET_KEY,
        FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      }
};

export default nextConfig;
