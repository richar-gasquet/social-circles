import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import AlertBox from "../shared-components/AlertBox";
import styles from '../../css/Modal.module.css';

function EditResource(props) {
  const [resource, setResource] = useState(props.resource);
  const [dispName, setDispName] = useState(props.disp_name);
  const [descrip, setDescrip] = useState(props.descrip);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resourceData = { resource_id: props.resource_id };
    if (resource !== props.resource && resource.trim() !== ""){
      if(!resource.startsWith("https://")){
        setAlert({
          type: "warning",
          header: "URL Link Issue",
          text: "Resource URL must start with 'https://'"
        });
        return;
      }
      resourceData.resource = resource;
    }
    if (dispName !== props.disp_name && dispName.trim() !== "")
      resourceData.disp_name = dispName;
    if (descrip !== props.descrip && descrip.trim() !== "")
      resourceData.descrip = descrip;

    if (Object.keys(resourceData).length > 1) {
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
              header: "Edit successful!",
              text: "The resource was successfully updated."
          });
          setTimeout(() => {
            props.fetchAllResources()
          }, 1500)
        } else {
          setAlert({
            type: "danger",
            header: "Edit failed!",
            text: "The resource could not be updated."
          });
        }
      } catch (error) {
        setAlert({
          type: "danger",
          header: "Edit error!",
          text: "We could not connect to the server while updating the resource."
        });
      }
    } else {
      setAlert({
        type: "warning",
        header: "Missing changes!",
        text: "Please update one or more fields."
      });
    }
  }

  return (
    <Modal show={props.isShown} onHide={props.handleClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>Edit Resource</Modal.Title>
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
          <Form.Group className={`mb-2`} controlId="resource">
            <Form.Label>Resource</Form.Label>
            <Form.Control
              type="text"
              placeholder={props.resource}
              value={resource}
              onChange={(e) => setResource(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="dispName">
            <Form.Label>Display Name</Form.Label>
            <Form.Control
              type="text"
              placeholder={props.disp_name}
              value={dispName}
              onChange={(e) => setDispName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="descrip">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder={props.descrip}
              value={descrip}
              onChange={(e) => setDescrip(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button variant="secondary" className={`${styles.modalBtn}`} onClick={props.handleClose}>
            Close
          </Button>
          <Button variant="primary" className={`${styles.modalBtn} ${styles.modalSubmit}`} type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditResource;