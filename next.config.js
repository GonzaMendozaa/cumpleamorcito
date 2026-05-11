/** @type {import('next').NextConfig} */
const nextConfig = {
  // Genera un sitio estático en /out — Netlify lo sirve directamente sin servidor
  output: 'export',
  images: {
    // Requerido para static export (Next.js Image optimization necesita servidor)
    unoptimized: true,
  },
  eslint: {
    // Evita que errores de lint rompan el build en Netlify
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
