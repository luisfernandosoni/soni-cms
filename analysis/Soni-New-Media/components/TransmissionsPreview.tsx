import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import type { TransmissionPreview, TransmissionsResponse } from '../types/transmissions';

/**
 * TransmissionsPreview
 * 
 * Displays the 3 latest transmissions from the Payload CMS
 * as a sneak peek on the homepage.
 * 
 * Uses the /api/transmissions/latest endpoint which is proxied
 * to the CMS Worker in development, and served directly in production.
 */

// API endpoint - uses relative path which works in both:
// - Development: Vite proxy forwards to https://soninewmedia.com
// - Production: Same domain, served directly by Cloudflare Worker routes
const API_URL = '/api/transmissions/latest';

export const TransmissionsPreview: React.FC = () => {
  const [transmissions, setTransmissions] = useState<TransmissionPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransmissions = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch transmissions');
        
        const data: TransmissionsResponse = await res.json();
        
        if (data.success && data.docs) {
          setTransmissions(data.docs);
        }
      } catch (err) {
        console.error('TransmissionsPreview fetch error:', err);
        setError('Unable to load transmissions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransmissions();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <section className="transmissions-preview" id="transmissions-preview">
        <div className="transmissions-container">
          <motion.div 
            className="transmissions-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="transmissions-label">Latest Transmissions</span>
          </motion.div>
          
          <div className="transmissions-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="transmission-skeleton">
                <div className="skeleton-image" />
                <div className="skeleton-content">
                  <div className="skeleton-category" />
                  <div className="skeleton-title" />
                  <div className="skeleton-excerpt" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Hide section if error or no content
  if (error || transmissions.length === 0) {
    return null;
  }

  return (
    <section className="transmissions-preview" id="transmissions-preview">
      <div className="transmissions-container">
        {/* Section Header */}
        <motion.div 
          className="transmissions-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="transmissions-label">Latest Transmissions</span>
        </motion.div>

        {/* Transmissions Grid */}
        <div className="transmissions-grid">
          {transmissions.map((transmission, index) => (
            <motion.a
              key={transmission.id}
              href={`/transmissions/${transmission.slug}`}
              className="transmission-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ 
                duration: 0.7, 
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1] 
              }}
            >
              {/* Card Image */}
              {transmission.heroImage?.url && (
                <div className="transmission-card__image">
                  <img 
                    src={transmission.heroImage.url} 
                    alt={transmission.heroImage.alt_text || transmission.title}
                    loading="lazy"
                  />
                </div>
              )}
              
              {/* Card Content */}
              <div className="transmission-card__content">
                {transmission.category && (
                  <span className="transmission-card__category">
                    {transmission.category.title}
                  </span>
                )}
                
                <h3 className="transmission-card__title">
                  {transmission.title}
                </h3>
                
                {transmission.excerpt && (
                  <p className="transmission-card__excerpt">
                    {transmission.excerpt}
                  </p>
                )}
                
                {transmission.publishedAt && (
                  <time 
                    className="transmission-card__date"
                    dateTime={transmission.publishedAt}
                  >
                    {new Date(transmission.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </time>
                )}
              </div>
            </motion.a>
          ))}
        </div>

        {/* View All Link */}
        <motion.div 
          className="transmissions-cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <a href="/transmissions" className="transmissions-cta__link">
            <span>View All Transmissions</span>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path 
                d="M4 10H16M16 10L11 5M16 10L11 15" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default TransmissionsPreview;
