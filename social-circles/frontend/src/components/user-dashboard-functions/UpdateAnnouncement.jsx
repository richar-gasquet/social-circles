import { useState } from "react";
import he from 'he';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ToastContainer from "react-bootstrap/ToastContainer";
import AlertToast from "../shared-components/AlertToast";
import styles from "../../css/Modal.module.css";
import toastStyles from "../../css/Toast.module.css";

function UpdateAnnouncement(props) {
  const [annName, setAnnName] = useState(props.announcement_name);
  const [descrip, setDescrip] = useState(props.description);
  const [imageLink, setImageLink] = useState(props.image_link);

  const [isQuerying, setIsQuerying] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    const announcementData = { announcement_id: props.announcement_id };
    if (annName !== props.announcement_name)
      announcementData.announcement_name = annName;
    if (descrip !== props.description)
      announcementData.description = descrip;
    if (imageLink !== props.image_link)
      try {
        new URL(imageLink)
        announcementData.image_link = imageLink
      } catch (error) {
        setAlert({
          type: "warning",
          text: "Image link must be a valid URL.",
        });
        return;
      }

    if ((!annName.trim() || !descrip.trim() || !imageLink.trim())) {
      setAlert({
        type: "warning",
        text: "All fields must be filled."
      })
    }
      
    if (Object.keys(announcementData).length > 1) {
      try {
        setIsQuerying(true);
        const request = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/update-announcement`,
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
            text: `${he.decode(annName)} was successfully updated.`,
          });
          props.updateAnnouncement(props.announcement_id, announcementData);
        } else {
          setAlert({
            type: "danger",
            text: `${he.decode(annName)} could not be updated.`,
          });
        }
      } catch (error) {
        setAlert({
          type: "danger",
          text: `We could not connect to the server while updating ${he.decode(annName)}.`,
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
        <Modal.Title className={`${styles.modalTitle}`}>
          Edit Announcement
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
            <Form.Label>Announcement Name</Form.Label>
            <Form.Control
              type="text"
              placeholder={props.announcement_name}
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
              placeholder={props.description}
              value={he.decode(descrip)}
              onChange={(e) => setDescrip(e.target.value)}
              maxLength={500}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="imageLink">
            <Form.Label>Image Link</Form.Label>
            <Form.Control
              as="textarea"
              placeholder={props.image_link}
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
            Save
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default UpdateAnnouncement;
