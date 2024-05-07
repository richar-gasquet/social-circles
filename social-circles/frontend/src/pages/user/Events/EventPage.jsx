import React, { useState, useEffect, useCallback } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAuthContext } from "../../../contexts/AuthContextHandler.jsx";
import { useUserContext } from "../../../contexts/UserContextHandler";
import he from "he";
import Button from "react-bootstrap/esm/Button.js";
import logo from "../../../assets/social-circles-logo.png";
import AdminHeader from "../../../components/headers/AdminHeader.jsx";
import UserHeader from "../../../components/headers/UserHeader.jsx";
import SessionTimeoutHandler from "../../../components/session-checker/SessionTimeoutHandler.jsx";
import EventRegisterButton from "../../../components/user-functions/EventRegisterButton.jsx";
import AlertBox from "../../../components/shared-components/AlertBox.jsx";
import Loading from "../../../components/shared-components/LoadingSpinner.jsx";
import ToastContainer from "react-bootstrap/esm/ToastContainer.js";
import AlertToast from "../../../components/shared-components/AlertToast.jsx";
import toastStyles from "../../../css/Toast.module.css";
import Modal from "react-bootstrap/Modal";
import styles from "../../../css/Buttons.module.css";
import pageStyles from "../../../css/ChildPage.module.css";

