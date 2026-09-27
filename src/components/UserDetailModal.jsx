export default function UserDetailModal({ usuario, onClose }) {
  if (!usuario) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-close-row">
          <h3>{usuario.nombre}</h3>
          <button className="modal-x" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <div className="user-detail-row">
          <span>Correo</span>
          <span>{usuario.correo}</span>
        </div>
        <div className="user-detail-row">
          <span>Carrera</span>
          <span>{usuario.carrera}</span>
        </div>
        <div className="user-detail-row">
          <span>Fecha de registro</span>
          <span>{usuario.fechaRegistro}</span>
        </div>
        <div className="user-detail-row">
          <span>Puntos acumulados</span>
          <span>{usuario.puntos.toLocaleString('es-PE')}</span>
        </div>
        <div className="user-detail-row">
          <span>Reciclajes totales</span>
          <span>{usuario.reciclajes}</span>
        </div>
        <div className="user-detail-row">
          <span>Estado</span>
          <span className={`pill ${usuario.estado === 'Activo' ? 'green' : 'gray'}`}>{usuario.estado}</span>
        </div>

        <div className="activity-mini">
          <h4>Actividad reciente</h4>
          {usuario.actividad.length === 0 && (
            <p className="empty-state" style={{ padding: '12px 0' }}>Este usuario aún no registra actividad.</p>
          )}
          {usuario.actividad.map((a, idx) => (
            <div className="activity-mini-item" key={idx}>
              <span>{a.material}</span>
              <span>+{a.puntos} pts</span>
              <span>{a.fecha}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
