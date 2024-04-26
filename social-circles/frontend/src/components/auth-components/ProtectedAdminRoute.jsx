import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContextHandler";
import Loading from "../loading-component/loading";

function ProtectedAdminRoute({ component: Component, ...rest }) {
  const { isAuth, isAdmin, isLoading } = useAuthContext();
  if (isLoading) {
    return <Loading/>; 
  }
  
  if (isAuth && isAdmin) {
    return <Component {...rest} />;
  } else {
    return <Navigate to="/login" replace />; // Change to navigate to not authorized page
  }
}

export default ProtectedAdminRoute;
