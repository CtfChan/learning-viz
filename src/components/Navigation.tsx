import { NavLink } from 'react-router-dom';

export function Navigation() {
  return (
    <nav className="nav-container">
      <NavLink
        to="/"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        Home
      </NavLink>
      <NavLink
        to="/crds"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        CRD Explorer
      </NavLink>
      <NavLink
        to="/architecture"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        Architecture
      </NavLink>
      <NavLink
        to="/kueue"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        Kueue
      </NavLink>
    </nav>
  );
}
