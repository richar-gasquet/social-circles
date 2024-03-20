import GuestHeader  from "../guest/GuestHeader" 

function LoginPage() {
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