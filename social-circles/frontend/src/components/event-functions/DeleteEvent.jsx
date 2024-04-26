import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import AlertBox from "../shared-components/AlertBox";
import styles from "../../css/Modal.module.css";

function DeleteEvent(props) {
  const [isQuerying, setIsQuerying] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async () => {
    setIsQuerying(true);
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
          text: `${props.name} was successfully deleted.`,
        });
        setTimeout(() => {
          props.fetchEvents();
        }, 1500);
      } else {
        setAlert({
          type: "danger",
          header: "Deletion failed!",
          text: `${props.name} could not be deleted.`,
        });
      }
    } catch (error) {
      setAlert({
        type: "danger",
        header: "Deletion error!",
        text: `We could not connect to the server while deleting ${props.name}.`,
      });
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <Modal show={props.isShown} onHide={props.handleClose} backdrop="static">
      <Modal.Header className={`${styles.modalHeader}`}>
        <Modal.Title className={`${styles.modalTitle}`}>
          Delete Event
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alert && (
          <AlertBox
            type={alert.type}
            header={alert.header}
            text={alert.text}
            handleClose={() => setAlert(null)}
          ></AlertBox>
        )}

        <p>
          Are you sure you want to delete the event{" "}
          <strong>{props.name}</strong>? This action will be irreversible.
        </p>
        <Button
          variant="secondary"
          className={`${styles.modalBtn}`}
          onClick={props.handleClose}
        >
          Close
        </Button>
        <Button
          variant="danger"
          className={`${styles.modalBtn} ${styles.modalSubmit}`}
          onClick={handleSubmit}
          disabled={isQuerying}
        >
          Delete
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default DeleteEvent;
