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
      <div className="container">
        <div className="row">
          {events.map((event) => (
            <div key={event.event_id} className="col-lg-4 col-md-6 col-sm-12">
              <EventCard
                name = {event.name}
                desc = {event.desc}
                start = {event.start_time}
                end = {event.end_time}
                capacity = {event.capacity}
                filled = {event.filled_spots}
                image = {event.image}>
              </EventCard>
            </div>
          ))}
        </div>  
      </div>
        

      <NavLink to="/registered-events">
        Click here to see the events you're registered for{" "}
      </NavLink>
    </>
  );
}

export default Events;
