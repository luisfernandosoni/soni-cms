import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import type { Transmission, Media } from '@/payload-types'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // ISR: revalidate every 60 seconds

export default async function TransmissionsPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs: transmissions } = await payload.find({
    collection: 'transmissions',
    where: {
      status: {
        equals: 'published',
      },
    },
    sort: '-publishedAt',
    depth: 2,
    limit: 100, // Reasonable limit for now
  })

  return (
    <div className="transmissions-archive">
      <section className="archive-header">
        <h1 className="header__title">All Transmissions</h1>
        <p className="header__subtitle">Signals from the ether.</p>
      </section>

      <section className="transmissions-grid">
        {transmissions.map((transmission: Transmission) => (
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

        {transmissions.length === 0 && (
          <div className="empty-state">
            <h2>No signals detected.</h2>
            <p>Our receivers are currently silent.</p>
          </div>
        )}
      </section>
    </div>
  )
}
