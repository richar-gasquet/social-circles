import { Navigate } from "react-router-dom";
import { useAuthContext } from "./AuthHandler.jsx";

function ProtectedRoute({ component: Component, ...rest }) {
  const { isAuth, isLoading } = useAuthContext();
  if (isLoading) {
    return <div>Loading...</div>; // Or a more sophisticated loader/spinner
  }

  if (isAuth) {
    return <Component {...rest} />;
  } else {
    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;
