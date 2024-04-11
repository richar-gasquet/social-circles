import { useState } from "react"
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

function EditCommunity(props) {
    const [groupName, setGroupName] = useState(props.groupName);
    const [groupDesc, setGroupDesc] = useState(props.groupDesc);
    const [imageLink, setImageLink] = useState(props.imageLink);
    const [noChangeAlert, setNoChangeAlert] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const communityData = { group_id: props.group_id };
    if (groupName !== props.groupName && groupName.trim() !== "") communityData.group_name = groupName;
    if (groupDesc !== props.groupDesc && groupDesc.trim() !== "") communityData.group_desc = groupDesc;
    if (imageLink !== props.imageLink && imageLink.trim() !== "") communityData.image_link = imageLink;

    if (Object.keys(communityData).length > 1) {
        setNoChangeAlert(false)
        try {
            const request = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/edit-community`,
              {
                  credentials: "include",
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json"
                  },
                  body: JSON.stringify(communityData)
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
  };

  return (
    <Modal show={props.isShown} onHide={props.handleClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>Add Community</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {successAlert && (
          <Alert variant="success">
            Success! The community was successfully updated!
          </Alert>
        )}
        {errorAlert && (
          <Alert variant="danger">
            Error! The community could not be updated. Try again or 
            contact technical support. 
          </Alert>
        )}
        {noChangeAlert && (
          <Alert variant="warning">
            At least one field must be changed.
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className={`mb-2`} controlId="groupName">
            <Form.Label>Group Name</Form.Label>
            <Form.Control
              type="text"
              placeholder={props.groupName}
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="groupDesc">
            <Form.Label>Group Description</Form.Label>
            <Form.Control
              type="text"
              placeholder={props.groupDesc}
              value={groupDesc}
              onChange={(e) => setGroupDesc(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="imageLink">
            <Form.Label>Image Link</Form.Label>
            <Form.Control
              type="text"
              placeholder={props.imageLink}
              value={imageLink}
              onChange={(e) => setImageLink(e.target.value)}
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

export default EditCommunity;
