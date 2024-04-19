import { createContext, useContext, useState, useCallback } from "react";

const EventContext = createContext({});
export const useEventContext = () => useContext(EventContext);

function EventContextProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [displayAlert, setDisplayAlert] = useState(null);

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

  const updateEventsOnRegistration = (event_id, registered, new_count) => {
    setEvents(
      events.map((event) => {
        if (event.event_id === event_id) {
          return { ...event, isRegistered: registered, count: new_count };
        } else {
          return event;
        }
      })
    );
  };

  return (
    <EventContext.Provider value={{
        events,
        isFetching,
        displayAlert,
        setDisplayAlert,
        fetchEvents,
        updateEventsOnRegistration,
    }}>
      {children}
    </EventContext.Provider>
  );
}

export default EventContextProvider;
