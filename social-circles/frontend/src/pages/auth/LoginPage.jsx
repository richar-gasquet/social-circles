import { Navigate } from 'react-router-dom'
import GuestHeader  from "../guest/GuestHeader" 
import { useAuth } from './AuthHandler.jsx'

function LoginPage() {
    // Check if the user is already logged in
    const { isAuth } = useAuth() 
    if (isAuth) {
        return <Navigate to = "/user-dashboard" />
    }

    const handleLogin = () => {
        window.location.href = 'https://localhost:5000/login'
    }

    return (
        <div>
            <GuestHeader />
            <h2>This is the login page.</h2>
            <button onClick={handleLogin}>Log In with Google</button>
        </div>
    )
}

export default LoginPage