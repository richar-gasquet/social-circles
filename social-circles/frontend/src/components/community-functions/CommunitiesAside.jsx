import { NavLink } from "react-router-dom";
import styles from "../../css/Aside.module.css"

/* Component for the aside in all pages of communities */
function CommunitiesAside() {
    return (
        <>
          <div className={`col-lg-2 mb-3 border-right`}>
            <aside className={`mt-3`}>
              {/* Links to other community-related pages*/}
              <ul className={`nav flex-column`}>
                <li className={`nav-item`}>
                  <NavLink className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.activeNavLink : ''}`} 
                    to="/communities">All Communities</NavLink>
                </li>
                <li className={`nav-item`}>
                  <NavLink className={({ isActive }) => `nav-link ${styles.navLink} ${isActive ? styles.activeNavLink : ''}`} 
                    to="/my-communities">My Communities</NavLink>
                </li>
              </ul>
            </aside>
          </div>
        </>
    );
}

export default CommunitiesAside;