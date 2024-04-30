import { useState } from "react";
import he from "he";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ToastContainer from "react-bootstrap/ToastContainer";
import AlertToast from "../shared-components/AlertToast";
import styles from "../../css/Modal.module.css";
import toastStyles from "../../css/Toast.module.css";

function AddResource(props) {
  const [resourceLink, setResource] = useState("");
  const [dispName, setDispName] = useState("");
  const [desc, setDesc] = useState("");

  const [isQuerying, setIsQuerying] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!resourceLink || !dispName || !desc) {
      setAlert({
        type: "warning",
        text: "All fields must be filled.",
      });
      return;
    }

    try {
      new URL(resourceLink);
    } catch (error) {
      setAlert({
        type: "warning",
        text: "Resource link must be a valid URL.",
      });
      return;
    }

    const resourceData = {
      resource: resourceLink,
      disp_name: dispName,
      descrip: desc,
    };

    try {
      setIsQuerying(true);
      const request = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/add-resources`,
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
          text: `${he.decode(dispName)} was successfully added.`,
        });
        props.fetchResources()
        setResource("");
        setDispName("");
        setDesc("");
      } else {
        setAlert({
          type: "danger",
          text: `${he.decode(dispName)} could not be added.`,
        });
      }
    } catch (error) {
      setAlert({
        type: "danger",
        text: `We could not connect to the server while adding ${he.decode(
          dispName
        )}.`,
      });
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <Modal show={props.isShown} onHide={props.handleClose} backdrop="static">
      <Modal.Header className={`${styles.modalHeader}`}>
        <Modal.Title className={`${styles.modalTitle}`}>
          Add Resource
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
              as="textarea"
              rows={2}
              placeholder="Enter the resource link"
              value={he.decode(resourceLink)}
              onChange={(e) => setResource(e.target.value)}
              maxLength={300}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="dispName">
            <Form.Label>Display Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter a display name for the resource link"
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
              placeholder="Enter a description for this resource"
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
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddResource;
