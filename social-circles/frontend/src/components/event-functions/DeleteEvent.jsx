import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ToastContainer from "react-bootstrap/ToastContainer";
import RegistrationToast from "../shared-components/RegistrationToast";
import styles from "../../css/Modal.module.css";
import toastStyles from "../../css/Toast.module.css";

function DeleteEvent(props) {
  const [isQuerying, setIsQuerying] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async () => {
    try {
      setIsQuerying(true);
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
          text: `${props.name} was successfully deleted.`,
        });
        setTimeout(() => {
          props.fetchEvents();
        }, 3000);
        setIsFinalized(true);
      } else {
        setAlert({
          type: "danger",
          text: `${props.name} could not be deleted.`,
        });
      }
    } catch (error) {
      setAlert({
        type: "danger",
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
          <ToastContainer
            className={`p-3 ${toastStyles.toastContainer}`}
            style={{ zIndex: 100 }}
          >
            <RegistrationToast
              key={alert.id}
              type={alert.type}
              text={alert.text}
              onDismiss={() => setAlert(null)}
            />
          </ToastContainer>
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
          disabled={isQuerying || isFinalized}
        >
          Delete
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default DeleteEvent;
