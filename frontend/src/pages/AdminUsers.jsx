import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function AdminUsers() {
  const [rows, setRows] = useState([])
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [order, setOrder] = useState('asc')
  const [error, setError] = useState('')

  async function fetchUsers() {
    try {
      const { data } = await api.get('/admin/users', { params: { search, role, sortBy, order } })
      setRows(data)
    } catch (err) {
      setError('Failed to load users')
    }
  }

  useEffect(() => { fetchUsers() }, [])

  function onSort(field) {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setOrder('asc')
    }
    setTimeout(fetchUsers, 0)
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Users</h2>
        <div style={{ marginBottom: 8 }}>
          <a className="btn" href="/admin/users/create">Add User</a>
        </div>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <input className="input" placeholder="Search name/email/address" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">All Roles</option>
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
            <option value="OWNER">OWNER</option>
          </select>
          <button className="btn" onClick={fetchUsers}>Apply</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th style={{ cursor: 'pointer' }} onClick={() => onSort('name')}>Name</th>
                <th style={{ cursor: 'pointer' }} onClick={() => onSort('email')}>Email</th>
                <th style={{ cursor: 'pointer' }} onClick={() => onSort('address')}>Address</th>
                <th style={{ cursor: 'pointer' }} onClick={() => onSort('role')}>Role</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.address}</td>
                  <td>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

