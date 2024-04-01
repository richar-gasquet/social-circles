import { Navigate } from "react-router-dom";
import GuestHeader from "../headers/GuestHeader.jsx";
import { useAuthContext } from "./AuthHandler.jsx";

function LoginPage() {
  // Check if the user is already logged in
  const { isAuth } = useAuthContext();
  if (isAuth) {
    return <Navigate to="/user-dashboard" />;
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
