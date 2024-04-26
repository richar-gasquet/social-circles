import { useState } from "react";
import Toast from "react-bootstrap/Toast";
import styles from "../../css/Toast.module.css";

function RegistrationToast(props) {
  const [show, setShow] = useState(true);

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

export default RegistrationToast;
