import { Navigate } from "react-router-dom";
import GuestHeader from "../headers/GuestHeader.jsx";
import { useAuthContext } from "./AuthHandler.jsx";

function LoginPage() {
  // Check if the user is already logged in
  const { isAuth, isAdmin, isLoading } = useAuthContext();
  if (isLoading) {
    return <div>Loading...</div>; // Or a more sophisticated loader/spinner
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
      <GuestHeader />
      <h2>This is the login page.</h2>
      <button onClick={handleLogin}>Log In with Google</button>
    </>
  );
}

export default LoginPage;
