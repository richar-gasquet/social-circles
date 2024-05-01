import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const CustomModal = ({ show, onHide, title, body, confirmAction, cancelButtonText = "Cancel", confirmButtonText = "Confirm", confirmButtonVariant = "danger" }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>{cancelButtonText}</Button>
        {confirmAction && <Button variant={confirmButtonVariant} onClick={confirmAction}>{confirmButtonText}</Button>}
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
