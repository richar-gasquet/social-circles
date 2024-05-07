import { useState } from "react";
import { useNavigate } from "react-router";
import he from "he";
import CardButton from "./CardButton";
import CommunityRegisterButton from "../user-functions/CommunityRegisterButton";
import EditCommunity from "../community-functions/EditCommunity";
import DeleteCommunity from "../community-functions/DeleteCommunity";
import EmailCommunity from "../community-functions/EmailCommunity";
import styles from "../../css/Card.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

/* Card containing details about a community */
function CommunityCard(props) {
  const [showDeleteComm, setShowDeleteComm] = useState(false);
  const [showEditComm, setShowEditComm] = useState(false);
  const [showEmailComm, setShowEmailComm] = useState(false);

  const [isQuerying, setIsQuerying] = useState(false);

  /* Handler method for registering a user to a commmunity */
  const handleRegistration = async () => {
    try {
      setIsQuerying(true);
      const request = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/add-community-registration`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ group_id: props.group_id }),
        }
      );
      if (request.ok) { // Successful fetch and registration
        props.addRegistrationAlert(
          "success",
          `You have joined ${he.decode(props.name)}.`
        );
        const updatedCard = { isRegistered: true, count: props.count + 1 };
        props.updateCommunities(props.group_id, updatedCard);
      } else { // Could connect to server, but server error
        props.addRegistrationAlert(
          "danger",
          `We couldn't let you join ${he.decode(props.name)}. 
          Try again or contact the administrator.`
        );
      }
    } catch (error) { // Could not connect to server
      props.addRegistrationAlert(
        "danger",
        `We couldn't let you join ${he.decode(props.name)}. 
        The server is most likely down.`
      );
    } finally {
      setIsQuerying(false);
    }
  };

  /* Handler method for cancelling a user's registration to a commmunity */
  const handleCancelRegistration = async () => {
    try {
      setIsQuerying(true);
      const request = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/delete-community-registration`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ group_id: props.group_id }),
        }
      );
      if (request.ok) { // Successful fetch and cancellation of registration
        props.addRegistrationAlert(
          "success",
          `You have left ${he.decode(props.name)}.`
        );
        const updatedCard = { isRegistered: false, count: props.count - 1 };
        props.updateCommunities(props.group_id, updatedCard);
      } else { // Could connect to server, but server error
        props.addRegistrationAlert(
          "danger",
          `We couldn't cancel your membership for ${he.decode(props.name)}. 
          Try again or contact the administrator`
        );
      }
    } catch (error) { // Could not connect to server
      props.addRegistrationAlert(
        "danger",
        `We couldn't cancel your membership for ${he.decode(props.name)}. 
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
      !e.target.closest(".edit-community-modal") &&
      !e.target.closest(".delete-community-modal") &&
      !e.target.closest(".email-community-modal") &&
      !e.target.closest(".register-button")
    ) {
      navigate(`/communities/${props.group_id}`);
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
    <>
      <div
        className={`card h-100 ${styles.card}`}
        onClick={(e) => handleCardClick(e)}
      >
        <div className={styles.cardImgTopContainer}>
          <img
            className={`card-img-top ${styles.cardImgTop}`}
            src={props.image}
            alt="Community"
          />
          {/* Show card buttons if the user is an admin */}
          {props.isAdmin && (
            <div className={`${styles.cardButtons}`}>
              <CardButton
                className="mb-2"
                action={(e) => {
                  e.stopPropagation();
                  setShowEditComm(true);
                }}
                message="Edit Community"
                icon="fas fa-edit"
              ></CardButton>
              <CardButton
                className={`mb-2`}
                action={(e) => {
                  e.stopPropagation();
                  setShowDeleteComm(true);
                }}
                message="Delete Community"
                icon="fas fa-trash"
              ></CardButton>
              <CardButton
                action={(e) => {
                  e.stopPropagation();
                  setShowEmailComm(true);
                }}
                message="Email Community"
                icon="fas fa-envelope"
              ></CardButton>
            </div>
          )}
        </div>
        {/* Display details about the community */}
        <div className={`card-body d-flex flex-column`}>
          <h2 className={`card-title ${styles.cardTitle}`}>
            {he.decode(props.name)}
          </h2>
          <h4 className={`card-subtitle mb-2 d-flex ${styles.cardSubtitle}`}>
            <i className="fa-solid fa-user pr-2 py-1"></i>
            {props.count} members
          </h4>
          <h6 className={`card-text ${styles.cardText}`}>
            {he.decode(props.desc)}
          </h6>
          <div>
            {/* Show registration button for users */}
            <CommunityRegisterButton
              isRegistered={props.isRegistered}
              isDisabled={isQuerying}
              handleRegister={(e) => handleButtonClick(e, handleRegistration)}
              handleCancelRegistration={(e) =>
                handleButtonClick(e, handleCancelRegistration)
              }
            />
          </div>
        </div>
      </div>
      {/* Show modals for community CRUD if card buttons are pressed */}
      {showEditComm && props.isAdmin && (
        <div
          className="edit-community-modal"
          onClick={(e) => stopPropagation(e)}
        >
          <EditCommunity
            isShown={showEditComm}
            handleClose={(e) => {
              e.stopPropagation();
              setShowEditComm(false);
            }}
            group_id={props.group_id}
            name={props.name}
            desc={props.desc}
            image={props.image}
            isRegistered={props.isRegistered}
            updateCommunities={props.updateCommunities}
          />
        </div>
      )}
      {showDeleteComm && props.isAdmin && (
        <div
          className="delete-community-modal"
          onClick={(e) => stopPropagation(e)}
        >
          <DeleteCommunity
            isShown={showDeleteComm}
            handleClose={(e) => {
              e.stopPropagation();
              setShowDeleteComm(false);
            }}
            group_id={props.group_id}
            name={props.name}
            fetchCommunities={props.fetchCommunities}
          />
        </div>
      )}
      {showEmailComm && props.isAdmin && (
        <div
          className="email-community-modal"
          onClick={(e) => stopPropagation(e)}
        >
          <EmailCommunity
            isShown={showEmailComm}
            handleClose={(e) => {
              e.stopPropagation();
              setShowEmailComm(false);
            }}
            group_id={props.group_id}
            name={props.name}
          />
        </div>
      )}
    </>
  );
}

export default CommunityCard;
