import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";

function DeleteEvent(props) {
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        setSuccessAlert(true);
        setErrorAlert(false);
      } else {
        setSuccessAlert(false);
        setErrorAlert(true);
      }
    } catch (error) {
      setSuccessAlert(false);
      setErrorAlert(true);
    }
  }

  return (
    <Modal show={props.isShown} onHide={props.handleClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>Delete Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {successAlert && (
          <Alert variant="success">
            Success! The event was successfully deleted!
          </Alert>
        )}
        {errorAlert && (
          <Alert variant="danger">
            Error! The event could not be deleted. Try again or contact
            technical support.
          </Alert>
        )}
        <p>
          Are you sure you want to delete the event{" "}
          <strong>{props.name}</strong>? This action will be irreversible.
        </p>
        <Button variant="secondary" onClick={props.handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleSubmit}>
          Delete
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default DeleteEvent;