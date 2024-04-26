import PropTypes from "prop-types";
import styles from './AdminButton.module.css'

function AdminButton(props) {
    return (
        <button type="button" onClick={props.action}
            className={`btn btn-primary ${styles.button}`}>
            {props.type}
        </button>
    )
}

export default AdminButton

AdminButton.propTypes = {
    type: PropTypes.string,
    action: PropTypes.func
}