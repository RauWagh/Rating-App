import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function OwnerDashboard() {
  const [data, setData] = useState({ storeId: null, averageRating: null, raters: [] })
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/owner/dashboard').then(({ data }) => setData(data)).catch(() => setError('Failed to load'))
  }, [])

  return (
    <div className="container">
      <div className="card">
        <h2>Owner Dashboard</h2>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <p><strong>Store ID:</strong> {data.storeId || '-'}</p>
        <p><strong>Average Rating:</strong> {data.averageRating ?? '-'}</p>
        <h3>Raters</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Rating</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {data.raters.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td>{r.rating}</td>
                  <td>{new Date(r.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

