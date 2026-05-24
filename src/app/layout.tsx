import type { Metadata } from 'next'
import { Press_Start_2P } from 'next/font/google'
import { CONFIG } from '@/config'
import './globals.css'

const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pixel',
})

export const metadata: Metadata = {
  title: `💖 Feliz Cumpleaños, ${CONFIG.nombre}! 💖`,
  description: 'Te hice una sorpresa especial para celebrar tu día. ¡Espero que lo disfrutes! 🥳🎉🥳',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={pixelFont.variable}>
      <body>{children}</body>
    </html>
  )
}
