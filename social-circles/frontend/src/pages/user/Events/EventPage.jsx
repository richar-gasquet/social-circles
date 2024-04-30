import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserHeader from "../../../components/headers/UserHeader.jsx";
import SessionTimeoutHandler from '../../../components/session-checker/SessionTimeoutHandler.jsx';
import '../../../css/EventPage.css'
import styles from '../../../css/Buttons.module.css';
import Modal from 'react-bootstrap/Modal'; 
import AdminHeader from "../../../components/headers/AdminHeader.jsx";
import { useAuthContext } from "../../../contexts/AuthContextHandler.jsx";
import EventRegisterButton from '../../../components/user-functions/EventRegisterButton.jsx';
import logo from "../../../assets/social-circles-logo.png";
import ToastContainer from 'react-bootstrap/esm/ToastContainer.js';
import RegistrationToast from '../../../components/shared-components/RegistrationToast.jsx';
import toastStyles from "../../../css/Toast.module.css"
import { useUserContext } from '../../../contexts/UserContextHandler';
import Loading from '../../../components/shared-components/LoadingSpinner.jsx';
import { Navigate } from "react-router-dom";


function EventPage() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [usersForEvent, setUsersForEvent] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const { isAdmin } = useAuthContext();
    const [registrationAlerts, setRegistrationAlerts] = useState([]);

    const { userData, isLoading } = useUserContext();
    const Header = isAdmin ? AdminHeader : UserHeader;

    if (isLoading) {
        return (
        <>
        <Header />
        <Loading/>
        </>
        )
    }
    // Checking if userData is undefined or email is empty  !userData ||
  if ( userData.email === '') {
    return <Navigate to={"/"} />;
  }
  if ( userData.is_admin === undefined) {
    return <Navigate to={"/profile"} />;
  }
    
    const [eventData, setEventData] = useState({
        isRegistered: false,
        isFull: false,
        isWaitlisted: false,
        filled_spots: 0
      });

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
    
    useEffect(() => {
      const storedEventData = JSON.parse(localStorage.getItem('eventData'));
      if (storedEventData) {
        setEventData(storedEventData);
        localStorage.removeItem('eventData'); // Clean up local storage after use
      }
    }, []);

    const handleUserClick = (user) => {
      if (isAdmin) {
        setSelectedUser(user);
      }
    };
    
    const closePopup = () => {
      setSelectedUser(null);
    };

    const unregisterUser = () => {
        // Confirm with the admin before proceeding
        
          if (!selectedUser) return;  // Guard clause if no user is selected
      
          fetch(`${import.meta.env.VITE_BACKEND_URL}/unregister-user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            credentials: 'include',  // Ensure cookies are sent with the request if sessions are used
            body: JSON.stringify({ email: selectedUser.email,
                                    event_id: eventId})
          })
          .then(response => response.json())
          .then(data => {
            {console.log(data.message)}
            if (data.status === 'success') {
              addRegistrationAlert(
                "success",
                `User has been successfully unregistered.`
              );

              closePopup();
              // Refresh the list of users or remove the user from the state
              setUsersForEvent(usersForEvent.filter(user => user.email !== selectedUser.email));
              const updated = {
                ...eventData,
                isRegistered: false,
                isWaitlisted: false,
                isFull: event.filled_spots - 1 >= event.capacity,
                filled_spots: event.filled_spots - 1,
              };
              event.filled_spots = event.filled_spots - 1;
              setEventData(updated);
            } else {
              addRegistrationAlert(
                "danger",
                `Error: ${data.message}`
              );
            }
          })
          .catch(error => {
            console.error('Error unregistering user:', error);
            addRegistrationAlert(
              "danger",
              `Failed to unregister user.`
            );
          });
        
      };

    useEffect(() => {
        const getEventInfo = async () => {
            try {
                const request = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/get-one-event-info-with-user-status?event_id=${eventId}`,
                    {
                        credentials: "include",
                    }
                );
                if (request.ok) {
                    const data = await request.json();
                    setEvent(data.results);
                    setEventData(currentData => ({
                        ...currentData,
                        isRegistered: data.results.is_registered,
                        isFull: data.results.is_full,
                        isWaitlisted: data.results.is_waitlisted,
                        filled_spots: data.results.filled_spots
                    }));
                } else {
                    addRegistrationAlert(
                      "danger",
                      `Could not display event!.
                      Try again or contact server administrator.`
                    );
                }
            } catch (error) {
              addRegistrationAlert(
                "danger",
                `Could not display event!.
                Try again or contact server administrator.`
              );
            }
        };

        getEventInfo();
    }, [eventId]);

    useEffect(() => {
        const getUsersForEvent = async () => {
            try {
                const request = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/get-users-for-event?event_id=${eventId}`,
                    {
                        credentials: "include",
                    }
                );
                if (request.ok) {
                    const data = await request.json();
                    setUsersForEvent(data.results);
                } else {
                  addRegistrationAlert(
                    "danger",
                    `Could not display users registered to this event!.
                    Try again or contact server administrator.`
                  );
                }
            } catch (error) {
              addRegistrationAlert(
                "danger",
                `Could not display users registered to this event!.
                Try again or contact server administrator.`
              );
            }
        };

        getUsersForEvent();
    }, [eventId, eventData]);

    const [isQuerying, setIsQuerying] = useState(false);

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
            addRegistrationAlert(
              "success",
              `You have joined waitlist for ${event.event_name}.`
            );

            const updated = {
                ...eventData,
                isRegistered: false,
                isWaitlisted: true,
                isFull: true,
                filled_spots: event.filled_spots,
              };

              setEventData(updated);

          } else {
            addRegistrationAlert(
              "success",
              `You have registered for ${event.event_name}.`
            );

            const updated = {
                ...eventData,
                isRegistered: true,
                isWaitlisted: false,
                isFull: event.filled_spots + 1 >= event.capacity,
                filled_spots: event.filled_spots + 1,
            };
            event.filled_spots = event.filled_spots + 1;
            setEventData(updated);

          }
        } else {
          const data = await request.json();
          if (data.message === "waitlist_error") {
            addRegistrationAlert(
              "danger",
              `We couldn't register you for the wailist for ${event.event_name}. 
              Try again or contact the administrator.`
            );
          } else {
            addRegistrationAlert(
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
          Try again or contact the administrator.`
        );
      } finally {
        setIsQuerying(false);
      }
    };
  
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
            const updated = {
              ...eventData,
              isRegistered: false,
              isWaitlisted: false,
              isFull: event.filled_spots - 1 >= event.capacity,
              filled_spots: event.filled_spots - 1,
            };
            event.filled_spots = event.filled_spots - 1;
            setEventData(updated);
      
            addRegistrationAlert(
              "success",
              `We have cancelled your registration for ${event.event_name}.`
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
            Try again or contact the administrator.`
          );
        } finally {
          setIsQuerying(false);
        }
      };
      
  
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
          The server is most likely down.`
        );
      } finally {
        setIsQuerying(false);
      }
    };

    const handleButtonClick = (e, action) => {
        e.stopPropagation();
        action();
    };

    const [confirmModal, setConfirmModal] = useState({ show: false, onConfirm: () => {} });

    return (
        <>
            <SessionTimeoutHandler />
            <Header />
            {/* Event info container */}
            <div className="container spacing-from-header" >
              <div className="position-relative">
                <ToastContainer
                  className={`p-3 ${toastStyles.toastContainer}`}
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
                {event ? (
                    <div className='event-info mt-5 postiion'>
                        <h1>{event.event_name}</h1>
                        <img src={event.image_link} alt={event.event_name} />
                        <div className="row mt-4 postiion">
                            <div className="col-md-3 mb-0">
                                <div className="d-flex mb-2">
                                    <div className="icon-container me-2">
                                        <i className='fas fa-clock'>&nbsp;</i>
                                    </div>
                                    <div>
                                        <p className="mb-2"><strong>Start:</strong> {new Date(event.start_time).toLocaleString()}</p>
                                        <p className="mb-0"><strong>End:</strong> {new Date(event.end_time).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 mb-0">
                                <div className='d-flex'>
                                    <div className="icon-container me-2">
                                        <i className='fas fa-map-marker-alt'>&ensp;</i>
                                    </div>
                                    <p className='mb-2'><strong>Location:</strong> {event.location}</p>
                                </div>
                            </div>
                            <div className="col-md-3 mb-0">
                                <div className='d-flex'>
                                    <div className="icon-container me-2">
                                        <i className='fas fa-user'>&ensp;</i>
                                    </div>
                                    <p className='mb-2'><strong>Registered: </strong>{event.filled_spots} out of {event.capacity}</p>
                                </div>
                            </div>
                            <div className="col-md-3 mb-0">
                                <div className='d-flex'>
                                    <div className="icon-container me-2">
                                        <i className='fas fa-exclamation-circle'>&nbsp;</i>
                                    </div>
                                    <p className='mb-2'><strong>Event with Dana?: </strong>{event.is_dana_event ? <span>Yes</span> : <span>No</span>}</p>
                                </div>
                            </div>
                        </div>
                        <div className='event-details mt-5 postiion'> 
                            <h2>Event Details</h2>
                            <p className='event-desc'>{event.event_desc}</p>
                        </div>
                        
                    </div>
                ) : (
                    <p>No event details available.</p>
                )}
                    <div className="register-button">
                        {eventData && (
                            <EventRegisterButton
                            isRegistered={eventData.isRegistered}
                            isFull={eventData.isFull}
                            isWaitlisted={eventData.isWaitlisted}
                            isDisabled={isQuerying}
                            handleRegister={(e) => handleButtonClick(e, handleRegistration)}
                            handleCancelRegistration={(e) => handleButtonClick(e, handleCancelRegistration)}
                            handleCancelWaitlist={(e) => handleButtonClick(e, handleCancelWaitlist)}
                            />
                        )}
                    </div>
                
            </div >
            {/* Users grid container */}
            <div className="container mt-5 position">
                <h4> Registered Users </h4>
                {usersForEvent && usersForEvent.length > 0 ? (
                    <div className="row">
                        {usersForEvent.map(user => (
                            <div className="col-12 col-sm-6 col-md-3 col-lg-3 mb-4" key={user.user_id}>
                                <div className={`card square ${isAdmin ? 'admin-hover-effect' : ''}`} onClick={() => handleUserClick(user)}>
                                    <div className="card-body square-content">
                                        <img src={user.profile_photo ? user.profile_photo : logo} alt="Profile Photo" width="100px"/>
                                        <p className="card-title">{user.first_name} {user.last_name}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No users registered for this event.</p>
                )}
                {selectedUser && isAdmin && (
                    <Modal show={selectedUser !== null} onHide={closePopup} backdrop='static' keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>User Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>First Name:</strong> {selectedUser.first_name}</p>
                        <p><strong>Last Name:</strong> {selectedUser.last_name}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>Phone Nmber:</strong> {selectedUser.phone_number}</p>
                        <p><strong>Address:</strong> {selectedUser.address}</p>
                        <p><strong>Preferred Name:</strong> {selectedUser.preferred_name}</p>
                        <p><strong>Pronouns:</strong> {selectedUser.pronouns}</p>
                        <p><strong>Marital Status:</strong> {selectedUser.marital_status}</p>
                        <p><strong>Family Circumstance:</strong> {selectedUser.family_circumstance}</p>
                        <p><strong>Community Status:</strong> {selectedUser.community_status}</p>
                        <p><strong>Interests:</strong> {selectedUser.interests}</p>
                        <p><strong>Personal Identity:</strong> {selectedUser.personal_identity}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        {isAdmin && (
                            <button className={styles.submitButton} variant="danger" onClick={unregisterUser}>Remove User</button>
                        )}
                        <button className={styles.cancelButton} variant="secondary" onClick={closePopup}>Close</button>
                    </Modal.Footer>
                    </Modal>
                    )}
            </div>
        </>
    );
}

export default EventPage;