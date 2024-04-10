import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function AddCommunity(props) {
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [imageLink, setImageLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const communityData = {
      group_name: groupName,
      group_desc: groupDesc,
      image_link: imageLink,
    };
    try {
      const request = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/add-community`,
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
        /* Add extra checks based on status to call either success function or not fulfilled*/
        console.log("Data added succesfully");
        setGroupName("");
        setGroupDesc("");
        setImageLink("");
      } else {
        console.error("Failed to add the community");
      }
    } catch (error) {
      console.error("Could not connect to backend:", error);
    }
    props.handleClose();
  };

  return (
    <Modal show={props.isShown} onHide={props.handleClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>Add Community</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
