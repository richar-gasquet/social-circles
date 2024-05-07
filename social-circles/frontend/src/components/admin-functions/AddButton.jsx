import styles from '../../css/AddButton.module.css'

/* Button to add events, communities, announcements, resources */
function AddButton(props) {
    return (
        <button type="button" onClick={props.action}
            className={`btn btn-primary ${styles.button}`}>
            {props.type}
        </button>
    )
}

export default AddButton