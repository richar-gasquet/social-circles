import { Navigate } from "react-router-dom";
import { useUserContext } from '../../contexts/UserContextHandler';
import UserHeader from "../../components/headers/UserHeader";
import LogoutButton from '../../components/auth-components/LogoutButton';
import SessionTimeoutHandler from "../../components/session-checker/SessionTimeoutHandler";

function UserDashboard() {
  const { userData, isLoading } = useUserContext();
  if (isLoading) {
    return (
      <>
      <UserHeader />
      <div className="col-12 d-flex justify-content-center">
        <div className="spinner-border mt-5" role="status"
          style={{ width: '10rem', height: '10rem'}}>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
      </>
    )
  }
  if (userData.is_admin == undefined){
    return <Navigate to={"/profile"} />;
  }
  return (
    <>
      {userData && <SessionTimeoutHandler />}
      <UserHeader />
      <h2>This is the User Dashboard.</h2>
      <p>
        This information is secret. You should only be able to see it if you're
        logged in
      </p>
      <p>Here's some info about you!</p>
      <div>
        <p>Name: {userData.first_name} {userData.last_name} </p>
        <p>Email: {userData.email} </p>
      </div>
      <LogoutButton />
    </>
  );
}

export default UserDashboard;
