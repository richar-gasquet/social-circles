import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function DeleteCommunity(props) {
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
        console.log("Event deleted successfully")
      } else {
        console.error("Failed to delete event.")
      }
    } catch (error) {
        console.error("Could not connect to backend:", error);
    }
    props.handleClose()
  };

  return (
    <Modal show={props.isShown} onHide={props.handleClose} backdrop="static">
        <Modal.Header>
            <Modal.Title>Delete Community</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
  )

}

export default DeleteCommunity;
