import Button from "react-bootstrap/Button";

function EventRegisterButton(props) {
  const buttonText = props.isWaitlisted 
    ? "Leave Waitlist"
    : props.isRegistered ? "Cancel Registration"
    : props.isFull ? "Join Waitlist"
    : "Register"
      
  const buttonType = props.isRegistered 
    ? "secondary" 
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

export default EventRegisterButton;
