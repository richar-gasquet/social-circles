import { Navigate } from 'react-router-dom'

function Login() {
    const handleLogin = (e) => {
        window.location.href = 'https://localhost:5000/login'
    }

    return (
        <button onClick={handleLogin}>Log In</button>
    )
}

export default Login