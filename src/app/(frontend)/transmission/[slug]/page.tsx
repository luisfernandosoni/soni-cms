import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { BlockRenderer } from '#components/Blocks'
import type { Transmission, Media, Author, Category } from '@/payload-types'

type Props = {
  params: Promise<{ slug: string }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'transmissions',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    limit: 1,
    depth: 1,
  })

  const transmission = docs[0] as Transmission | undefined

  if (!transmission) {
    return { title: 'Transmission Not Found' }
  }

  const heroImage = transmission.heroImage as Media | undefined

  return {
    title: transmission.title,
    description: transmission.excerpt,
    openGraph: {
      title: transmission.title,
      description: transmission.excerpt || undefined,
      type: 'article',
      publishedTime: transmission.publishedAt || undefined,
      images: heroImage?.url ? [{ url: heroImage.url }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: transmission.title,
      description: transmission.excerpt || undefined,
      images: heroImage?.url ? [heroImage.url] : undefined,
    },
  }
}

// Generate static params for build-time generation
// Note: Returns empty array if PAYLOAD_SECRET unavailable during build
export async function generateStaticParams() {
  // Skip static generation if secret not available (e.g., Cloudflare Pages build)
  if (!process.env.PAYLOAD_SECRET) {
    return []
  }

  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const { docs } = await payload.find({
      collection: 'transmissions',
      where: { status: { equals: 'published' } },
      limit: 100,
      select: { slug: true },
    })

    return docs.map((doc) => ({ slug: doc.slug }))
  } catch {
    // If Payload init fails for any reason, skip static generation
    // Pages will be generated on-demand at runtime
    return []
  }
}

export default async function TransmissionPage({ params }: Props) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'transmissions',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    limit: 1,
    depth: 2, // Include all relations
  })

  const transmission = docs[0] as Transmission | undefined

  if (!transmission) {
    notFound()
  }

  const heroImage = transmission.heroImage as Media | undefined
  const author = transmission.author as Author | undefined
  const category = transmission.category as Category | undefined

  return (
    <article className="transmission-page">
      {/* Hero Header */}
      <header className="transmission-hero">
        <div className="transmission-hero__backdrop">
          {heroImage?.url && (
            <Image
              src={heroImage.url}
              alt={transmission.title}
              fill
              priority
              className="transmission-hero__image"
            />
          )}
          <div className="transmission-hero__overlay" />
        </div>
        <div className="transmission-hero__content">
          {category && (
            <span className="transmission-hero__category">{category.title}</span>
          )}
          <h1 className="transmission-hero__title">{transmission.title}</h1>
          {transmission.excerpt && (
            <p className="transmission-hero__excerpt">{transmission.excerpt}</p>
          )}
          <div className="transmission-hero__meta">
            {author && <span className="author">By {author.name}</span>}
            {transmission.publishedAt && (
              <time dateTime={transmission.publishedAt}>
                {new Date(transmission.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
            )}
          </div>
        </div>
      </header>

      {/* Block Content */}
      <div className="transmission-content">
        <BlockRenderer blocks={transmission.layout} />
      </div>

      {/* Back Navigation */}
      <footer className="transmission-footer">
        <Link href="/" className="back-link">
          ← Back to Transmissions
        </Link>
      </footer>
    </article>
  )
}
