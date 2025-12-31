import { NavLink } from 'react-router-dom';

export function Navigation() {
  return (
    <nav className="nav-container">
      <NavLink
        to="/"
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
    </nav>
  );
}
