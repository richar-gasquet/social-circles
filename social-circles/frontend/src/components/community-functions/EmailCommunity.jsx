import { useState } from "react"
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import styles from '../../css/Modal.module.css';

function EmailCommunity(props) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [noChangeAlert, setNoChangeAlert] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim().length > 0) {
      setNoChangeAlert(false);
      try {
          const request = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/get-community-emails`,
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
              setSuccessAlert(true);
              setErrorAlert(false);
              const data = await request.json();
              const encoded_subject = encodeURIComponent(String(subject));
              const encoded_msg = encodeURIComponent(String(message));
              const mailToLink = "mailto:" + String(data.results) + "?subject=" + encoded_subject + "&body=" + encoded_msg;
              window.open(mailToLink);
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
  };

  return (
    <Modal show={props.isShown} onHide={props.handleClose} backdrop="static">
      <Modal.Header className={`${styles.modalHeader}`}>
        <Modal.Title className={`${styles.modalTitle}`}>Email Community: {props.groupName} </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {successAlert && (
          <Alert variant="success">
            Success! The community was successfully emailed to!
          </Alert>
        )}
        {errorAlert && (
          <Alert variant="danger">
            Error! The community could not be emailed to. Try again or 
            contact technical support. 
          </Alert>
        )}
        {noChangeAlert && (
          <Alert variant="warning">
            Please write your message!
          </Alert>
        )}
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
              placeholder={"Input your message here!"}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ height: "300px", resize: "vertical" }}
              rows={5}
            ></Form.Control>
          </Form.Group>
          <Button variant="secondary" className={`${styles.modalBtn}`} onClick={props.handleClose}>
            Cancel
          </Button>
          <Button variant="primary" className={`${styles.modalBtn} ${styles.modalSubmit}`} type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EmailCommunity;
