import PropTypes from "prop-types";
import styles from './Card.module.css';

function EventCard(props) {
  const formattedStart = new Date(props.start).toLocaleString();
  const formattedEnd = new Date(props.end).toLocaleString();

  return (
    <div className={`card h-100 ${styles.card}`}>
      <img className={`card-img-top ${styles.cardImgTop}`} src={props.image} alt="Event" />
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
