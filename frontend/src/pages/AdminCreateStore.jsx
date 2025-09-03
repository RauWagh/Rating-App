import { useState } from 'react'
import { api } from '../lib/api'
import { useNavigate } from 'react-router-dom'

export default function AdminCreateStore() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [ownerId, setOwnerId] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await api.post('/admin/stores', { name, email: email || null, address, ownerId: ownerId || null })
      navigate('/admin/stores')
    } catch (err) {
      setError('Failed to create store')
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 560, margin: '40px auto' }}>
        <h2>Create Store</h2>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <form onSubmit={onSubmit}>
          <div>
            <label>Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div style={{ marginTop: 12 }}>
            <label>Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div style={{ marginTop: 12 }}>
            <label>Address</label>
            <input className="input" value={address} onChange={(e) => setAddress(e.target.value)} maxLength={400} required />
          </div>
          <div style={{ marginTop: 12 }}>
            <label>Owner ID (optional)</label>
            <input className="input" value={ownerId} onChange={(e) => setOwnerId(e.target.value)} />
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="btn" type="submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  )
}

