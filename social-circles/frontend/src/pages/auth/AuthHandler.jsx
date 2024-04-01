import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext({});
export const useAuthContext = () => useContext(AuthContext);

function AuthProvider({ children }) {
  // isAuth - state variable that contains auth status, set initially to local storage's value
  const [isAuth, setAuth] = useState(JSON.parse(localStorage.getItem('isAuth')) || false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const authenticate = async () => {
      // Each time authenticate is called, set isLoading to true
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/authenticate`, {
          credentials: "include",
        });
        // Server issued OK (200)
        if (response.ok) {
          const auth_data = await response.json();
          // User has been authenticated
          if (auth_data.status === "auth") {
            setAuth(true);
            localStorage.setItem('isAuth', 'true');
          // User has NOT been authenticated
          } else {
            setAuth(false);
            localStorage.setItem('isAuth', 'false');
          }
        // Server issued HTTP error
        } else {
          setAuth(false);
          localStorage.setItem('isAuth', 'false');
        }
      // Coult not connect to server at all
      } catch (error) {
        console.error("Authentication check failed", error);
        setAuth(false);
        localStorage.setItem('isAuth', 'false');
      // Finished loading
      } finally {
        setLoading(false);
      }
    };
    authenticate();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;