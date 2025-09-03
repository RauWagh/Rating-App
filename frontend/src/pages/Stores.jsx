import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Stores() {
  const [rows, setRows] = useState([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  async function fetchStores() {
    try {
      const { data } = await api.get('/stores', { params: { search } })
      setRows(data)
    } catch (err) {
      setError('Failed to load stores')
    }
  }

  useEffect(() => {
    fetchStores()
  }, [])

  async function submitRating(storeId, rating) {
    try {
      await api.post('/ratings', { storeId, rating })
      await fetchStores()
    } catch (err) {
      alert('Failed to submit rating')
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Stores</h2>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input className="input" placeholder="Search by name or address" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn" onClick={fetchStores}>Search</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Store Name</th>
                <th>Address</th>
                <th>Overall Rating</th>
                <th>Your Rating</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.address}</td>
                  <td>{r.overall_rating ?? '-'}</td>
                  <td>{r.user_rating ?? '-'}</td>
                  <td>
                    <select defaultValue={r.user_rating || ''} onChange={(e) => submitRating(r.id, Number(e.target.value))}>
                      <option value="">Select</option>
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

