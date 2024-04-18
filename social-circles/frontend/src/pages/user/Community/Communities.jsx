import { useState, useEffect } from "react";
import { useAuthContext } from "../../../contexts/AuthContextHandler.jsx";
import { useCommunityContext } from "../../../contexts/CommunityContextHandler.jsx";
import AlertBox from "../../../components/shared-components/AlertBox.jsx";
import UserHeader from "../../../components/headers/UserHeader.jsx";
import CommunitiesAside from "../../../components/community-functions/CommunitiesAside.jsx";
import CommunityCard from "../../../components/card-components/CommunityCard.jsx";
import AddCommunity from "../../../components/community-functions/AddCommunity.jsx";
import AddButton from "../../../components/admin-functions/AddButton.jsx";
import WebStreamLoader from "../../../components/WebStream/WebStreamLoader.jsx";

function Communities() {
  const {
    communities,
    isFetching,
    fetchCommunities,
    displayAlert,
    setDisplayAlert,
    updateCommunitiesOnRegistration,
  } = useCommunityContext();
  const [registrationAlerts, setRegistrationAlerts] = useState([]);

  const { isAdmin } = useAuthContext();
  const [showAddCommunity, setShowAddCommunity] = useState(false);

  useEffect(() => {
    fetchCommunities("/api/get-available-communities");
  }, []);

  const fetchAllCommunities = () =>
    fetchCommunities("/api/get-available-communities");

  const addRegistrationAlert = (type, header, text) => {
    setRegistrationAlerts((prevRegistrationAlerts) => {
      const newRegistrationAlert = { id: Date.now(), type, header, text };
      if (prevRegistrationAlerts.length >= 3) {
        return [newRegistrationAlert, ...prevRegistrationAlerts.slice(0, 2)];
      } else {
        return [newRegistrationAlert, ...prevRegistrationAlerts];
      }
    });
  };

  const removeRegistrationAlert = (id) => {
    setRegistrationAlerts((prevRegistrationAlerts) =>
      prevRegistrationAlerts.filter((alert) => alert.id !== id)
    );
  };

  return (
    <>
      <WebStreamLoader/>
      <UserHeader />
      <div className={`container-fluid p-5`}>
        {registrationAlerts.map((alert) => (
          <AlertBox
            key={alert.id}
            type={alert.type}
            header={alert.header}
            text={alert.text}
            wantTimer={true}
            handleClose={() => removeRegistrationAlert(alert.id)}
          ></AlertBox>
        ))}
        <div className={`row container-fluid align-items-center`}>
          <div className="col">
            <h1 className={`ml-4`} style={{ fontSize: "2.5rem" }}>
              All Communities
            </h1>
          </div>
          {isAdmin && (
            <div className="col d-flex justify-content-end">
              <AddButton
                type="Add Community"
                action={() => {
                  setShowAddCommunity(true);
                }}
              ></AddButton>
            </div>
          )}
        </div>
        <hr />
        <div className={`row`}>
          <CommunitiesAside />
          <div className={`col-lg-10 mt-3`}>
            <div className={`row`}>
              {isFetching ? (
                <div className="col-12 d-flex justify-content-center">
                  <div
                    className="spinner-border mt-5"
                    role="status"
                    style={{ width: "10rem", height: "10rem" }}
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : communities.length > 0 ? (
                communities.map((comm) => (
                  <div
                    key={comm.group_id}
                    className="col-lg-6 col-md-6 col-sm-12 mt-3"
                  >
                    <CommunityCard
                      group_id={comm.group_id}
                      name={comm.name}
                      desc={comm.desc}
                      count={comm.count}
                      image={comm.image}
                      isRegistered={comm.isRegistered}
                      isAdmin={isAdmin}
                      fetchCommunities={fetchAllCommunities}
                      updateCommunities={updateCommunitiesOnRegistration}
                      addRegistrationAlert={addRegistrationAlert}
                    />
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
                <h3 className="col-12 text-center">
                  There are no communities matching the filter criteria.
                </h3>
              )}
            </div>
          </div>
        </div>
      </div>
      {showAddCommunity && isAdmin && (
        <AddCommunity
          isShown={showAddCommunity}
          handleClose={() => setShowAddCommunity(false)}
          fetchCommunities={fetchAllCommunities}
        ></AddCommunity>
      )}
    </>
  );
}

export default Communities;
