import { NavLink } from 'react-router-dom'

import Login from '../auth/Login.jsx'
import GuestHeader from '../user/UserHeader'

function LandingPage() {
    return <div>
        <GuestHeader />
        <p><NavLink to ='/user-dashboard'>Access User Dashboard</NavLink></p>
        <Login />
    </div>
}

export default LandingPage