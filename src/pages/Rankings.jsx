import { useEffect, useMemo, useState } from 'react'
import Topbar from '../components/Topbar'
import UserDetailModal from '../components/UserDetailModal'
import { esAnomalo } from '../data/mockData'
import * as api from '../lib/api'

const MEDALLAS = ['🥇', '🥈', '🥉']
const POLL_INTERVAL_MS = 15000

export default function Rankings({ usuarios, setUsuarios, showToast }) {
  const [busqueda, setBusqueda] = useState('')
  const [seleccionado, setSeleccionado] = useState(null)
  const [cargandoDetalle, setCargandoDetalle] = useState(false)

  // Refresca el ranking real desde el backend cada cierto tiempo,
  // en vez de simular puntos aleatorios en el cliente.
  useEffect(() => {
    let activo = true

    const refrescar = async () => {
      try {
        const data = await api.getRankings()
        if (!activo) return
        setUsuarios((prev) =>
          data.rankings.map((r) => {
            const previo = prev.find((p) => p.id === r.id)
            return {
              ...(previo || {}),
              id: r.id,
              nombre: r.nombre,
              puntos: r.puntos,
              reciclajes: r.reciclajes,
              estado: r.estado,
              correo: previo?.correo ?? '',
              carrera: previo?.carrera ?? '',
              fechaRegistro: r.fechaRegistro,
            }
          })
        )
      } catch (err) {
        // Silencioso: no interrumpimos la vista por un fallo de refresco puntual.
        console.error('No se pudo refrescar el ranking:', err.message)
      }
    }

    const interval = setInterval(refrescar, POLL_INTERVAL_MS)
    return () => {
      activo = false
      clearInterval(interval)
    }
  }, [setUsuarios])

  const ranking = useMemo(() => {
    return [...usuarios].sort((a, b) => b.puntos - a.puntos)
  }, [usuarios])

  const filtrado = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return ranking
    return ranking.filter((u) => u.nombre.toLowerCase().includes(q))
  }, [ranking, busqueda])

  const mayorPuntos = ranking[0]?.puntos ?? 0
  const anomalos = usuarios.filter(esAnomalo).length

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
      <Topbar title="Gestor de Rankings" />
      <div className="page-content">
        <div className="stat-grid">
          <div className="stat-card">
            <div className="label">Usuarios</div>
            <div className="value">{usuarios.length}</div>
          </div>
          <div className="stat-card">
            <div className="label">Mayor puntos</div>
            <div className="value">{mayorPuntos.toLocaleString('es-PE')}</div>
          </div>
          <div className="stat-card">
            <div className="label">Anómalos</div>
            <div className="value red">{anomalos}</div>
          </div>
        </div>

        <div className="panel">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <h3 style={{ marginBottom: 0 }}>Ranking general</h3>
            <span style={{ fontSize: 12.5, color: 'var(--ink-500)', fontWeight: 600 }}>
              <span className="live-dot" /> Actualiza cada {POLL_INTERVAL_MS / 1000}s
            </span>
          </div>
          <input
            className="search-input"
            style={{ marginTop: 14 }}
            type="text"
            placeholder="Buscar usuario..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <table className="data-table">
            <thead>
              <tr>
                <th>Posición</th>
                <th>Usuario</th>
                <th>Puntos</th>
                <th>Recicla</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtrado.map((u) => {
                const posicion = ranking.findIndex((r) => r.id === u.id) + 1
                const anomalo = esAnomalo(u)
                return (
                  <tr key={u.id}>
                    <td>
                      {posicion <= 3 && <span className="rank-medal">{MEDALLAS[posicion - 1]}</span>}
                      {posicion}
                    </td>
                    <td>{u.nombre}</td>
                    <td>{u.puntos.toLocaleString('es-PE')}</td>
                    <td>{u.reciclajes}</td>
                    <td>
                      <span className={`pill ${anomalo ? 'red' : 'green'}`}>
                        {anomalo ? 'Anómalo' : 'Normal'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${anomalo ? 'btn-danger' : 'btn-outline'}`}
                        onClick={() => verDetalle(u)}
                        disabled={cargandoDetalle}
                      >
                        {anomalo ? 'Investigar' : 'Detalle'}
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filtrado.length === 0 && (
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
