import React, { createContext, useContext, useState, useEffect } from 'react';

// Allow children components to get authentication status
export const useAuth = () => useContext(AuthContext);

const AuthContext = createContext({});

function AuthProvider({children}) {
    const [isAuth, setAuth] = useState(false);

    useEffect(() => {
        const authenticate = async () => {
            try {
                // Request from backend: is user authenticated?
                const response = await fetch('https://localhost:5000/authenticate', 
                                            {credentials : 'include'});
                if (response.ok) {
                    const auth_data = await response.json();
                    if (auth_data.status === 'auth') {
                        setAuth(true);
                    }
                }
            } catch (error) {
                console.error("Authentication check failed", error);
            }
        }
        authenticate();
    }, [])

    return (
        <AuthContext.Provider value = {{isAuth, setAuth}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider