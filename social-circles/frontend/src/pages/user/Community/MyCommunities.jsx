import { useState, useEffect } from "react";
import { useAuthContext } from "../../../contexts/AuthContextHandler.jsx";
import { useUserContext } from '../../../contexts/UserContextHandler';
import { useCommunityContext } from "../../../contexts/CommunityContextHandler.jsx";
import ToastContainer from "react-bootstrap/ToastContainer";
import AlertToast from "../../../components/shared-components/AlertToast.jsx";
import AlertBox from "../../../components/shared-components/AlertBox.jsx";
import UserHeader from "../../../components/headers/UserHeader.jsx";
import AdminHeader from "../../../components/headers/AdminHeader.jsx";
import CommunitiesAside from "../../../components/community-functions/CommunitiesAside.jsx";
import CommunityCard from "../../../components/card-components/CommunityCard.jsx";
import AddCommunity from "../../../components/community-functions/AddCommunity.jsx";
import AddButton from "../../../components/admin-functions/AddButton.jsx";
import SearchBar from "../../../components/shared-components/SearchBar.jsx";
import Loading from "../../../components/shared-components/LoadingSpinner.jsx";
import SessionTimeoutHandler from "../../../components/session-checker/SessionTimeoutHandler.jsx";
import { Navigate } from "react-router-dom";
import styles from "../../../css/Toast.module.css";

function MyCommunities() {
  const {
    communities,
    isFetching,
    fetchCommunities,
    displayAlert,
    setDisplayAlert,
    updateCommunities,
    query,
    setQuery,
    searchCommunities,
  } = useCommunityContext();
  const [registrationAlerts, setRegistrationAlerts] = useState([]);

  const { isAdmin } = useAuthContext();
  const [showAddCommunity, setShowAddCommunity] = useState(false);
  const { userData, isLoading } = useUserContext();

  useEffect(() => {
    fetchCommunities("/api/get-registered-communities");
  }, []);

  const fetchRegisteredCommunities = () =>
    fetchCommunities("/api/get-registered-communities");

  const addRegistrationAlert = (type, text) => {
    setRegistrationAlerts((prevRegistrationAlerts) => {
      const newRegistrationAlert = { id: Date.now(), type, text };
      if (prevRegistrationAlerts.length >= 3) {
        return [newRegistrationAlert, ...prevRegistrationAlerts.slice(0, 2)];
      } else {
        return [newRegistrationAlert, ...prevRegistrationAlerts];
      }
    });
  };

  const dismissAlert = alertId => {
    setRegistrationAlerts(prevRegistrationAlerts =>
      prevRegistrationAlerts.filter(alert => alert.id !== alertId)
    );
  };

  const filteredCommunities = searchCommunities(communities);

  if (isLoading) {
    return (
      <>
        <Loading/>
      </>
    );
  }

  // Checking if userData is undefined or email is empty 
  if (userData.is_admin === undefined || userData.is_admin === null) {
    return <Navigate to={"/profile"} />;
  }
  if (userData.email === '') {
    return <Navigate to={"/"} />;
  }

  const Header = isAdmin ? AdminHeader : UserHeader;

  return (
    <>
      <SessionTimeoutHandler />
      <Header />
      <div className={`container-fluid p-5`}>
        <div className="position-relative">
          <ToastContainer
            className={`p-3 ${styles.toastContainer}`}
            style={{ zIndex: 100 }}
          >
            {registrationAlerts.map((alert) => (
              <AlertToast
                key={alert.id}
                type={alert.type}
                text={alert.text}
                onDismiss={() => dismissAlert(alert.id)}
              />
            ))}
          </ToastContainer>
        </div>
        <div
          className={`row container-fluid align-items-center`}
          style={{ paddingTop: "7em" }}
        >
          <div className="col">
            <h1 className={`ml-4`} style={{ fontSize: "2.5rem" }}>
              My Communities
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
            <SearchBar query={query} setQuery={setQuery}></SearchBar>
            <div className={`row`}>
              {isFetching ? (
                <Loading />
              ) : filteredCommunities.length > 0 ? (
                searchCommunities(communities).map((comm) => (
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
                      fetchCommunities={fetchRegisteredCommunities}
                      updateCommunities={updateCommunities}
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
          fetchCommunities={fetchRegisteredCommunities}
        ></AddCommunity>
      )}
    </>
  );
}

export default MyCommunities;
