import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

function EditEvent(props) {
  const [eventName, setEventName] = useState(props.eventName);
  const [eventDesc, setEventDesc] = useState(props.eventDesc);
  const [imageLink, setImageLink] = useState(props.imageLink);
  const [eventCapacity, setEventCapacity] = useState(props.capacity);
  const [eventStart, setEventStart] = useState(props.start);
  const [eventEnd, setEventEnd] = useState(props.end);
  const [noChangeAlert, setNoChangeAlert] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventData = { event_id: props.event_id };
    if (eventName !== props.eventName && eventName.trim() !== "")
      eventData.event_name = eventName;
    if (eventDesc !== props.eventDesc && eventDesc.trim() !== "")
      eventData.event_desc = eventDesc;
    if (imageLink !== props.imageLink && imageLink.trim() !== "")
      eventData.image_link = imageLink;
    if (eventCapacity !== props.capacity && eventCapacity.trim() !== "")
      eventData.capacity = eventCapacity;
    if (eventStart !== props.start && eventStart.trim() !== "")
      eventData.start_time = eventStart;
    if (eventEnd !== props.end && eventEnd.trim() !== "")
      eventData.end_time = eventEnd;

    if (Object.keys(eventData).length > 1) {
      setNoChangeAlert(false);
      try {
        const request = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/edit-event`,
          {
            credentials: "include",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(eventData),
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
    } else {
      setNoChangeAlert(true);
      setSuccessAlert(false);
      setErrorAlert(false);
    }
  }

  return (
    <Modal show={props.isShown} onHide={props.handleClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>Edit Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {successAlert && (
          <Alert variant="success">
            Success! The event was successfully updated!
          </Alert>
        )}
        {errorAlert && (
          <Alert variant="danger">
            Error! The event could not be updated. Try again or contact
            technical support.
          </Alert>
        )}
        {noChangeAlert && (
          <Alert variant="warning">At least one field must be changed.</Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className={`mb-2`} controlId="eventName">
            <Form.Label>Event Name</Form.Label>
            <Form.Control
              type="text"
              placeholder={props.eventName}
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="eventDesc">
            <Form.Label>Event Description</Form.Label>
            <Form.Control
              type="text"
              placeholder={props.eventDesc}
              value={eventDesc}
              onChange={(e) => setEventDesc(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="eventCapacity">
            <Form.Label>Event Capacity</Form.Label>
            <Form.Control
              type="number"
              placeholder={props.capacity}
              value={eventCapacity}
              onChange={(e) => setEventCapacity(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="eventStart">
            <Form.Label>Event Start Time</Form.Label>
            <Form.Control
              type="datetime-local"
              placeholder={props.start}
              value={eventStart}
              onChange={(e) => setEventStart(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="eventEnd">
            <Form.Label>Event End Time</Form.Label>
            <Form.Control
              type="datetime-local"
              placeholder={props.end}
              value={eventEnd}
              onChange={(e) => setEventEnd(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="imageLink">
            <Form.Label>Image Link</Form.Label>
            <Form.Control
              type="text"
              placeholder={props.imageLink}
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

export default EditEvent;
