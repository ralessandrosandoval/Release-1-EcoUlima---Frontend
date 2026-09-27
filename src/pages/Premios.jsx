import { useState } from 'react'
import Topbar from '../components/Topbar'
import * as api from '../lib/api'

const ICONOS = ['🎁', '☕', '📓', '🍩', '🎫', '🥤', '🎧', '🌱']

export default function Premios({ premios, setPremios, showToast }) {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [costo, setCosto] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  const [confirmarEliminar, setConfirmarEliminar] = useState(null)
  const [enviando, setEnviando] = useState(false)

  const limpiarFormulario = () => {
    setNombre('')
    setDescripcion('')
    setCosto('')
    setEditandoId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nombre.trim() || !costo) {
      showToast('Completa el nombre y el costo en puntos.', 'error')
      return
    }
    const puntosNum = Number(costo)
    if (Number.isNaN(puntosNum) || puntosNum <= 0) {
      showToast('El costo en puntos debe ser un número mayor a 0.', 'error')
      return
    }

    setEnviando(true)
    try {
      if (editandoId) {
        const data = await api.updatePremio(editandoId, {
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          puntos: puntosNum,
        })
        setPremios((prev) => prev.map((p) => (p.id === editandoId ? data.premio : p)))
        showToast('Premio actualizado exitosamente.', 'success')
      } else {
        const icono = ICONOS[Math.floor(Math.random() * ICONOS.length)]
        const data = await api.createPremio({
          nombre: nombre.trim(),
          descripcion: descripcion.trim() || 'Sin descripción',
          puntos: puntosNum,
          icono,
        })
        setPremios((prev) => [...prev, data.premio])
        showToast('Premio agregado exitosamente.', 'success')
      }
      limpiarFormulario()
    } catch (err) {
      showToast(err.message || 'No se pudo guardar el premio.', 'error')
    } finally {
      setEnviando(false)
    }
  }

  const iniciarEdicion = (premio) => {
    setEditandoId(premio.id)
    setNombre(premio.nombre)
    setDescripcion(premio.descripcion)
    setCosto(String(premio.puntos))
  }

  const eliminarPremio = async (id) => {
    try {
      await api.deletePremio(id)
      setPremios((prev) => prev.filter((p) => p.id !== id))
      showToast('Premio eliminado exitosamente.', 'success')
    } catch (err) {
      showToast(err.message || 'No se pudo eliminar el premio.', 'error')
    } finally {
      setConfirmarEliminar(null)
    }
  }

  const toggleEstado = async (id) => {
    try {
      const data = await api.togglePremioEstado(id)
      setPremios((prev) => prev.map((p) => (p.id === id ? data.premio : p)))
    } catch (err) {
      showToast(err.message || 'No se pudo cambiar el estado del premio.', 'error')
    }
  }

  return (
    <>
      <Topbar title="Gestión de Premios" />
      <div className="page-content">
        <div className="panel">
          <h3>{editandoId ? 'Editar premio' : 'Agregar nuevo premio'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field">
                <label>Nombre del premio</label>
                <input
                  type="text"
                  placeholder="Ej. Café Gratis"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="field">
                <label>Descripción</label>
                <input
                  type="text"
                  placeholder="Ej. Bebida en cafetería"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>
              <div className="field">
                <label>Costo en puntos</label>
                <input
                  type="number"
                  min="1"
                  placeholder="50"
                  value={costo}
                  onChange={(e) => setCosto(e.target.value)}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button type="submit" className="btn btn-primary" disabled={enviando}>
                {enviando ? 'Guardando...' : editandoId ? 'Guardar cambios' : '+ Agregar'}
              </button>
              {editandoId && (
                <button type="button" className="btn btn-ghost" onClick={limpiarFormulario} disabled={enviando}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="panel">
          <h3>Premios disponibles ({premios.length})</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Premio</th>
                <th>Descripción</th>
                <th>Puntos</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {premios.map((p) => (
                <tr key={p.id}>
                  <td>{p.icono} {p.nombre}</td>
                  <td>{p.descripcion}</td>
                  <td>{p.puntos}</td>
                  <td>
                    <button
                      className={`pill ${p.estado === 'Activo' ? 'green' : 'gray'}`}
                      style={{ border: 'none', cursor: 'pointer' }}
                      onClick={() => toggleEstado(p.id)}
                      title="Cambiar estado"
                    >
                      {p.estado}
                    </button>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn btn-outline btn-sm" onClick={() => iniciarEdicion(p)}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setConfirmarEliminar(p)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
              {premios.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty-state">Aún no hay premios en el catálogo. Agrega el primero arriba.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {confirmarEliminar && (
        <div className="modal-backdrop" onClick={() => setConfirmarEliminar(null)}>
          <div className="modal-card" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
            <h3>Eliminar premio</h3>
            <p style={{ color: 'var(--ink-700)', fontSize: 14, margin: '10px 0 20px' }}>
              ¿Deseas eliminar <strong>{confirmarEliminar.nombre}</strong> del catálogo? Esta acción se reflejará
              de inmediato en la aplicación móvil.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setConfirmarEliminar(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={() => eliminarPremio(confirmarEliminar.id)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
