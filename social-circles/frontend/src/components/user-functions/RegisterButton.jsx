import Button from "react-bootstrap/Button";

function RegisterButton(props) {
  const buttonText = props.isRegistered
    ? "Cancel Registration"
    : (props.isDisabled ? "Not available" : "Register")
  const handleOnClick = props.isRegistered ? props.handleCancel : props.handleRegister;
  return (
    <Button variant = {props.isRegistered ? "danger" : "success"}
      onClick = {handleOnClick}
      disabled = {props.isDisabled}>
      {buttonText}
    </Button>
  );
}

export default RegisterButton;
