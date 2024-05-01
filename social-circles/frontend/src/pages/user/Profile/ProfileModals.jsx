import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export const ConfirmModal = ({ show, onHide, onConfirm, message }) => (
  <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Confirm Action</Modal.Title>
    </Modal.Header>
    <Modal.Body>{message}</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>
        Close
      </Button>
      <Button variant="danger" onClick={onConfirm}>
        Confirm
      </Button>
    </Modal.Footer>
  </Modal>
);

export const WelcomeModal = ({ show, onHide, onRedirect }) => (
  <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Welcome!</Modal.Title>
    </Modal.Header>
    <Modal.Body>Thank you for signing up, get started with your first event</Modal.Body>
    <Modal.Footer>
      <Button variant="danger" onClick={onRedirect}>
        To Events
      </Button>
    </Modal.Footer>
  </Modal>
);
