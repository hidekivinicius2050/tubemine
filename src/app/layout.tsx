import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TubeMine - Video Analytics Platform',
  description: 'Plataforma profissional para análise e mineração de dados do YouTube',
  icons: {
    icon: [
      {
        url: '/logo-tubeminer.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/logo-tubeminer.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/logo-tubeminer.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcut: '/logo-tubeminer.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/logo-tubeminer.png" sizes="any" />
        <link rel="icon" href="/logo-tubeminer.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-tubeminer.png" />
        <link rel="shortcut icon" href="/logo-tubeminer.png" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}

