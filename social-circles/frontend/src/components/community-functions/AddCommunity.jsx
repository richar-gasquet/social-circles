import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import AlertBox from "../shared-components/AlertBox";

function AddCommunity(props) {
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [alert, setAlert] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName || !groupDesc) {
      setAlert({type: "warning", 
                header: "Missing fields!", 
                text: "All fields must be filled." }); 
      return; 
    }

    const communityData = {
      group_name: groupName,
      group_desc: groupDesc,
      image_link: imageLink,
    };
    try {
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
        setAlert({type: "success", 
                  header: "Addition successful!",
                  text: "The community was successfully added." })
        props.fetchCommunities()
        setGroupName("");
        setGroupDesc("");
        setImageLink("");
      } else {
        setAlert({type: "danger",  
                  header: "Addition failed!",
                  text: "The community could not be added." });
      }
    } catch (error) {
      setAlert({type: "danger", 
                header: "Addition error!",
                text: "We could not connect to the server while adding the community." })
    }
  };

  return (
    <Modal show={props.isShown} onHide={props.handleClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>Add Community</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alert && (
          <AlertBox
            type={alert.type}
            header={alert.header}
            text={alert.text}
            handleClose={() => setAlert(null)}>
          </AlertBox>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className={`mb-2`} controlId="groupName">
            <Form.Label>Group Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="groupDesc">
            <Form.Label>Group Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter group description"
              value={groupDesc}
              onChange={(e) => setGroupDesc(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className={`mb-2`} controlId="imageLink">
            <Form.Label>Image Link</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter image URL"
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

export default AddCommunity;
