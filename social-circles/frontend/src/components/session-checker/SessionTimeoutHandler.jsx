import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';  
import styles from '../../css/Buttons.module.css';

/* Component to check if user session is active*/
function SessionTimeoutHandler() {
  const [showModal, setShowModal] = useState(false);
  const sessionTimeout = 30 * 60 * 1000; // 30 minutes

  useEffect(() => {
    let timeout = setTimeout(handleSessionTimeout, sessionTimeout);

    function resetTimeout() {
      clearTimeout(timeout);
      timeout = setTimeout(handleSessionTimeout, sessionTimeout);
    }

    // Event listeners to reset timeout on user activities
    window.addEventListener('click', resetTimeout);
    window.addEventListener('keypress', resetTimeout);
    window.addEventListener('fetch', resetTimeout);

    function handleSessionTimeout() {
      setShowModal(true);  // Show modal to ask user to extend session
    }

    return () => {
      window.removeEventListener('click', resetTimeout);
      window.removeEventListener('keypress', resetTimeout);
      window.removeEventListener('fetch', resetTimeout);
      clearTimeout(timeout);
    };
  }, []);

  const continueSession = () => {
    // Call to backend to refresh session
    fetch(`${import.meta.env.VITE_BACKEND_URL}/extend-session`, { method: 'POST', credentials: 'include' })
      .then(response => response.json())
      .then(data => console.log('Session extended:', data));
    setShowModal(false);
  };

  const endSession = (e) => {
    // Clear session on client side and notify backend
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/logout`;
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Session Timeout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Your session is about to expire. Do you want to continue your session?
      </Modal.Body>
      <Modal.Footer>
        <button className={styles.cancelButton} onClick={endSession}>End Session</button>
        <button className={styles.submitButton} onClick={continueSession}>Continue Session</button>
      </Modal.Footer>
    </Modal>
  );
}

export default SessionTimeoutHandler;
