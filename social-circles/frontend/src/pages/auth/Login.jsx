import { Navigate } from 'react-router-dom'

function Login() {
    const handleLogin = (e) => {
        <Navigate to = "/login"></Navigate>
    }

    return (
        <button onClick={handleLogin}>Log In</button>
    )
}

export default Login