import { useCallback, useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Toast from './components/Toast'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Usuarios from './pages/Usuarios'
import Rankings from './pages/Rankings'
import Premios from './pages/Premios'
import useToast from './hooks/useToast'
import useAuth from './hooks/useAuth'
import * as api from './lib/api'

export default function App() {
  const [usuarios, setUsuarios] = useState([])
  const [premios, setPremios] = useState([])
  const [actividad, setActividad] = useState([])
  const [resumen, setResumen] = useState(null)
  const [cargando, setCargando] = useState(false)
  const { toast, showToast } = useToast()
  const { user, saveSession, clearSession } = useAuth()

  // Carga inicial de datos reales del backend una vez el admin inició sesión.
  const cargarDatos = useCallback(async () => {
    setCargando(true)
    try {
      const [dashboardData, usuariosData, premiosData] = await Promise.all([
        api.getDashboard(),
        api.getUsuarios(),
        api.getPremios(),
      ])
      setResumen(dashboardData.resumen)
      setActividad(dashboardData.actividad)
      setUsuarios(usuariosData.usuarios)
      setPremios(premiosData.premios)
    } catch (err) {
      showToast(err.message || 'No se pudieron cargar los datos del servidor.', 'error')
    } finally {
      setCargando(false)
    }
  }, [showToast])

  useEffect(() => {
    if (user) cargarDatos()
  }, [user, cargarDatos])

  const handleLogin = (userData) => {
    saveSession(userData)
  }

  const handleLogout = () => {
    clearSession()
    setUsuarios([])
    setPremios([])
    setActividad([])
    setResumen(null)
  }

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute user={user}>
            <div className="app-shell">
              <Sidebar user={user} onLogout={handleLogout} />
              <div className="main-area">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Dashboard
                        usuarios={usuarios}
                        actividad={actividad}
                        premios={premios}
                        resumen={resumen}
                        cargando={cargando}
                      />
                    }
                  />
                  <Route
                    path="/usuarios"
                    element={<Usuarios usuarios={usuarios} showToast={showToast} onRecargar={cargarDatos} />}
                  />
                  <Route
                    path="/rankings"
                    element={<Rankings usuarios={usuarios} setUsuarios={setUsuarios} showToast={showToast} />}
                  />
                  <Route
                    path="/premios"
                    element={
                      <Premios
                        premios={premios}
                        setPremios={setPremios}
                        showToast={showToast}
                      />
                    }
                  />
                </Routes>
              </div>
              <Toast toast={toast} />
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
