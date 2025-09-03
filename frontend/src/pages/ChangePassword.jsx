import { useState } from 'react'
import { api } from '../lib/api'

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword })
      setMessage('Password updated')
      setCurrentPassword('')
      setNewPassword('')
    } catch (err) {
      setError('Failed to update password')
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 520, margin: '40px auto' }}>
        <h2>Change Password</h2>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <form onSubmit={onSubmit}>
          <div>
            <label>Current Password</label>
            <input className="input" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          </div>
          <div style={{ marginTop: 12 }}>
            <label>New Password</label>
            <input className="input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={8} maxLength={16} required />
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="btn" type="submit">Update</button>
          </div>
        </form>
      </div>
    </div>
  )
}

