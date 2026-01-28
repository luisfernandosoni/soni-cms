import React from 'react'
import Link from 'next/link'
import './quick-actions.scss'

const QuickActions: React.FC = () => {
  return (
    <div className="quick-actions-widget">
      <h3 className="widget-title">Quick Actions</h3>
      <div className="actions-grid">
        <Link href="/admin/collections/transmissions/create" className="action-btn neon-border-cyan">
          <span className="icon">📡</span>
          <span className="text">New Transmission</span>
        </Link>
        
        <Link href="/admin/collections/media/create" className="action-btn neon-border-magenta">
          <span className="icon">🖼️</span>
          <span className="text">Upload Media</span>
        </Link>

        <Link href="/admin/collections/authors/create" className="action-btn neon-border-purple">
          <span className="icon">👤</span>
          <span className="text">Add Author</span>
        </Link>

        <a href="/" target="_blank" className="action-btn neon-border-green">
          <span className="icon">🚀</span>
          <span className="text">View Live Site</span>
        </a>
      </div>
    </div>
  )
}

export default QuickActions
