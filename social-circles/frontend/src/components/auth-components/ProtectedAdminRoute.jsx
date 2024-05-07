import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContextHandler";
import Loading from "../shared-components/LoadingSpinner";

/* Ensures that wrapped components are only accessible to admin */
function ProtectedAdminRoute({ component: Component, ...rest }) {
  const { isAuth, isAdmin, isLoading } = useAuthContext();

  if (isLoading) {
    return <Loading/>; 
  }
  
  if (isAuth && isAdmin) {
    return <Component {...rest} />;
  } else {
    return <Navigate to="/unauthorized" replace />; 
  }
}

export default ProtectedAdminRoute;
