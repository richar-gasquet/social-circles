import { useState } from "react";
import he from 'he';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ToastContainer from "react-bootstrap/ToastContainer";
import AlertToast from "../shared-components/AlertToast";
import styles from "../../css/Modal.module.css";
import toastStyles from "../../css/Toast.module.css";

function AddAnnouncement(props) {
  const [annName, setAnnName] = useState("");
  const [descrip, setDescrip] = useState("");
  const [imageLink, setImageLink] = useState("");

  const [isQuerying, setIsQuerying] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!annName.trim() || !descrip.trim() || !imageLink.trim()) {
      setAlert({
        type: "warning",
        text: "All fields must be filled.",
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

    const announcementData = {
      announcement_name: annName,
      description: descrip,
      image_link: imageLink,
    };
    try {
      setIsQuerying(true);
      const request = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/add-announcement`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(announcementData),
        }
      );
      if (request.ok) {
        setAlert({
          type: "success",
          text: `${he.decode(annName)} was successfully added.`,
        });
        props.fetchAnnouncements();
        setAnnName("");
        setDescrip("");
        setImageLink("");
      } else {
        setAlert({
          type: "danger",
          text: `${he.decode(annName)} could not be added.`,
        });
      }
    } catch (error) {
      setAlert({
        type: "danger",
        text: `We could not connect to the server while adding ${he.decode(annName)}.`
      });
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <Modal show={props.isShown} onHide={props.handleClose} backdrop="static">
      <Modal.Header className={`${styles.modalHeader}`}>
        <Modal.Title className={`${styles.modalTitle}`}>
          Add Announcement
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
          <Form.Group className={`mb-2`} controlId="annName">
            <Form.Label>Announcement Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the title for the announcement."
              value={he.decode(annName)}
              onChange={(e) => setAnnName(e.target.value)}
              maxLength={100}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="descrip">
            <Form.Label>Announcement Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Enter the announcement description."
              value={he.decode(descrip)}
              onChange={(e) => setDescrip(e.target.value)}
              maxLength={500}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="imageLink">
            <Form.Label>Image Link</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter image URL"
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

export default AddAnnouncement;
