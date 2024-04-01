import React, { useState, useEffect, createContext, useContext  } from 'react';

// Allow children components to get user's data and set it
export const useUserContext = () => useContext(UserContext);

const UserContext = createContext({});

const UserContextProvider = ({ children }) => {
    const [userData, setUserData] = useState({ name: '', email: ''});
    const [error, setError] = useState('');

    useEffect(() => {
        const getUserData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user-data`, 
                                            {credentials: 'include',});
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