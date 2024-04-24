import { useAuthContext } from "../../contexts/AuthContextHandler";
import UserHeader from "../../components/headers/UserHeader";
import WebStreamLoader from "../../components/WebStream/WebStreamLoader";
import AddResource from "../../components/resources-functions/AddResource";
import AddButton from "../../components/admin-functions/AddButton";
import ResourceCard from "../../components/card-components/ResourcesCard";
import React, { useState, useEffect } from 'react';

function Resources() {
  const [resources, setResources] = useState([]);
  const [error, setError] = useState("");
  const [isQuerying, setQuerying] = useState(true);
  const [showAddResource, setShowAddResource] = useState(false);

  const { isAdmin } = useAuthContext();

  useEffect(() => {
    fetchAllResources()
  }, []);

  const fetchAllResources = async () => {
    try {
      setQuerying(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-resources`,
        { credentials: "include" }
      )
      if (response.ok) {
        const data = await response.json();
        setResources(data.results);
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {
      console.error("Failed to fetch resource data: ", error);
      setError("Server error. Please contact the administrator.")
    } finally {
      setQuerying(false);
    }
  };

  const handleShowAddResource = () => setShowAddResource(true)
  const handleCloseAddResource = () => {
    setShowAddResource(false);
    fetchAllResources();
  };

  return (
    <>
      <WebStreamLoader/>
      <UserHeader />
      <div className={`container-fluid p-5`}>
        <div className={`row container-fluid align-items-center`}>
          {isAdmin && (
              <div className="col d-flex justify-content-end">
                <AddButton
                  type="Add Resource"
                  action={handleShowAddResource}>
                </AddButton>
              </div>
            )}
        </div>
      </div>
      <hr />
      <div className={`row`}>
        <div className={`col-lg-10 mt-3`}>
          <div className={`row`}>
            {isQuerying ? (
              <div className="col-12 d-flex justify-content-center">
                <div className="spinner-border mt-5" role="status"
                  style={{ width: '10rem', height: '10rem'}}>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : resources.length > 0 ? (
              resources.map((resource) => (
                <div key={resource.resource_id} className="col-lg-4 col-md-6 col-sm-12 mt-2">
                  <ResourceCard
                    resource_id={resource.resource_id}
                    image={resource.image}
                    resource={resource.resource}
                    disp_name={resource.disp_name}
                    descrip={resource.descrip}
                    isAdmin={isAdmin}
                    fetchAllResources={fetchAllResources}>
                  </ResourceCard>
                </div>
              ))
            ) : (
              <h3 className="col-12">
                There are no available resources.
              </h3>
            )}
          </div>
        </div>
      </div>
      {showAddResource && isAdmin && (
        <AddResource
          isShown={showAddResource}
          handleClose={handleCloseAddResource}>
        </AddResource>
      )}
    </>
  );
}

export default Resources;