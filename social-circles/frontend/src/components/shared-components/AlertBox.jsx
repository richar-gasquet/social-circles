import { useEffect } from "react";
import Alert from "react-bootstrap/Alert"
import Button from "react-bootstrap/Button"

function AlertBox(props) {
  useEffect(() => {
    const timer = setTimeout(() => props.handleClose(), 5000);
    return () => clearTimeout(timer);

  }, [props.id, props.handleClose]);

  return (
    <Alert variant={props.type} onClose={props.handleClose}>
      <Alert.Heading>{props.header}</Alert.Heading>
      <p>{props.text}</p>
      <hr />
      <div>
          <Button onClick={props.handleClose} variant={`outline-${props.type}`}>
            Close me
          </Button>
      </div>
    </Alert>
  );
}

export default AlertBox;