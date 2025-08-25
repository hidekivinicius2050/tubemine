import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TubeMine - Video Analytics Platform',
  description: 'Plataforma profissional para análise e mineração de dados do YouTube',
  keywords: 'YouTube, analytics, mineração de dados, vídeos, análise',
  authors: [{ name: 'TubeMine Team' }],
  creator: 'TubeMine',
  publisher: 'TubeMine',
  robots: 'index, follow',
  openGraph: {
    title: 'TubeMine - Video Analytics Platform',
    description: 'Plataforma profissional para análise e mineração de dados do YouTube',
    url: 'https://tubemine.com.br',
    siteName: 'TubeMine',
    images: [
      {
        url: '/logo-tubeminer.png',
        width: 1200,
        height: 630,
        alt: 'TubeMine Logo',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TubeMine - Video Analytics Platform',
    description: 'Plataforma profissional para análise e mineração de dados do YouTube',
    images: ['/logo-tubeminer.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ff4444',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ff4444" />
        <meta name="msapplication-TileColor" content="#ff4444" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

