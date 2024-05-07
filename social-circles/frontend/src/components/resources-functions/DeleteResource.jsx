import { useState } from "react";
import he from 'he';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ToastContainer from "react-bootstrap/ToastContainer";
import AlertToast from "../shared-components/AlertToast";
import styles from "../../css/Modal.module.css";
import toastStyles from "../../css/Toast.module.css";

/* Component to delete a resource via a Modal */
function DeleteResource(props) {
  const [isQuerying, setIsQuerying] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);
  const [alert, setAlert] = useState(null);

  /* Handler method to delete a resource via fetch when 'Submit' is clicked */
  const handleSubmit = async () => {
    setAlert(null);
    try {
      setIsQuerying(true);
      const request = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/delete-resources`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ resource_id: props.resource_id }),
        }
      );

      if (request.ok) { // Fetch successful, resource deleted
        setAlert({
          key: Date.now(),
          type: "success",
          text: `${he.decode(props.dispName)} was successfully deleted.`,
        });
        setTimeout(() => {
          props.fetchResources();
        }, 2000);
        setIsFinalized(true);
      } else { // Could connect to server, but server error
        setAlert({ 
          key: Date.now(),
          type: "danger",
          text: `${he.decode(props.dispName)} could not be deleted.`,
        });
      }
    } catch (error) { // Could not connect to server
      setAlert({
        key: Date.now(),
        type: "danger",
        text: `We could not connect to the server while deleting ${he.decode(props.dispName)}.`,
      });
    } finally {
      setIsQuerying(false);
    }
  }

  return (
    <Modal show={props.isShown} onHide={props.handleClose} backdrop="static">
      <Modal.Header className={`${styles.modalHeader}`}>
        <Modal.Title className={`${styles.modalTitle}`}>
          Delete Resource
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        { /* Display alert if it exists */}
        {alert && (
          <ToastContainer
            className={`p-3 ${toastStyles.toastContainer}`}
            style={{ zIndex: 100 }}
          >
            <AlertToast
              key={alert.id}
              type={alert.type}
              text={alert.text}
              onDismiss={() => setAlert(null)}
            />
          </ToastContainer>
        )}
        <p>
          Are you sure you want to delete the resource{" "}
          <strong>{he.decode(props.dispName)}</strong>? This action will be irreversible.
        </p>
        { /* Buttons for admin actions */}
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

export default DeleteResource;