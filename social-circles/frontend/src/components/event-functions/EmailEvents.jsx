import { useState } from "react";
import he from 'he';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ToastContainer from "react-bootstrap/ToastContainer";
import AlertToast from "../shared-components/AlertToast";
import styles from "../../css/Modal.module.css";
import toastStyles from "../../css/Toast.module.css";
import pageStyles from "../../css/ChildPage.module.css";

/* Component to email an event's attendees via a Modal */
function EmailEventGroup(props) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [isQuerying, setIsQuerying] = useState(false);
  const [alert, setAlert] = useState(null);

  /* Handler method to email an event via fetch when 'Submit' is clicked */
  const handleSubmit = async (e) => {
    e.preventDefault();
    /* Ensure message and subject are not blank */
    if (message.trim().length > 0 && subject.trim().length > 0) {
      try {
        setIsQuerying(true);
        const request = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/get-event-emails`,
          {
            credentials: "include",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ event_id: props.event_id }),
          }
        );
        if (request.ok) { // Fetch successful, emails acquired
          setAlert({
            key: Date.now(),
            type: "success",
            text: "You will be redirected shortly to your mail app.",
          });
          // Create mailto with subjects and messages
          const data = await request.json();
          const encoded_subject = encodeURIComponent(String(subject));
          const encoded_msg = encodeURIComponent(String(message));
          const mailToLink =
            "mailto:" +
            String(data.results) +
            "?subject=" +
            encoded_subject +
            "&body=" +
            encoded_msg;
          window.open(mailToLink);
        } else { // Could connect to server, but server error
          setAlert({
            key: Date.now(),
            type: "danger",
            text: `We could not fetch the user emails for ${he.decode(props.name)}.`,
          });
        }
      } catch (error) { // Could not connect to server
        setAlert({
          key: Date.now(),
          type: "danger",
          text: "We could not connect to the server while fetching the event's emails.",
        });
      } finally {
        setIsQuerying(false);
      }
    } else {
      setAlert({
        key: Date.now(),
        type: "warning",
        text: "Please fill out the subject line and email message.",
      });
    }
  };

  return (
    <Modal show={props.isShown} onHide={props.handleClose} backdrop="static">
      <Modal.Header className={`${styles.modalHeader}`}>
        <Modal.Title className={`${styles.modalTitle} ${pageStyles.wrapText}`}>
          Email Attendees for {he.decode(props.name)}{" "}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        { /* Display alert if it exists */}
        {alert && (
          <ToastContainer
            className={`p-3 ${toastStyles.toastContainer}`}
            style={{ zIndex: 100 }}
          >
            <AlertToast
              key={alert.id}
              type={alert.type}
              text={alert.text}
              onDismiss={() => setAlert(null)}
            />
          </ToastContainer>
        )}
        { /* Form entries and labels */}
        <Form onSubmit={handleSubmit}>
          <Form.Group className={`mb-2`} controlId="subject">
            <Form.Label>Subject</Form.Label>
            <Form.Control
              type="text"
              placeholder={"Input the subject of the email here!"}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="message">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder={"Input your message here!"}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></Form.Control>
          </Form.Group>
          { /* Buttons for admin actions */}
          <Button
            variant="secondary"
            className={`${styles.modalBtn}`}
            onClick={props.handleClose}
          >
            Cancel
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

export default EmailEventGroup;
