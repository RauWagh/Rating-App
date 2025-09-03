import { useState } from 'react'
import { api } from '../lib/api'
import { useNavigate } from 'react-router-dom'

export default function AdminCreateUser() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('USER')
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await api.post('/admin/users', { name, email, address, password, role })
      navigate('/admin/users')
    } catch (err) {
      setError('Failed to create user')
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 560, margin: '40px auto' }}>
        <h2>Create User</h2>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <form onSubmit={onSubmit}>
          <div>
            <label>Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} minLength={20} maxLength={60} required />
          </div>
          <div style={{ marginTop: 12 }}>
            <label>Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div style={{ marginTop: 12 }}>
            <label>Address</label>
            <input className="input" value={address} onChange={(e) => setAddress(e.target.value)} maxLength={400} />
          </div>
          <div style={{ marginTop: 12 }}>
            <label>Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} maxLength={16} required />
          </div>
          <div style={{ marginTop: 12 }}>
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
              <option value="OWNER">OWNER</option>
            </select>
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="btn" type="submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  )
}

