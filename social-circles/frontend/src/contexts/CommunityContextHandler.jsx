import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";

const CommunityContext = createContext({});
export const useCommunityContext = () => useContext(CommunityContext);

/* Context provider for community components and pages */
function CommunityContextProvider({ children }) {
  const [communities, setCommunities] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [displayAlert, setDisplayAlert] = useState(null);
  const [query, setQuery] = useState("");
  const [searchParam] = useState(["name", "desc"]);

  const location = useLocation();
  useEffect(() => {
    setDisplayAlert(null)
    setQuery("");
  }, [location])

  /* Fetch communities from the parameter backend route */
  const fetchCommunities = useCallback(async (route) => {
    try {
      setIsFetching(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}${route}`,
        {
          credentials: "include",
        }
      );
      if (response.ok) { // Fetch successful, store communities
        const data = await response.json();
        setCommunities(data.results);
      } else { // Connected to server, but server error
        setDisplayAlert({
          type: "danger",
          header: "Could not display communities!",
          text: "Try again or contact the administrator.",
        });
      }
    } catch (error) { // Could not connect to server
      setDisplayAlert({
        type: "danger",
        header: "Could not connect to server!",
        text: "Try again or contact the administrator.",
      });
    } finally {
      setIsFetching(false);
    }
  }, []);

  /* Update details of community with parameter group_id */
  const updateCommunities = useCallback((group_id, newCommunity) => {
    setCommunities((prevCommunities) =>
      prevCommunities.map((oldCommunity) => {
        if (oldCommunity.group_id === group_id) {
          return { ...oldCommunity, ...newCommunity };
        } else {
          return oldCommunity;
        }
      })
    );
  }, [communities]);

  /* Filter communities based on parameters */
  const searchCommunities = useCallback(() => {
    if (!query) return communities;
    return communities.filter(community =>
      searchParam.some(param =>
        community[param].toString().toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [communities, query, searchParam]);

  return (
    <CommunityContext.Provider value={{
        communities,
        isFetching,
        displayAlert,
        query,
        setQuery,
        setDisplayAlert,
        fetchCommunities,
        updateCommunities,
        searchCommunities
    }}>
      {children}
    </CommunityContext.Provider>
  );
}

export default CommunityContextProvider;
