import { useAtom, useSetAtom } from 'jotai'
import { authAtom, logoutAtom } from '../state/auth'
import { Link, useNavigate } from 'react-router-dom'

export default function Nav() {
  const [auth] = useAtom(authAtom)
  const logout = useSetAtom(logoutAtom)
  const navigate = useNavigate()
  const role = auth.user?.role

  function onLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
      <div className="container" style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link to="/">StoreRatings</Link>
          {auth.token && (
            <>
              <Link to="/stores">Stores</Link>
              <Link to="/change-password">Change Password</Link>
              {role === 'ADMIN' && <Link to="/admin">Admin</Link>}
              {role === 'ADMIN' && <Link to="/admin/users">Users</Link>}
              {role === 'ADMIN' && <Link to="/admin/stores">Stores</Link>}
              {role === 'OWNER' && <Link to="/owner">Owner</Link>}
            </>
          )}
        </div>
        <div>
          {!auth.token ? (
            <>
              <Link to="/login">Login</Link>
              {" | "}
              <Link to="/signup">Signup</Link>
            </>
          ) : (
            <button className="btn" onClick={onLogout}>Logout</button>
          )}
        </div>
      </div>
    </div>
  )
}

