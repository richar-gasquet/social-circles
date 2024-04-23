import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContextHandler.jsx";
import GuestHeader from "../../components/headers/GuestHeader.jsx";
import SessionTimeoutHandler from "../../components/session-checker/SessionTimeoutHandler.jsx";


function LoginPage() {
  // Check if the user is already logged in
  const { isAuth, isAdmin, isLoading } = useAuthContext();
  if (isLoading) {
    return (
      <>
      <WebStreamLoader/>
      <GuestHeader />
      <div className="col-12 d-flex justify-content-center">
        <div className="spinner-border mt-5" role="status"
          style={{ width: '10rem', height: '10rem'}}>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
      </>
    )
  }
  
  if (isAuth) {
    const redirectTo = isAdmin ? "/admin-dashboard" : "/user-dashboard";
    return <Navigate to={redirectTo} />;
  }

  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/login`;
  };
  
  return (
    <>
      <SessionTimeoutHandler />
      <GuestHeader />
      <h2>This is the login page.</h2>
      <button onClick={handleLogin}>Log In with Google</button>
    </>
  );
}

export default LoginPage;
