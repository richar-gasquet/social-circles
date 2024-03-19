import { Navigate, Route } from 'react-router-dom';

function ProtectedRoute({component: Component, ...rest}) {
    const [isAuth, setAuth] = useAuth();

    return (
        
    )
}