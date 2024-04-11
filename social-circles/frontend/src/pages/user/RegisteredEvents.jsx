import React, { useState, useEffect } from "react";
import { useAuthContext } from "../auth/AuthHandler.jsx";
import UserHeader from "../headers/UserHeader";
import EventsAside from "./EventsAside.jsx";
import EventCard from "./EventCard"
import AddButton from "../admin/AddButton.jsx";

function RegisteredEvents() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [isQuerying, setQuerying] = useState(true);

  const { isAdmin } = useAuthContext();

  useEffect(() => {
    const getRegisteredEvents = async () => {
      try {
        setQuerying(true);
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
        setQuerying(false);
      }
    };
    getRegisteredEvents();
  }, []);

  return (
    <>
      <UserHeader />
      <div className={`container-fluid p-5`}>
        <div className={`row container-fluid align-items-center`}>
          <div className="col">
            <h1 className={`ml-4`} style={{ fontSize: '2.5rem' }}>Registered Events</h1>
          </div>
          {isAdmin && (
            <div className="col d-flex justify-content-end">
              <AddButton
                type="Add Event"
                action={() => console.log(hello)}
              />
            </div>
          )}
        </div>
        <hr />
        <div className={`row`}>
          <EventsAside />
          <div className={`col-lg-10 mt-3`}>
            <div className={`row`}>
              {isQuerying ? (
                <div className="col-12 d-flex justify-content-center">
                  <div className="spinner-border mt-5" role="status"
                    style={{ width: '10rem', height: '10rem'}}>
                    <span class="sr-only">Loading...</span>
                  </div>
                </div>
              ) : events.length > 0 ? (
                events.map((event) => (
                  <div key={event.event_id} className="col-lg-4 col-md-6 col-sm-12 mt-2">
                    <EventCard
                      name={event.name}
                      desc={event.desc}
                      start={event.start_time}
                      end={event.end_time}
                      capacity={event.capacity}
                      filled={event.filled_spots}
                      image={event.image}>
                    </EventCard>
                  </div>
                ))
              ) : (
                <h3 className="col-12">
                  You have not registered for any events.
                </h3>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisteredEvents;
