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
    
    <div className="card">
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
      <div className="card-body" style={{ width: '90%' }}>
        <h3 className="card-title"><a href={props.resource} style={{ color: 'black' }} target="_blank">{props.disp_name}</a></h3>
        <p className="card-text text-muted">{props.descrip}</p>
        <a href={props.resource} className="btn btn-primary" style={{ backgroundColor: '#E0525E', border:'none' }} target="_blank">Go to Resource</a>
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
          resource={props.resource}
          disp_name={props.disp_name}
          descrip={props.descrip}
        ></EditResource>
      )}
    </div>
  );
}

ResourceCard.propTypes = {
  resource: PropTypes.string,
  disp_name: PropTypes.string,
  descrip: PropTypes.string,
};

ResourceCard.defaultProps = {
  resource: "https://www.google.com/",
  disp_name: "Resource Name...",
  descrip: "Resource Description...",
};

export default ResourceCard;