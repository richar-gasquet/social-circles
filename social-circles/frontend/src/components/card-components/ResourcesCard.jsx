import { useState } from "react";
import he from 'he';
import CardButton from "./CardButton";
import DeleteResource from "../resources-functions/DeleteResource";
import EditResource from "../resources-functions/EditResource";
import styles from "../../css/Card.module.css";

/* Card containing details about a resource */
function ResourceCard(props) {
  const [showDeleteResource, setShowDeleteResource] = useState(false);
  const [showEditResource, setShowEditResource] = useState(false);

  return (
    <div className="card">
      {/* Show card buttons if the user is an admin */}
      {props.isAdmin && (
        <div className={`${styles.cardButtons}`}>
          <CardButton
            className="mb-2"
            action={() => setShowEditResource(true)}
            message="Edit Resource"
            icon="fas fa-edit"
          ></CardButton>
          <CardButton
            action={() => setShowDeleteResource(true)}
            message="Delete Resource"
            icon="fas fa-trash"
          ></CardButton>
        </div>
      )}
      {{/* Display details about the resource */}}
      <div className="card-body" style={{ width: "90%" }}>
        <h3 className="card-title">
            {he.decode(props.dispName)}
        </h3>
        <p className="card-text text-muted">{he.decode(props.desc)}</p>
        <a
          href={he.decode(props.resource)}
          className="btn btn-primary"
          style={{ backgroundColor: "#E0525E", border: "none" }}
          target="_blank"
        >
          Go to Resource
        </a>
      </div>
      {/* Show modals for resources CRUD if card buttons are pressed */}
      {showEditResource && props.isAdmin && (
        <EditResource
          isShown={showEditResource}
          handleClose={() => setShowEditResource(false)}
          resource_id={props.resource_id}
          resource={props.resource}
          dispName={props.dispName}
          desc={props.desc}
          updateResources={props.updateResources}
        ></EditResource>
      )}
      {showDeleteResource && props.isAdmin && (
        <DeleteResource
          isShown={showDeleteResource}
          handleClose={() => setShowDeleteResource(false)}
          resource_id={props.resource_id}
          dispName={props.dispName}
          fetchResources={props.fetchResources}
        ></DeleteResource>
      )}
    </div>
  );
}

export default ResourceCard;
