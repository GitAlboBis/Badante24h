import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Badante24h — Trova badanti e caregiver nella tua zona',
    template: '%s | Badante24h',
  },
  description:
    'Badante24h è la piattaforma che connette famiglie e caregiver. Trova assistenza domiciliare qualificata vicino a te.',
  manifest: '/manifest.json',
  keywords: [
    'badante',
    'caregiver',
    'assistenza domiciliare',
    'babysitter',
    'badante 24h',
    'assistenza anziani',
  ],
}

export const viewport: Viewport = {
  themeColor: '#2563EB',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" className={inter.variable}>
      <body className="font-sans bg-background text-slate-900 antialiased">
        {children}
      </body>
    </html>
  )
}
