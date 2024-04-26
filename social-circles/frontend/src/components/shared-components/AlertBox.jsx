import Alert from "react-bootstrap/Alert"
import "@fortawesome/fontawesome-free/css/all.min.css";

function AlertBox(props) {
  return (
    <Alert variant={props.type} className="container-fluid">
      <Alert.Heading className="d-flex justify-content-between align-items-center">
        {props.header}
        <button onClick={props.handleClose} style={{ border: 'none', background: 'none', margin: '0'}}>
          <i className="fa fa-close" aria-hidden="true"></i>
        </button>
      </Alert.Heading>
      {props.text}
    </Alert>
  );
}

export default AlertBox;