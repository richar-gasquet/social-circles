import { NavLink } from "react-router-dom";

function UserHeader() {
  return (
    <header>
      <h1>Social Circles</h1>
      <nav>
        <ul>
          <li>
            <a href="#">Calendar</a>
          </li>
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          <li>
            <a href="#">Groups</a>
          </li>
          <li>
            <NavLink to="/resources">
              Resources
            </NavLink>
          </li>
          <li>
            <a href="#">Profile</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default UserHeader;
