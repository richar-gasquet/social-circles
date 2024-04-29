import { useState } from "react";
import he from 'he';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ToastContainer from "react-bootstrap/ToastContainer";
import RegistrationToast from "../shared-components/RegistrationToast";
import styles from "../../css/Modal.module.css";
import toastStyles from "../../css/Toast.module.css";

function AddCommunity(props) {
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [imageLink, setImageLink] = useState("");

  const [isQuerying, setIsQuerying] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!groupName.trim() || !groupDesc.trim() || !imageLink.trim()) {
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

    const communityData = {
      name: groupName,
      desc: groupDesc,
      image: imageLink,
    };
    try {
      setIsQuerying(true);
      const request = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/add-community`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(communityData),
        }
      );
      if (request.ok) {
        setAlert({
          type: "success",
          text: `${he.decode(groupName)} was successfully added.`,
        });
        props.fetchCommunities();
        setGroupName("");
        setGroupDesc("");
        setImageLink("");
      } else {
        setAlert({
          type: "danger",
          text: `${he.decode(groupName)} could not be added.`,
        });
      }
    } catch (error) {
      setAlert({
        type: "danger",
        text: `We could not connect to the server while adding ${he.decode(groupName)}.`
      });
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <Modal show={props.isShown} onHide={props.handleClose} backdrop="static">
      <Modal.Header className={`${styles.modalHeader}`}>
        <Modal.Title className={`${styles.modalTitle}`}>
          Add Community
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
          <Form.Group className={`mb-2`} controlId="groupName">
            <Form.Label>Group Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter group name"
              value={he.decode(groupName)}
              onChange={(e) => setGroupName(e.target.value)}
              maxLength={100}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="groupDesc">
            <Form.Label>Group Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Enter group description"
              value={he.decode(groupDesc)}
              onChange={(e) => setGroupDesc(e.target.value)}
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

export default AddCommunity;
