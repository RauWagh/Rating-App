import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function AdminStores() {
  const [rows, setRows] = useState([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [order, setOrder] = useState('asc')
  const [error, setError] = useState('')

  async function fetchStores() {
    try {
      const { data } = await api.get('/admin/stores', { params: { search, sortBy, order } })
      setRows(data)
    } catch (err) {
      setError('Failed to load stores')
    }
  }

  useEffect(() => { fetchStores() }, [])

  function onSort(field) {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setOrder('asc')
    }
    setTimeout(fetchStores, 0)
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Stores</h2>
        <div style={{ marginBottom: 8 }}>
          <a className="btn" href="/admin/stores/create">Add Store</a>
        </div>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input className="input" placeholder="Search name/email/address" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn" onClick={fetchStores}>Apply</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th style={{ cursor: 'pointer' }} onClick={() => onSort('name')}>Name</th>
                <th style={{ cursor: 'pointer' }} onClick={() => onSort('email')}>Email</th>
                <th style={{ cursor: 'pointer' }} onClick={() => onSort('address')}>Address</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.address}</td>
                  <td>{s.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

