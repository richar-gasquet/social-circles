import { Navigate } from "react-router-dom";
import { useUserContext } from '../../contexts/UserContextHandler';
import { useEventContext } from "../../contexts/EventsContextHandler";
import { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import UserHeader from "../../components/headers/UserHeader";
import SessionTimeoutHandler from "../../components/session-checker/SessionTimeoutHandler";
import AlertBox from "../../components/shared-components/AlertBox";
import Loading from "../../components/shared-components/LoadingSpinner";
import ToastContainer from "react-bootstrap/esm/ToastContainer";
import styles from "../../css/Toast.module.css";

function UserDashboard() {
  const { userData, isLoading } = useUserContext();
  const [announcements, setAnnouncements] = useState([]);
  const [isQuerying, setQuerying] = useState(true);
  const [index, setIndex] = useState(0);
  // const [displayAlert, setDisplayAlert] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [registrationAlerts, setRegistrationAlerts] = useState([]);

  const {
    events,
    isFetching,
    fetchEvents,
    displayAlert,
    setDisplayAlert,
    updateEvents,
    query,
    setQuery,
    searchEvents
  } = useEventContext();

  useEffect(() => {
    fetchAllAnnouncements()
      .then(() => setDataLoaded(true))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const fetchAllAnnouncements = async () => {
    try {
      setQuerying(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-announcements`,
        { credentials: "include" }
      )
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
      setQuerying(false);
    }
  };

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

  const upcomingEvents = events.slice(0,2);

  if (userData.is_admin === undefined){
    return <Navigate to={"/profile"} />;
  }

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <>
      {userData && <SessionTimeoutHandler />}
        <UserHeader />
        <div style={{paddingTop: '7em'}}>
          <Carousel activeIndex={index} onSelect={handleSelect} indicators={false} slide={false}>
            {isLoading ? (
              <Loading />
            ) : dataLoaded && announcements.length > 0 ? (
              announcements.map((ann) => (
                <Carousel.Item key={ann.announcement_id} style={{ maxHeight: '400px', overflow: 'hidden' }}>
                  <img
                    className="d-block w-100"
                    src={ann.image_link}
                    alt={ann.announcement_name}
                    style={{ objectFit: 'cover', maxHeight: '100%' }}
                  />
                  <Carousel.Caption style={{ margin: '5em'}}>
                    <h3>{ann.announcement_name}</h3>
                    <p>{ann.description}</p>
                  </Carousel.Caption>
                </Carousel.Item>
              ))
            ) : dataLoaded && displayAlert ? (
              <AlertBox
                type={displayAlert.type}
                header={displayAlert.header}
                text={displayAlert.text}
                handleClose={() => setDisplayAlert(null)}
              />
            ) : null}
            {/* Display "No Announcements" item only if data loading is complete and no announcements are available */}
            {dataLoaded && announcements.length === 0 && (
              <Carousel.Item key="no-announcements" style={{ maxHeight: '400px', overflow: 'hidden' }}>
                <img
                  className="d-block w-100"
                  src="https://t3.ftcdn.net/jpg/03/08/93/14/360_F_308931411_1lkVPXmBNd2IojYMSdGaz7sedkSr5Q2w.jpg"
                  alt="No Announcements"
                  style={{ objectFit: 'cover', maxHeight: '100%' }}
                />
                <Carousel.Caption>
                  <p>There are no announcements.</p>
                </Carousel.Caption>
              </Carousel.Item>
            )}
          </Carousel>
        </div>
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
          <div className={`row container-fluid align-items-center`} style = {{paddingTop: '7em'}}>
            <div className="col">
              <h1 className={`ml-4`} style={{ fontSize: "2.5rem" }}>
                Upcoming Events
              </h1>
            </div>
          </div>
          <hr />
          <div className={`row`}>
            <div className={`col-lg-10 mt-3`}>
              <div className={`row`}>
                {isFetching ? (
                  <Loading />
                ) : upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
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
    </>
  );
}

export default UserDashboard;