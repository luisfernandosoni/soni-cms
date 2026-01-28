import React from 'react'
import type { StatementBlock as StatementBlockType } from '@/payload-types'
import './blocks.scss'

interface StatementProps {
  block: StatementBlockType
}

/**
 * Statement Block
 * 
 * Massive typography for quotes and manifestos.
 * Supports display, h1, h2 sizes with alignment options.
 */
export const Statement: React.FC<StatementProps> = ({ block }) => {
  const { text, size, alignment, attribution } = block
  
  const sizeClass = `statement--${size || 'h1'}`
  const alignClass = `statement--align-${alignment || 'center'}`

  return (
    <blockquote className={`block block--statement ${sizeClass} ${alignClass}`}>
      <p className="statement-text">{text}</p>
      {attribution && (
        <footer className="statement-attribution">
          <cite>— {attribution}</cite>
        </footer>
      )}
    </blockquote>
  )
}

export default Statement
