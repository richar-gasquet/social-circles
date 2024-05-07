import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useLocation } from "react-router";

const EventContext = createContext({});
export const useEventContext = () => useContext(EventContext);

/* Context provider for community components and pages */
function EventContextProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [displayAlert, setDisplayAlert] = useState(null);
  const [query, setQuery] = useState("");
  const [searchParam] = useState(["name", "desc"]);

  const location = useLocation();
  useEffect(() => {
    setDisplayAlert(null);
    setQuery("");
  }, [location]);

  /* Fetch events from the parameter backend route */
  const fetchEvents = useCallback(async (route) => {
    try {
      setIsFetching(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}${route}`,
        {
          credentials: "include",
        }
      );
      if (response.ok) { // Fetch successful, store events
        const data = await response.json();
        setEvents(data.results);
      } else { // Connected to server, but server error
        setDisplayAlert({ 
          type: "danger",
          header: "Could not display events!",
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

  /* Update details of event with parameter event_id */
  const updateEvents = useCallback(
    (event_id, newEvent) => {
      setEvents((prevEvents) =>
        prevEvents.map((oldEvent) => {
          if (oldEvent.event_id === event_id) {
            return { ...oldEvent, ...newEvent };
          } else {
            return oldEvent;
          }
        })
      );
    },
    [events]
  );

  /* Filter events based on parameters */
  const searchEvents = useCallback(() => {
    if (!query) return events;
    return events.filter((event) =>
      searchParam.some((param) =>
        event[param].toString().toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [events, query, searchParam]);

  return (
    <EventContext.Provider
      value={{
        events,
        isFetching,
        isFetchingUsers,
        displayAlert,
        query,
        setQuery,
        setDisplayAlert,
        fetchEvents,
        updateEvents,
        searchEvents
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export default EventContextProvider;
