import PropTypes from "prop-types";
import styles from './DeleteButton.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function DeleteButton(props) {
    return (
        <button type="button" onClick={props.action}
            className={`btn btn-danger ${styles.button} ${props.className}`}>
            <i className="fas fa-trash"></i>
        </button>
    )
}

export default DeleteButton

DeleteButton.propTypes = {
    action: PropTypes.func
}