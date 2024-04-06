import React, { useState, useEffect } from "react";
import UserHeader from "../headers/UserHeader";
import EventCard from "./EventCard.jsx";

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
