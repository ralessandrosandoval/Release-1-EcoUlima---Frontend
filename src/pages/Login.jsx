import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../lib/api'

export default function Login({ onLogin }) {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!correo.trim() || !password) {
      setError('Ingresa tu correo institucional y tu contraseña.')
      return
    }

    setCargando(true)
    try {
      // El backend espera el campo "codigo"; se envía el valor del campo correo.
      const data = await login(correo.trim(), password)
      onLogin(data.user || { codigo: correo.trim() })
      navigate('/')
    } catch (err) {
      setError(err.message || 'Correo o contraseña incorrectos.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-circle">♻️</div>
          <h1>EcoULima-Adminitrador</h1>
          <p>Recicla y cuida el planeta</p>
        </div>

        <div className="login-body">
          <h2>Iniciar Sesión</h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="correo">Correo institucional</label>
              <input
                id="correo"
                type="email"
                placeholder="nombre@ulima.edu.pe"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="field" style={{ marginTop: 16 }}>
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="btn btn-primary login-submit" disabled={cargando}>
              {cargando ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>


          <p className="login-copy">Universidad de Lima © 2026</p>
        </div>
      </div>
    </div>
  )
}
