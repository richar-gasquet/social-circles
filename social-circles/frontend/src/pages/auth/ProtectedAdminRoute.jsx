import { Navigate } from "react-router-dom";
import { useAuthContext } from "./AuthHandler.jsx";

function ProtectedAdminRoute({ component: Component, ...rest }) {
  const { isAuth, isAdmin, isLoading } = useAuthContext();
  if (isLoading) {
    return <div>Loading...</div>; // Or a more sophisticated loader/spinner
  }
  
  if (isAuth && isAdmin) {
    return <Component {...rest} />;
  } else {
    return <Navigate to="/login" replace />; // Change to navigate to not authorized page
  }
}

export default ProtectedAdminRoute;
