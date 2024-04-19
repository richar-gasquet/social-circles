import { useState } from 'react';
import PropTypes from "prop-types";
import CardButton from './CardButton';
import RegisterButton from '../user-functions/RegisterButton';
import EditEvent from '../event-functions/EditEvent';
import DeleteEvent from '../event-functions/DeleteEvent';
import styles from '../../css/Card.module.css'; 

function EventCard(props) {
  const formattedStart = new Date(props.start).toLocaleString();
  const formattedEnd = new Date(props.end).toLocaleString();
  const [showDeleteEvent, setShowDeleteEvent] = useState(false);
  const [showEditEvent, setShowEditEvent] = useState(false);

  const handleRegistration = async () => {
    try {
      const request = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/add-event-registration`, {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({event_id : props.id})
        }
      );
      if (request.ok) {
        props.addRegistrationAlert("success", "Registration successful!", 
                      `You have registered for ${props.name}.`);
                      props.updateEvents(props.id, true, props.filled + 1);
      } else {
        props.addRegistrationAlert("danger", "Registration failed!", 
                      `We couldn't register you for ${props.name}.`);
      }
    } catch (error) {
      props.addRegistrationAlert("danger", "Registration error!", 
                    `We could not connect to the server while registering you for ${props.name}.`);
    }
  }

  const handleCancelRegistration = async () => {
    try {
      const request = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/delete-event-registration`, {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({event_id : props.id})
        }
      )
      if (request.ok) {
        props.addRegistrationAlert("success", "Cancellation successful!", 
                      `You have canceled your registration for ${props.name}.`);
        props.updateEvents(props.id, false, props.filled - 1);
      } else {
        props.addRegistrationAlert("danger", "Cancellation failed!", 
                      `We couldn't cancel your registration for ${props.name}.`);
      }
    } catch (error) {
      props.addRegistrationAlert("danger", "Cancellation error!", 
                    `We could not connect to the server while cancelling your registration for ${props.name}.`);
    }
  }

  return (
    <div className={`card h-100 ${styles.card}`}>
      <div className={styles.cardImgTopContainer}>
      <img className={`card-img-top ${styles.cardImgTop}`} src={props.image} alt="Event" />
      {props.isAdmin && (
        <div className={`${styles.cardButtons}`}>
          <CardButton
            className="mb-2"
            action={() => setShowEditEvent(true)}
            message="Edit Event"
            icon="fas fa-edit"
          ></CardButton>
          <CardButton
            action={() => setShowDeleteEvent(true)}
            message="Delete Event"
            icon="fas fa-trash"
          ></CardButton>
        </div>
      )}
      </div>
      <div className={`card-body d-flex flex-column`}>
        <h2 className={`card-title ${styles.cardTitle}`}>
          {props.name}
        </h2>
        <h4 className={`card-subtitle mb-2 ${styles.cardSubtitle}`}>
          {props.filled}/{props.capacity} registered
        </h4>
        <h6 className={`card-text ${styles.cardText}`}>
          {props.desc}
        </h6>
        <h6 className={`${styles.cardTime}`}>
          <strong>Start: </strong>{formattedStart}<br />
          <strong>End: </strong>{formattedEnd}
        </h6>
        <div className={``}>
            <RegisterButton
              isRegistered={props.isRegistered}
              handleRegister={handleRegistration}
              handleCancel={handleCancelRegistration}>
            </RegisterButton>
          </div>
      </div>

      {showDeleteEvent && props.isAdmin && (
        <DeleteEvent
          isShown={showDeleteEvent}
          handleClose={() => setShowDeleteEvent(false)}
          event_id={props.id}
          name={props.name}
          fetchEvents={props.fetchAllEvents}
        ></DeleteEvent>
      )}

      {showEditEvent && props.isAdmin && (
        <EditEvent
          isShown={showEditEvent}
          handleClose={() => setShowEditEvent(false)}
          event_id={props.id}
          eventName={props.name}
          eventDesc={props.desc}
          imageLink={props.image}
          capacity={props.capacity}
          filled={props.filled}
          start={formattedStart}
          end={formattedEnd}
          isRegistered={props.isRegistered}
          fetchEvents={props.fetchAllEvents}
        ></EditEvent>
      )}
    </div>
  );
}

EventCard.propTypes = {
  name: PropTypes.string,
  desc: PropTypes.string,
  start: PropTypes.string,
  end: PropTypes.string,
  capacity: PropTypes.number,
  filled: PropTypes.number,
  image: PropTypes.string
};

EventCard.defaultProps = {
  name: "No Event Name",
  desc: "No Event Description",
  start: "N/A",
  end: "N/A",
  capacity: 0,
  filled: 0,
  image: "https://via.placeholder.com/200"
};

export default EventCard;
