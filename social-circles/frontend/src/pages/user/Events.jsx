import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import UserHeader from "../headers/UserHeader";
import EventCard from "./EventCard.jsx";

function Events() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const getAllEvents = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/get-available-events`,
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
      }
    };
    getAllEvents();
  }, []);

  return (
    <>
      <UserHeader />
      <h2>This is the Events page.</h2>
      <p>Here are all available events: </p>
      <ul>
        {events.map((event) => (
          <EventCard
            name={event.event_name}
            date_and_time={event.date_and_time}
            capacity={event.capacity}
            filled_spots={event.filled_spots}/>
        ))}
      </ul>

      <NavLink to="/event-registrations">
        Click here to see the events you're registered for{" "}
      </NavLink>
    </>
  );
}

export default Events;
