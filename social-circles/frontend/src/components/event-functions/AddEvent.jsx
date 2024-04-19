import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import AlertBox from "../shared-components/AlertBox";
import styles from '../../css/Modal.module.css';

function AddEvent(props) {
  const [eventName, setEventName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [alert, setAlert] = useState(null)
  // const [emptyAlert, setEmptyAlert] = useState(false);
  // const [successAlert, setSuccessAlert] = useState(false);
  // const [errorAlert, setErrorAlert] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventName && !capacity && !eventDesc && !imageLink && !startTime && !endTime) {
      setAlert({type: "warning", 
                header: "Missing fields!", 
                text: "All fields must be filled." }); 
      return; 
    }

    const eventData = {
      event_name: eventName,
      capacity: capacity,
      event_desc: eventDesc,
      image_link: imageLink,
      start_time: startTime,
      end_time: endTime
    };

    try {
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
        setAlert({type: "success", 
                  header: "Addition successful!",
                  text: "The event was successfully added." })
        props.fetchEvents();
        setEventName("");
        setCapacity("");
        setEventDesc("");
        setImageLink("");
        setStartTime("");
        setEndTime("");
      } else {
        setAlert({type: "danger",  
                  header: "Addition failed!",
                  text: "The event could not be added." });
      }
    } catch (error) {
      setAlert({type: "danger", 
                header: "Addition error!",
                text: "We could not connect to the server while adding the community." })
    }
  };

  return (
    <Modal show={props.isShown} onHide={props.handleClose} backdrop="static">
      <Modal.Header className={`${styles.modalHeader}`}>
        <Modal.Title className={`${styles.modalTitle}`}>Add Event</Modal.Title>
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
        {/* {errorAlert && (
          <Alert variant="danger">
            Error! The event could not be added. Try again or 
            contact technical support. 
          </Alert>
        )}
        {emptyAlert && (
          <Alert variant="warning">
            All fields must be filled.
          </Alert>
        )} */}
        <Form onSubmit={handleSubmit}>
          <Form.Group className={`mb-2`} controlId="eventName">
            <Form.Label>Event Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter event name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
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
          <Form.Group className={`mb-2`} controlId="eventDesc">
            <Form.Label>Event Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Enter an event description"
              value={eventDesc}
              onChange={(e) => setEventDesc(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="imageLink">
            <Form.Label>Image Link</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter an event image link (png/jpg)"
              value={imageLink}
              onChange={(e) => setImageLink(e.target.value)}
            ></Form.Control>
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

export default AddEvent;