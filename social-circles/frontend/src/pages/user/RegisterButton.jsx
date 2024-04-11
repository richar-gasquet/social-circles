import PropTypes from "prop-types";

function RegisterButton() {
  return (
    <button
      type="button"
      onClick={props.action}
      className={`btn btn-success`}
      title={props.message}
    >
      {props.text}
    </button>
  );
}

export default RegisterButton;
