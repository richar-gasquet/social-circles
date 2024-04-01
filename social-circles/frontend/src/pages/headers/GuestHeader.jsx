import { NavLink } from "react-router-dom";
import logo from "../../assets/social-circles-logo.png";

function GuestHeader() {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <NavLink to="/" className="navbar-brand">
          <img src={logo} alt="Logo" className="img-fluid" />
        </NavLink>
        <h2>Social Circles</h2>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <NavLink to="/about" className="nav-link">
                About Us
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contact" className="nav-link">
                Contact
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/resources" className="nav-link">
                Resources
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/login" className="nav-link">
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
