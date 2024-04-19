import React, { useEffect, useState } from 'react';
import AdminHeader from '../../components/headers/AdminHeader';
import LogoutButton from '../../components/auth-components/LogoutButton';
import { useUserContext } from '../../contexts/UserContextHandler';
import WebStreamLoader from '../../components/WebStream/WebStreamLoader';
import Modal from 'react-bootstrap/Modal'; 

function AdminDashboard() {
  const { userData, isLoading } = useUserContext();
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [blacklistedUsers, setBlacklistedUsers] = useState([]);


  useEffect(() => {
    setIsFetching(true);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/all-users`, {
      method: 'GET',
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
      // Filter out admin users
      const nonAdminUsers = data.filter(user => !user.is_admin);
      setAllUsers(nonAdminUsers);
      setIsFetching(false);
    })
    .catch(error => {
      console.error('Error fetching all users:', error);
      setIsFetching(false);
    });
  }, []);


useEffect(() => {
  const fetchBlacklistedUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/get-blacklisted-users`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();
      setBlacklistedUsers(data);
    } catch (error) {
      console.error('Error fetching blacklisted users:', error);
    }
  };

  fetchBlacklistedUsers();
}, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const closePopup = () => {
    setSelectedUser(null);
  };

  const blacklistAndDeleteUser = () => {
    // Confirm with the admin before proceeding
    const confirmAction = window.confirm("Are you sure you want to blacklist and delete this user? This action cannot be undone.");
    
    if (confirmAction) {
      if (!selectedUser) return;  // Guard clause if no user is selected
  
      fetch(`${import.meta.env.VITE_BACKEND_URL}/blacklist-and-delete-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',  // Ensure cookies are sent with the request if sessions are used
        body: JSON.stringify({ email: selectedUser.email })
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          alert('User has been blacklisted and deleted.');
          closePopup();
          // Refresh the list of users or remove the user from the state
          setAllUsers(allUsers.filter(user => user.email !== selectedUser.email));
          setBlacklistedUsers([...blacklistedUsers, {
            email: selectedUser.email,
            first_name: selectedUser.first_name,
            last_name: selectedUser.last_name
          }]);
        } else {
          alert('Error: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error blacklisting and deleting user:', error);
        alert('Failed to blacklist and delete the user.');
      });
    } else {
      // If the user cancels, just close the confirmation and do nothing
      console.log("User deletion cancelled.");
    }
  };
  
  const removeUserFromBlacklist = async (email) => {
    if (window.confirm("Are you sure you want to remove this user from the blacklist?")) {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/remove-user-from-blacklist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (data.status === 'success') {
          alert('User has been removed from the blacklist.');
          setBlacklistedUsers(blacklistedUsers.filter(user => user.email !== email));
        } else {
          alert('Error: ' + data.message);
        }
      } catch (error) {
        console.error('Error removing user from blacklist:', error);
        alert('Failed to remove the user from the blacklist.');
      }
    }
  };
  

  if (isLoading) {
    return (
      <>
        <AdminHeader />
        <div className="col-12 d-flex justify-content-center">
          <div className="spinner-border mt-5" role="status" style={{ width: '10rem', height: '10rem' }}>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
    <WebStreamLoader />
    <AdminHeader />
    <div>
      <h2>Hello {userData.first_name} {userData.last_name}</h2>
      <br/>
      <div>
        <h3>Website Analytics</h3>
        <h3>All Users</h3>
        <p>Click on a user to view user information.</p>
        {isFetching ? (
          <p>Loading users...</p>
        ) : (
          <ul style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '20px' }}>
            {allUsers.map(user => (
              <li key={user.email} onClick={() => handleUserClick(user)} style={{ cursor: 'pointer' }}>
                {user.first_name} {user.last_name}
              </li>
            ))}
          </ul>
        )}
        <h3>Blacklisted Users</h3>
        <ul style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {blacklistedUsers.map(user => (
            <li key={user.email} style={{ cursor: 'pointer' }}>
              {user.first_name} {user.last_name} - 
              <button onClick={() => removeUserFromBlacklist(user.email)}>Remove from Blacklist</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
    <LogoutButton />
    {selectedUser && (
    <Modal show={selectedUser !== null} onHide={closePopup}>
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
        <button variant="danger" onClick={blacklistAndDeleteUser}>Blacklist and Delete</button>
        <button variant="secondary" onClick={closePopup}>Close</button>
      </Modal.Footer>
    </Modal>
    )}
  </>
  );
}

export default AdminDashboard;
