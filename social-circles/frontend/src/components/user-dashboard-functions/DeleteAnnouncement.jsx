import { useState } from "react";
import he from 'he';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ToastContainer from "react-bootstrap/ToastContainer";
import AlertToast from "../shared-components/AlertToast";
import styles from "../../css/Modal.module.css";
import toastStyles from "../../css/Toast.module.css";

/* Component to delete an announcement via a Modal */
function DeleteAnnouncement(props) {
  const [isQuerying, setIsQuerying] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);
  const [alert, setAlert] = useState(null);

  /* Handler method to delete an announcement via fetch when 'Submit' is clicked */
  const handleSubmit = async () => {
    setAlert(null);

    try {
      setIsQuerying(true);
      const request = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/delete-announcement`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ announcement_id: props.announcement_id }),
        }
      );

      if (request.ok) {  // Fetch successful, announcement deleted
        setAlert({
          key: Date.now(),
          type: "success",
          text: `${he.decode(props.announcement_name)} was successfully deleted.`,
        });
        setTimeout(() => {
          props.fetchAnnouncements();
        }, 2000);
        setIsFinalized(true);
      } else { // Could connect to server, but server error
        setAlert({
          key: Date.now(),
          type: "danger",
          text: `${he.decode(props.announcement_name)} could not be deleted.`,
        });
      }
    } catch (error) { // Could not connect to server
      setAlert({
        key: Date.now(),
        type: "danger",
        text: `We could not connect to the server while deleting ${he.decode(props.announcement_name)}.`,
      });
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <Modal show={props.isShown} onHide={props.handleClose} backdrop="static">
      <Modal.Header className={`${styles.modalHeader}`}>
        <Modal.Title className={`${styles.modalTitle}`}>
          Delete Announcement
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
          Are you sure you want to delete the announcement{" "}
          <strong>{he.decode(props.announcement_name)}</strong>? This action will be irreversible.
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

export default DeleteAnnouncement;
