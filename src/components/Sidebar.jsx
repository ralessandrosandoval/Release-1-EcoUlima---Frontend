import { NavLink, useNavigate } from 'react-router-dom'

const links = [
  { to: '/', icon: '📊', label: 'Dashboard', end: true },
  { to: '/usuarios', icon: '👥', label: 'Usuarios' },
  { to: '/rankings', icon: '🏆', label: 'Rankings' },
  { to: '/premios', icon: '🎁', label: 'Premios' },
]

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1>EcoULima</h1>
        <p>Panel Administrativo</p>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span className="sidebar-icon">{link.icon}</span>
            <span className="label">{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <button className="sidebar-logout" type="button" onClick={handleLogout}>
        <span className="sidebar-icon"></span>
        <span className="label">Cerrar sesión</span>
      </button>
    </aside>
  )
}
