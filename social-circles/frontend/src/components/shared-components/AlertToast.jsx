import { useState, useEffect } from "react";
import Toast from "react-bootstrap/Toast";
import styles from "../../css/Toast.module.css";

function AlertToast(props) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(props.onDismiss, 300);  // Allow some time for fade-out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [props.key, props.onDismiss]);

  return (
    <Toast
      onClose={() => setShow(false)}
      show={show}
      delay={3000}
      autohide
      bg={props.type}
      animation={true}
      className={`${styles.toast} ${!show ? styles.fadeOut : ''}`}
    >
      <Toast.Body>
        <h6 className="text-center" style={{ color: "white", margin: "0px" }}>
          {props.text}
        </h6>
      </Toast.Body>
    </Toast>
  );
}

export default AlertToast;
