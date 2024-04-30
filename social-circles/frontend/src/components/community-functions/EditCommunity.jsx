import { useState } from "react";
import he from 'he';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ToastContainer from "react-bootstrap/ToastContainer";
import AlertToast from "../shared-components/AlertToast";
import styles from "../../css/Modal.module.css";
import toastStyles from "../../css/Toast.module.css";

function EditCommunity(props) {
  const [groupName, setGroupName] = useState(props.name);
  const [groupDesc, setGroupDesc] = useState(props.desc);
  const [imageLink, setImageLink] = useState(props.image);

  const [isQuerying, setIsQuerying] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    const communityData = { group_id: props.group_id };
    if (groupName !== props.name)
      communityData.name = groupName;
    if (groupDesc !== props.desc)
      communityData.desc = groupDesc;
    if (imageLink !== props.image)
      try {
        new URL(imageLink)
        communityData.image = imageLink
      } catch (error) {
        setAlert({
          type: "warning",
          text: "Image link must be a valid URL.",
        });
        return;
      }

    if ((!groupName.trim() || !groupDesc.trim() || !imageLink.trim())) {
      setAlert({
        type: "warning",
        text: "All fields must be filled."
      })
    }
      
    if (Object.keys(communityData).length > 1) {
      try {
        setIsQuerying(true);
        const request = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/edit-community`,
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
            text: `${he.decode(groupName)} was successfully updated.`,
          });
          props.updateCommunities(props.group_id, communityData);
        } else {
          setAlert({
            type: "danger",
            text: `${he.decode(groupName)} could not be updated.`,
          });
        }
      } catch (error) {
        setAlert({
          type: "danger",
          text: `We could not connect to the server while updating ${he.decode(groupName)}.`,
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
          Edit Community
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
          <Form.Group className={`mb-2`} controlId="groupName">
            <Form.Label>Group Name</Form.Label>
            <Form.Control
              type="text"
              placeholder={props.groupName}
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
              placeholder={props.groupDesc}
              value={he.decode(groupDesc)}
              onChange={(e) => setGroupDesc(e.target.value)}
              maxLength={500}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="imageLink">
            <Form.Label>Image Link</Form.Label>
            <Form.Control
              as="textarea"
              placeholder={props.imageLink}
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

export default EditCommunity;
