import React from "react";
import { NavLink } from "react-router-dom";

function Navigation() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="#">
        <img src="path/to/logo.png" alt="Social Circles" />
      </a>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <NavLink to="/about" className="nav-link" href="#">
              About Us
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/contact" className="nav-link" href="#">
              Contact
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/resources" className="nav-link" href="#">
              Resources
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/login" className="nav-link" href="#">
              Sign In
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
