import { useState, useEffect } from 'react';
import { Navigate } from "react-router-dom";
import { useUserContext } from '../../contexts/UserContextHandler';
import { useEventContext } from "../../contexts/EventsContextHandler";
import { useAuthContext } from "../../contexts/AuthContextHandler";
import UserHeader from "../../components/headers/UserHeader";
import AdminHeader from "../../components/headers/AdminHeader";
import EventCard from "../../components/card-components/EventCard";
import ToastContainer from "react-bootstrap/ToastContainer";
import AlertToast from "../../components/shared-components/AlertToast";
import CarouselComponent from "../../components/user-dashboard-functions/CarouselComponent"
import Loading from "../../components/shared-components/LoadingSpinner";
import SessionTimeoutHandler from "../../components/session-checker/SessionTimeoutHandler";
import AddButton from "../../components/admin-functions/AddButton";
import styles from "../../css/Toast.module.css";
import AddAnnouncement from "../../components/user-dashboard-functions/AddAnnouncement";

function UserDashboard() {
  const { userData, isLoading } = useUserContext();
  const { isAdmin } = useAuthContext();
  const [announcements, setAnnouncements] = useState([]);
  const [isQuerying, setIsQuerying] = useState(true);
  const [registrationAlerts, setRegistrationAlerts] = useState([]);
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  const { events, isFetching, fetchEvents, displayAlert, setDisplayAlert, updateEvents } = useEventContext();
  const Header = isAdmin
    ? AdminHeader
    : UserHeader;

  if (isLoading) {
    return (
      <>
        <UserHeader />
        <Loading />
      </>
    )
  }

  // Checking if userData is undefined or email is empty 
  if (userData.email === '') {
    return <Navigate to={"/"} />;
  }
  if (userData.is_admin === undefined) {
    return <Navigate to={"/profile"} />;
  }

  const fetchAllAnnouncements = async () => {
    try {
      setIsQuerying(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-announcements`,
        { credentials: "include" }
      );
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.results);
      } else {
        setDisplayAlert({
          type: "danger",
          header: "Could not display announcements!",
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
      setIsQuerying(false);
    }
  };

  useEffect(() => {
    fetchEvents("/get-available-events");
    fetchAllAnnouncements();
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

  const slicedEvents = events.slice(0, 3);

  return (
    <>
      <SessionTimeoutHandler />
      <Header />
      <div style={{ paddingTop: '7em' }}>
        <CarouselComponent
          announcements={announcements}
          isQuerying={isQuerying}
          isAdmin={ isAdmin }
          fetchAnnouncements={fetchAllAnnouncements}
        />
      </div>
      {isAdmin && (
        <div className="col d-flex justify-content-end mt-2">
          <AddButton
            type="Add Ann."
            action={() => {
              setShowAddAnnouncement(true);
            }}
          ></AddButton>
        </div>
      )}
      <div className={`container`}>
        <div className="position-relative">
          <ToastContainer
            className={`p-3 ${styles.toastContainer}`}
            style={{ zIndex: 100 }}
          >
            {registrationAlerts.map((alert) => (
              <AlertToast
                key={alert.id}
                type={alert.type}
                text={alert.text}
              />
            ))}
          </ToastContainer>
        </div>
        <div className={`row container-fluid align-items-center`} style={{ paddingTop: '2em' }}>
          <h1 className={`ml-4`} style={{ fontSize: "2.5rem" }}>
            Upcoming Events
          </h1>
        </div>
        <hr />
        <div className={`row`}>
          <div className={`col mb-3`}>
            <div className="row justify-content-center">
              {isFetching ? (
                <Loading />
              ) : slicedEvents.length > 0 ? (
                slicedEvents.map((event) => (
                  <div
                    key={event.event_id}
                    className="col-lg-4 col-md-6 col-sm-12 mt-2"
                  >
                    <EventCard
                      id={event.event_id}
                      name={event.name}
                      desc={event.desc}
                      capacity={event.capacity}
                      filled={event.filled_spots}
                      location={event.location}
                      isDanaEvent={event.isDanaEvent}
                      image={event.image}
                      start={event.start_time}
                      end={event.end_time}
                      isRegistered={event.isRegistered}
                      isWaitlisted={event.isWaitlisted}
                      isFull={event.isFull}
                      isAdmin={false}
                      fetchEvents={fetchAllEvents}
                      updateEvents={updateEvents}
                      addRegistrationAlert={addRegistrationAlert}
                      isPastEvent={false}
                    />
                  </div>
                ))
              ) : displayAlert ? (
                <AlertBox
                  type={displayAlert.type}
                  header={displayAlert.header}
                  text={displayAlert.text}
                  wantTimer={false}
                  handleClose={() => setDisplayAlert(null)}
                />
              ) : (
                <h3 className="col-12 text-center">
                  There are no events matching filter criteria.
                </h3>
              )}
            </div>
          </div>
        </div>
      </div>
      {showAddAnnouncement && isAdmin && (
        <AddAnnouncement
          isShown={showAddAnnouncement}
          handleClose={() => setShowAddAnnouncement(false)}
          fetchAnnouncements={fetchAllAnnouncements}
        ></AddAnnouncement>
      )}
    </>
  );
}

export default UserDashboard;
