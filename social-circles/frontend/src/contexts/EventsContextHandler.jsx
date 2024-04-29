import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router";

const EventContext = createContext({});
export const useEventContext = () => useContext(EventContext);

function EventContextProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [displayAlert, setDisplayAlert] = useState(null);
  const [query, setQuery] = useState("");
  const [searchParam] = useState(["name", "desc"]);


  const location = useLocation();
  useEffect(() => {
    setDisplayAlert(null)
    setQuery("");
  }, [location])

  const fetchEvents = useCallback(async (route) => {
    try {
      setIsFetching(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}${route}`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setEvents(data.results);
      } else {
        setDisplayAlert({
          type: "danger",
          header: "Could not display events!",
          text: "Try again or contact the administrator.",
        });
      }
    } catch (error) {
      setDisplayAlert({
        type: "danger",
        header: "Could not connect to server!",
        text: "Try again or contact the administrator.",
      });
    } finally {
      setIsFetching(false);
    }
  }, []);

  const updateEvents = useCallback((event_id, newEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((oldEvent) => {
        if (oldEvent.event_id === event_id) {
          return { ...oldEvent, ...newEvent};
        } else {
          return oldEvent
        }
      })
  
    );
  }, [events]);

  const searchEvents = useCallback(() => {
    if (!query) return events;
    return events.filter(event =>
      searchParam.some(param =>
        event[param].toString().toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [events, query, searchParam]);

  return (
    <EventContext.Provider value={{
        events,
        isFetching,
        displayAlert,
        query, 
        setQuery,
        setDisplayAlert,
        fetchEvents,
        updateEvents,
        searchEvents
    }}>
      {children}
    </EventContext.Provider>
  );
}

export default EventContextProvider;
