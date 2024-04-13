import { useState } from 'react';
import PropTypes from "prop-types";
import CardButton from './CardButton';
import EditEvent from '../event-functions/EditEvent';
import DeleteEvent from '../event-functions/DeleteEvent';
import styles from '../../css/Card.module.css'; 

function EventCard(props) {
  const formattedStart = new Date(props.start).toLocaleString();
  const formattedEnd = new Date(props.end).toLocaleString();
  const [showDeleteEvent, setShowDeleteEvent] = useState(false);
  const [showEditEvent, setShowEditEvent] = useState(false);
  const [show, setShow] = useState(false);

  const handleShowDeleteEvent = () => setShowDeleteEvent(true);
  const handleCloseDeleteEvent = () => {
    setShowDeleteEvent(false);
    props.fetchAllEvents();
  };

  const handleShowEditEvent = () => setShowEditEvent(true);
  const handleCloseEditEvent = () => {
    setShowEditEvent(false);
    props.fetchAllEvents();
  };

  function toggleShow() {
    setShow(!show);
  }

  return (
    <div className={`card h-100 ${styles.card}`}>
      <img className={`card-img-top ${styles.cardImgTop}`} src={props.image} alt="Event" />
      {props.isAdmin && (
        <div className={`${styles.cardButtons}`}>
          <CardButton
            className="mb-2"
            action={handleShowEditEvent}
            message="Edit Event"
            icon="fas fa-edit"
          ></CardButton>
          <CardButton
            action={handleShowDeleteEvent}
            message="Delete Event"
            icon="fas fa-trash"
          ></CardButton>
        </div>
      )}
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
      </div>

      {showDeleteEvent && props.isAdmin && (
        <DeleteEvent
          isShown={showDeleteEvent}
          handleClose={handleCloseDeleteEvent}
          event_id={props.id}
          name={props.name}
        ></DeleteEvent>
      )}

      {showEditEvent && props.isAdmin && (
        <EditEvent
          isShown={showEditEvent}
          handleClose={handleCloseEditEvent}
          event_id={props.id}
          eventName={props.name}
          eventDesc={props.desc}
          imageLink={props.image}
          capacity={props.capacity}
          filled={props.filled}
          start={formattedStart}
          end={formattedEnd}
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
