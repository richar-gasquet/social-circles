import React, { useState, useEffect } from 'react'
import UserHeader from '../user/UserHeader.jsx'
import LogoutButton from '../auth/LogoutButton.jsx'

function UserDashboard() {
    const [userData, setUserData] = useState({ name: '', email: ''}) // Maybe set userData with useContext?
    // That way we can access userData in all children components and render based off that
    // Ask Ajimelec
    const [error, setError] = useState(''); // Maybe use as props for children components?

    useEffect(() => {
        const getUserData = async () => {
            try {
                const response = await fetch('https://localhost:5000/user-data', 
                                            {credentials: 'include'});
                if (response.ok) {
                    const auth_data = await response.json();
                    setUserData({ name: auth_data.name, email: auth_data.email });
                } else (
                    setError('Server error. Please contact the administrator.')
                )
                
            } catch (error) {
                console.error('Failed to fetch user data: ', error);
                setError('Server error. Please contact the administrator');
            }
        }
        getUserData();
    }, []);


    return <div>
        <UserHeader />
        <h2>This is the UserDashboard.</h2>
        <p>This information is secret. You should only be able to see it if you're logged in</p>
        <p>Here's some info about you!</p>
        <div>
            <p>Name: {userData.name} </p>
            <p>Email: {userData.email} </p>
        </div>
        <LogoutButton />
    </div>
}

export default UserDashboard