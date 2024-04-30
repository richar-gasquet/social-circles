import { useState } from "react";
import he from 'he';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ToastContainer from "react-bootstrap/ToastContainer";
import AlertToast from "../shared-components/AlertToast";
import styles from "../../css/Modal.module.css";
import toastStyles from "../../css/Toast.module.css";

function EmailCommunity(props) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [isQuerying, setIsQuerying] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim().length > 0) {
      try {
        setIsQuerying(true);
        const request = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/get-community-emails`,
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
            text: "You will be redirected shortly to your mail app..",
          });
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
        } else {
          setAlert({
            type: "danger",
            text: `We could not fetch the user emails for ${he.decode(props.name)}.`,
          });
        }
      } catch (error) {
        setAlert({
          type: "danger",
          text: "We could not connect to the server while fetching the community's emails.",
        });
      } finally {
        setIsQuerying(false);
      }
    } else {
      setAlert({
        type: "warning",
        text: "Please fill out the subject line and email message.",
      });
    }
  };

  return (
    <Modal show={props.isShown} onHide={props.handleClose} backdrop="static">
      <Modal.Header className={`${styles.modalHeader}`}>
        <Modal.Title className={`${styles.modalTitle}`}>
          Email Members for {he.decode(props.name)}{" "}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
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

export default EmailCommunity;
