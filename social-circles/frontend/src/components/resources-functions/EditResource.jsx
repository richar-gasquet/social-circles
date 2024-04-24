import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

function EditResource(props) {
  const [image, setImage] = useState(props.image);
  const [resource, setResource] = useState(props.resource);
  const [dispName, setDispName] = useState(props.disp_name);
  const [descrip, setDescrip] = useState(props.descrip);
  const [noChangeAlert, setNoChangeAlert] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resourceData = { resource_id: props.resource_id };
    if (image !== props.image && image.trim() !== "")
      resourceData.image = image;
    if (resource !== props.resource && resource.trim() !== "")
      resourceData.resource = resource;
    if (dispName !== props.disp_name && dispName.trim() !== "")
      resourceData.disp_name = dispName;
    if (descrip !== props.descrip && descrip.trim() !== "")
      resourceData.descrip = descrip;

    if (Object.keys(resourceData).length > 1) {
      setNoChangeAlert(false);
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
          setSuccessAlert(true);
          setErrorAlert(false);
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
  }

  return (
    <Modal show={props.isShown} onHide={props.handleClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>Edit Resource</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {successAlert && (
          <Alert variant="success">
            Success! The resource was successfully updated!
          </Alert>
        )}
        {errorAlert && (
          <Alert variant="danger">
            Error! The resource could not be updated. Try again or contact
            technical support.
          </Alert>
        )}
        {noChangeAlert && (
          <Alert variant="warning">At least one field must be changed.</Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className={`mb-2`} controlId="image">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="text"
              placeholder={props.image}
              value={image}
              onChange={(e) => setImage(e.target.value)}
            ></Form.Control>
          </Form.Group>
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
          <Button variant="secondary" onClick={props.handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditResource;