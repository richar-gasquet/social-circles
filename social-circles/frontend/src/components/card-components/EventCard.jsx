import { useState } from "react";
import { useNavigate } from "react-router-dom";
import he from "he";
import Button from "react-bootstrap/Button";
import CardButton from "./CardButton";
import EventRegisterButton from "../user-functions/EventRegisterButton";
import EditEvent from "../event-functions/EditEvent";
import DeleteEvent from "../event-functions/DeleteEvent";
import EmailEventGroup from "../event-functions/EmailEvents";
import styles from "../../css/Card.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

/* Card containing details about an event */
function EventCard(props) {
  const formattedStart = new Date(props.start).toISOString().slice(0, 16);
  const formattedEnd = new Date(props.end).toISOString().slice(0, 16);

  const localStart = new Date(props.start).toLocaleString();
  const localEnd = new Date(props.end).toLocaleString();

  const [showDeleteEvent, setShowDeleteEvent] = useState(false);
  const [showEditEvent, setShowEditEvent] = useState(false);
  const [showEmailEvent, setShowEmailEvent] = useState(false);

  const [isQuerying, setIsQuerying] = useState(false);

  /* Handler method for registering a user to an event */
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
          body: JSON.stringify({ event_id: props.id }),
        }
      );
      if (request.ok) {
        // Fetch successful
        const data = await request.json();
        if (data.status === "waitlist") {
          // User ended up being added to waitlist
          props.addRegistrationAlert(
            "success",
            `You have joined the waitlist for ${he.decode(props.name)}.`
          );
          const updatedCard = {
            isRegistered: false,
            isWaitlisted: true,
            isFull: true,
            filled_spots: props.filled,
          };
          props.updateEvents(props.id, updatedCard);
        } else {
          // Fetch successful and user registered properly
          props.addRegistrationAlert(
            "success",
            `You have registered for ${he.decode(props.name)}.`
          );
          const updatedCard = {
            isRegistered: true,
            isWaitlisted: false,
            isFull: props.filled + 1 >= props.capacity,
            filled_spots: props.filled + 1,
          };
          props.updateEvents(props.id, updatedCard);
        }
      } else {
        // Could connect to server, but server error
        const data = await request.json();
        if (data.message === "waitlist_error") {
          // Waitlist error msg
          props.addRegistrationAlert(
            "danger",
            `We couldn't register you for the wailist for ${he.decode(
              props.name
            )}. 
            Try again or contact the administrator.`
          );
        } else {
          // Registration error msg
          props.addRegistrationAlert(
            "danger",
            `We couldn't register you for ${he.decode(props.name)}. 
            Try again or contact the administrator.`
          );
        }
      }
    } catch (error) {
      // Could not connect to server
      props.addRegistrationAlert(
        "danger",
        `We couldn't register you for ${he.decode(props.name)}. 
        The server is most likely down.`
      );
    } finally {
      setIsQuerying(false);
    }
  };

  /* Handler method for cancelling a user's registration to an event */
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
          body: JSON.stringify({ event_id: props.id }),
        }
      );
      if (request.ok) {
        // Successful fetch and cancellation of registration
        props.addRegistrationAlert(
          "success",
          `You have cancelled your registration for ${he.decode(props.name)}.`
        );
        props.fetchEvents();
      } else {
        // Could connect to server, but server erro
        props.addRegistrationAlert(
          "danger",
          `We couldn't cancel your registration for ${he.decode(props.name)}. 
          Try again or contact the administrator`
        );
      }
    } catch (error) {
      // Could not connect to server
      props.addRegistrationAlert(
        "danger",
        `We couldn't cancel your membership for ${he.decode(props.name)}. 
        The server is most likely down.`
      );
    } finally {
      setIsQuerying(false);
    }
  };

  /* Handler method for removing a user from the waitlist for an event */
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
          body: JSON.stringify({ event_id: props.id }),
        }
      );
      if (request.ok) {
        // Successful fetch and removal of user from waitlist
        props.addRegistrationAlert(
          "success",
          `You have left the waitlist for ${he.decode(props.name)}.`
        );
        const updatedCard = {
          isRegistered: false,
          isWaitlisted: false,
          isFull: true,
        };
        props.updateEvents(props.id, updatedCard);
      } else {
        // Could connect to server, but server error
        props.addRegistrationAlert(
          "danger",
          `We couldn't cancel your waitlist spot for ${he.decode(props.name)}. 
          Try again or contact the administrator`
        );
      }
    } catch (error) {
      // Could not connect to server
      props.addRegistrationAlert(
        "danger",
        `We couldn't cancel your waitlist spot for ${he.decode(props.name)}. 
        The server is most likely down.`
      );
    } finally {
      setIsQuerying(false);
    }
  };

  const navigate = useNavigate();

  /* Handler method for clicking on the card to view individual page*/
  const handleCardClick = (e) => {
    if (
      !e.target.closest(".edit-event-modal") &&
      !e.target.closest(".delete-event-modal") &&
      !e.target.closest(".email-event-modal") &&
      !e.target.closest(".register-button")
    ) {
      navigate(`/events/${props.id}`);
    }
  };

  const handleButtonClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`card h-100 ${styles.card}`}
      onClick={(e) => handleCardClick(e)}
    >
      <div className={styles.cardImgTopContainer}>
        <img
          className={`card-img-top ${styles.cardImgTop}`}
          src={props.image}
          alt="Event"
        />
        {/* Show card buttons if the user is an admin */}
        {props.isAdmin && (
          <div className={`${styles.cardButtons}`}>
            <CardButton
              className="mb-2"
              action={(e) => {
                e.stopPropagation();
                setShowEditEvent(true);
              }}
              message="Edit Event"
              icon="fas fa-edit"
            ></CardButton>
            <CardButton
              className="mb-2"
              action={(e) => {
                e.stopPropagation();
                setShowDeleteEvent(true);
              }}
              message="Delete Event"
              icon="fas fa-trash"
            ></CardButton>
            <CardButton
              action={(e) => {
                e.stopPropagation();
                setShowEmailEvent(true);
              }}
              message="Email Event Attendees"
              icon="fas fa-envelope"
            ></CardButton>
          </div>
        )}
      </div>
      {/* Display details about the event */}
      <div className={`card-body d-flex flex-column`}>
        <h2 className={`card-title ${styles.cardTitle}`}>
          {he.decode(props.name)}
        </h2>
        <h5 className={`card-subtitle mb-2 d-flex ${styles.cardSubtitle}`}>
          <i className="fa-solid fa-user pr-2 py-1"></i>
          {props.filled}/{props.capacity} registered
        </h5>
        <h5 className={`card-subtitle mb-2 d-flex ${styles.cardSubtitle}`}>
          <i className="fa-solid fa-location-dot pr-2 py-1"></i>
          {he.decode(props.location)}
        </h5>
        <h6 className={`card-text ${styles.cardText}`}>
          {he.decode(props.desc)}
        </h6>
        <h6 className={`${styles.cardTime}`}>
          <i className="fa-solid fa-clock pr-2 py-1"></i>
          {localStart} —
          <br />
          {localEnd}
        </h6>
        <div className="register-button">
          {/* Show registration button for users if not a past event */}
          {!props.isPastEvent ? (
            <EventRegisterButton
              isRegistered={props.isRegistered}
              isFull={props.isFull}
              isWaitlisted={props.isWaitlisted}
              isDisabled={isQuerying}
              handleRegister={(e) => handleButtonClick(e, handleRegistration)}
              handleCancelRegistration={(e) =>
                handleButtonClick(e, handleCancelRegistration)
              }
              handleCancelWaitlist={(e) =>
                handleButtonClick(e, handleCancelWaitlist)
              }
            />
          ) : (
            <Button variant="secondary" disabled>
              Passed
            </Button>
          )}
        </div>
      </div>
    { /* Show modals for event CRUD if card buttons are pressed */}
      {showEditEvent && props.isAdmin && (
        <div className="edit-event-modal" onClick={(e) => stopPropagation(e)}>
          <EditEvent
            isShown={showEditEvent}
            handleClose={(e) => {
              e.stopPropagation();
              setShowEditEvent(false);
            }}
            event_id={props.id}
            eventName={props.name}
            eventDesc={props.desc}
            capacity={props.capacity}
            filled={props.filled}
            location={props.location}
            isDanaEvent={props.isDanaEvent}
            imageLink={props.image}
            start={formattedStart}
            end={formattedEnd}
            isRegistered={props.isRegistered}
            updateEvents={props.updateEvents}
          ></EditEvent>
        </div>
      )}
      {showDeleteEvent && props.isAdmin && (
        <div className="delete-event-modal" onClick={(e) => stopPropagation(e)}>
          <DeleteEvent
            isShown={showDeleteEvent}
            handleClose={(e) => {
              e.stopPropagation();
              setShowDeleteEvent(false);
            }}
            event_id={props.id}
            name={props.name}
            fetchEvents={props.fetchEvents}
          ></DeleteEvent>
        </div>
      )}

      {showEmailEvent && props.isAdmin && (
        <div className="email-event-modal" onClick={(e) => stopPropagation(e)}>
          <EmailEventGroup
            isShown={showEmailEvent}
            handleClose={(e) => {
              e.stopPropagation();
              setShowEmailEvent(false);
            }}
            event_id={props.id}
            name={props.name}
            fetchEvents={props.fetchEvents}
          ></EmailEventGroup>
        </div>
      )}
    </div>
  );
}

export default EventCard;
