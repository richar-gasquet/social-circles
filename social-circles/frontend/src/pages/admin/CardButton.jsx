import PropTypes from "prop-types";
import styles from './CardButton.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function CardButton(props) {
    return (
        <button type="button" onClick={props.action}
            className={`btn btn-danger ${styles.button} ${props.className}`}>
            <i className="fas fa-trash"></i>
        </button>
    )
}

export default CardButton

CardButton.propTypes = {
    action: PropTypes.func
}