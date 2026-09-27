import Topbar from '../components/Topbar'

export default function Dashboard({ actividad, premios, resumen, cargando }) {
  const totalUsuarios = resumen?.usuarios ?? 0
  const totalResiduos = resumen?.residuos ?? 0
  const totalPuntos = resumen?.puntos ?? 0
  const premiosCanjeados = resumen?.premiosCanjeados ?? 0

  return (
    <>
      <Topbar title="Dashboard General" />
      <div className="page-content">
        <div className="stat-grid">
          <div className="stat-card">
            <div className="label">Usuarios registrados</div>
            <div className="value">{totalUsuarios.toLocaleString('es-PE')}</div>
          </div>
          <div className="stat-card">
            <div className="label">Residuos reciclados</div>
            <div className="value">{totalResiduos.toLocaleString('es-PE')}</div>
          </div>
          <div className="stat-card">
            <div className="label">Puntos generados</div>
            <div className="value">{totalPuntos.toLocaleString('es-PE')}</div>
          </div>
          <div className="stat-card">
            <div className="label">Premios canjeados</div>
            <div className="value">{premiosCanjeados.toLocaleString('es-PE')}</div>
          </div>
        </div>

        <div className="panel">
          <h3>Actividad reciente</h3>
          {cargando && actividad.length === 0 && <p className="empty-state">Cargando...</p>}
          <table className="data-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Material</th>
                <th>Puntos</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {actividad.map((a) => (
                <tr key={a.id}>
                  <td>{a.usuario}</td>
                  <td>{a.material}</td>
                  <td>+{a.puntos}</td>
                  <td>{a.fecha}</td>
                  <td><span className={`pill ${a.estado === 'Validado' ? 'green' : 'orange'}`}>{a.estado}</span></td>
                </tr>
              ))}
              {!cargando && actividad.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty-state">Aún no hay actividad registrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h3>Catálogo de premios activos</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Premio</th>
                <th>Descripción</th>
                <th>Costo en puntos</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {premios.map((p) => (
                <tr key={p.id}>
                  <td>{p.icono} {p.nombre}</td>
                  <td>{p.descripcion}</td>
                  <td>{p.puntos} pts</td>
                  <td><span className="pill green">{p.estado}</span></td>
                </tr>
              ))}
              {!cargando && premios.length === 0 && (
                <tr>
                  <td colSpan={4} className="empty-state">No hay premios activos en el catálogo.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
