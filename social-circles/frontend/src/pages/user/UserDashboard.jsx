import UserHeader from '../user/UserHeader.jsx'
import LogoutButton from '../auth/LogoutButton.jsx'

function UserDashboard() {
    return <div>
        <UserHeader />
        <h2>This is the UserDashboard.</h2>
        <p>This information is secret. You should only be able to see it if you're logged in</p>
        <LogoutButton />
    </div>
}

export default UserDashboard