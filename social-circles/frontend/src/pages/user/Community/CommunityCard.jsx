import { useState } from "react";
import PropTypes from "prop-types";
import CardButton from "../../admin/CardButton";
import DeleteCommunity from "./DeleteCommunity";
import styles from '../Card.module.css';

function CommunityCard(props) {
  const [showDeleteComm, setShowDeleteComm] = useState(false)

  const handleShowDeleteComm = () => setShowDeleteComm(true)
  const handleCloseDeleteComm = () => {
    setShowDeleteComm(false)
    props.fetchAllCommunities()
  }

  return (
    <>
      <div className={`card h-100 ${styles.card}`}>
        <div className={styles.cardImgTopContainer}>
          <img className={`card-img-top ${styles.cardImgTop}`} src={props.image} alt="Community" />
          {props.isAdmin && (
            <CardButton className={styles.deleteButton}
              action={handleShowDeleteComm}>
            </CardButton>
          )}
        </div>
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
      {showDeleteComm && props.isAdmin && (
        <DeleteCommunity
          isShown={showDeleteComm}
          handleClose={handleCloseDeleteComm}
          group_id={props.group_id}
          name={props.name}>
        </DeleteCommunity>
      )}
    </>
  );
}

CommunityCard.propTypes = {
  group_id: PropTypes.number,
  name: PropTypes.string,
  desc: PropTypes.string,
  count: PropTypes.number,
  image: PropTypes.string,
  isAdmin: PropTypes.bool
};

CommunityCard.defaultProps = {
  group_id: 0,
  name: "No Community Name",
  desc: "No Community Description", 
  count: 0,
  image: "https://via.placeholder.com/200",
  isAdmin: false
};

export default CommunityCard;
