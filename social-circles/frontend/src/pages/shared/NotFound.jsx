import GuestHeader from "../../components/headers/GuestHeader";
import UserHeader from "../../components/headers/UserHeader";
import AdminHeader from "../../components/headers/AdminHeader";
import { useAuthContext } from "../../contexts/AuthContextHandler";

function NotFound() {
  const { isAuth, isAdmin } = useAuthContext();

  return (
    <>
      {isAdmin ? <AdminHeader /> : isAuth ? <UserHeader /> : <GuestHeader />}
      <div className="container-fluid col-12 text-center" style={{paddingTop: '15em'}}>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Sorry! The page you are looking for does not exist.</p>
      </div>
    </>
  );
}

export default NotFound;
