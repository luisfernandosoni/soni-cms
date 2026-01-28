import type { Metadata } from 'next'
import { Outfit, JetBrains_Mono } from 'next/font/google'
import React from 'react'
import './styles.css'
import '#components/Blocks/blocks.scss'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Transmissions | Soni New Media',
    template: '%s | Soni New Media',
  },
  description: 'Bleeding-edge transmissions on technology, design, and culture from the edge of tomorrow.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Soni New Media',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrainsMono.variable}`}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}

