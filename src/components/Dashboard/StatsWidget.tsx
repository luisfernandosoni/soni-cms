import React from 'react'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'
import './stats.scss'

const StatsWidget: React.FC = async () => {
  try {
    const payload = await getPayloadHMR({ config })

    const [transmissions, media, authors] = await Promise.all([
      payload.count({ collection: 'transmissions' }),
      payload.count({ collection: 'media' }),
      payload.count({ collection: 'authors' }),
    ])

    return (
      <div className="stats-widget">
        <div className="stat-card neon-cyan">
          <h3>Transmissions</h3>
          <span className="count">{transmissions.totalDocs}</span>
          <div className="stat-footer">
            <span className="label">Total Signals</span>
          </div>
        </div>
        
        <div className="stat-card neon-magenta">
          <h3>Media Assets</h3>
          <span className="count">{media.totalDocs}</span>
          <div className="stat-footer">
            <span className="label">Uploaded Files</span>
          </div>
        </div>

        <div className="stat-card neon-purple">
          <h3>Authors</h3>
          <span className="count">{authors.totalDocs}</span>
          <div className="stat-footer">
            <span className="label">Active Credits</span>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('StatsWidget error:', error)
    return (
      <div className="stats-widget stats-widget--error">
        <p>Unable to load statistics</p>
      </div>
    )
  }
}

export default StatsWidget

