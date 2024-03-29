import PropTypes from 'prop-types'

function EventCard(props) {
    return(
        <div className="event-card">
            <img className="event-image" src="https://via.placeholder.com/200"></img>
            <h2 className="event-title">{props.name}</h2>
            <p className="event-text">Date and Time: {props.date_and_time} </p>
            <p className="event-text">
                {props.filled_spots} out of {props.capacity} have already registered
            </p>
        </div>
    );
}

EventCard.propTypes = {
    name: PropTypes.string,
    date_and_time: PropTypes.string,
    capacity: PropTypes.number,
    filled_spots: PropTypes.number,
}

EventCard.defaultProps = {
    name: "No title",
    date_and_time: "N/A",
    capacity: "N/A",
    filled_spots: "N/A",
}

export default EventCard
