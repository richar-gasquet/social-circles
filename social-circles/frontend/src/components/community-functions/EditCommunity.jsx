import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import AlertBox from "../shared-components/AlertBox";
import styles from "../../css/Modal.module.css";

function EditCommunity(props) {
  const [groupName, setGroupName] = useState(props.name);
  const [groupDesc, setGroupDesc] = useState(props.desc);
  const [imageLink, setImageLink] = useState(props.image);

  const [isQuerying, setIsQuerying] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const communityData = { group_id: props.group_id };
    if (groupName !== props.name && groupName.trim() !== "")
      communityData.name = groupName;
    if (groupDesc !== props.desc && groupDesc.trim() !== "")
      communityData.desc = groupDesc;
    if (imageLink !== props.image && imageLink.trim() !== "")
      communityData.image = imageLink;
    if (Object.keys(communityData).length > 1) {
      setIsQuerying(true);
      try {
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
            header: "Edit successful!",
            text: `${groupName} was successfully updated.`,
          });
          props.updateCommunities(props.group_id, communityData);
        } else {
          setAlert({
            type: "danger",
            header: "Edit failed!",
            text: `${groupName} could not be updated.`,
          });
        }
      } catch (error) {
        setAlert({
          type: "danger",
          header: "Edit error!",
          text: `We could not connect to the server while updating ${groupName}.`,
        });
      } finally {
        setIsQuerying(false);
      }
    } else {
      setAlert({
        type: "warning",
        header: "Missing changes!",
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
          <AlertBox
            type={alert.type}
            header={alert.header}
            text={alert.text}
            handleClose={() => setAlert(null)}
          ></AlertBox>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className={`mb-2`} controlId="groupName">
            <Form.Label>Group Name</Form.Label>
            <Form.Control
              type="text"
              placeholder={props.groupName}
              value={groupName}
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
              value={groupDesc}
              onChange={(e) => setGroupDesc(e.target.value)}
              maxLength={500}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="imageLink">
            <Form.Label>Image Link</Form.Label>
            <Form.Control
              as="textarea"
              placeholder={props.imageLink}
              value={imageLink}
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

export default EditCommunity;
