import { useState } from 'react'
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert"

function DeleteCommunity(props) {
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const request = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/delete-community`,
        {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({group_id : props.group_id})
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
            <Modal.Title>Delete Community</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {successAlert && (
            <Alert variant="success">
              Success! The community was successfully deleted!
            </Alert>
          )}
          {errorAlert && (
            <Alert variant="danger">
              Error! The community could not be deleted. Try again or 
              contact technical support. 
            </Alert>
          )}
            <p>
                Are you sure you want to delete the community <strong>{props.name}</strong>? 
                This action will be irreversible.
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

export default DeleteCommunity;
