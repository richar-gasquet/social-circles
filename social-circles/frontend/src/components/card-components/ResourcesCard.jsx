import { useState } from 'react';
import PropTypes from "prop-types";
import CardButton from './CardButton';
import DeleteResource from '../resources-functions/DeleteResource';
import EditResource from '../resources-functions/EditResource';
import styles from '../../css/Card.module.css'; 

function ResourceCard(props) {
  const [showDeleteResource, setShowDeleteResource] = useState(false);
  const [showEditResource, setShowEditResource] = useState(false);
  const [show, setShow] = useState(false);

  const handleShowDeleteResource = () => setShowDeleteResource(true);
  const handleCloseDeleteResource = () => {
    setShowDeleteResource(false);
    props.fetchAllResources();
  };

  const handleShowEditResource = () => setShowEditResource(true);
  const handleCloseEditResource = () => {
    setShowEditResource(false);
    props.fetchAllResources();
  };

  function toggleShow() {
    setShow(!show);
  }

  return (
    <div className={`card h-100 ${styles.card}`}>
      <img className={`card-img-top ${styles.cardImgTop}`} src={props.image} alt="Resource Image" />
      {props.isAdmin && (
        <div className={`${styles.cardButtons}`}>
          <CardButton
            className="mb-2"
            action={handleShowEditResource}
            message="Edit Resource"
            icon="fas fa-edit"
          ></CardButton>
          <CardButton
            action={handleShowDeleteResource}
            message="Delete Resource"
            icon="fas fa-trash"
          ></CardButton>
        </div>
      )}
      <div className={`card-body d-flex flex-column`}>
        <h2 className={`card-title ${styles.cardTitle}`}>
          {props.resource}
        </h2>
        <h4 className={`card-subtitle mb-2 ${styles.cardSubtitle}`}>
          {props.disp_name}
        </h4>
        <h6 className={`card-text ${styles.cardText}`}>
          {props.descrip}
        </h6>
      </div>

      {showDeleteResource && props.isAdmin && (
        <DeleteResource
          isShown={showDeleteResource}
          handleClose={handleCloseDeleteResource}
          resource_id={props.resource_id}
          resource={props.resource}
        ></DeleteResource>
      )}

      {showEditResource && props.isAdmin && (
        <EditResource
          isShown={showEditResource}
          handleClose={handleCloseEditResource}
          resource_id={props.resource_id}
          image={props.image}
          resource={props.resource}
          disp_name={props.disp_name}
          descrip={props.descrip}
        ></EditResource>
      )}
    </div>
  );
}

ResourceCard.propTypes = {
  image: PropTypes.string,
  resource: PropTypes.string,
  disp_name: PropTypes.string,
  descrip: PropTypes.string,
};

ResourceCard.defaultProps = {
  image: "https://via.placeholder.com/200",
  resource: "https://www.google.com/",
  disp_name: "Resource Name...",
  descrip: "Resource Description...",
};

export default ResourceCard;