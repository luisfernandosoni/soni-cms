'use client'

import React, { useState } from 'react'
import type { CinematicVideoBlock as CinematicVideoBlockType, Media } from '@/payload-types'
import './blocks.scss'

interface CinematicVideoProps {
  block: CinematicVideoBlockType
}

/**
 * CinematicVideo Block
 * 
 * Renders video embeds with:
 * - YouTube/Vimeo detection and embed
 * - Direct video file support
 * - Poster image overlay with play button
 * - Autoplay/loop options
 */
export const CinematicVideo: React.FC<CinematicVideoProps> = ({ block }) => {
  const [isPlaying, setIsPlaying] = useState(block.autoplay || false)
  
  const { url, posterImage, autoplay, loop, caption } = block
  
  // Get poster URL from media object
  const posterUrl = posterImage && typeof posterImage === 'object' 
    ? (posterImage as Media).url 
    : null

  // Detect video provider
  const isYouTube = url?.includes('youtube.com') || url?.includes('youtu.be')
  const isVimeo = url?.includes('vimeo.com')
  
  // Extract video ID for embeds
  const getYouTubeId = (videoUrl: string) => {
    const match = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/)
    return match?.[1]
  }
  
  const getVimeoId = (videoUrl: string) => {
    const match = videoUrl.match(/vimeo\.com\/(\d+)/)
    return match?.[1]
  }

  const handlePlay = () => {
    setIsPlaying(true)
  }

  return (
    <div className="block block--cinematic-video">
      <div className="video-container">
        {!isPlaying && posterUrl && (
          <div className="video-poster" onClick={handlePlay}>
            <img src={posterUrl} alt="Video thumbnail" />
            <button className="play-button" aria-label="Play video">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        )}
        
        {(isPlaying || !posterUrl) && (
          <>
            {isYouTube && url && (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${getYouTubeId(url)}?autoplay=${autoplay ? 1 : 0}&loop=${loop ? 1 : 0}&rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="video-embed"
              />
            )}
            
            {isVimeo && url && (
              <iframe
                src={`https://player.vimeo.com/video/${getVimeoId(url)}?autoplay=${autoplay ? 1 : 0}&loop=${loop ? 1 : 0}`}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="video-embed"
              />
            )}
            
            {!isYouTube && !isVimeo && url && (
              <video
                src={url}
                controls
                autoPlay={autoplay || false}
                loop={loop || false}
                poster={posterUrl || undefined}
                className="video-native"
              />
            )}
          </>
        )}
      </div>
      
      {caption && <figcaption className="video-caption">{caption}</figcaption>}
    </div>
  )
}

export default CinematicVideo
