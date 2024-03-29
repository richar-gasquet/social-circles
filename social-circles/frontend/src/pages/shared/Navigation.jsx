import React from "react";

function Navigation() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="#">
        <img src="path/to/logo.png" alt="Social Circles" />
      </a>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a className="nav-link" href="#">
              About Us
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Contact
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Resources
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Sign In
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
