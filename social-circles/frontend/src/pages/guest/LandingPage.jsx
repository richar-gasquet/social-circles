import { NavLink } from 'react-router-dom'
import GuestHeader from '../headers/GuestHeader'

function LandingPage() {
    return (
        <>
            <GuestHeader />
            <p><NavLink to ='/user-dashboard'>Access User Dashboard</NavLink></p>
            <p><NavLink to = '/login'>Click here to go to login page.</NavLink></p>
        </>
    )
}

export default LandingPage