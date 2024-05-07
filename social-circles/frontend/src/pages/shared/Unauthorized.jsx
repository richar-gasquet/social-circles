import GuestHeader from "../../components/headers/GuestHeader";
import UserHeader from "../../components/headers/UserHeader";
import AdminHeader from "../../components/headers/AdminHeader";
import { useAuthContext } from "../../contexts/AuthContextHandler";

function Unauthorized() {
  const { isAuth, isAdmin } = useAuthContext();

  return (
    <>
      {isAdmin ? <AdminHeader /> : isAuth ? <UserHeader /> : <GuestHeader />}
      <div className="container-fluid col-12 text-center" style={{paddingTop: '15em'}}>
        <h1>401</h1>
        <h2>Unauthorized</h2>
        <p>Sorry! You are not authorized to view this page.</p>
      </div>
    </>
  );
}

export default Unauthorized;
