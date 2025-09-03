import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ users: 0, stores: 0, ratings: 0 })
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => setCounts(data)).catch(() => setError('Failed to load'))
  }, [])

  return (
    <div className="container">
      <div className="card">
        <h2>Admin Dashboard</h2>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
          <div className="card"><strong>Total Users:</strong> {counts.users}</div>
          <div className="card"><strong>Total Stores:</strong> {counts.stores}</div>
          <div className="card"><strong>Total Ratings:</strong> {counts.ratings}</div>
        </div>
      </div>
    </div>
  )
}

