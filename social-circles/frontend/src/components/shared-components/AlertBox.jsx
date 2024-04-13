import { useEffect } from "react";
import Alert from "react-bootstrap/Alert"
import Button from "react-bootstrap/Button"

function AlertBox(props) {
  if (props.wantTimer) {
    useEffect(() => {
      const timer = setTimeout(() => props.handleClose(), 3000);
      return () => clearTimeout(timer);
  
    }, [props.id, props.handleClose]);
  }

  return (
    <Alert variant={props.type} onClose={props.handleClose} className="container-fluid">
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