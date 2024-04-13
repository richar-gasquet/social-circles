import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import AlertBox from "../shared-components/AlertBox";

function DeleteCommunity(props) {
  const [alert, setAlert] = useState(null);

  const handleSubmit = async () => {
    try {
      const request = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/delete-community`,
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
        setAlert({
          type: "success",
          header: "Deletion successful!",
          text: "The community was successfully deleted.",
        });
        props.fetchCommunities()
      } else {
        setAlert({
          type: "danger",
          header: "Deletion failed!",
          text: "The community could not be deleted.",
        });
      }
    } catch (error) {
      setAlert({
        type: "danger",
        header: "Deletion error!",
        text: "We could not connect to the server while deleting the community.",
      });
    }
  };

  return (
    <Modal show={props.isShown} onHide={props.handleClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>Delete Community</Modal.Title>
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
          Are you sure you want to delete the community{" "}
          <strong>{props.name}</strong>? This action will be irreversible.
        </p>
        <Button variant="secondary" onClick={props.handleClose}>
          Close
        </Button>
        <Button variant="danger" onClick={handleSubmit}>
          Delete
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default DeleteCommunity;
