import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

function AddCommunity(props) {
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [emptyAlert, setEmptyAlert] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName && !groupDesc && !imageLink) {
      setEmptyAlert(true); 
      return; 
    }

    const communityData = {
      group_name: groupName,
      group_desc: groupDesc,
      image_link: imageLink,
    };
    try {
      const request = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/add-community`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(communityData),
        }
      );
      if (request.ok) {
        setSuccessAlert(true);
        setErrorAlert(false);
        setGroupName("");
        setGroupDesc("");
        setImageLink("");
      } else {
        setErrorAlert(true);
      }
    } catch (error) {
      setErrorAlert(true);
    }
  };

  return (
    <Modal show={props.isShown} onHide={props.handleClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>Add Community</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {successAlert && (
          <Alert variant="success">
            Success! The community was successfully added!
          </Alert>
        )}
        {errorAlert && (
          <Alert variant="danger">
            Error! The community could not be added. Try again or 
            contact technical support. 
          </Alert>
        )}
        {emptyAlert && (
          <Alert variant="warning">
            All fields must be filled.
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className={`mb-2`} controlId="groupName">
            <Form.Label>Group Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="groupDesc">
            <Form.Label>Group Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter group description"
              value={groupDesc}
              onChange={(e) => setGroupDesc(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="imageLink">
            <Form.Label>Image Link</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter image URL"
              value={imageLink}
              onChange={(e) => setImageLink(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button variant="secondary" onClick={props.handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddCommunity;
