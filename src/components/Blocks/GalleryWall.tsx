'use client'

import React, { useState } from 'react'
import type { GalleryWallBlock as GalleryWallBlockType, Media } from '@/payload-types'
import './blocks.scss'

interface GalleryWallProps {
  block: GalleryWallBlockType
}

/**
 * GalleryWall Block
 * 
 * Multi-image layouts with:
 * - Grid, Masonry, Carousel modes
 * - Configurable columns
 * - Lightbox on click
 */
export const GalleryWall: React.FC<GalleryWallProps> = ({ block }) => {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const { images, layoutType, columns, caption } = block
  
  // Normalize images to Media objects
  const mediaImages = (images || [])
    .map((img) => (typeof img === 'object' ? img : null))
    .filter(Boolean) as Media[]

  const layoutClass = `gallery--${layoutType || 'grid'}`
  const columnClass = `gallery--cols-${columns || '3'}`

  const handleImageClick = (url: string) => {
    setLightboxImage(url)
  }

  const closeLightbox = () => {
    setLightboxImage(null)
  }

  return (
    <div className={`block block--gallery-wall ${layoutClass} ${columnClass}`}>
      <div className="gallery-grid">
        {mediaImages.map((image, index) => (
          <figure 
            key={image.id || index} 
            className="gallery-item"
            onClick={() => image.url && handleImageClick(image.url)}
          >
            <img
              src={image.url || ''}
              alt={image.altText || `Gallery image ${index + 1}`}
              loading="lazy"
            />
          </figure>
        ))}
      </div>
      
      {caption && <figcaption className="gallery-caption">{caption}</figcaption>}
      
      {/* Lightbox */}
      {lightboxImage && (
        <div className="gallery-lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" aria-label="Close lightbox">×</button>
          <img src={lightboxImage} alt="Lightbox view" />
        </div>
      )}
    </div>
  )
}

export default GalleryWall
