import { useState } from "react";
import PropTypes from "prop-types";
import CardButton from "./CardButton";
import RegisterButton from "../user-functions/RegisterButton";
import EditCommunity from "../community-functions/EditCommunity";
import DeleteCommunity from "../community-functions/DeleteCommunity";
import EmailCommunity from "../community-functions/EmailCommunity";
import styles from '../../css/Card.module.css';

function CommunityCard(props) {
  const [showDeleteComm, setShowDeleteComm] = useState(false)
  const [showEditComm, setShowEditComm] = useState(false)
  const [showEmailComm, setShowEmailComm] = useState(false)

  const handleRegistration = async () => {
    try {
      const request = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/add-community-registration`, {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({group_id : props.group_id})
        }
      );
      if (request.ok) {
        props.addRegistrationAlert("success", "Registration successful!", 
                      `You have registered for ${props.name}.`);
        props.updateCommunities('register', props.group_id, {
          isRegistered: true,
          count: props.count + 1
        });
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
        `${import.meta.env.VITE_BACKEND_URL}/api/delete-community-registration`, {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({group_id : props.group_id})
        }
      )
      if (request.ok) {
        props.addRegistrationAlert("success", "Cancellation successful!", 
                      `You have canceled your registration for ${props.name}.`);
        props.updateCommunities('register', props.group_id, {
          isRegistered: false,
          count: props.count - 1
        });
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
    <>
      <div className={`card h-100 ${styles.card}`}>
        <div className={styles.cardImgTopContainer}>
          <img className={`card-img-top ${styles.cardImgTop}`} src={props.image} alt="Community" />
          {props.isAdmin && (
            <div className={`${styles.cardButtons}`}>
              <CardButton className="mb-2"
                action={() => setShowEditComm(true)}
                message="Edit Community"
                icon="fas fa-edit">
              </CardButton>              
              <CardButton className={`mb-2`}
                action={() => setShowDeleteComm(true)}
                message="Delete Community"
                icon="fas fa-trash">
              </CardButton>
              <CardButton 
                action={() => setShowEmailComm(true)}
                message="Email Community"
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
      {showEditComm && props.isAdmin && (
        <EditCommunity
          isShown={showEditComm}
          handleClose={() => setShowEditComm(false)}
          group_id={props.group_id}
          groupName={props.name}
          groupDesc={props.desc}
          imageLink={props.image}
          isRegistered={props.isRegistered}
          updateCommunities={props.updateCommunities}>
        </EditCommunity>
      )}
      {showDeleteComm && props.isAdmin && (
        <DeleteCommunity
          isShown={showDeleteComm}
          handleClose={() => setShowDeleteComm(false)}
          group_id={props.group_id}
          name={props.name}
          updateCommunities={props.updateCommunities}>
        </DeleteCommunity>
      )}
      {showEmailComm && props.isAdmin && (
      <EmailCommunity
        isShown={showEmailComm}
        handleClose={() => setShowEmailComm(false)}
        group_id={props.group_id}
        groupName={props.name}
        updateCommunities={props.updateCommunities}>
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
