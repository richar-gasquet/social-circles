import { useState } from "react";
import PropTypes from "prop-types";
import CardButton from "../../admin/CardButton";
import RegisterButton from "../RegisterButton";
import EditCommunity from "./EditCommunity";
import DeleteCommunity from "./DeleteCommunity";
import EmailCommunity from "./EmailCommunity";
import styles from '../Card.module.css';

function CommunityCard(props) {
  const [showDeleteComm, setShowDeleteComm] = useState(false)
  const [showEditComm, setShowEditComm] = useState(false)
  const [showEmail, setShowEmail] = useState(false)

  const handleShowDeleteComm = () => setShowDeleteComm(true)
  const handleCloseDeleteComm = () => {
    setShowDeleteComm(false)
    props.fetchCommunities()
  }
  
  const handleShowEditComm = () => setShowEditComm(true)
  const handleCloseEditComm = () => {
    setShowEditComm(false)
    props.fetchCommunities()
  }

  const handleShowEmail = () => setShowEmail(true)
  const handleCloseEmail = () => {
    setShowEmail(false)
    props.fetchCommunities()
  }

  const handleRegistration = async () => {
    try {
      const request = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/add-community-registration`, {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({group_id : props.group_id})
        }
      );
      if (request.ok) {
        props.addAlert("success", "Registration successful!", `You have registered for ${props.name}.`);
        props.updateCommunities(props.group_id, true);
      } else {
        props.addAlert("danger", "Registration failed!", `We couldn't register you for ${props.name}.`);
      }
    } catch (error) {
      props.addAlert("danger", "Registration error!", `An error occurred while registering for ${props.name}.`);
    }
  }

  const handleCancelRegistration = async () => {
    try {
      const request = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/delete-community-registration`, {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({group_id : props.group_id})
        }
      )
      if (request.ok) {
        props.addAlert("success", "Cancellation successful!", `You have canceled your registration for ${props.name}.`);
        props.updateCommunities(props.group_id, false);
      } else {
        props.addAlert("danger", "Cancellation failed!", `We couldn't cancel your registration for ${props.name}.`);
      }
    } catch (error) {
      props.addAlert("danger", "Cancellation error!", `An error occurred while canceling your registration for ${props.name}.`);
    }
  }

  return (
    <>
      <div className={`card h-100 ${styles.card}`}>
        <div className={styles.cardImgTopContainer}>
          <img className={`card-img-top ${styles.cardImgTop}`} src={props.image} alt="Community" />
          {props.isAdmin && (
            <div className={`${styles.cardButtons}`}>
              <CardButton className="mb-2"
                action={handleShowEditComm}
                message="Edit Community"
                icon="fas fa-edit">
              </CardButton>              
              <CardButton className={`mb-2`}
                action={handleShowDeleteComm}
                message="Delete Community"
                icon="fas fa-trash">
              </CardButton>
              <CardButton 
                action={handleShowEmail}
                message="Email this Community"
                icon="fas fa-envelope">
              </CardButton>
            </div>
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
          <div className={``}>
            <RegisterButton
              isRegistered={props.isRegistered}
              handleRegister={handleRegistration}
              handleCancel={handleCancelRegistration}>
            </RegisterButton>
          </div>
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
      {showEditComm && props.isAdmin && (
        <EditCommunity
          isShown={showEditComm}
          handleClose={handleCloseEditComm}
          group_id={props.group_id}
          groupName={props.name}
          groupDesc={props.desc}
          imageLink={props.image}>
        </EditCommunity>
      )}
      {showEmail && props.isAdmin && (
      <EmailCommunity
        isShown={showEmail}
        handleClose={handleCloseEmail}
        group_id={props.group_id}
        groupName={props.name}>
      </EmailCommunity>
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
