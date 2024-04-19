import React, { useState, useEffect, useContext } from 'react';
import UserContext from './UserContext';

const UserContextProvider = ({ children }) => {
    const [userData, setUserData] = useState({ name: '', email: ''});
    const [error, setError] = useState('');

    useEffect(() => {
        const getUserData = async () => {
            try {
                const response = await fetch('https://localhost:5000/user-data', {credentials: 'include',});
                if (response.ok) {
                    const auth_data = await response.json();
                    setUserData({ name: auth_data.name, email: auth_data.email });
                } else {
                    setError('Server error. Please contact the administrator.');
                }
            } catch (error) {
                console.error('Failed to fetch user data: ', error);
                setError('Server error. Please contact the administrator');
            }
        };
        getUserData();
    }, []);

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider