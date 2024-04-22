import { NavLink } from "react-router-dom";
import GuestHeader from "../../components/headers/GuestHeader";
import SessionTimeoutHandler from "../../components/session-checker/SessionTimeoutHandler";

function LandingPage() {
  return (
    <>
      <SessionTimeoutHandler />
      <GuestHeader />
      <p>
        <NavLink to="/user-dashboard">Access User Dashboard</NavLink>
      </p>
      <p>
        <NavLink to="/login">Click here to go to login page.</NavLink>
      </p>
    </>
  );
}

export default LandingPage;
