import { NavLink } from "react-router-dom";
import { useState } from 'react'; 
import logo from "../../assets/social-circles-logo.png";
import styles from '../../css/Header.module.css';

/* Component containing the regular user header/navbar */
function UserHeader() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleLogout = (e) => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/logout`;
  };

  return (
    <header>
      <nav className={`navbar navbar-expand-xl navbar-light ${styles.nav}`}>
        <NavLink to="/user-dashboard" className="navbar-brand">
          <img src={logo} alt="Social Circles Logo" className={`img-fluid ${styles.logo}`} />
        </NavLink>
        <NavLink to="/user-dashboard" className={`${styles.aSocial} navbar-brand`}>
          Social Circles
        </NavLink>
        {/* Button to activate hamburger dropdown */}
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarHamburger"
                aria-controls="navbarHamburger" aria-expanded={!isNavCollapsed ? true : false} aria-label="Toggle navigation"
                onClick={() => setIsNavCollapsed(!isNavCollapsed)}>
          <span className="navbar-toggler-icon"></span>
        </button>
        {/* Links in header */}
        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarHamburger">
          <ul className={`navbar-nav ml-auto`}>
            <li className={`nav-item ${styles.navItem}`}>
              <NavLink to="/events" 
                className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}>
                Events
              </NavLink>
            </li>
            <li className={`nav-item ${styles.navItem}`}>
              <NavLink to="/calendar" 
                className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}>
                Calendar
              </NavLink>
            </li>
            <li className={`nav-item ${styles.navItem}`}>
              <NavLink to="/communities" 
                className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}>
                Communities
              </NavLink>
            </li>
            <li className={`nav-item ${styles.navItem}`}>
              <NavLink to="/resources" 
                className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}>
                Resources
              </NavLink>
            </li>
            <li className={`nav-item ${styles.navItem}`}>
              <NavLink to="/contact" className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}>
                Contact
              </NavLink>
            </li>
            <li className={`nav-item ${styles.navItem}`}>
              <NavLink to="/profile" className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}>
                Profile
              </NavLink>
            </li>
            <li className={`nav-item ${styles.navItem}`} onClick={handleLogout}>
              <NavLink to="/" className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}>
                Log Out
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default UserHeader;