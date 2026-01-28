import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import type { Transmission, Media } from '@/payload-types'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // ISR: revalidate every 60 seconds

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Fetch latest published transmissions
  const { docs: transmissions } = await payload.find({
    collection: 'transmissions',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 10,
    depth: 2, // Include author, category, heroImage
  })

  const featured = transmissions[0]
  const recent = transmissions.slice(1, 7)

  return (
    <div className="homepage">
      {/* Hero Section */}
      {featured && (
        <section className="hero">
          <div className="hero__backdrop">
            {featured.heroImage && typeof featured.heroImage === 'object' && (
              <Image
                src={(featured.heroImage as Media).url || ''}
                alt={featured.title}
                fill
                priority
                className="hero__image"
              />
            )}
            <div className="hero__overlay" />
          </div>
          <div className="hero__content">
            <span className="hero__category">
              {typeof featured.category === 'object' && featured.category?.title}
            </span>
            <h1 className="hero__title">{featured.title}</h1>
            <p className="hero__excerpt">{featured.excerpt}</p>
            <Link href={`/transmission/${featured.slug}`} className="hero__cta">
              Read Transmission →
            </Link>
          </div>
        </section>
      )}

      {/* Recent Transmissions Grid */}
      <section className="grid-section">
        <h2 className="section-title">Recent Transmissions</h2>
        <div className="transmissions-grid">
          {recent.map((transmission: Transmission) => (
            <Link
              key={transmission.id}
              href={`/transmission/${transmission.slug}`}
              className="transmission-card"
            >
              <div className="card__image-wrapper">
                {transmission.heroImage && typeof transmission.heroImage === 'object' && (
                  <Image
                    src={(transmission.heroImage as Media).url || ''}
                    alt={transmission.title}
                    fill
                    className="card__image"
                  />
                )}
                <div className="card__overlay" />
              </div>
              <div className="card__content">
                <span className="card__category">
                  {typeof transmission.category === 'object' && transmission.category?.title}
                </span>
                <h3 className="card__title">{transmission.title}</h3>
                <p className="card__excerpt">{transmission.excerpt}</p>
                <div className="card__meta">
                  <span className="card__author">
                    {typeof transmission.author === 'object' && transmission.author?.name}
                  </span>
                  {transmission.publishedAt && (
                    <time className="card__date">
                      {new Date(transmission.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* No transmissions fallback */}
      {transmissions.length === 0 && (
        <section className="empty-state">
          <h2>No Transmissions Yet</h2>
          <p>Create your first transmission in the admin panel.</p>
          <Link href="/admin" className="hero__cta">
            Open Admin →
          </Link>
        </section>
      )}
    </div>
  )
}

