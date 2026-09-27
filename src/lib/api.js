// Cliente para conectarse al backend real (Proyecto_Soft_back).
// Configura la URL en un archivo .env (mira .env.example).

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const TOKEN_STORAGE_KEY = 'ecoulima_token'

export function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

async function parseResponse(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || 'Ocurrió un error al conectar con el servidor.')
  }
  return data
}

// Wrapper interno que agrega el header Authorization automáticamente.
async function authFetch(path, { method = 'GET', body } = {}) {
  const token = getToken()
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  return parseResponse(res)
}

// --- Autenticación ---

// El backend recibe el campo "codigo" (código de usuario), no un correo.
// El formulario de login pide "correo institucional" para respetar el mockup,
// pero ese valor se envía como "codigo" al backend.
export async function login(codigo, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ codigo, password, soloAdmin: true }),
  })
  const data = await parseResponse(res)
  if (data.token) setToken(data.token)
  return data
}

// --- Dashboard ---

export function getDashboard() {
  return authFetch('/api/dashboard')
}

// --- Usuarios ---

export function getUsuarios() {
  return authFetch('/api/usuarios')
}

export function getUsuario(id) {
  return authFetch(`/api/usuarios/${id}`)
}

export function updateUsuario(id, data) {
  return authFetch(`/api/usuarios/${id}`, { method: 'PATCH', body: data })
}

// --- Rankings ---

export function getRankings() {
  return authFetch('/api/rankings')
}

// --- Premios ---

export function getPremios() {
  return authFetch('/api/premios')
}

export function createPremio(data) {
  return authFetch('/api/premios', { method: 'POST', body: data })
}

export function updatePremio(id, data) {
  return authFetch(`/api/premios/${id}`, { method: 'PUT', body: data })
}

export function togglePremioEstado(id) {
  return authFetch(`/api/premios/${id}/estado`, { method: 'PATCH' })
}

export function deletePremio(id) {
  return authFetch(`/api/premios/${id}`, { method: 'DELETE' })
}

export { API_URL }
