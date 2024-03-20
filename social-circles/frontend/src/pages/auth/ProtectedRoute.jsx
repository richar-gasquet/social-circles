import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthHandler'

function ProtectedRoute({component: Component, ...rest}) {
    const { isAuth } = useAuth();

    if (isAuth) {
        return <Component {...rest} />
    } else {
        return <Navigate to="/login" replace />;
    }
}

export default ProtectedRoute