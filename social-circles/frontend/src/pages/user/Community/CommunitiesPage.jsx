import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserHeader from "../../../components/headers/UserHeader.jsx";
import SessionTimeoutHandler from '../../../components/session-checker/SessionTimeoutHandler.jsx';
import '../../../css/CommunityPage.css'
import styles from '../../../css/Buttons.module.css';
import Modal from 'react-bootstrap/Modal'; 
import AdminHeader from "../../../components/headers/AdminHeader.jsx";
import { useAuthContext } from "../../../contexts/AuthContextHandler.jsx";
import logo from "../../../assets/social-circles-logo.png"
import CommunityRegisterButton from '../../../components/user-functions/CommunityRegisterButton.jsx';
import ToastContainer from 'react-bootstrap/ToastContainer.js';
import AlertToast from '../../../components/shared-components/AlertToast.jsx';
import toastStyles from "../../../css/Toast.module.css"
import { useUserContext } from '../../../contexts/UserContextHandler';
import Loading from '../../../components/shared-components/LoadingSpinner.jsx';
import { Navigate } from "react-router-dom";

function CommunitiesPage() {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [usersForGroup, setUsersForGroup] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const { isAdmin } = useAuthContext();
    const [registrationAlerts, setRegistrationAlerts] = useState([]);

    const { userData, isLoading } = useUserContext();
    const Header = isAdmin ? AdminHeader : UserHeader;

    if (isLoading) {
        return (
        <>
        <Header />
        <Loading/>
        </>
        )
    }
    // Checking if userData is undefined or email is empty  !userData ||
    if ( userData.email === '') {
        return <Navigate to={"/"} />;
    }
    if ( userData.is_admin === undefined) {
        return <Navigate to={"/profile"} />;
    }

    const [isQuerying, setIsQuerying] = useState(false);

    const [commData, setCommData] = useState({
        isRegistered: false,
        count: 0
      });

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

    useEffect(() => {
    const storedCommData = JSON.parse(localStorage.getItem('commData'));
    if (storedCommData) {
        setCommData(storedCommData);
        localStorage.removeItem('commData'); // Clean up local storage after use
    }
    }, []);

    const cardBodyStyle = {
        padding: '0.5rem'  // Adjust padding as needed
    };

    const handleUserClick = (user) => {
        if (isAdmin) {
            setSelectedUser(user);
          }
    };
    
      const closePopup = () => {
        setSelectedUser(null);
    };

    const unregisterUser = () => {
        // Confirm with the admin before proceeding
    
          if (!selectedUser) return;  // Guard clause if no user is selected
      
          fetch(`${import.meta.env.VITE_BACKEND_URL}/remove-user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            credentials: 'include',  // Ensure cookies are sent with the request if sessions are used
            body: JSON.stringify({ email: selectedUser.email,
                                    group_id: groupId})
          })
          .then(response => response.json())
          .then(data => {
            if (data.status === 'success') {
              addRegistrationAlert(
                    "success",
                    `User has been successfully unregistered.`
              );
              closePopup();
              // Refresh the list of users or remove the user from the state
              setUsersForGroup(usersForGroup.filter(user => user.email !== selectedUser.email));
              const updated = {
                ...commData,
                isRegistered: false,
                count: group.count - 1,
              };
              group.count = group.count - 1;
              setCommData(updated);

            } else {
                addRegistrationAlert(
                    "danger",
                    `Error: ${data.message}`
                );
            }
          })
          .catch(error => {
            console.error('Error unregistering user:', error);
            addRegistrationAlert(
                "danger",
                `Failed to unregister user.`
              );
          });
       
      };

    useEffect(() => {
        const getGroupInfo = async () => {
            try {
                const request = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/get-one-group-info-with-user-status?group_id=${groupId}`,
                    {
                        credentials: "include",
                    }
                );
                if (request.ok) {
                    const data = await request.json();
                    console.log(data.results)
                    setGroup(data.results);
                } else {
                    addRegistrationAlert(
                        "danger",
                        `Could not display community!.
                        Try again or contact server administrator.`
                      );
                }
            } catch (error) {
                addRegistrationAlert(
                    "danger",
                    `Could not display community!.
                    Try again or contact server administrator.`
                  );
            }
        };

        getGroupInfo();
    }, [groupId]);

    useEffect(() => {
        const getUsersForGroup = async () => {
            try {
                const request = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/get-users-for-group?group_id=${groupId}`,
                    {
                        credentials: "include",
                    }
                );
                if (request.ok) {
                    const data = await request.json();
                    console.log(data.results)
                    setUsersForGroup(data.results);
                } else {
                    addRegistrationAlert(
                        "danger",
                        `Could not display members!.
                        Try again or contact server administrator.`
                      );
                }
            } catch (error) {
                addRegistrationAlert(
                    "danger",
                    `Could not display members!.
                    Try again or contact server administrator.`
                  );
            }
        };

        getUsersForGroup();
    }, [groupId, commData]);

    const handleRegistration = async () => {
        setIsQuerying(true);
        try {
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
            const data = await request.json();
            
            
            addRegistrationAlert(
                "success",
                `You have been added to ${group.group_name}.`
              );

            const updated = {
                ...commData,
                isRegistered: true,
                count: group.count + 1,
            };
            group.count = group.count + 1;
            setCommData(updated);
          } else {
            const data = await request.json();
            
                addRegistrationAlert(
                    "danger",
                    `We couldn't add you to ${group.group_name}. 
                    Try again or contact the administrator.`
                  );
          }
        } catch (error) {
       
            addRegistrationAlert(
                "danger",
                `We couldn't add you to ${group.group_name}. 
                Try again or contact the administrator.`
            );
        } finally {
          setIsQuerying(false);
        }
      };
    
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
              const updated = {
                ...commData,
                isRegistered: false,
                count: group.count - 1,
              };
              group.count = group.count - 1;
              setCommData(updated);
        
           
              addRegistrationAlert(
                "success",
                `We have cancelled your membership for ${group.group_name}.`
              );
        
            } else {
            
              addRegistrationAlert(
                "danger",
                `We couldn't cancel your membership for ${group.group_name}. 
                Try again or contact the administrator.`
              );
            }
          } catch (error) {
            addRegistrationAlert(
                "danger",
                `We couldn't cancel your membership for ${group.group_name}. 
                Try again or contact the administrator.`
              );
           
          } finally {
            setIsQuerying(false);
          }
        };

        const handleButtonClick = (e, action) => {
            e.stopPropagation();
            action();
          };

    // add loading states please, probably up top and not here
    // <i className='fas fa-calendar'></i>
    return (
        <>
            <SessionTimeoutHandler />
            <Header />
            {/* Community info container */}
            <div className="container spacing-from-header" >
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
                        />
                    ))}
                    </ToastContainer>
                </div>
                {group ? (
                    <div className='group-info mt-5 postiion'>
                        <h1>{group.group_name}</h1>
                        <img src={group.image_link} alt={group.group_name} />
                        <div className="row mt-4 postiion">
                            <div className="col-md-3 mb-0">
                                <div className='d-flex'>
                                    <div className="icon-container me-2">
                                        <i className='fas fa-user'>&ensp;</i>
                                    </div>
                                    <p className='mb-2'><strong>Number of members: </strong>{group.count}</p>
                                </div>
                            </div>
                        </div>
                        <div className='group-details mt-5 postiion'> 
                            <h2>Community Details</h2>
                            <p className='group-desc'>{group.group_desc}</p>
                        </div>
                        
                    </div>
                ) : (
                    <p>No community details available.</p>
                )}
                    <div className="register-button">
                        {commData && (
                            <CommunityRegisterButton
                            isRegistered={commData.isRegistered}
                            isDisabled={isQuerying}
                            handleRegister={(e) => handleButtonClick(e, handleRegistration)}
                            handleCancelRegistration={(e) => handleButtonClick(e, handleCancelRegistration)}
                            />
                        )}
                    </div>
                
            </div >
            {/* Users grid container */}
            <div className="container mt-5 position">
                <h4> Members </h4>
                {usersForGroup && usersForGroup.length > 0 ? (
                    <div className="row">
                        {usersForGroup.map(user => (
                            <div className="col-12 col-sm-6 col-md-3 col-lg-3 mb-4" key={user.user_id}>
                                <div className={`card square ${isAdmin ? 'admin-hover-effect' : ''}`} onClick={() => handleUserClick(user)}>
                                    <div className="card-body square-content">
                                        <img src={user.profile_photo ? user.profile_photo : logo} alt="Profile Photo" width="100px"/>
                                        <p className="card-title">{user.first_name} {user.last_name}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No members in this group.</p>
                )}
                {selectedUser && isAdmin && (
                    <Modal show={selectedUser !== null} onHide={closePopup} backdrop='static' keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>User Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>First Name:</strong> {selectedUser.first_name}</p>
                        <p><strong>Last Name:</strong> {selectedUser.last_name}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>Phone Nmber:</strong> {selectedUser.phone_number}</p>
                        <p><strong>Address:</strong> {selectedUser.address}</p>
                        <p><strong>Preferred Name:</strong> {selectedUser.preferred_name}</p>
                        <p><strong>Pronouns:</strong> {selectedUser.pronouns}</p>
                        <p><strong>Marital Status:</strong> {selectedUser.marital_status}</p>
                        <p><strong>Family Circumstance:</strong> {selectedUser.family_circumstance}</p>
                        <p><strong>Community Status:</strong> {selectedUser.community_status}</p>
                        <p><strong>Interests:</strong> {selectedUser.interests}</p>
                        <p><strong>Personal Identity:</strong> {selectedUser.personal_identity}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        {isAdmin && (
                            <button className={styles.submitButton} variant="danger" onClick={unregisterUser}>Remove User</button>
                        )}
                        <button className={styles.cancelButton} variant="secondary" onClick={closePopup}>Close</button>
                    </Modal.Footer>
                    </Modal>
                    )}
            </div>
        </>
    );
}

export default CommunitiesPage;