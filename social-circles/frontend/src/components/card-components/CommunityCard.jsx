import { useState } from "react";
import CardButton from "./CardButton";
import CommunityRegisterButton from "../user-functions/CommunityRegisterButton";
import EditCommunity from "../community-functions/EditCommunity";
import DeleteCommunity from "../community-functions/DeleteCommunity";
import EmailCommunity from "../community-functions/EmailCommunity";
import styles from "../../css/Card.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function CommunityCard(props) {
  const [showDeleteComm, setShowDeleteComm] = useState(false);
  const [showEditComm, setShowEditComm] = useState(false);
  const [showEmailComm, setShowEmailComm] = useState(false);

  const [isQuerying, setIsQuerying] = useState(false);

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
      if (request.ok) {
        props.addRegistrationAlert(
          "success",
          `You have joined ${props.name}.`
        );
        const updatedCard = {isRegistered : true, count: props.count + 1}
        props.updateCommunities(props.group_id, updatedCard);
      } else {
        props.addRegistrationAlert(
          "danger",
          `We couldn't register you for ${props.name}. 
          Try again or contact the administrator.`
        );
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
      if (request.ok) {
        props.addRegistrationAlert(
          "success",
          `You have left ${props.name}.`
        );
        const updatedCard = {isRegistered : false, count: props.count - 1}
        props.updateCommunities(props.group_id, updatedCard);
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

  // const handleCardClick = (e) => {
  //   if (!e.target.closest('.edit-community-modal') && !e.target.closest('.delete-community-modal')
  //             && !e.target.closest('.email-community-modal') && !e.target.closest('.register-button')) {
  //     window.open(`/community/${props.id}`, "_blank");
  //   }
  // };

  // const handleButtonClick = (e, action) => {
  //   e.stopPropagation();
  //   action();
  // };

  // const stopPropagation = (e) => {
  //   e.stopPropagation();
  // };

  return (
    <>
      <div className={`card h-100 ${styles.card}`}>
        <div className={styles.cardImgTopContainer}>
          <img
            className={`card-img-top ${styles.cardImgTop}`}
            src={props.image}
            alt="Community"
          />
          {props.isAdmin && (
            <div className={`${styles.cardButtons}`}>
              <CardButton
                className="mb-2"
                action={() => setShowEditComm(true)}
                // action={(e) => { e.stopPropagation(); setShowEditComm(true); }}
                message="Edit Community"
                icon="fas fa-edit"
              ></CardButton>
              <CardButton
                className={`mb-2`}
                action={() => setShowDeleteComm(true)}
                // action={(e) => { e.stopPropagation(); setShowDeleteComm(true); }}
                message="Delete Community"
                icon="fas fa-trash"
              ></CardButton>
              <CardButton
              action={() => setShowEmailComm(true)}
              // action={(e) => { e.stopPropagation(); setShowEmailComm(true); }}
              message="Email Community"
                icon="fas fa-envelope"
              ></CardButton>
            </div>
          )}
        </div>
        <div className={`card-body d-flex flex-column`}>
          <h2 className={`card-title ${styles.cardTitle}`}>{props.name}</h2>
          <h4 className={`card-subtitle mb-2 d-flex ${styles.cardSubtitle}`}>
            <i className="fa-solid fa-user pr-2 py-1"></i>
            {props.count} members
          </h4>
          <h6 className={`card-text ${styles.cardText}`}>{props.desc}</h6>
          <div className={``}>
            <CommunityRegisterButton
              isRegistered={props.isRegistered}
              isDisabled={isQuerying}
              handleRegister={handleRegistration}
              handleCancelRegistration={handleCancelRegistration}
            />
          </div>
        </div>
      </div>
      {showEditComm && props.isAdmin && (
        // <div className="edit-community-modal" onClick={stopPropagation}>
        <EditCommunity
          isShown={showEditComm}
          handleClose={() => setShowEditComm(false)}
          // handleClose={(e) => { e.stopPropagation(); setShowEditComm(false); }}
          group_id={props.group_id}
          name={props.name}
          desc={props.desc}
          image={props.image}
          isRegistered={props.isRegistered}
          updateCommunities={props.updateCommunities}
        />
        // </div>

      )}
      {showDeleteComm && props.isAdmin && (
        // <div className="delete-community-modal" onClick={stopPropagation}>
        <DeleteCommunity
          isShown={showDeleteComm}
          handleClose={() => setShowDeleteComm(false)}
          // handleClose={(e) => { e.stopPropagation(); setShowDeleteComm(false); }}
          group_id={props.group_id}
          name={props.name}
          fetchCommunities={props.fetchCommunities}
        />
        // </div>
      )}
      {showEmailComm && props.isAdmin && (
        // <div className="email-community-modal" onClick={stopPropagation}>
        <EmailCommunity
          isShown={showEmailComm}
          handleClose={() => setShowEmailComm(false)}
          // handleClose={(e) => { e.stopPropagation(); setShowEmailComm(false); }}
          group_id={props.group_id}
          groupName={props.name}
        />
        // </div>
      )}
    </>
  );
}


export default CommunityCard;