/* Single event page */
function EventPage() {
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [usersForEvent, setUsersForEvent] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [registrationAlerts, setRegistrationAlerts] = useState([]);
  const [eventDisplayAlert, setEventDisplayAlert] = useState(null);
  const [userDisplayAlert, setUserDisplayAlert] = useState(null);

  const { isAdmin } = useAuthContext();
  const { userData, isLoading } = useUserContext();

  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [isFetchingEvent, setIsFetchingEvent] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);

  if (isLoading) {
    return (
      <>
        <Loading/>
      </>
    );
  }

  // Checking if userData is undefined or email is empty 
  if (userData.is_admin === undefined || userData.is_admin === null) {
    return <Navigate to={"/profile"} />;
  }
  if (userData.email === '') {
    return <Navigate to={"/"} />;
  }

  // Utility function for handling fetch errors
  const handleFetchError = (
    setAlert,
    message,
    detail = "Try again or contact the administrator."
  ) => {
    setAlert({
      type: "danger",
      header: message,
      text: detail,
    });
  };

  // Fetch single event from the backend
  const fetchSingleEvent = useCallback(async () => {
    try {
      setIsFetchingEvent(true);
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/get-single-event-info?event_id=${eventId}`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setEvent(data.results);
      } else {
        handleFetchError(
          setEventDisplayAlert,
          "Could not display the event details!"
        );
      }
    } catch (error) {
      handleFetchError(setEventDisplayAlert, "Could not connect to server!");
    } finally {
      setIsFetchingEvent(false);
    }
  }, [eventId, setIsFetchingEvent, setEventDisplayAlert]);

  // Fetch all users for this event from the backend
  const getUsersForEvent = useCallback(async () => {
    try {
      setIsFetchingUsers(true);
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/get-users-for-event?event_id=${eventId}`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUsersForEvent(data.results);
      } else {
        handleFetchError(
          setUserDisplayAlert,
          "Could not display the registered users!"
        );
      }
    } catch (error) {
      handleFetchError(setUserDisplayAlert, "Could not connect to server!");
    } finally {
      setIsFetchingUsers(false);
    }
  }, [eventId, setIsFetchingUsers, setUserDisplayAlert]);

  useEffect(() => {
    fetchSingleEvent();
    getUsersForEvent();
  }, [fetchSingleEvent, getUsersForEvent]);

  // Forcefully unbregister a user from this event
  const unregisterUser = async () => {
    if (!selectedUser) return; // Guard clause if no user is selected

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/unregister-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include", // Ensure cookies are sent with the request if sessions are used
          body: JSON.stringify({
            email: selectedUser.email,
            event_id: eventId,
          }),
        }
      );

      if (response.ok) {
        // Refresh the list of users or remove the user from the state
        setUsersForEvent(() =>
          usersForEvent.filter((user) => user.email !== selectedUser.email)
        );

        if (selectedUser.email === userData.email) {
          const updatedEvent = { ...event, is_registered: false };
          setEvent(updatedEvent);
        }

        setSelectedUser(null);

        addRegistrationAlert(
          "success",
          `User has been successfully unregistered.`
        );
      } else {
        addRegistrationAlert(
          "danger",
          `We couldn't unregister the user for ${he.decode(event.event_name)}.`
        );
      }
    } catch (error) {
      addRegistrationAlert(
        "danger",
        `We couldn't unregister the user for ${he.decode(
          event.event_name
        )}. There was
        most likely a server error.`
      );
    }
  };

  // Register current user to the event
  const handleRegistration = async () => {
    setIsQuerying(true);
    try {
      const request = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/add-event-registration`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ event_id: eventId }),
        }
      );
      if (request.ok) {
        const data = await request.json();
        if (data.status === "waitlist") {
          // Add user to waitlist
          addRegistrationAlert(
            "success",
            `You have joined waitlist for ${event.event_name}.`
          );

          const updatedEvent = {
            ...event,
            is_registered: false,
            is_waitlisted: true,
            is_full: true,
            filled_spots: event.filled_spots,
          };

          setEvent(updatedEvent);
        } else {
          // Add user to attendees list
          addRegistrationAlert(
            "success",
            `You have registered for ${event.event_name}.`
          );

          const updatedEvent = {
            ...event,
            is_registered: true,
            is_waitlisted: false,
            is_full: event.filled_spots + 1 >= event.capacity,
            filled_spots: event.filled_spots + 1,
          };
          setEvent(updatedEvent);
          setUsersForEvent(() => {
            return [
              {
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
                is_admin: userData.is_admin,
                address: userData.address,
                preferred_name: userData.preferred_name,
                pronouns: userData.pronouns,
                phone_number: userData.phone_number,
                marital_status: userData.marital_status,
                family_circumstance: userData.family_circumstance,
                community_status: userData.community_status,
                interests: userData.interests,
                personal_identity: userData.personal_identity,
                picture: userData.picture,
              },
              ...usersForEvent,
            ];
          });
        }
      } else {
        // Could connect to server, but server error
        const data = await request.json();
        if (data.message === "waitlist_error") {
          // Display waitlist error
          addRegistrationAlert(
            "danger",
            `We couldn't register you for the wailist for ${event.event_name}. 
              Try again or contact the administrator.`
          );
        } else {
          addRegistrationAlert(
            // Display registration error
            "danger",
            `We couldn't register you for ${event.event_name}. 
              Try again or contact the administrator.`
          );
        }
      }
    } catch (error) {
      addRegistrationAlert(
        "danger",
        `We couldn't register you for ${event.event_name}. 
        The server is most likely down.`
      );
    } finally {
      setIsQuerying(false);
    }
  };

  // Cancel the current user's registration to the event
  const handleCancelRegistration = async () => {
    setIsQuerying(true);
    try {
      const request = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/delete-event-registration`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ event_id: eventId }),
        }
      );
      if (request.ok) {
        const updatedEvent = {
          ...event,
          is_registered: false,
          is_waitlisted: false,
          is_full: event.filled_spots - 1 >= event.capacity,
          filled_spots: event.filled_spots - 1,
        };
        setEvent(updatedEvent);
        setUsersForEvent(() =>
          usersForEvent.filter((user) => user.email !== userData.email)
        );
        addRegistrationAlert(
          "success",
          `You have unregistered for ${event.event_name}.`
        );
      } else {
        addRegistrationAlert(
          "danger",
          `We couldn't cancel your registration for ${event.event_name}. 
              Try again or contact the administrator.`
        );
      }
    } catch (error) {
      addRegistrationAlert(
        "danger",
        `We couldn't cancel your registration for ${event.event_name}. 
            There was most likely a server error.`
      );
    } finally {
      setIsQuerying(false);
    }
  };

  // Remove the current user from the waitlist
  const handleCancelWaitlist = async () => {
    setIsQuerying(true);
    try {
      const request = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/delete-event-waitlist`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ event_id: eventId }),
        }
      );
      if (request.ok) {
        addRegistrationAlert(
          "success",
          `You have left the waitlist for ${event.event_name}.`
        );
      } else {
        addRegistrationAlert(
          "danger",
          `We couldn't cancel your waitlist spot for ${event.event_name}. 
            Try again or contact the administrator`
        );
      }
    } catch (error) {
      addRegistrationAlert(
        "danger",
        `We couldn't cancel your waitlist spot for ${event.event_name}. 
          There was most likely a server error.`
      );
    } finally {
      setIsQuerying(false);
    }
  };

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

  const dismissAlert = (alertId) => {
    setRegistrationAlerts((prevRegistrationAlerts) =>
      prevRegistrationAlerts.filter((alert) => alert.id !== alertId)
    );
  };

  const handleUserClick = (user) => {
    if (isAdmin) {
      setSelectedUser(user);
    }
  };

  const handleButtonClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  const Header = isAdmin ? AdminHeader : UserHeader;

  return (
    <>
      <SessionTimeoutHandler />
      <Header />
      {/* Event info container */}
      <div className="container" style={{ paddingTop: "8em" }}>
        <div className="position-relative">
          <ToastContainer
            className={`p-3 ${toastStyles.toastContainer}`}
            style={{ zIndex: 100 }}
          >
            {registrationAlerts.map((alert) => (
              <AlertToast
                key={alert.id}
                type={alert.type}
                text={alert.text}
                onDismiss={() => dismissAlert(alert.id)}
              />
            ))}
          </ToastContainer>
        </div>
        {isFetchingEvent ? (
          <Loading />
        ) : event ? (
          <div>
            <h1 className="mt-3 py-3">{he.decode(event.event_name)}</h1>
            <div>
              <img
                className={`${pageStyles.img}`}
                src={event.image_link}
                alt={event.event_name}
              />
            </div>
            <hr />
            <h1 className={`mt-3 py-3`}>Event Details</h1>
            <div className="row my-3">
              <div className="col-md-3">
                <div className="d-flex">
                  <div className="icon-container">
                    <i className="fas fa-clock">&nbsp;</i>
                  </div>
                  <div>
                    <h5 className="mb-2">
                      <strong>Start:</strong>{" "}
                      {new Date(event.start_time).toLocaleString()}
                    </h5>
                    <h5 className="mb-2">
                      <strong>End:</strong>{" "}
                      {new Date(event.end_time).toLocaleString()}
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="d-flex">
                  <div className="icon-container">
                    <i className="fas fa-map-marker-alt">&ensp;</i>
                  </div>
                  <h5 className="mb-2">
                    <strong>Location:</strong> {he.decode(event.location)}
                  </h5>
                </div>
              </div>
              <div className="col-md-3 mb-0">
                <div className="d-flex">
                  <div className="icon-container">
                    <i className="fas fa-user">&ensp;</i>
                  </div>
                  <h5 className="mb-2">
                    <strong>Registered: </strong>
                    {event.filled_spots} out of {event.capacity}
                  </h5>
                </div>
              </div>
              <div className="col-md-3">
                <div className="d-flex">
                  <div className="icon-container">
                    <i className="fas fa-exclamation-circle">&nbsp;</i>
                  </div>
                  <h5 className="mb-2">
                    <strong>Event with Dana? </strong>
                    {event.is_dana_event ? <span>Yes</span> : <span>No</span>}
                  </h5>
                </div>
              </div>
            </div>
            <div className={`row mb-3`}>
              <h5 className={`pl-3`}>
                <strong>Description</strong>: {he.decode(event.event_desc)}
              </h5>
            </div>
          </div>
        ) : eventDisplayAlert ? (
          <AlertBox
            type={eventDisplayAlert.type}
            header={eventDisplayAlert.header}
            text={eventDisplayAlert.text}
            handleClose={() => setEventDisplayAlert(null)}
          ></AlertBox>
        ) : (
          <p>This event does not exist.</p>
        )}
        <div>
          {isFetchingEvent || !event ? (
            <Loading />
          ) : event.in_past ? (
            <Button variant="secondary" disabled>
              Passed
            </Button>
          ) : (
            <EventRegisterButton
              isRegistered={event.is_registered}
              isFull={event.is_full}
              isWaitlisted={event.is_waitlisted}
              isDisabled={isQuerying}
              handleRegister={(e) => handleButtonClick(e, handleRegistration)}
              handleCancelRegistration={(e) =>
                handleButtonClick(e, handleCancelRegistration)
              }
              handleCancelWaitlist={(e) =>
                handleButtonClick(e, handleCancelWaitlist)
              }
            />
          )}
        </div>
      </div>
      {/* Users grid container */}
      <div className={`container mt-5 ${pageStyles.usersContainer}`}>
        <hr />
        <h1 className={`mt-3 pb-3`}> Registered Users </h1>
        {isFetchingUsers ? (
          <Loading />
        ) : usersForEvent && usersForEvent.length > 0 ? (
          <div className="row">
            {usersForEvent.map((user) => (
              <div
                className="col-6 col-sm-4 col-md-2 col-lg-2 mb-4"
                key={user.user_id}
              >
                <div
                  className={`card ${
                    isAdmin ? pageStyles.adminHoverEffect : ""
                  }`}
                  onClick={() => handleUserClick(user)}
                >
                  <div className={pageStyles.cardImgContainer}>
                    <img
                      className={pageStyles.cardImg}
                      src={user.profile_photo || logo}
                      alt="Profile Photo"
                    />
                  </div>
                  <div className="card-body p-2">
                    <h6
                      className="card-title text-truncate text-center"
                      style={{ fontSize: "1rem" }}
                    >
                      {user.first_name} {user.last_name}
                    </h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : userDisplayAlert ? (
          <AlertBox
            type={userDisplayAlert.type}
            header={userDisplayAlert.header}
            text={userDisplayAlert.text}
            handleClose={() => setUserDisplayAlert(null)}
          ></AlertBox>
        ) : (
          <h4>No users are currently registered for this event.</h4>
        )}
        {selectedUser && isAdmin && (
          <Modal
            show={selectedUser !== null}
            onHide={() => setSelectedUser(null)}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>User Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                <strong>First Name:</strong> {selectedUser.first_name}
              </p>
              <p>
                <strong>Last Name:</strong> {selectedUser.last_name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Phone Nmber:</strong> {selectedUser.phone_number}
              </p>
              <p>
                <strong>Address:</strong> {selectedUser.address}
              </p>
              <p>
                <strong>Preferred Name:</strong> {selectedUser.preferred_name}
              </p>
              <p>
                <strong>Pronouns:</strong> {selectedUser.pronouns}
              </p>
              <p>
                <strong>Marital Status:</strong> {selectedUser.marital_status}
              </p>
              <p>
                <strong>Family Circumstance:</strong>{" "}
                {selectedUser.family_circumstance}
              </p>
              <p>
                <strong>Community Status:</strong>{" "}
                {selectedUser.community_status}
              </p>
              <p>
                <strong>Interests:</strong> {selectedUser.interests}
              </p>
              <p>
                <strong>Personal Identity:</strong>{" "}
                {selectedUser.personal_identity}
              </p>
            </Modal.Body>
            <Modal.Footer>
              {isAdmin && (
                <button
                  className={styles.submitButton}
                  variant="danger"
                  onClick={unregisterUser}
                >
                  Remove User
                </button>
              )}
              <button
                className={styles.cancelButton}
                variant="secondary"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </>
  );
}

export default EventPage;
