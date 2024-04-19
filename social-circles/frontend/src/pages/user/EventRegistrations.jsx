import React, { useState, useEffect } from "react";
import UserHeader from "../headers/UserHeader";

function EventRegistrations() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const getRegisteredEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/get-registered-events`,
          { credentials: "include" }
        );
        if (response.ok) {
          const data = await response.json();
          setEvents(data.results);
        } else {
          const errorData = await response.json();
          setError(errorData.message);
        }
      } catch (error) {
        console.error("Failed to fetch event data: ", error);
        setError("Server error. Please contact the administrator");
      } finally {
        setLoading(false);
      }
    };
    getRegisteredEvents();
  }, []);

  let content;
  if (isLoading) {
    content = <p>Loading your registered events...</p>;
  } else if (events.length > 0) {
    content = (
        <>
          <p>Here are the events you registered for: </p>
          <ul>
            {events.map((event) => (
              <li key={event.event_id}>
                {event.event_name} - {event.date_and_time} - {event.capacity} - {event.filled_spots}
              </li>
            ))}
          </ul>
        </>
      );
  } else {
    content = <p>You have not registered for any events.</p>;
  }

  return (
    <>
        <UserHeader />
        <h2>This is the Registered Events Page</h2>    
        {content}   
    </>
  );
}

export default EventRegistrations;
