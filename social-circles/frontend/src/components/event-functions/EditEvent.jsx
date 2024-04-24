import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import AlertBox from "../shared-components/AlertBox";
import styles from '../../css/Modal.module.css';

function EditEvent(props) {
  const [eventName, setEventName] = useState(props.eventName);
  const [eventDesc, setEventDesc] = useState(props.eventDesc);
  const [imageLink, setImageLink] = useState(props.imageLink);
  const [eventCapacity, setEventCapacity] = useState(props.capacity);
  const [eventStart, setEventStart] = useState(props.start);
  const [eventEnd, setEventEnd] = useState(props.end);

  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventData = { event_id: props.event_id };
    if (eventName !== props.eventName && eventName.trim() !== "")
      eventData.event_name = eventName;
    if (eventDesc !== props.eventDesc && eventDesc.trim() !== "")
      eventData.event_desc = eventDesc;
    if (imageLink !== props.imageLink && imageLink.trim() !== "")
      eventData.image_link = imageLink;
    if (eventCapacity !== props.capacity && !isNaN(parseInt(eventCapacity)))
      eventData.capacity = parseInt(eventCapacity);
    if (eventStart !== props.start && eventStart)
      eventData.start_time = eventStart;
    if (eventEnd !== props.end && eventEnd)
      eventData.end_time = eventEnd;

    if (Object.keys(eventData).length > 1) {
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
          setAlert({
            type: "success",
            header: "Edit successful!",
            text: "The event was successfully updated."
          });
        setTimeout(() => {
          props.fetchEvents()
        }, 1500)
        } else {
          setAlert({
            type: "danger",
            header: "Edit failed!",
            text: "The event could not be updated. Please try again or contact the webmasters."
          });
        }
      } catch (error) {
        setAlert({
          type: "danger",
          header: "Edit error!",
          text: "We could not connect to the server while updating the event."
        });
      }
    } else {
      setAlert({
        type: "warning",
        header: "Missing changes!",
        text: "Please update one or more fields."
    });
    }
  }

  return (
    <Modal show={props.isShown} onHide={props.handleClose} backdrop="static">
      <Modal.Header className={`${styles.modalHeader}`}>
        <Modal.Title className={`${styles.modalTitle}`}>Edit Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alert && (
          <AlertBox
            type={alert.type}
            header={alert.header}
            text={alert.text}
            wantTimer={false}
            handleClose={() => setAlert(null)}>
          </AlertBox>
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
              as="textarea"
              rows={5}
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
              as="textarea"
              placeholder={props.imageLink}
              value={imageLink}
              onChange={(e) => setImageLink(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button variant="secondary" className={`${styles.modalBtn}`} onClick={props.handleClose}>
            Close
          </Button>
          <Button variant="primary" className={`${styles.modalBtn} ${styles.modalSubmit}`} type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditEvent;