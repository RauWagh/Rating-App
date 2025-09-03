import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { setAuthAtom } from '../state/auth'
import { api } from '../lib/api'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const setAuth = useSetAtom(setAuthAtom)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/auth/login', { email, password })
      setAuth({ token: data.token, user: data.user })
      navigate('/')
    } catch (err) {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 420, margin: '40px auto' }}>
        <h2>Login</h2>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <form onSubmit={onSubmit}>
          <div>
            <label>Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div style={{ marginTop: 12 }}>
            <label>Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button className="btn" type="submit">Login</button>
            <Link to="/signup">Create account</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

