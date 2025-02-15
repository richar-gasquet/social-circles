import GuestHeader from "../../components/headers/GuestHeader";
import UserHeader from "../../components/headers/UserHeader";
import AdminHeader from "../../components/headers/AdminHeader";
import Loading from "../../components/shared-components/LoadingSpinner";
import { useUserContext } from "../../contexts/UserContextHandler";
import logo from "../../assets/social-circles-logo.png";

/* 401 Unauthorized page for users attempting unauthorized access */
function Unauthorized() {
  const { userData, isLoading } = useUserContext();

  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  const Header = userData.is_admin 
  ? AdminHeader
  : userData.is_admin === false
  ? UserHeader
  : GuestHeader;

  return (
    <>
      <Header />
      <div className="container-fluid col-12 text-center" style={{paddingTop: '15em'}}>
        <img src={logo} style={{maxWidth: "150px"}}></img>
        <h1>401</h1>
        <h2>Unauthorized</h2>
        <p>Sorry! You are not authorized to view this page.</p>
        <p>You may have tried to view an admin-only page or you may have been blocked. </p>
      </div>
    </>
  );
}

export default Unauthorized;
