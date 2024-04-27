import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserHeader from "../../../components/headers/UserHeader.jsx";
import SessionTimeoutHandler from '../../../components/session-checker/SessionTimeoutHandler.jsx';
import '../../../css/EventPage.css'
import styles from '../../../css/Buttons.module.css';
import Modal from 'react-bootstrap/Modal'; 
import AdminHeader from "../../../components/headers/AdminHeader.jsx";
import { useAuthContext } from "../../../contexts/AuthContextHandler.jsx";
import logo from "../../../assets/social-circles-logo.png"


function EventPage() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [displayAlert, setDisplayAlert] = useState(null);
    const [usersForEvent, setUsersForEvent] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const { isAdmin } = useAuthContext();

    const Header = isAdmin ? AdminHeader : UserHeader;

    const cardBodyStyle = {
        padding: '0.5rem'  // Adjust padding as needed
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
    };
    
      const closePopup = () => {
        setSelectedUser(null);
    };

    const unregisterUser = () => {
        // Confirm with the admin before proceeding
        const confirmAction = window.confirm("Are you sure you want to unregister this user?");
        
        if (confirmAction) {
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
            if (data.status === 'success') {
              alert('User has been unregistered.');
              closePopup();
              // Refresh the list of users or remove the user from the state
              setUsersForEvent(usersForEvent.filter(user => user.email !== selectedUser.email));
             
            } else {
              alert('Error: ' + data.message);
            }
          })
          .catch(error => {
            console.error('Error unregistering user:', error);
            alert('Failed to unregister user.');
          });
        } else {
          // If the user cancels, just close the confirmation and do nothing
          console.log("User deletion cancelled.");
        }
      };

    useEffect(() => {
        const getEventInfo = async () => {
            try {
                const request = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/get-one-event-info?event_id=${eventId}`,
                    {
                        credentials: "include",
                    }
                );
                if (request.ok) {
                    const data = await request.json();
                    console.log(data.results)
                    setEvent(data.results);
                } else {
                    setDisplayAlert({
                        type: "danger",
                        header: "Could not display event!",
                        text: "Try again or contact the administrator.",
                    });
                }
            } catch (error) {
                setDisplayAlert({
                    type: "danger",
                    header: "Could not display events!",
                    text: "Try again or contact the administrator.",
                });
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
                    console.log(data.results)
                    setUsersForEvent(data.results);
                } else {
                    setDisplayAlert({
                        type: "danger",
                        header: "Could not display event!",
                        text: "Try again or contact the administrator.",
                    });
                }
            } catch (error) {
                setDisplayAlert({
                    type: "danger",
                    header: "Could not display events!",
                    text: "Try again or contact the administrator.",
                });
            }
        };

        getUsersForEvent();
    }, [eventId]);

    return (
        <>
            <SessionTimeoutHandler />
            <Header />
            {/* Event info container */}
            <div className="container position" >
                {console.log(event)}
                {event ? (
                    <div>
                        <h2>{event.event_name}</h2>
                        <img src={event.image_link} alt={event.event_name} />
                        <p>{event.event_desc}</p>
                        <p>Start: {new Date(event.start_time).toLocaleString()}</p>
                        <p>End: {new Date(event.end_time).toLocaleString()}</p>
                        <p>{event.filled_spots} out of {event.capacity}</p>
                        <p>Location: {event.location}</p>
                        <p>Dana Event?: {event.is_dana_event ? <p>Yes</p> : <p>No</p>}</p>
                    </div>
                ) : (
                    <p>No event details available.</p>
                )}
                
            </div >
                
            {/* Users grid container */}
            <div className="container mt-4 position">
                <h4> Registered Users </h4>
                {usersForEvent && usersForEvent.length > 0 ? (
                    <div className="row">
                        {usersForEvent.map(user => (
                            <div className="col-12 col-sm-6 col-md-3 col-lg-3 mb-4" key={user.user_id}>
                                <div className="card square" onClick={() => handleUserClick(user)}>
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
                {selectedUser && (
                <Modal show={selectedUser !== null} onHide={closePopup}>
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
                    <button className={styles.submitButton} variant="danger" onClick={unregisterUser}>Remove User</button>
                    <button className={styles.cancelButton} variant="secondary" onClick={closePopup}>Close</button>
                </Modal.Footer>
                </Modal>
                )}
            </div>
        </>
    );
}

export default EventPage;