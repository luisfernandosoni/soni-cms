'use client'

import React from 'react'
import type { RichTextBlock as RichTextBlockType } from '@/payload-types'
import './blocks.scss'

interface RichTextProps {
  block: RichTextBlockType
}

/**
 * RichText Block
 * 
 * Renders Lexical rich text content.
 * Uses Payload's serializer or raw HTML output.
 */
export const RichText: React.FC<RichTextProps> = ({ block }) => {
  const { content } = block

  if (!content) {
    return null
  }

  // Lexical content is stored as JSON - render it
  // For full rich rendering, integrate @payloadcms/richtext-lexical/react
  // This is a simplified version that handles the JSON structure
  return (
    <div className="block block--rich-text prose">
      {typeof content === 'string' ? (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <div className="lexical-content">
          {/* Lexical JSON content - requires proper serializer */}
          <pre style={{ display: 'none' }}>{JSON.stringify(content)}</pre>
          <p className="rich-text-placeholder">
            Rich text content loaded. Enable Lexical serializer for full rendering.
          </p>
        </div>
      )}
    </div>
  )
}

export default RichText
