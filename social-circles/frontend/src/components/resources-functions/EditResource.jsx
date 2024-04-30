import { useState } from "react";
import he from "he";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ToastContainer from "react-bootstrap/ToastContainer";
import AlertToast from "../shared-components/AlertToast";
import styles from "../../css/Modal.module.css";
import toastStyles from "../../css/Toast.module.css";

function EditResource(props) {
  const [resource, setResource] = useState(props.resource);
  const [dispName, setDispName] = useState(props.dispName);
  const [desc, setDesc] = useState(props.desc);

  const [isQuerying, setIsQuerying] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    console.log("click")
    e.preventDefault();
    setAlert(null);

    const resourceData = { resource_id: props.resource_id };
    if (resource !== props.resource)
      try {
        new URL(resource);
        resourceData.resource = resource;
      } catch (error) {
        setAlert({
          type: "warning",
          text: "Resorce link must be a valid URL.",
        });
        return;
      }
    if (dispName !== props.dispName) resourceData.disp_name = dispName;
    if (desc !== props.desc) resourceData.descrip = desc;

    if (
      !resource ||
      !resource.trim() ||
      !dispName ||
      !dispName.trim() ||
      !desc ||
      !desc.trim()
    ) {
      setAlert({
        type: "warning",
        text: "All fields must be filled.",
      });
      return;
    }

    if (Object.keys(resourceData).length > 1) {
      setIsQuerying(true);
      try {
        const request = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/edit-resources`,
          {
            credentials: "include",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(resourceData),
          }
        );
        if (request.ok) {
          setAlert({
            type: "success",
            text: `${he.decode(dispName)} was successfully updated.`,
          });
          props.updateResources(props.resource_id, resourceData);
        } else {
          setAlert({
            type: "danger",
            text: `${he.decode(dispName)} could not be updated.`,
          });
        }
      } catch (error) {
        setAlert({
          type: "danger",
          text: `We could not connect to the server while updating ${he.decode(
            dispName
          )}.`,
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
          Edit Resource
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
          <Form.Group className={`mb-2`} controlId="resource">
            <Form.Label>Resource URL Link</Form.Label>
            <Form.Control
              type="textarea"
              rows={2}
              placeholder={props.resource}
              value={he.decode(resource)}
              onChange={(e) => setResource(e.target.value)}
              maxLength={300}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="dispName">
            <Form.Label>Display Name</Form.Label>
            <Form.Control
              type="text"
              placeholder={props.disp_name}
              value={he.decode(dispName)}
              onChange={(e) => setDispName(e.target.value)}
              maxLength={300}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="desc">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder={props.descrip}
              value={he.decode(desc)}
              onChange={(e) => setDesc(e.target.value)}
              maxLength={500}
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

export default EditResource;
