import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { setAuthAtom } from '../state/auth'
import { api } from '../lib/api'
import { Link, useNavigate } from 'react-router-dom'

const passwordHint = '8-16 chars, include uppercase & special character'

export default function Signup() {
  const setAuth = useSetAtom(setAuthAtom)
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/auth/signup', { name, email, address, password })
      setAuth({ token: data.token, user: data.user })
      navigate('/')
    } catch (err) {
      setError('Signup failed. Check inputs or email already used')
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 520, margin: '40px auto' }}>
        <h2>Signup</h2>
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
            <small>{passwordHint}</small>
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button className="btn" type="submit">Create account</button>
            <Link to="/login">Back to login</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

