import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

function AddAnnouncement(props) {
  const [annName, setAnnName] = useState("");
  const [descrip, setDescrip] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [emptyAlert, setEmptyAlert] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!annName && !descrip && !imageLink) {
      setEmptyAlert(true); 
      return; 
    }

    const announcementData = {
      announcement_name: annName,
      description: descrip,
      image_link: imageLink
    };

    try {
      const request = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/add-announcement`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(announcementData),
        }
      );
      if (request.ok) {
        setSuccessAlert(true);
        setErrorAlert(false);
        setAnnName("");
        setDescrip("");
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
        <Modal.Title>Add Announcement</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {successAlert && (
          <Alert variant="success">
            Success! The announcement was successfully added!
          </Alert>
        )}
        {errorAlert && (
          <Alert variant="danger">
            Error! The announcement could not be added. Try again or 
            contact technical support. 
          </Alert>
        )}
        {emptyAlert && (
          <Alert variant="warning">
            All fields must be filled.
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className={`mb-2`} controlId="annName">
            <Form.Label>Announcement Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the title for the announcement."
              value={annName}
              onChange={(e) => setAnnName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="imageLink">
            <Form.Label>Link for Background Image</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter a link for the background."
              value={imageLink}
              onChange={(e) => setImageLink(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="descrip">
            <Form.Label>Announcement Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Enter a description for the announcement."
              value={descrip}
              onChange={(e) => setDescrip(e.target.value)}
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

export default AddAnnouncement;