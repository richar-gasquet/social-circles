import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContextHandler.jsx";
import GuestHeader from "../../components/headers/GuestHeader.jsx";
import SessionTimeoutHandler from "../../components/session-checker/SessionTimeoutHandler.jsx";
import Loading from "../../components/loading-component/loading.jsx";


function LoginPage() {
  // Check if the user is already logged in
  const { isAuth, isAdmin, isLoading } = useAuthContext();
  if (isLoading) {
    return (
      <>
      <SessionTimeoutHandler />
      <GuestHeader />
      <Loading/>
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
      <div style={{paddingTop: '15em'}}>
        <h2>This is the login page.</h2>
        <button onClick={handleLogin}>Log In with Google</button>
      </div>
    </>
  );
}

export default LoginPage;
