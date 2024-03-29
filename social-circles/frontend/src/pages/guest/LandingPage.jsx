import { NavLink } from 'react-router-dom'
import GuestHeader from './GuestHeader.jsx'
import { useAuth } from "../auth/AuthHandler.jsx";

function LandingPage() {
    const { isAuth } = useAuth()
    if (isAuth) {
        return <NavLink to = "/user-dashboard"></NavLink>
    }
 
    return (
        <>
            <GuestHeader />
            <p><NavLink to ='/user-dashboard'>Access User Dashboard</NavLink></p>
            <p><NavLink to = '/login'>Click here to go to login page.</NavLink></p>
        </>
    )
}

export default LandingPage