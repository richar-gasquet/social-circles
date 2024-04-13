import { useState, useEffect } from "react";
import { useAuthContext } from "../../../contexts/AuthContextHandler.jsx";
import AlertBox from "../../../components/shared-components/AlertBox.jsx";
import UserHeader from "../../../components/headers/UserHeader.jsx"
import CommunitiesAside from "../../../components/community-functions/CommunitiesAside.jsx";
import CommunityCard from "../../../components/card-components/CommunityCard.jsx";
import AddCommunity from "../../../components/community-functions/AddCommunity.jsx";
import AddButton from "../../../components/admin-functions/AddButton.jsx";


function Communities() {
  const [communities, setCommunities] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [registrationAlerts, setRegistrationAlerts] = useState([]);
  const [displayAlerts, setDisplayAlerts] = useState([]);

  const { isAdmin } = useAuthContext();
  const [showAddCommunity, setShowAddCommunity] = useState(false);

  useEffect(() => {
    fetchAllCommunities();
  }, []);

  const fetchAllCommunities = async () => {
    try {
      setIsFetching(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-available-communities`,
        { credentials: "include" }
      );
      if (response.ok) {
        const data = await response.json();
        setCommunities(data.results);
      } else {
        addDisplayAlert("danger", "Could not display events!", 
                        "Try again or contact the administrator.")
      }
    } catch (error) {
      addDisplayAlert("danger", "Could not connect to server!", 
                      "Try again or contact the administrator.")
    } finally {
      setIsFetching(false);
    }
  };

  const updateCommunitiesOnRegistration = (group_id, registered, count) => {
    
  };

  const addRegistrationAlert = (type, header, text) => {
    setRegistrationAlerts((prevRegistrationAlerts) => {
      const newRegistrationAlert = { id: Date.now(), type, header, text};
      if (prevRegistrationAlerts.length >= 3) {
        return [newRegistrationAlert, ...prevRegistrationAlerts.slice(1)];
      } else {
        return [newRegistrationAlert, ...prevRegistrationAlerts];
      }
    })
  }

  const removeRegistrationAlert = (id) => {
    setRegistrationAlerts((prevRegistrationAlerts) =>
      prevRegistrationAlerts.filter((alert) => alert.id !== id)
    );
  };

  const addDisplayAlert = (type, header, text) => {
    setDisplayAlerts((prevDisplayAlerts) => {
      const newAlert = { id: Date.now(), type, header, text };
      if (prevDisplayAlerts.length >= 3) {
        return [...prevDisplayAlerts.slice(1), newAlert];
      } else {
        return [...prevDisplayAlerts, newAlert];
      }
    });
  };

  const removeDisplayAlert = (id) => {
    setDisplayAlerts((prevDisplayAlerts) =>
      prevDisplayAlerts.filter((alert) => alert.id !== id)
    );
  };

  const handleShowAddCommunity = () => setShowAddCommunity(true);
  const handleCloseAddCommunity = () => {
    setShowAddCommunity(false);
  };

  return (
    <>
      <UserHeader />
      <div className={`container-fluid p-5`}>
        {registrationAlerts.map((alert) => (
          <AlertBox
            key={alert.id}
            type={alert.type}
            header={alert.header}
            text={alert.text}
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
                action={handleShowAddCommunity}
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
                <div className="spinner-border mt-5" role="status" style={{ width: "10rem", height: "10rem" }}>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : communities.length > 0 ? (
              communities.map((comm) => (
                <div key={comm.group_id} className="col-lg-6 col-md-6 col-sm-12 mt-3">
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
            ) : displayAlerts.length > 0 ? (
              displayAlerts.map((alert) => (
                <AlertBox
                  key={alert.id}
                  type={alert.type}
                  header={alert.header}
                  text={alert.text}
                  handleClose={() => removeDisplayAlert(alert.id)}
                />
              ))
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
          handleClose={handleCloseAddCommunity}
          fetchCommunities={fetchAllCommunities}
        ></AddCommunity>
      )}
    </>
  );
}

export default Communities;
