import React, { useState, useEffect } from "react";
import { useAuthContext } from "../auth/AuthHandler.jsx";
import UserHeader from "../headers/UserHeader";
import AdminButton from "../admin/AdminButton.jsx";
import EventsAside from "./EventsAside.jsx";
import EventCard from "./EventCard.jsx";
import AddEvent from "./AddEvent.jsx";

function Events() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [isQuerying, setQuerying] = useState(true);
  const [showAddEvent, setShowAddEvent] = useState(false);

  const { isAdmin } = useAuthContext();

  useEffect(() => {
    fetchAllEvents()
  }, []);

  const fetchAllEvents = async () => {
    try {
      setQuerying(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/get-available-events`,
        { credentials: "include" }
      )
      if (response.ok) {
        const data = await response.json();
        setEvents(data.results);
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {
      console.error("Failed to fetch event data: ", error);
      setError("Server error. Please contact the administrator.")
    } finally {
      setQuerying(false);
    }
  };

  const handleShowAddEvent = () => setShowAddEvent(true)
  const handleCloseAddEvent = () => {
    setShowAddEvent(false);
    fetchAllEvents();
  };

  return (
    <>
      <UserHeader />
      <div className={`container-fluid p-5`}>
        <div className={`row container-fluid align-items-center`}>
          <div className="col">
            <h1 className={`ml-4`} style={{ fontSize: '2.5rem' }}>Upcoming Events</h1>
          </div>
          {isAdmin && (
            <div className="col d-flex justify-content-end">
              <AdminButton
                type="Add Event"
                action={handleShowAddEvent}>
              </AdminButton>
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
                    <span className="sr-only">Loading...</span>
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
                      image={event.image}
                      isAdmin={isAdmin}
                      fetchAllEvents={fetchAllEvents}>
                    </EventCard>
                  </div>
                ))
              ) : (
                <h3 className="col-12">
                  There are no available events.
                </h3>
              )}
            </div>
          </div>
        </div>
      </div>
      {showAddEvent && isAdmin && (
        <AddEvent
          isShown={showAddEvent}
          handleClose={handleCloseAddEvent}>
        </AddEvent>
      )}
    </>
  );
}


export default Events;
