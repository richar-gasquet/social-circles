import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContextHandler";
import Loading from "../shared-components/LoadingSpinner";

/* Ensures that wrapped components are only accessible to users */
function ProtectedRoute({ component: Component, ...rest }) {
  const { isAuth, isLoading } = useAuthContext();
  if (isLoading) {
    return (
      <>
        <Loading/>
      </>
    ); 
  }

  if (isAuth) {
    return <Component {...rest} />;
  } else {
    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;
