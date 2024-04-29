import { Navigate } from "react-router-dom";
import { useUserContext } from '../../contexts/UserContextHandler';
import { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import UserHeader from "../../components/headers/UserHeader";
import SessionTimeoutHandler from "../../components/session-checker/SessionTimeoutHandler";
import AlertBox from "../../components/shared-components/AlertBox";

function UserDashboard() {
  const { userData, isLoading } = useUserContext();
  const [announcements, setAnnouncements] = useState([]);
  const [isQuerying, setQuerying] = useState(true);
  const [index, setIndex] = useState(0);
  const [displayAlert, setDisplayAlert] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setDisplayAlert(null)
    fetchAllAnnouncements()
    fetchUpcomingEvents()
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

  const fetchUpcomingEvents = async () => {
    try {
      setQuerying(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-upcoming-events`,
        { credentials: "include" }
      )
      if (response.ok) {
        const data = await response.json();
        setEvents(data.results);
      } else {
        setDisplayAlert({
          type: "danger",
          header: "Could not display upcoming events!",
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
        <Carousel activeIndex={index} onSelect={handleSelect}>
          {isLoading ? (
            <div className="col-12 d-flex justify-content-center">
              <div
                className="spinner-border mb-5"
                role="status"
                style={{ width: "10rem", height: "10rem" }}
              >
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : announcements.length > 0 ? (
            announcements.map((ann) => (
              <Carousel.Item key={ann.announcement_id} style={{ maxHeight: '400px', overflow: 'hidden' }}>
                  <img
                      className="d-block w-100"
                      src={ann.image_link}
                      alt={ann.announcement_name}
                      style={{ objectFit: 'cover', maxHeight: '100%' }}
                  />
                  <Carousel.Caption style={{ margin: '5px'}}>
                      <h3>{ann.announcement_name}</h3>
                      <p>{ann.description}</p>
                  </Carousel.Caption>
              </Carousel.Item>
            ))
          ) : displayAlert ? (
            <AlertBox
              type={displayAlert.type}
              header={displayAlert.header}
              text={displayAlert.text}
              handleClose={() => setDisplayAlert(null)}
            />
          ) : (
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
      <div className="container"> 
        <h1 className="p-5 text-center">Upcoming Events</h1>
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
        ) : filteredCommunities.length > 0 ? (
          filteredCommunities.map((comm) => (
            <div
              key={comm.group_id}
              className="col-lg-6 col-md-6 col-sm-12 mt-3"
            >
              <CommunityCard
                group_id={comm.group_id}
                name={comm.name}
                desc={comm.desc}
                count={comm.count}
                image={comm.image}
                isRegistered={comm.isRegistered}
                isAdmin={isAdmin}
                fetchCommunities={fetchAllCommunities}
                updateCommunities={updateCommunities}
                addRegistrationAlert={addRegistrationAlert}
              />
            </div>
          ))
        ) : displayAlert ? (
          <AlertBox
            type={displayAlert.type}
            header={displayAlert.header}
            text={displayAlert.text}
            handleClose={() => setDisplayAlert(null)}
          ></AlertBox>
        ) : (
          <h3 className="col-12 text-center">
            There are no communities matching the filter criteria.
          </h3>
        )}
      </div>

    </>
  );
}

export default UserDashboard;
