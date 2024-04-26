import { NavLink } from "react-router-dom";
import { useState } from 'react';
import logo from "../../assets/social-circles-logo.png";
import styles from '../../css/Header.module.css';

function GuestHeader() {
  // State variables to handle navbar collapse
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  return (
    <header>
      <nav className={`navbar navbar-expand-md navbar-light ${styles.nav}`}>
        <NavLink to="/" className="navbar-brand">
          <img src={logo} alt="Social Circles Logo" className={`img-fluid ${styles.logo}`} />
        </NavLink>
        {/* MUST ADD ANIMATION FOR NAVBAR COLLAPSING */}
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarHamburger"
                aria-controls="navbarHamburger" aria-expanded={!isNavCollapsed ? true : false} aria-label="Toggle navigation"
                onClick={() => setIsNavCollapsed(!isNavCollapsed)}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarHamburger">
          <ul className={`navbar-nav ml-auto`}>
            <li className={`nav-item ${styles.navItem}`}>
              <NavLink to="/contact" className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}>
                Contact
              </NavLink>
            </li>
            <li className={`nav-item ${styles.navItem}`}>
              <NavLink to="/resources" className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}>
                Resources
              </NavLink>
            </li>
            <li className={`nav-item ${styles.navItem}`}>
              <NavLink to="/login" className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}>
                Log In
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default GuestHeader;