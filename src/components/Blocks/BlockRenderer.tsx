import React from 'react'
import type {
  CinematicVideoBlock,
  StatementBlock,
  CodeTerminalBlock,
  GalleryWallBlock,
  RichTextBlock,
} from '@/payload-types'
import { CinematicVideo } from './CinematicVideo'
import { Statement } from './Statement'
import { CodeTerminal } from './CodeTerminal'
import { GalleryWall } from './GalleryWall'
import { RichText } from './RichText'

// Block type union - all possible block types
type Block =
  | CinematicVideoBlock
  | StatementBlock
  | CodeTerminalBlock
  | GalleryWallBlock
  | RichTextBlock

interface BlockRendererProps {
  blocks: Block[] | null | undefined
}

/**
 * BlockRenderer
 * 
 * Main router component that receives an array of blocks from Payload CMS
 * and renders the appropriate React component for each block type.
 * 
 * Uses a mapping object pattern for clean, extensible block routing.
 */
export const BlockRenderer: React.FC<BlockRendererProps> = ({ blocks }) => {
  if (!blocks || blocks.length === 0) {
    return null
  }

  return (
    <div className="blocks-renderer">
      {blocks.map((block, index) => {
        const key = `block-${index}-${block.blockType}`
        
        switch (block.blockType) {
          case 'cinematicVideo':
            return <CinematicVideo key={key} block={block} />
          case 'statement':
            return <Statement key={key} block={block} />
          case 'codeTerminal':
            return <CodeTerminal key={key} block={block} />
          case 'galleryWall':
            return <GalleryWall key={key} block={block} />
          case 'richText':
            return <RichText key={key} block={block} />
          default:
            // Unknown block type - render nothing in production
            console.warn(`Unknown block type: ${(block as any).blockType}`)
            return null
        }
      })}
    </div>
  )
}

export default BlockRenderer
