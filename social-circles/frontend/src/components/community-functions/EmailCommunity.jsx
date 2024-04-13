import { useState } from "react"
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import AlertBox from "../shared-components/AlertBox";
import styles from '../../css/Modal.module.css';

function EmailCommunity(props) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim().length > 0) {
      try {
          const request = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/get-community-emails`,
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
            setAlert({
              type: "success",
              header: "Fetched emails succesfully!",
              text: "You will be redirected shortly."
            });
              const data = await request.json();
              const encoded_subject = encodeURIComponent(String(subject));
              const encoded_msg = encodeURIComponent(String(message));
              const mailToLink = "mailto:" + String(data.results) + "?subject=" + encoded_subject + "&body=" + encoded_msg;
              window.open(mailToLink);
          } else {
            setAlert({
              type: "danger",
              header: "Fetching emails failed!",
              text: "The community's emails could not be fetched.."
          });
          }
        } catch (error) {
          setAlert({
                type: "danger",
                header: "Fetching emails error!",
                text: "We could not connect to the server while fetching the community's emails."
          });
        }
    } else {
      setAlert({
        type: "warning",
        header: "Missing fields",
        text: "Please fill out the subject line and email message."
      });
    }
  };

  return (
    <Modal show={props.isShown} onHide={props.handleClose} backdrop="static">
      <Modal.Header className={`${styles.modalHeader}`}>
        <Modal.Title className={`${styles.modalTitle}`}>Email Community: {props.groupName} </Modal.Title>
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
