import type { Metadata } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import React from 'react'
import './styles.css'
import '#components/Blocks/blocks.scss'

// Typography matching Soni-New-Media design system
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.soninewmedia.com'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Transmissions | Soni New Media',
    template: '%s | Soni New Media',
  },
  description: 'Bleeding-edge transmissions on technology, design, and culture from the edge of tomorrow.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'Soni New Media',
    images: [
      {
        url: '/og-image.png', // Fallback OG image
        width: 1200,
        height: 630,
        alt: 'Soni New Media Transmissions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@soninewmedia',
    creator: '@soninewmedia',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body>
        {/* Noise overlay - Soni signature effect */}
        <div className="noise-overlay" aria-hidden="true" />
        <main>{children}</main>
      </body>
    </html>
  )
}
