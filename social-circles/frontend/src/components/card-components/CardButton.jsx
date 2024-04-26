import styles from "../../css/CardButton.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function CardButton(props) {
  return (
    <button
      type="button"
      onClick={props.action}
      className={`btn btn-danger ${styles.button} ${props.className}`}
      title={props.message}
    >
      <i className={props.icon} aria-hidden="true"></i>
    </button>
  );
}

export default CardButton;
