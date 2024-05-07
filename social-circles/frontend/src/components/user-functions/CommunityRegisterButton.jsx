import Button from "react-bootstrap/Button";

/* Button component to register to a community */
function CommunityRegisterButton(props) {
  const buttonText = props.isRegistered 
  ? "Leave" : "Join";
      
  const buttonType = props.isRegistered 
    ? "secondary" : "success";
  
  const handleOnClick =  props.isRegistered 
  ? props.handleCancelRegistration : props.handleRegister;

  return (
    <Button variant = {buttonType}
      onClick = {handleOnClick}
      disabled = {props.isDisabled}>
      {buttonText}
    </Button>
  );
}

export default CommunityRegisterButton;
