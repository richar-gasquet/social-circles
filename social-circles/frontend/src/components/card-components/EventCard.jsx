import { useState } from "react";
import Button from "react-bootstrap/Button";
import CardButton from "./CardButton";
import EventRegisterButton from "../user-functions/EventRegisterButton";
import EditEvent from "../event-functions/EditEvent";
import DeleteEvent from "../event-functions/DeleteEvent";
import EmailEventGroup from "../event-functions/EmailEvents";
import styles from "../../css/Card.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function EventCard(props) {
  const formattedStart = new Date(props.start).toISOString().slice(0, 16);
  const formattedEnd = new Date(props.end).toISOString().slice(0, 16);

  const localeOptions = {
    weekday: 'short', 
    year: 'numeric', 
    month: 'short',
    day: 'numeric',  
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit', 
    timeZoneName: 'short'
  };

  const localStart = new Date(props.start).toLocaleString('en-us', localeOptions)
  const localEnd = new Date(props.end).toLocaleString('en-us', localeOptions)

  const [showDeleteEvent, setShowDeleteEvent] = useState(false);
  const [showEditEvent, setShowEditEvent] = useState(false);
  const [showEmailEvent, setShowEmailEvent] = useState(false);

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
          body: JSON.stringify({ event_id: props.id }),
        }
      );
      if (request.ok) {
        const data = await request.json();
        if (data.status === "waitlist") {
          props.addRegistrationAlert(
            "success",
            `You have joined the waitlist for ${props.name}.`
          );
          const updatedCard = {
            isRegistered: false,
            isWaitlisted: true,
            isFull: true,
            filled_spots: props.filled,
          };
          props.updateEvents(props.id, updatedCard);
        } else {
          props.addRegistrationAlert(
            "success",
            `You have registered for ${props.name}.`
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
        const data = await request.json();
        if (data.message === "waitlist_error") {
          props.addRegistrationAlert(
            "danger",
            `We couldn't register you for the wailist for ${props.name}. 
            Try again or contact the administrator.`
          );
        } else {
          props.addRegistrationAlert(
            "danger",
            `We couldn't register you for ${props.name}. 
            Try again or contact the administrator.`
          );
        }
      }
    } catch (error) {
      props.addRegistrationAlert(
        "danger",
        `We couldn't connect to the server. 
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
          body: JSON.stringify({ event_id: props.id }),
        }
      );
      if (request.ok) {
        props.addRegistrationAlert(
          "success",
          `You have cancelled your registration for ${props.name}.`
        );
        props.fetchEvents();
      } else {
        props.addRegistrationAlert(
          "danger",
          `We couldn't cancel your membership for ${props.name}. 
          Try again or contact the administrator`
        );
      }
    } catch (error) {
      props.addRegistrationAlert(
        "danger",
        `We couldn't cancel your membership for ${props.name}. 
        The server is most likely down.`
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
          body: JSON.stringify({ event_id: props.id }),
        }
      );
      if (request.ok) {
        props.addRegistrationAlert(
          "success",
          `You have left the waitlist for ${props.name}.`
        );
        const updatedCard = {
          isRegistered: false,
          isWaitlisted: false,
          isFull: true,
        };
        props.updateEvents(props.id, updatedCard);
      } else {
        props.addRegistrationAlert(
          "danger",
          `We couldn't cancel your waitlist spot for ${props.name}. 
          Try again or contact the administrator`
        );
      }
    } catch (error) {
      props.addRegistrationAlert(
        "danger",
        `We couldn't cancel your waitlist spot for ${props.name}. 
        The server is most likely down.`
      );
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <div className={`card h-100 ${styles.card}`}>
      <div className={styles.cardImgTopContainer}>
        <img
          className={`card-img-top ${styles.cardImgTop}`}
          src={props.image}
          alt="Event"
        />
        {props.isAdmin && (
          <div className={`${styles.cardButtons}`}>
            <CardButton
              className="mb-2"
              action={() => setShowEditEvent(true)}
              message="Edit Event"
              icon="fas fa-edit"
            ></CardButton>
            <CardButton
              className="mb-2"
              action={() => setShowDeleteEvent(true)}
              message="Delete Event"
              icon="fas fa-trash"
            ></CardButton>
            <CardButton
              action={() => setShowEmailEvent(true)}
              message="Email Event Attendees"
              icon="fas fa-envelope"
            ></CardButton>
          </div>
        )}
      </div>
      <div className={`card-body d-flex flex-column`}>
        <h2 className={`card-title ${styles.cardTitle}`}>{props.name}</h2>
        <h5 className={`card-subtitle mb-2 d-flex ${styles.cardSubtitle}`}>
          <i className="fa-solid fa-user pr-2 py-1"></i>
          {props.filled}/{props.capacity} registered
        </h5>
        <h5 className={`card-subtitle mb-2 d-flex ${styles.cardSubtitle}`}>
          <i class="fa-solid fa-location-dot pr-2 py-1"></i>
          {props.location}
        </h5>
        <h6 className={`card-text ${styles.cardText}`}>{props.desc}</h6>
        <h6 className={`${styles.cardTime}`}>
          <i class="fa-solid fa-clock pr-2 py-1"></i>
          {localStart} —
          <br />
          {localEnd}
        </h6>
        <div className={``}>
          {!props.isPastEvent ? (
            <EventRegisterButton
              isRegistered={props.isRegistered}
              isFull={props.isFull}
              isWaitlisted={props.isWaitlisted}
              isDisabled={isQuerying}
              handleRegister={handleRegistration}
              handleCancelRegistration={handleCancelRegistration}
              handleCancelWaitlist={handleCancelWaitlist}
            />
          ) : (
            <Button variant="secondary" disabled>
              Passed
            </Button>
          )}
        </div>
      </div>
      {showEditEvent && props.isAdmin && (
        <EditEvent
          isShown={showEditEvent}
          handleClose={() => setShowEditEvent(false)}
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
      )}
      {showDeleteEvent && props.isAdmin && (
        <DeleteEvent
          isShown={showDeleteEvent}
          handleClose={() => setShowDeleteEvent(false)}
          event_id={props.id}
          name={props.name}
          fetchEvents={props.fetchEvents}
        ></DeleteEvent>
      )}
      {showEmailEvent && props.isAdmin && (
        <EmailEventGroup
          isShown={showEmailEvent}
          handleClose={() => setShowEmailEvent(false)}
          event_id={props.id}
          name={props.name}
          fetchEvents={props.fetchEvents}
        ></EmailEventGroup>
      )}
    </div>
  );
}

export default EventCard;
