'use client'

import React from 'react'
import type { CodeTerminalBlock as CodeTerminalBlockType } from '@/payload-types'
import './blocks.scss'

interface CodeTerminalProps {
  block: CodeTerminalBlockType
}

/**
 * CodeTerminal Block
 * 
 * Renders code snippets with:
 * - Syntax highlighting via CSS classes
 * - Line numbers toggle
 * - Filename header bar
 * - Copy to clipboard button
 */
export const CodeTerminal: React.FC<CodeTerminalProps> = ({ block }) => {
  const { code, language, showLineNumbers, filename } = block
  
  const handleCopy = async () => {
    if (code) {
      await navigator.clipboard.writeText(code)
    }
  }
  
  // Split code into lines for line numbers
  const lines = code?.split('\n') || []

  return (
    <div className={`block block--code-terminal language-${language || 'typescript'}`}>
      {/* Terminal header bar */}
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot dot--red" />
          <span className="dot dot--yellow" />
          <span className="dot dot--green" />
        </div>
        {filename && <span className="terminal-filename">{filename}</span>}
        <button 
          className="terminal-copy" 
          onClick={handleCopy}
          aria-label="Copy code"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>
      </div>
      
      {/* Code content */}
      <div className="terminal-body">
        <pre className={showLineNumbers ? 'with-line-numbers' : ''}>
          {showLineNumbers && (
            <div className="line-numbers" aria-hidden="true">
              {lines.map((_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>
          )}
          <code className={`language-${language || 'typescript'}`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  )
}

export default CodeTerminal
