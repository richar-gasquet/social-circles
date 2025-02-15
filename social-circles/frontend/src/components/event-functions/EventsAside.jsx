import { NavLink } from "react-router-dom";
import styles from "../../css/Aside.module.css"

/* Component for the aside in all pages of communities */
function EventsAside() {
    return (
        <>
          <div className={`col-lg-2 mb-3 border-right`}>
            <aside className={`mt-3`}>
              {/* Links to other community-related pages*/}
              <ul className={`nav flex-column`}>
                <li className={`nav-item`}>
                  <NavLink className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.activeNavLink : ''}`} 
                    to="/events">Upcoming Events</NavLink>
                </li>
                <li className={`nav-item`}>
                  <NavLink className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.activeNavLink : ''}`} 
                    to="/dana-events">Events with Dana</NavLink>
                </li>
                <li className={`nav-item`}>
                  <NavLink className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.activeNavLink : ''}`} 
                    to="/past-events">Past Events</NavLink>
                </li>
                <li className={`nav-item`}>
                  <NavLink className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.activeNavLink : ''}`} 
                    to="/my-events">My Events</NavLink>
                </li>
              </ul>
            </aside>
          </div>
        </>
    );
}

export default EventsAside;