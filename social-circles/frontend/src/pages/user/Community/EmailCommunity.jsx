import { useState } from "react"
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

function EmailCommunity(props) {
    const [message, setMessage] = useState("");
    const [noChangeAlert, setNoChangeAlert] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false);

    const getEmails = async (e) => {
        try {
            const request = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/get-community-emails`,
            {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(props.id)
            }
            );
            if (request.ok) {
                encoded_msg = encodeURIComponent(message)
                email_href_str = "mailto:" + request.results + "?subject=" + encoded_msg;
            } else {
            setSuccessAlert(false);
            setErrorAlert(true);
            }
        } catch (error) {
            setSuccessAlert(false);
            setErrorAlert(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (message.trim().length > 0) {
            setNoChangeAlert(false)
            try {
                const request = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/get-community-emails`,
                {
                    credentials: "include",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(props.id)
                }
                );
                if (request.ok) {
                    setSuccessAlert(true);
                    setErrorAlert(false);
                    encoded_msg = encodeURIComponent(message)
                    email_href_str = "mailto:" + request.results + "?subject=" + encoded_msg;
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
      <Modal.Header>
        <Modal.Title>Email Community: {props.name} </Modal.Title>
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
          <Form.Group className={`mb-2`} controlId="message">
            <Form.Label>Message</Form.Label>
            <Form.Control
              type="text"
              placeholder={"Input your message here!"}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button variant="secondary" onClick={props.handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            <a href="{{ email_href_str }}">Send Email</a>
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EmailCommunity;
