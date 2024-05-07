import GuestHeader from "../../components/headers/GuestHeader";
import UserHeader from "../../components/headers/UserHeader";
import AdminHeader from "../../components/headers/AdminHeader";
import Loading from "../../components/shared-components/LoadingSpinner";
import { useUserContext } from "../../contexts/UserContextHandler";
import logo from "../../assets/social-circles-logo.png";

/* 404 Not Found page for unvalid routes */
function NotFound() {
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
      <div
        className="container-fluid col-12 text-center"
        style={{ paddingTop: "15em" }}
      >
        <img src={logo} style={{maxWidth: "150px"}}></img>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Sorry! The page you are looking for does not exist.</p>
      </div>
    </>
  );
}

export default NotFound;
