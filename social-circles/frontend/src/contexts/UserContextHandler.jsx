import React, { useState, useEffect, createContext, useContext  } from 'react';

// Allow children components to get user's data and set it
export const useUserContext = () => useContext(UserContext);

const UserContext = createContext({});

const UserContextProvider = ({ children }) => {
    const [userData, setUserData] = useState({ first_name: '', last_name: '', email: '', is_admin: null, address: '', preferred_name: '', pronouns: '', phone_number: '', marital_status: '', family_circumstance: '', community_status: '', interests: '', personal_identity: '', picture: ''});
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const getUserData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user-data`, 
                                            {credentials: 'include',});
                if (response.ok) {
                    const user_data = await response.json();
                    setUserData({ first_name: user_data.first_name, last_name: user_data.last_name, email: user_data.email, is_admin: user_data.is_admin, address: user_data.address, preferred_name: user_data.preferred_name, pronouns: user_data.pronouns, phone_number: user_data.phone_number, marital_status: user_data.marital_status, family_circumstance: user_data.family_circumstance, community_status: user_data.community_status, interests: user_data.interests, personal_identity: user_data.personal_identity, picture: user_data.picture});
                } else {
                    setError('Server error. Please contact the administrator.');
                }
            } catch (error) {
                console.error('Failed to fetch user data: ', error);
                setError('Server error. Please contact the administrator');
            } finally {
                setLoading(false);
            }
        };
        getUserData();
    }, []);

    return (
        <UserContext.Provider value={{ userData, isLoading, setUserData }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider