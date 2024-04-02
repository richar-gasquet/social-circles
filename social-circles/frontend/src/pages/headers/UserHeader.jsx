import { NavLink } from "react-router-dom";
import { useState } from 'react'; // Import useState hook
import logo from "../../assets/social-circles-logo.png";
import styles from './Header.module.css';

function GuestHeader() {
  // State to handle the collapse
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
          <ul className="navbar-nav ml-auto">
            <li className={`nav-item ${styles.navItem}`}>
              <NavLink to="/about" className={({ isActive }) => isActive ? `nav-link ${styles.navLink} ${styles.activeNavLink}` : `nav-link ${styles.navLink}`}>
                Events
              </NavLink>
            </li>
            <li className={`nav-item ${styles.navItem}`}>
              <NavLink to="/contact" className={({ isActive }) => isActive ? `nav-link ${styles.navLink} ${styles.activeNavLink}` : `nav-link ${styles.navLink}`}>
                Calendar
              </NavLink>
            </li>
            <li className={`nav-item ${styles.navItem}`}>
              <NavLink to="/resources" className={({ isActive }) => isActive ? `nav-link ${styles.navLink} ${styles.activeNavLink}` : `nav-link ${styles.navLink}`}>
                Communities
              </NavLink>
            </li>
            <li className={`nav-item ${styles.navItem}`}>
              <NavLink to="/login" className={({ isActive }) => isActive ? `nav-link ${styles.navLink} ${styles.activeNavLink}` : `nav-link ${styles.navLink}`}>
                Resources
              </NavLink>
            </li>
            <li className={`nav-item ${styles.navItem}`}>
              <NavLink to="/login" className={({ isActive }) => isActive ? `nav-link ${styles.navLink} ${styles.activeNavLink}` : `nav-link ${styles.navLink}`}>
                Profile
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default GuestHeader;