// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import UserHeader from "../../../components/headers/UserHeader.jsx";
// import SessionTimeoutHandler from '../../../components/session-checker/SessionTimeoutHandler.jsx';
// import '../../../css/CommunitiesPage.css'
// import styles from '../../../css/Buttons.module.css';
// import Modal from 'react-bootstrap/Modal'; 
// import AdminHeader from "../../../components/headers/AdminHeader.jsx";
// import { useAuthContext } from "../../../contexts/AuthContextHandler.jsx";
// import logo from "../../../assets/social-circles-logo.png"


// function CommunitiesPage() {
//     const { groupId } = useParams();
//     const [group, setGroup] = useState(null);
//     const [displayAlert, setDisplayAlert] = useState(null);
//     const [usersForGroup, setUsersForGroup] = useState(null);
//     const [selectedUser, setSelectedUser] = useState(null);
//     const { isAdmin } = useAuthContext();

//     const Header = isAdmin ? AdminHeader : UserHeader;

//     const cardBodyStyle = {
//         padding: '0.5rem'  // Adjust padding as needed
//     };

//     const handleUserClick = (user) => {
//         setSelectedUser(user);
//     };
    
//       const closePopup = () => {
//         setSelectedUser(null);
//     };

//     const unregisterUser = () => {
//         // Confirm with the admin before proceeding
//         const confirmAction = window.confirm("Are you sure you want to unregister this user?");
        
//         if (confirmAction) {
//           if (!selectedUser) return;  // Guard clause if no user is selected
      
//           fetch(`${import.meta.env.VITE_BACKEND_URL}/remove-user`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               'Accept': 'application/json',
//             },
//             credentials: 'include',  // Ensure cookies are sent with the request if sessions are used
//             body: JSON.stringify({ email: selectedUser.email,
//                                     group_id: groupId})
//           })
//           .then(response => response.json())
//           .then(data => {
//             if (data.status === 'success') {
//               alert('User has been unregistered.');
//               closePopup();
//               // Refresh the list of users or remove the user from the state
//               setUsersForGroup(usersForGroup.filter(user => user.email !== selectedUser.email));
             
//             } else {
//               alert('Error: ' + data.message);
//             }
//           })
//           .catch(error => {
//             console.error('Error unregistering user:', error);
//             alert('Failed to unregister user.');
//           });
//         } else {
//           // If the user cancels, just close the confirmation and do nothing
//           console.log("User deletion cancelled.");
//         }
//       };

//     useEffect(() => {
//         const getGroupInfo = async () => {
//             try {
//                 const request = await fetch(
//                     `${import.meta.env.VITE_BACKEND_URL}/api/get-one-group-info?group_id=${groupId}`,
//                     {
//                         credentials: "include",
//                     }
//                 );
//                 if (request.ok) {
//                     const data = await request.json();
//                     console.log(data.results)
//                     setGroup(data.results);
//                 } else {
//                     setDisplayAlert({
//                         type: "danger",
//                         header: "Could not display community!",
//                         text: "Try again or contact the administrator.",
//                     });
//                 }
//             } catch (error) {
//                 setDisplayAlert({
//                     type: "danger",
//                     header: "Could not display communities!",
//                     text: "Try again or contact the administrator.",
//                 });
//             }
//         };

//         getGroupInfo();
//     }, [groupId]);

//     useEffect(() => {
//         const getUsersForGroup = async () => {
//             try {
//                 const request = await fetch(
//                     `${import.meta.env.VITE_BACKEND_URL}/api/get-users-for-group?group_id=${groupId}`,
//                     {
//                         credentials: "include",
//                     }
//                 );
//                 if (request.ok) {
//                     const data = await request.json();
//                     console.log(data.results)
//                     setUsersForGroup(data.results);
//                 } else {
//                     setDisplayAlert({
//                         type: "danger",
//                         header: "Could not display users!",
//                         text: "Try again or contact the administrator.",
//                     });
//                 }
//             } catch (error) {
//                 setDisplayAlert({
//                     type: "danger",
//                     header: "Could not display users!",
//                     text: "Try again or contact the administrator.",
//                 });
//             }
//         };

//         getUsersForGroup();
//     }, [groupId]);

//     // add loading states please, probably up top and not here
//     // <i className='fas fa-calendar'></i>
//     return (
//         <>
//             <SessionTimeoutHandler />
//             <Header />
//             {/* Community info container */}
//             <div className="container position" >
//                 {console.log(group)}
//                 {group ? (
//                     <div className='group-details'>
//                         <h1>{group.group_name}</h1>
//                         <img src={group.image_link} alt={group.group_name} />
//                         <div className="row">
//                             <div className="col-md-3 group-details-col mb-0">
//                                 <div className="d-flex">
//                                     <div className="icon-container me-2">
//                                         <i className='fas fa-clock'>&nbsp;</i>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="col-md-3 mb-0">
//                                 <div className='d-flex'>
//                                     <div className="icon-container me-2">
//                                         <i className='fas fa-map-marker-alt'>&nbsp;&nbsp;</i>
//                                     </div>
                            
//                                 </div>
//                             </div>
//                         </div>

//                         <h2>Group Details</h2>
//                         <p>{group.group_desc}</p>
//                         <p>{group.filled_spots} users.</p>
//                     </div>
//                 ) : (
//                     <p>No community details available.</p>
//                 )}
//             <hr/>
//             </div >
//             {/* Users grid container */}
//             <div className="container mt-4 position">
//                 <h4> Registered Users </h4>
//                 {usersForGroup && usersForGroup.length > 0 ? (
//                     <div className="row">
//                         {usersForGroup.map(user => (
//                             <div className="col-12 col-sm-6 col-md-3 col-lg-3 mb-4" key={user.user_id}>
//                                 <div className="card square" onClick={() => handleUserClick(user)}>
//                                     <div className="card-body square-content">
//                                         <img src={user.profile_photo ? user.profile_photo : logo} alt="Profile Photo" width="100px"/>
//                                         <p className="card-title">{user.first_name} {user.last_name}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <p>No users registered for this community.</p>
//                 )}
//                 {selectedUser && (
//                 <Modal show={selectedUser !== null} onHide={closePopup}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>User Details</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <p><strong>First Name:</strong> {selectedUser.first_name}</p>
//                     <p><strong>Last Name:</strong> {selectedUser.last_name}</p>
//                     <p><strong>Email:</strong> {selectedUser.email}</p>
//                     <p><strong>Phone Nmber:</strong> {selectedUser.phone_number}</p>
//                     <p><strong>Address:</strong> {selectedUser.address}</p>
//                     <p><strong>Preferred Name:</strong> {selectedUser.preferred_name}</p>
//                     <p><strong>Pronouns:</strong> {selectedUser.pronouns}</p>
//                     <p><strong>Marital Status:</strong> {selectedUser.marital_status}</p>
//                     <p><strong>Family Circumstance:</strong> {selectedUser.family_circumstance}</p>
//                     <p><strong>Community Status:</strong> {selectedUser.community_status}</p>
//                     <p><strong>Interests:</strong> {selectedUser.interests}</p>
//                     <p><strong>Personal Identity:</strong> {selectedUser.personal_identity}</p>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <button className={styles.submitButton} variant="danger" onClick={unregisterUser}>Remove User</button>
//                     <button className={styles.cancelButton} variant="secondary" onClick={closePopup}>Close</button>
//                 </Modal.Footer>
//                 </Modal>
//                 )}
//             </div>
//         </>
//     );
// }

// export default CommunitiesPage;