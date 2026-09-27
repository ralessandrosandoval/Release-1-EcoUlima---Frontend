export default function Topbar({ title }) {
  return (
    <header className="topbar">
      <h2>{title}</h2>
      <button type="button" className="topbar-admin">
        <span>👤</span>
        <span>Administrador</span>
      </button>
    </header>
  )
}
