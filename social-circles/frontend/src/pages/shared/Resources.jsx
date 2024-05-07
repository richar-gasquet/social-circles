import React, { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "../../contexts/AuthContextHandler";
import { useUserContext } from "../../contexts/UserContextHandler";
import Loading from "../../components/shared-components/LoadingSpinner";
import AlertBox from "../../components/shared-components/AlertBox";
import UserHeader from "../../components/headers/UserHeader";
import GuestHeader from "../../components/headers/GuestHeader";
import AdminHeader from "../../components/headers/AdminHeader";
import AddResource from "../../components/resources-functions/AddResource";
import AddButton from "../../components/admin-functions/AddButton";
import ResourceCard from "../../components/card-components/ResourcesCard";

/* Resources page */
function Resources() {
  const { userData, isLoading } = useUserContext();

  const [resources, setResources] = useState([]);
  const [isQuerying, setQuerying] = useState(true);
  const [displayAlert, setDisplayAlert] = useState(false);
  const [showAddResource, setShowAddResource] = useState(false);

  const { isAdmin } = useAuthContext();

  useEffect(() => {
    fetchAllResources();
  }, []);

  /* Retrieve all resources from backend */
  const fetchAllResources = async () => {
    try {
      setQuerying(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-resources`,
        { credentials: "include" }
      );
      if (response.ok) { // Successful fetch, store resources
        const data = await response.json();
        setResources(data.results);
      } else { // Could connect to server, but server error
        setDisplayAlert({
          type: "danger",
          header: "Could not display resources!",
          text: "Try again or contact the administrator.",
        });
      }
    } catch (error) { // Could not connect to server
      setDisplayAlert({
        type: "danger",
        header: "Could not connect to server!",
        text: "Try again or contact the administrator.",
      });
    } finally {
      setQuerying(false);
    }
  };

  /* Update resource with resource_id with details from new Resource*/
  const updateResources = useCallback((resource_id, newResource) => {
    setResources((prevResources) =>
      prevResources.map((oldResource) => {
        if (oldResource.resource_id === resource_id) {
          return { ...oldResource, ...newResource};
        } else {
          return oldResource
        }
      })
  
    );
  }, [resources]);

  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  const Header = userData.is_admin 
  ? AdminHeader
  : userData.is_admin === false
  ? UserHeader
  : GuestHeader;

  return (
    <>
      <Header />
      <div className={`container-fluid p-5 `}>
        <div
          className={`row container-fluid align-items-center`}
          style={{ paddingTop: "7em" }}
        >
          <h1 className={`ml-4`} style={{ fontSize: "2.5rem" }}>
            Resources
          </h1>
          {isAdmin && (
            <div className="col d-flex justify-content-end">
              <AddButton
                type="Add Resource"
                action={() => setShowAddResource(true)}
              ></AddButton>
            </div>
          )}
        </div>
        <hr />
        <div className={`row justify-content-center`}>
          <div className={`col-lg-10 mt-3`}>
            <div className={`row ml-5 mr-5`}>
              {isQuerying ? (
                <Loading />
              ) : resources.length > 0 ? (
                resources.map((resource) => (
                  <div key={resource.resource_id} className="col-lg-12 mb-4">
                    <ResourceCard
                      resource_id={resource.resource_id}
                      resource={resource.resource}
                      dispName={resource.disp_name}
                      desc={resource.descrip}
                      isAdmin={isAdmin}
                      fetchResources={fetchAllResources}
                      updateResources={updateResources}
                    ></ResourceCard>
                  </div>
                ))
              ) : displayAlert ? (
                <AlertBox
                  type={displayAlert.type}
                  header={displayAlert.header}
                  text={displayAlert.text}
                  wantTimer={false}
                  handleClose={() => setDisplayAlert(null)}
                ></AlertBox>
              ) : (
                <h3 className="col-12">There are no available resources.</h3>
              )}
            </div>
          </div>
        </div>
        {showAddResource && isAdmin && (
          <AddResource
            isShown={showAddResource}
            handleClose={() => setShowAddResource(false)}
            fetchResources={fetchAllResources}
          ></AddResource>
        )}
      </div>
    </>
  );
}

export default Resources;
