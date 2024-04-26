import { useState, useEffect } from "react";
import { useAuthContext } from "../../../contexts/AuthContextHandler.jsx";
import { useEventContext } from "../../../contexts/EventsContextHandler.jsx";
import ToastContainer from "react-bootstrap/esm/ToastContainer.js";
import RegistrationToast from "../../../components/shared-components/RegistrationToast.jsx";
import AlertBox from "../../../components/shared-components/AlertBox.jsx";
import UserHeader from "../../../components/headers/UserHeader.jsx"
import AdminHeader from "../../../components/headers/AdminHeader.jsx";
import EventsAside from "../../../components/event-functions/EventsAside.jsx";
import EventCard from "../../../components/card-components/EventCard.jsx";
import AddEvent from "../../../components/event-functions/AddEvent.jsx";
import AddButton from "../../../components/admin-functions/AddButton.jsx";
import SearchBar from "../../../components/shared-components/SearchBar.jsx";
import SessionTimeoutHandler from "../../../components/session-checker/SessionTimeoutHandler.jsx";
import styles from "../../../css/Toast.module.css"

function Events() {
  const {
    events,
    isFetching,
    fetchEvents,
    displayAlert,
    setDisplayAlert,
    updateEvents,
    query,
    setQuery,
    searchEvents,
  } = useEventContext();
  const { isAdmin } = useAuthContext();

  const [registrationAlerts, setRegistrationAlerts] = useState([]);
  const [showAddEvent, setShowAddEvent] = useState(false);

  useEffect(() => {
    fetchEvents("/get-available-events");
  }, []);

  const fetchAllEvents = () => fetchEvents("/get-available-events");

  const addRegistrationAlert = (type, text) => {
    setRegistrationAlerts((prevRegistrationAlerts) => {
      const newRegistrationAlert = { id: Date.now(), type, text };
      if (prevRegistrationAlerts.length >= 3) {
        return [newRegistrationAlert, ...prevRegistrationAlerts.slice(0, 2)];
      } else {
        return [newRegistrationAlert, ...prevRegistrationAlerts];
      }
    });
  };
  const filteredEvents = searchEvents(events);
  const Header = isAdmin ? AdminHeader : UserHeader;

  return (
    <>
      <SessionTimeoutHandler />
      <Header />
      <div className={`container-fluid p-5`}>
        <div className="position-relative">
          <ToastContainer
            className={`p-3 ${styles.toastContainer}`}
            style={{ zIndex: 100 }}
          >
            {registrationAlerts.map((alert) => (
              <RegistrationToast
                key={alert.id}
                type={alert.type}
                text={alert.text}
              />
            ))}
          </ToastContainer>
        </div>
        <div className={`row container-fluid align-items-center`}>
          <div className="col">
            <h1 className={`ml-4`} style={{ fontSize: "2.5rem" }}>
              Upcoming Events
            </h1>
          </div>
          {isAdmin && (
            <div className="col d-flex justify-content-end">
              <AddButton
                type="Add Event"
                action={() => {
                  setShowAddEvent(true);
                }}
              ></AddButton>
            </div>
          )}
        </div>
        <hr />
        <div className={`row`}>
          <EventsAside />
          <div className={`col-lg-10 mt-3`}>
            <SearchBar query={query} setQuery={setQuery}></SearchBar>
            <div className={`row`}>
              {isFetching ? (
                <div className="col-12 d-flex justify-content-center">
                  <div
                    className="spinner-border mt-5"
                    role="status"
                    style={{ width: "10rem", height: "10rem" }}
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <div
                    key={event.event_id}
                    className="col-lg-4 col-md-6 col-sm-12 mt-2"
                  >
                    <EventCard
                      id={event.event_id}
                      name={event.name}
                      desc={event.desc}
                      start={event.start_time}
                      end={event.end_time}
                      capacity={event.capacity}
                      filled={event.filled_spots}
                      image={event.image}
                      isRegistered={event.isRegistered}
                      isWaitlisted={event.isWaitlisted}
                      isFull={event.isFull}
                      isAdmin={isAdmin}
                      fetchEvents={fetchAllEvents}
                      updateEvents={updateEvents}
                      addRegistrationAlert={addRegistrationAlert}
                      isPastEvent={false}
                    ></EventCard>
                  </div>
                ))
              ) : displayAlert ? (
                <AlertBox
                  type={displayAlert.type}
                  header={displayAlert.header}
                  text={displayAlert.text}
                  wantTimer={false}
                  handleClose={() => setDisplayAlert(null)}
                ></AlertBox>
              ) : (
                <h3 className="col-12 text-center">
                  There are no events matching filter criteria.
                </h3>
              )}
            </div>
          </div>
        </div>
      </div>
      {showAddEvent && isAdmin && (
        <AddEvent
          isShown={showAddEvent}
          handleClose={() => setShowAddEvent(false)}
          fetchEvents={fetchAllEvents}
        ></AddEvent>
      )}
    </>
  );
}

export default Events;
