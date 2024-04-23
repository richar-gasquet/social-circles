import React, { useEffect, useState } from 'react';
import AdminHeader from '../../components/headers/AdminHeader';
import { useUserContext } from '../../contexts/UserContextHandler';
import SessionTimeoutHandler from '../../components/session-checker/SessionTimeoutHandler';
import Modal from 'react-bootstrap/Modal'; 
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend } from 'chart.js';
import styles from '../../css/Buttons.module.css';
import dashstyles from '../../css/AdminDash.module.css'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);


function AdminDashboard() {
  const { userData, isLoading } = useUserContext();
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [blacklistedUsers, setBlacklistedUsers] = useState([]);
  const [currentUsers, setCurrentUsers] = useState([]);
  const [rerender, setRerender] = useState(false);
  const [chartData, setChartData] = useState({
    labels: [], // This will hold time intervals or dates
    datasets: [{
      label: 'Current Users',
      data: [], // Array of user counts
      fill: false,
      backgroundColor: 'rgb(0, 150, 255)',
      borderColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1
    }]
  });

  const fetchCurrentUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/current_visitors`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();
      console.log(data);
      updateChartData(data.current_visitors);
    } catch (error) {
      console.error('Error fetching current users:', error);
    }
  };

  const updateChartData = (currentCount) => {
    const newTime = new Date().toLocaleTimeString();
    const newChartData = { ...chartData };
    newChartData.labels.push(newTime);
    newChartData.datasets[0].data.push(currentCount);
    if (newChartData.labels.length > 10) { // Limit data points
      newChartData.labels.shift();
      newChartData.datasets[0].data.shift();
    }
    setChartData(newChartData);
  };

  // Button click handler to force redraw
  const handleRedraw = () => {
    fetchCurrentUsers();
    setRerender(true);
    setTimeout(() => setRerender(false), 0);  // Reset redraw state immediately
  };

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
      setFilteredUsers(nonAdminUsers);
      setIsFetching(false);
    })
    .catch(error => {
      console.error('Error fetching all users:', error);
      setIsFetching(false);
    });
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    filterUsers(value);
  };

  const filterUsers = (term) => {
    const lowerCaseTerm = term.toLowerCase();
    const filtered = allUsers.filter(user => {
      console.log(user)
      return (
        (user.first_name && user.first_name.toLowerCase().includes(lowerCaseTerm)) ||
        (user.last_name && user.last_name.toLowerCase().includes(lowerCaseTerm)) ||
        (user.email && user.email.toLowerCase().includes(lowerCaseTerm)) ||
        (user.phone_number && user.phone_number.toLowerCase().includes(lowerCaseTerm)) ||
        (user.address && user.address.toLowerCase().includes(lowerCaseTerm)) ||
        (user.pronouns && user.pronouns.toLowerCase().includes(lowerCaseTerm)) ||
        (user.marital_status && user.marital_status.toLowerCase().includes(lowerCaseTerm)) ||
        (user.family_circumstance && user.family_circumstance.toLowerCase().includes(lowerCaseTerm)) ||
        (user.community_status && user.community_status.toLowerCase().includes(lowerCaseTerm)) ||
        (user.interests && user.interests.toLowerCase().includes(lowerCaseTerm)) ||
        (user.personal_identity && user.personal_identity.toLowerCase().includes(lowerCaseTerm))
        );
    });
    setFilteredUsers(filtered);
  };


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

  const handleLogout = (e) => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/logout`;
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
    <SessionTimeoutHandler />
    <AdminHeader />
    <div style={{margin: '5%'}}>
      <div>
        <h2>Hello {userData.first_name} {userData.last_name}</h2>
        <br/>
        <div>
          <div style={{outline: '#F5EDED solid 10px', borderRadius: '1%', padding: '2%'}}>
            <h3 style={{marginLeft: '5%'}}>Website Analytics</h3>
            <h4 style={{marginLeft: '5%'}}>Current Users on Site</h4>
            <div style={{ width: '75%', margin: 'auto'}}>
              <Line data={chartData} redraw={rerender}/>
              <button className={styles.submitButton} style={{marginTop: '2%'}} onClick={handleRedraw}>Redraw Graph</button>
            </div>
          </div>
          <hr style={{marginTop: '5%'}}/>
          <div className='row' style={{marginTop: '5%', marginBottom: '3%', padding: '2%', outline: '#F5EDED solid 10px', borderRadius: '1%'}}>
            <div className='col-md-6'>
              <h3>All Users</h3>
              <input className='form-control mb-2' style={{width: '50%'}} type="text" placeholder="Search users and their info..." onChange={handleSearchChange} value={searchTerm}/>
              <p>Click on a user to view user information.</p>
              {isFetching ? (
                <p>Loading users...</p>
              ) : (
                <ul className='list-group' style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '20px', width: '50%' }}>
                  {filteredUsers.map(user => (
                    <li className={`list-group-item ${dashstyles.userName}`} key={user.email} onClick={() => handleUserClick(user)} style={{ cursor: 'pointer'}}>
                      {user.first_name} {user.last_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className='col-md-6'>
              <h3>Blacklisted Users</h3>
              <ul className='list-group' style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '20px', width: '50%' }}>
                {blacklistedUsers.map(user => (
                  <li className={'list-group-item'} key={user.email} style={{padding: 'auto'}}>
                    {user.first_name} {user.last_name} 
                    <button className={styles.smallSubmitButton} style={{marginLeft: '7%'}} onClick={() => removeUserFromBlacklist(user.email)}>Remove from Blacklist</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <button className={styles.submitButton} onClick={handleLogout}>Log Out</button>
    </div>
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
        <button className={styles.submitButton} variant="danger" onClick={blacklistAndDeleteUser}>Blacklist and Delete</button>
        <button className={styles.cancelButton} variant="secondary" onClick={closePopup}>Close</button>
      </Modal.Footer>
    </Modal>
    )}
  </>
  );
}

export default AdminDashboard;
