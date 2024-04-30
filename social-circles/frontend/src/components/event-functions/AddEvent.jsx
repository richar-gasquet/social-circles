import { useState } from "react";
import he from 'he';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ToastContainer from "react-bootstrap/ToastContainer";
import RegistrationToast from "../shared-components/RegistrationToast";
import styles from "../../css/Modal.module.css";
import toastStyles from "../../css/Toast.module.css";

function AddEvent(props) {
  const [eventName, setEventName] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [capacity, setCapacity] = useState("");
  const [location, setLocation] = useState("");
  const [isDanaEvent, setIsDanaEvent] = useState(false);
  const [imageLink, setImageLink] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [isQuerying, setIsQuerying] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

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
        text: "End time must be later than the start time.,",
      });
      return;
    } 

    try {
      new URL(imageLink)
    } catch (error) {
      setAlert({
        type: "warning",
        text: "Image link must be a valid URL.",
      });
      return;
    }

    const eventData = {
      name: eventName,
      desc: eventDesc,
      capacity: capacity,
      location: location,
      isDanaEvent: isDanaEvent,
      image: imageLink,
      start_time: startTime,
      end_time: endTime,
    };

    try {
      setIsQuerying(true);
      const request = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/add-event`,
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
          text: `${he.decode(eventName)} was successfully added.`,
        });
        props.fetchEvents();
        setEventName("");
        setEventDesc("");
        setCapacity("");
        setLocation("");
        setIsDanaEvent(false);
        setImageLink("");
        setStartTime("");
        setEndTime("");
      } else {
        setAlert({
          type: "danger",
          text: `${he.decode(eventName)} could not be added.`,
        });
      }
    } catch (error) {
      setAlert({
        type: "danger",
        text: `We could not connect to the server while adding ${he.decode(eventName)}.`,
      });
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <Modal show={props.isShown} onHide={props.handleClose} backdrop="static">
      <Modal.Header className={`${styles.modalHeader}`}>
        <Modal.Title className={`${styles.modalTitle}`}>
          Add Event
        </Modal.Title>
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
              placeholder="Enter event name"
              value={he.decode(eventName)}
              onChange={(e) => setEventName(e.target.value)}
              maxLength={150}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="eventDesc">
            <Form.Label>Event Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Enter an event description"
              value={he.decode(eventDesc)}
              onChange={(e) => setEventDesc(e.target.value)}
              maxLength={800}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="capacity">
            <Form.Label>Capacity</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter the event capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="location">
            <Form.Label>Event Location</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Enter an event location"
              value={he.decode(location)}
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
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type="datetime-local"
              placeholder="Enter the event start time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="endTime">
            <Form.Label>End Time</Form.Label>
            <Form.Control
              type="datetime-local"
              placeholder="Enter the event end time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="imageLink">
            <Form.Label>Image Link</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Enter an event image link (png/jpg)"
              value={he.decode(imageLink)}
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
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddEvent;
