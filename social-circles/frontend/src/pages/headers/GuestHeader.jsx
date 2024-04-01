import { NavLink } from "react-router-dom";
import logo from "../../assets/social-circles-logo.png";
import styles from './Header.module.css';

function GuestHeader() {
  return (
    <header>
      <nav className={`navbar navbar-expand-md navbar-light ${styles.nav}`}>
        <NavLink to="/" className="navbar-brand">
          <img src={logo} alt="Social Circles Logo" className={`img-fluid ${styles.logo}`} />
        </NavLink>
        <h2 className="d-none d-lg-block">Social Circles</h2>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarHamburger" aria-controls="navbarHamburger" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarHamburger">
          <ul className="navbar-nav ml-auto">
            <li className={`nav-item ${styles.navItem}`}>
              <NavLink to="/about" className={({ isActive }) => isActive ? `nav-link ${styles.navLink} ${styles.activeNavLink}` : `nav-link ${styles.navLink}`}>
                About Us
              </NavLink>
            </li>
            <li className={`nav-item ${styles.navItem}`}>
              <NavLink to="/contact" className={({ isActive }) => isActive ? `nav-link ${styles.navLink} ${styles.activeNavLink}` : `nav-link ${styles.navLink}`}>
                Contact
              </NavLink>
            </li>
            <li className={`nav-item ${styles.navItem}`}>
              <NavLink to="/resources" className={({ isActive }) => isActive ? `nav-link ${styles.navLink} ${styles.activeNavLink}` : `nav-link ${styles.navLink}`}>
                Resources
              </NavLink>
            </li>
            <li className={`nav-item ${styles.navItem}`}>
              <NavLink to="/login" className={({ isActive }) => isActive ? `nav-link ${styles.navLink} ${styles.activeNavLink}` : `nav-link ${styles.navLink}`}>
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