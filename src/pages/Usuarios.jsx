import { useMemo, useState } from 'react'
import Topbar from '../components/Topbar'
import UserDetailModal from '../components/UserDetailModal'
import * as api from '../lib/api'

export default function Usuarios({ usuarios, showToast }) {
  const [busqueda, setBusqueda] = useState('')
  const [seleccionado, setSeleccionado] = useState(null)
  const [cargandoDetalle, setCargandoDetalle] = useState(false)

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return usuarios
    return usuarios.filter((u) =>
      u.nombre.toLowerCase().includes(q) || u.correo.toLowerCase().includes(q)
    )
  }, [usuarios, busqueda])

  const verDetalle = async (usuario) => {
    setCargandoDetalle(true)
    try {
      const data = await api.getUsuario(usuario.id)
      setSeleccionado(data.usuario)
    } catch (err) {
      showToast(err.message || 'No se pudo cargar el detalle del usuario.', 'error')
    } finally {
      setCargandoDetalle(false)
    }
  }

  return (
    <>
      <Topbar title="Administración de Usuarios" />
      <div className="page-content">
        <div className="panel">
          <h3>Usuarios registrados ({usuarios.length})</h3>
          <input
            className="search-input"
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <table className="data-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Carrera</th>
                <th>Puntos</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((u) => (
                <tr key={u.id}>
                  <td>{u.nombre}</td>
                  <td>{u.correo}</td>
                  <td>{u.carrera}</td>
                  <td>{u.puntos.toLocaleString('es-PE')}</td>
                  <td><span className={`pill ${u.estado === 'Activo' ? 'green' : 'gray'}`}>{u.estado}</span></td>
                  <td>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => verDetalle(u)}
                      disabled={cargandoDetalle}
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-state">No se encontraron usuarios con ese criterio.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UserDetailModal usuario={seleccionado} onClose={() => setSeleccionado(null)} />
    </>
  )
}
