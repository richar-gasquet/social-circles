import Button from "react-bootstrap/Button";

function RegisterButton(props) {
  const buttonText = props.isRegistered ? "Cancel Registration" : "Register"
  const handleOnClick = props.isRegistered ? props.handleCancel : props.handleRegister;
  return (
    <Button variant = {props.isRegistered ? "danger" : "success"}
      onClick = {handleOnClick}>
      {buttonText}
    </Button>
  );
}

export default RegisterButton;
