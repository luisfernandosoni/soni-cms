import React from 'react'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'
import Link from 'next/link'
import './recent.scss'

const RecentTransmissions: React.FC = async () => {
  try {
    const payload = await getPayloadHMR({ config })

    const recentDocs = await payload.find({
      collection: 'transmissions',
      limit: 5,
      sort: '-updatedAt',
      depth: 0,
    })

    return (
      <div className="recent-transmissions-widget">
        <h3 className="widget-title">Recent Transmissions</h3>
        <div className="table-container">
          <table className="recent-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentDocs.docs.map((doc) => (
                <tr key={doc.id}>
                  <td className="title-cell">{doc.title}</td>
                  <td>
                    <span className={`status-badge ${doc.status}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="date-cell">
                    {new Date(doc.updatedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <Link 
                      href={`/admin/collections/transmissions/${doc.id}`}
                      className="edit-link"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {recentDocs.docs.length === 0 && (
                <tr>
                  <td colSpan={4} className="empty-state">No transmissions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  } catch (error) {
    console.error('RecentTransmissions error:', error)
    return (
      <div className="recent-transmissions-widget recent-transmissions-widget--error">
        <p>Unable to load recent transmissions</p>
      </div>
    )
  }
}

export default RecentTransmissions

