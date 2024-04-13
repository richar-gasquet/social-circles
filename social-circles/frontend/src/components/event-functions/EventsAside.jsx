import { NavLink } from "react-router-dom";
import styles from "../../css/Aside.module.css"

function EventsAside() {
    return (
        <>
          <div className={`col-lg-2 mb-3 border-right`}>
            <aside className={`mt-3`}>
              <ul className={`nav flex-column`}>
                <li className={`nav-item`}>
                  <NavLink className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.activeNavLink : ''}`} 
                    to="/events">Upcoming Events</NavLink>
                </li>
                <li className={`nav-item`}>
                  <NavLink className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.activeNavLink : ''}`} 
                    to="/past-events">Past Events</NavLink>
                </li>
                <li className={`nav-item`}>
                  <NavLink className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.activeNavLink : ''}`} 
                    to="/registered-events">Registered Events</NavLink>
                </li>
                <li className={`nav-item`}>
                  <NavLink className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.activeNavLink : ''}`} 
                    to="/events-with-dana">Events with Dana</NavLink>
                </li>
              </ul>
            </aside>
          </div>
        </>
    );
}

export default EventsAside;