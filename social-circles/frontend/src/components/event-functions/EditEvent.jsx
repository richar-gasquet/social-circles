import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ToastContainer from "react-bootstrap/ToastContainer";
import RegistrationToast from "../shared-components/RegistrationToast";
import styles from "../../css/Modal.module.css";
import toastStyles from "../../css/Toast.module.css";

function EditEvent(props) {
  const [eventName, setEventName] = useState(props.eventName);
  const [eventDesc, setEventDesc] = useState(props.eventDesc);
  const [capacity, setCapacity] = useState(props.capacity);
  const [location, setLocation] = useState(props.location);
  const [isDanaEvent, setIsDanaEvent] = useState(props.isDanaEvent);
  const [imageLink, setImageLink] = useState(props.imageLink);
  const [startTime, setStartTime] = useState(props.start);
  const [endTime, setEndTime] = useState(props.end);

  const [isQuerying, setIsQuerying] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    const eventData = { event_id: props.event_id };
    if (eventName !== props.eventName)
      eventData.name = eventName;
    if (eventDesc !== props.eventDesc)
      eventData.desc = eventDesc;
    if (capacity !== props.capacity && !isNaN(parseInt(capacity)))
      eventData.capacity = parseInt(capacity);
    if (location !== props.location)
      eventData.location = location;
    if (isDanaEvent !== props.isDanaEvent)
      eventData.isDanaEvent = isDanaEvent;
    if (imageLink !== props.imageLink) {
      try {
        new URL(imageLink)
        eventData.image = imageLink;
      } catch (error) {
        setAlert({
          type: "warning",
          text: "Image link must be a valid URL.",
        });
        return;
      }
    }
    if (startTime !== props.start)
      eventData.start_time = startTime;
    if (endTime !== props.end) 
      eventData.end_time = endTime;

    if (
      !eventName || !eventName.trim() ||
      !eventDesc || !eventDesc.trim() ||
      !location || !location.trim() ||
      !imageLink || !imageLink.trim() ||
      !startTime || !endTime
    ) {
      setAlert({
        type: "warning",
        text: "All fields must be filled.",
      });
      return;
    }

    if (capacity < 0) {
      setAlert({
        type: "warning",
        text: "Capacity must be greater than 0.",
      });
      return;
    }

    if (endTime < startTime) {
      setAlert({
        type: "warning",
        text: "End time must be later than the start time",
      });
      return;
    }

    if (Object.keys(eventData).length > 1) {
      setIsQuerying(true);
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
            text: `${eventName} was successfully updated.`,
          });
          props.updateEvents(props.event_id, eventData);
        } else {
          setAlert({
            type: "danger",
            text: `${eventName} could not be updated.`,
          });
        }
      } catch (error) {
        console.log(error)
        setAlert({
          type: "danger",
          text: `We could not connect to the server while updating ${eventName}.`,
        });
      } finally {
        setIsQuerying(false);
      }
    } else {
      setAlert({
        type: "warning",
        text: "Please update one or more fields.",
      });
    }
  };

  return (
    <Modal show={props.isShown} onHide={props.handleClose} backdrop="static">
      <Modal.Header className={`${styles.modalHeader}`}>
        <Modal.Title className={`${styles.modalTitle}`}>Edit Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alert && (
          <ToastContainer
            className={`p-3 ${toastStyles.toastContainer}`}
            style={{ zIndex: 100 }}
          >
            <RegistrationToast
              key={alert.id}
              type={alert.type}
              text={alert.text}
              onDismiss={() => setAlert(null)}
            />
          </ToastContainer>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className={`mb-2`} controlId="eventName">
            <Form.Label>Event Name</Form.Label>
            <Form.Control
              type="text"
              placeholder={props.eventName}
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              maxLength={150}
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
              maxLength={800}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="capacity">
            <Form.Label>Event Capacity</Form.Label>
            <Form.Control
              type="number"
              placeholder={props.capacity}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="location">
            <Form.Label>Event Location</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder={props.location}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={200}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="isDanaEvent">
            <Form.Label>Event With Dana</Form.Label>
            <Form.Check
              type="checkbox"
              checked={isDanaEvent}
              label="Is this an event Dana will participate in/host?"
              onChange={(e) => setIsDanaEvent(e.target.checked)}
              className={`pl-4`}
            />
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="startTime">
            <Form.Label>Event Start Time</Form.Label>
            <Form.Control
              type="datetime-local"
              placeholder={props.start}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="endTime">
            <Form.Label>Event End Time</Form.Label>
            <Form.Control
              type="datetime-local"
              placeholder={props.end}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="imageLink">
            <Form.Label>Image Link</Form.Label>
            <Form.Control
              as="textarea"
              placeholder={props.imageLink}
              value={imageLink}
              onChange={(e) => setImageLink(e.target.value)}
              maxLength={200}
            ></Form.Control>
          </Form.Group>
          <Button
            variant="secondary"
            className={`${styles.modalBtn}`}
            onClick={props.handleClose}
          >
            Close
          </Button>
          <Button
            variant="primary"
            className={`${styles.modalBtn} ${styles.modalSubmit}`}
            type="submit"
            disabled={isQuerying}
          >
            Save
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditEvent;
