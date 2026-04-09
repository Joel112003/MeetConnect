const API_BASE_URL = 'http://localhost:8000/api/v1/users'

export const api = {
  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error('Login failed')
    return res.json()
  },

  signup: async (username, email, password) => {
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })
    if (!res.ok) throw new Error('Signup failed')
    return res.json()
  },

  verifyToken: async (token) => {
    const res = await fetch(`${API_BASE_URL}/verify`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    if (!res.ok) throw new Error('Token verification failed')
    return res.json()
  },

  logout: async (token) => {
    await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    })
  },
}