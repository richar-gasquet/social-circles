import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

function AddResource(props) {
  const [resource, setResource] = useState("");
  const [dispName, setDispName] = useState("");
  const [descrip, setDescrip] = useState("");
  const [emptyAlert, setEmptyAlert] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [urlIssueAlert, setUrlIssueAlert] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resource && !dispName && !descrip) {
      setEmptyAlert(true); 
      return; 
    }

    if(!resource.startsWith("https://")){
      setUrlIssueAlert(true);
      return;
    }

    const resourceData = {
      resource: resource,
      disp_name: dispName,
      descrip: descrip
    };

    try {
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
        setSuccessAlert(true);
        setErrorAlert(false);
        setResource("");
        setDispName("");
        setDescrip("");
      } else {
        setErrorAlert(true);
      }
    } catch (error) {
      setErrorAlert(true);
    }
  };

  return (
    <Modal show={props.isShown} onHide={props.handleClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>Add Resource</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {successAlert && (
          <Alert variant="success">
            Success! The resource was successfully added!
          </Alert>
        )}
        {errorAlert && (
          <Alert variant="danger">
            Error! The resource could not be added. Try again or 
            contact technical support. 
          </Alert>
        )}
        {emptyAlert && (
          <Alert variant="warning">
            All fields must be filled.
          </Alert>
        )}
        {urlIssueAlert && (
          <Alert variant="warning">
            Resource URL must start with "https://"
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className={`mb-2`} controlId="resource">
            <Form.Label>Resource URL Link</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the resource link"
              value={resource}
              onChange={(e) => setResource(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="dispName">
            <Form.Label>Display Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter a display name for the resource link"
              value={dispName}
              onChange={(e) => setDispName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="descrip">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter a description for this resource"
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

export default AddResource;