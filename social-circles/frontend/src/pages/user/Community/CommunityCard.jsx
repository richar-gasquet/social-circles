import PropTypes from "prop-types";
import styles from '../Card.module.css';

function CommunityCard(props) {
  return (
    <div className={`card h-100 ${styles.card}`}>
      <img className={`card-img-top ${styles.cardImgTop}`} src={props.image} alt="Event" />
      <div className={`card-body d-flex flex-column`}>
        <h2 className={`card-title ${styles.cardTitle}`}>
          {props.name}
        </h2>
        <h4 className={`card-subtitle mb-2 ${styles.cardSubtitle}`}>
          {props.count} members
        </h4>
        <h6 className={`card-text ${styles.cardText}`}>
          {props.desc}
        </h6>
      </div>
    </div>
  );
}

CommunityCard.propTypes = {
  name: PropTypes.string,
  desc: PropTypes.string,
  count: PropTypes.number,
  image: PropTypes.string
};

CommunityCard.defaultProps = {
  name: "No Community Name",
  desc: "No Community Description", 
  count: 0,
  image: "https://via.placeholder.com/200"
};

export default CommunityCard;
