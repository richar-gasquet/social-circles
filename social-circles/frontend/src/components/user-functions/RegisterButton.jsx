import Button from "react-bootstrap/Button";

function RegisterButton(props) {
  const buttonText = props.isDisabled
    ? "Not Available"
    : props.isWaitlisted ? "Leave Waitlist"
    : props.isRegistered ? "Cancel Registration"
    : props.isFull ? "Join Waitlist"
    : "Register"

  console.log(props.isFull)
      
  const buttonType = props.isRegistered 
    ? "danger" 
    : props.isWaitlisted || props.isFull ? "warning"
    : "success"
  
  const handleOnClick = props.isWaitlisted
    ? props.handleCancelWaitlist
    : (props.isRegistered ? props.handleCancelRegistration : props.handleRegister);
  
  return (
    <Button variant = {buttonType}
      onClick = {handleOnClick}
      disabled = {props.isDisabled}>
      {buttonText}
    </Button>
  );
}

export default RegisterButton;
