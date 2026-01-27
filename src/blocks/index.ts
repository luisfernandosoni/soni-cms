/**
 * Blocks Index
 * Export all block types for the Canvas Architecture
 */

export { CinematicVideoBlock } from './CinematicVideo'
export { StatementBlock } from './Statement'
export { CodeTerminalBlock } from './CodeTerminal'
export { GalleryWallBlock } from './GalleryWall'
export { RichTextBlock } from './RichText'

// Convenience array for importing all blocks at once
import { CinematicVideoBlock } from './CinematicVideo'
import { StatementBlock } from './Statement'
import { CodeTerminalBlock } from './CodeTerminal'
import { GalleryWallBlock } from './GalleryWall'
import { RichTextBlock } from './RichText'

export const AllBlocks = [
  CinematicVideoBlock,
  StatementBlock,
  CodeTerminalBlock,
  GalleryWallBlock,
  RichTextBlock,
]
