import { useAtom } from 'jotai'
import { Navigate } from 'react-router-dom'
import { authAtom } from '../state/auth'

export default function RequireAuth({ children }) {
  const [auth] = useAtom(authAtom)
  if (!auth.token) return <Navigate to="/login" replace />
  return children
}

