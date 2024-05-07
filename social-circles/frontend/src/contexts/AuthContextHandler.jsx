import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({});
export const useAuthContext = () => useContext(AuthContext);

function AuthProvider({ children }) {
  // isAuth - state variable that contains auth status, set initially to local storage's value
  const [isAuth, setAuth] = useState(JSON.parse(localStorage.getItem('isAuth')) || false);
  const [isAdmin, setAdmin] = useState(JSON.parse(localStorage.getItem('isAdmin')) || false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const authenticate = async () => {
      // Each time authenticate is called, set isLoading to true
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/authenticate`, {
          credentials: "include",
        });
        if (response.ok) {
          const auth_data = await response.json();
          // User has been authenticated
          if (auth_data.status === "auth") {
            setAuth(true);
            setAdmin(auth_data.is_admin || false);
            localStorage.setItem('isAuth', 'true');
            localStorage.setItem('isAdmin', JSON.stringify(auth_data.is_admin || false));
          // User has NOT been authenticated
          } else {
            setAuth(false);
            setAdmin(false);
            localStorage.setItem('isAuth', 'false');
            localStorage.setItem('isAdmin', 'false');
          }
        // Server issued HTTP error
        } else {
          setAuth(false);
          setAdmin(false);
          localStorage.setItem('isAuth', 'false');
          localStorage.setItem('isAdmin', 'false');
        }
      // Coult not connect to server at all
      } catch (error) {
        setAuth(false);
        setAdmin(false);
        localStorage.setItem('isAuth', 'false');
        localStorage.setItem('isAdmin', 'false');
      // Finished loading, update components
      } finally {
        setLoading(false);
      }
    };
    authenticate();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, isAdmin, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;