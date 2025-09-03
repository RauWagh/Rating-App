import { useAtom } from 'jotai'
import { Navigate } from 'react-router-dom'
import { authAtom } from '../state/auth'

export default function RequireRole({ roles, children }) {
  const [auth] = useAtom(authAtom)
  if (!auth.token) return <Navigate to="/login" replace />
  if (!roles.includes(auth.user?.role)) return <Navigate to="/" replace />
  return children
}

