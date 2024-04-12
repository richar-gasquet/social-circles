import PropTypes from "prop-types";
import styles from './AddButton.module.css'

function AddButton(props) {
    return (
        <button type="button" onClick={props.action}
            className={`btn btn-primary ${styles.button}`}>
            {props.type}
        </button>
    )
}

export default AddButton

AddButton.propTypes = {
    type: PropTypes.string,
    action: PropTypes.func
}