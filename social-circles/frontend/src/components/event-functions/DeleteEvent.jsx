import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import AlertBox from "../shared-components/AlertBox";
import styles from '../../css/Modal.module.css';

function DeleteEvent(props) {
  // const [successAlert, setSuccessAlert] = useState(false);
  // const [errorAlert, setErrorAlert] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    // e.preventDefault();
    try {
      const request = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/delete-event`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ event_id: props.event_id }),
        }
      );

      if (request.ok) {
        setAlert({
          type: "success",
          header: "Deletion successful!",
          text: "The event was successfully deleted.",
        });
        setTimeout(() => {
          props.fetchEvents()
        }, 1500)
      } else {
        setAlert({
          type: "danger",
          header: "Deletion failed!",
          text: "The event could not be deleted.",
        });
      }
    } catch (error) {
      setAlert({
        type: "danger",
        header: "Deletion error!",
        text: "We could not connect to the server while deleting the event.",
      });
    }
  }

  return (
    <Modal show={props.isShown} onHide={props.handleClose} backdrop="static">
      <Modal.Header className={`${styles.modalHeader}`}>
        <Modal.Title className={`${styles.modalTitle}`}>Delete Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alert && (
          <AlertBox
            type={alert.type}
            header={alert.header}
            text={alert.text}
            wantTimer={false}
            handleClose={() => setAlert(null)}
          ></AlertBox>
        )}
        {/* {errorAlert && (
          <Alert variant="danger">
            Error! The event could not be deleted. Try again or contact
            technical support.
          </Alert>
        )} */}
        <p>
          Are you sure you want to delete the event{" "}
          <strong>{props.name}</strong>? This action will be irreversible.
        </p>
        <Button variant="secondary" className={`${styles.modalBtn}`} onClick={props.handleClose}>
          Close
        </Button>
        <Button variant="danger" className={`${styles.modalBtn} ${styles.modalSubmit}`} onClick={handleSubmit}>
          Delete
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default DeleteEvent;