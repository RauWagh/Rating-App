import { atom } from 'jotai'

export const authAtom = atom(() => {
  const token = localStorage.getItem('token')
  const userJson = localStorage.getItem('user')
  return {
    token,
    user: userJson ? JSON.parse(userJson) : null,
  }
})

export const setAuthAtom = atom(null, (get, set, { token, user }) => {
  if (token) localStorage.setItem('token', token)
  else localStorage.removeItem('token')
  if (user) localStorage.setItem('user', JSON.stringify(user))
  else localStorage.removeItem('user')
  set(authAtom, { token, user })
})

export const logoutAtom = atom(null, (get, set) => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  set(authAtom, { token: null, user: null })
})

