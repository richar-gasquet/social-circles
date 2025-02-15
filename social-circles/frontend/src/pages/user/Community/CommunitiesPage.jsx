import React, { useState, useEffect, useCallback } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAuthContext } from "../../../contexts/AuthContextHandler.jsx";
import { useUserContext } from "../../../contexts/UserContextHandler";
import he from "he";
import logo from "../../../assets/social-circles-logo.png";
import AdminHeader from "../../../components/headers/AdminHeader.jsx";
import UserHeader from "../../../components/headers/UserHeader.jsx";
import SessionTimeoutHandler from "../../../components/session-checker/SessionTimeoutHandler.jsx";
import CommunityRegisterButton from "../../../components/user-functions/CommunityRegisterButton.jsx";
import AlertBox from "../../../components/shared-components/AlertBox.jsx";
import Loading from "../../../components/shared-components/LoadingSpinner.jsx";
import ToastContainer from "react-bootstrap/esm/ToastContainer.js";
import AlertToast from "../../../components/shared-components/AlertToast.jsx";
import toastStyles from "../../../css/Toast.module.css";
import Modal from "react-bootstrap/Modal";
import styles from "../../../css/Buttons.module.css";
import pageStyles from "../../../css/ChildPage.module.css";

/* Single community page */
function CommunitiesPage() {
  const { groupId } = useParams();

  const [community, setCommunity] = useState(null);
  const [usersForCommunity, setUsersForCommunity] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [registrationAlerts, setRegistrationAlerts] = useState([]);
  const [communityDisplayAlert, setCommunityDisplayAlert] = useState(null);
  const [userDisplayAlert, setUserDisplayAlert] = useState(null);

  const { isAdmin } = useAuthContext();
  const { userData, isLoading } = useUserContext();

  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [isFetchingCommunity, setIsFetchingCommunity] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);
  const [redirectOnNotFound, setRedirectOnNotFound] = useState(false);

  // Utility function for handling fetch errors
  const handleFetchError = (
    setAlert,
    message,
    detail = "Try again or contact the administrator."
  ) => {
    setAlert({
      type: "danger",
      header: message,
      text: detail,
    });
  };

  /* Retrieve details about a single community from the backend */
  const fetchSingleCommunity = useCallback(async () => {
    try {
      setIsFetchingCommunity(true);
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/get-single-community-info?group_id=${groupId}`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCommunity(data.results);
      } else if (response.status === 404) {
        setRedirectOnNotFound(true); // Trigger redirection when 404 is found
      } else {
        handleFetchError(
          setCommunityDisplayAlert,
          "Could not display the group details!"
        );
      }
    } catch (error) {
      handleFetchError(
        setCommunityDisplayAlert,
        "Could not connect to server!"
      );
    } finally {
      setIsFetchingCommunity(false);
    }
  }, [groupId, setIsFetchingCommunity, setCommunityDisplayAlert]);

  /* Retrieve all users belonging to this community */
  const getUsersForCommunity = useCallback(async () => {
    try {
      setIsFetchingUsers(true);
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/get-users-for-community?group_id=${groupId}`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUsersForCommunity(data.results);
      } else {
        handleFetchError(
          setUserDisplayAlert,
          "Could not display the registered users!"
        );
      }
    } catch (error) {
      handleFetchError(setUserDisplayAlert, "Could not connect to server!");
    } finally {
      setIsFetchingUsers(false);
    }
  }, [groupId, setIsFetchingUsers, setUserDisplayAlert]);

  useEffect(() => {
    fetchSingleCommunity();
    getUsersForCommunity();
  }, [fetchSingleCommunity, getUsersForCommunity]);

  /* Forcefully remove a user from the community via FETCH*/
  const unregisterUser = async () => {
    if (!selectedUser) return; // Guard clause if no user is selected

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/remove-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include", // Ensure cookies are sent with the request if sessions are used
          body: JSON.stringify({
            email: selectedUser.email,
            group_id: groupId,
          }),
        }
      );

      if (response.ok) {
        // Refresh the list of users
        setUsersForCommunity(() =>
          usersForCommunity.filter((user) => user.email !== selectedUser.email)
        );

        if (selectedUser.email === userData.email) {
          const updatedCommunity = { ...community, is_registered: false };
          setCommunity(updatedCommunity);
        }

        setSelectedUser(null);

        addRegistrationAlert("success", `User has been successfully removed.`);
      } else {
        addRegistrationAlert(
          "danger",
          `We couldn't remove the user for ${he.decode(community.group_name)}.`
        );
      }
    } catch (error) {
      addRegistrationAlert(
        "danger",
        `We couldn't remove the user for ${he.decode(
          community.group_name
        )}. There was
        most likely a server error.`
      );
    }
  };

  /* Allow user to register for the event on 'Submit' */
  const handleRegistration = async () => {
    try {
      setIsQuerying(true);
      const request = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/add-community-registration`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ group_id: groupId }),
        }
      );
      if (request.ok) {
        // Fetch successful
        addRegistrationAlert(
          "success",
          `You have joined ${he.decode(community.group_name)}.`
        );
        const updatedCommunity = {
          ...community,
          isRegistered: true,
          count: community.count + 1,
        };
        setCommunity(updatedCommunity);
        /* Add current user to the registered users list*/
        setUsersForCommunity(() => {
          return [
            {
              first_name: userData.first_name,
              last_name: userData.last_name,
              email: userData.email,
              is_admin: userData.is_admin,
              address: userData.address,
              preferred_name: userData.preferred_name,
              pronouns: userData.pronouns,
              phone_number: userData.phone_number,
              marital_status: userData.marital_status,
              family_circumstance: userData.family_circumstance,
              community_status: userData.community_status,
              interests: userData.interests,
              personal_identity: userData.personal_identity,
              picture: userData.picture,
            },
            ...usersForCommunity,
          ];
        });
      } else {
        addRegistrationAlert(
          "danger",
          `We couldn't let you join ${he.decode(community.group_name)}. 
          Try again or contact the administrator.`
        );
      }
    } catch (error) {
      addRegistrationAlert(
        "danger",
        `We couldn't let you join ${he.decode(community.group_name)}. 
        The server is most likely down.`
      );
    } finally {
      setIsQuerying(false);
    }
  };

  /* Cancel the current user's registration voluntarily */
  const handleCancelRegistration = async () => {
    setIsQuerying(true);
    try {
      const request = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/delete-community-registration`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ group_id: groupId }),
        }
      );
      if (request.ok) {
        // Fetch successful
        const updatedCommunity = {
          ...community,
          isRegistered: false,
          count: community.count - 1,
        };
        setCommunity(updatedCommunity);
        setUsersForCommunity(() =>
          usersForCommunity.filter((user) => user.email !== userData.email)
        );
        addRegistrationAlert(
          "success",
          `You have left ${he.decode(community.group_name)}.`
        );
      } else {
        addRegistrationAlert(
          "danger",
          `We couldn't cancel your membership for ${he.decode(
            community.group_name
          )}. 
              Try again or contact the administrator.`
        );
      }
    } catch (error) {
      addRegistrationAlert(
        "danger",
        `We couldn't cancel your membership for ${he.decode(
          community.group_name
        )}. 
            There was most likely a server error.`
      );
    } finally {
      setIsQuerying(false);
    }
  };

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

  const dismissAlert = (alertId) => {
    setRegistrationAlerts((prevRegistrationAlerts) =>
      prevRegistrationAlerts.filter((alert) => alert.id !== alertId)
    );
  };

  const handleUserClick = (user) => {
    if (isAdmin) {
      setSelectedUser(user);
    }
  };

  const handleButtonClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  if (redirectOnNotFound) {
    return <Navigate to="/not-found" replace />;
  }

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
      {/* Event info container */}
      <div className="container" style={{ paddingTop: "8em" }}>
        <div className="position-relative">
          <ToastContainer
            className={`p-3 ${toastStyles.toastContainer}`}
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
        {isFetchingCommunity ? (
          <Loading paddingTop="2rem"/>
        ) : community ? (
          <div className={`${pageStyles.wrapText}`}>
            <h1 className="mt-3 py-3">{he.decode(community.group_name)}</h1>
            <div>
              <img
                className={`${pageStyles.mainImg}`}
                src={community.image_link}
                alt={community.group_name}
              />
            </div>
            <hr />
            <h1 className={`mt-3 py-3`}>Community Details</h1>
            <div className="row my-3">
              <div className="col-md-3">
                <div className="d-flex">
                  <div className="icon-container">
                    <i className="fas fa-user">&nbsp;</i>
                  </div>
                  <div>
                    <h5 className="mb-2">
                      <strong>Number of members: </strong>
                      {community.count}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className={`mb-3`}>
              <h5 className={`pl-3`}>
                <strong>Description</strong>: {he.decode(community.group_desc)}
              </h5>
            </div>
          </div>
        ) : communityDisplayAlert ? (
          <AlertBox
            type={communityDisplayAlert.type}
            header={communityDisplayAlert.header}
            text={communityDisplayAlert.text}
            handleClose={() => setCommunityDisplayAlert(null)}
          ></AlertBox>
        ) : (
          <div>
            <h2> Inexistent community ID </h2>
            <h4>This community does not exist.</h4>
          </div>
        )}
        <div>
          {isFetchingCommunity || !community ? (
            <div />
          ) : (
            <CommunityRegisterButton
              isRegistered={community.isRegistered}
              isDisabled={isQuerying}
              handleRegister={(e) => handleButtonClick(e, handleRegistration)}
              handleCancelRegistration={(e) =>
                handleButtonClick(e, handleCancelRegistration)
              }
            />
          )}
        </div>
      </div>
      {/* Users grid container */}
      <div className={`container mt-5 ${pageStyles.usersContainer}`}>
        <hr />
        <h1 className={`mt-3 pb-3`}> Community Members </h1>
        {isFetchingUsers ? (
          <Loading paddingTop="2rem" size="5rem"/>
        ) : usersForCommunity && usersForCommunity.length > 0 ? (
          <div className="row">
            {usersForCommunity.map((user) => (
              <div
                className="col-6 col-sm-4 col-md-2 col-lg-2 mb-4"
                key={user.user_id}
              >
                <div
                  className={`card ${
                    isAdmin ? pageStyles.adminHoverEffect : ""
                  }`}
                  onClick={() => handleUserClick(user)}
                >
                  <div className={pageStyles.cardImgContainer}>
                    <img
                      className={pageStyles.cardImg}
                      src={user.profile_photo || logo}
                      alt="Profile Photo"
                    />
                  </div>
                  <div className="card-body p-2">
                    <h6
                      className="card-title text-truncate text-center"
                      style={{ fontSize: "1rem" }}
                    >
                      {user.first_name} {user.last_name}
                    </h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : userDisplayAlert ? (
          <AlertBox
            type={userDisplayAlert.type}
            header={userDisplayAlert.header}
            text={userDisplayAlert.text}
            handleClose={() => setUserDisplayAlert(null)}
          ></AlertBox>
        ) : (
          <h4>No users are currently a part of this community.</h4>
        )}
        {/* View selected user's detailed via a Modal */}
        {selectedUser && isAdmin && (
          <Modal
            show={selectedUser !== null}
            onHide={() => setSelectedUser(null)}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>User Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div className={`${pageStyles.wrapText}`}>
                <p>
                  <strong>First Name:</strong> {selectedUser.first_name}
                </p>
                <p>
                  <strong>Last Name:</strong> {selectedUser.last_name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Phone Nmber:</strong> {selectedUser.phone_number}
                </p>
                <p>
                  <strong>Address:</strong> {selectedUser.address}
                </p>
                <p>
                  <strong>Preferred Name:</strong> {selectedUser.preferred_name}
                </p>
                <p>
                  <strong>Pronouns:</strong> {selectedUser.pronouns}
                </p>
                <p>
                  <strong>Marital Status:</strong> {selectedUser.marital_status}
                </p>
                <p>
                  <strong>Family Circumstance:</strong>{" "}
                  {selectedUser.family_circumstance}
                </p>
                <p>
                  <strong>Community Status:</strong>{" "}
                  {selectedUser.community_status}
                </p>
                <p>
                  <strong>Interests:</strong> {selectedUser.interests}
                </p>
                <p>
                  <strong>Personal Identity:</strong>{" "}
                  {selectedUser.personal_identity}
                </p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              {isAdmin && (
                <button
                  className={styles.submitButton}
                  variant="danger"
                  onClick={unregisterUser}
                >
                  Remove User
                </button>
              )}
              <button
                className={styles.cancelButton}
                variant="secondary"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </>
  );
}

export default CommunitiesPage;
