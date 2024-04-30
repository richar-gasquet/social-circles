import React, { useEffect, useState } from 'react';
import AdminHeader from '../../components/headers/AdminHeader';
import { useUserContext } from '../../contexts/UserContextHandler';
import SessionTimeoutHandler from '../../components/session-checker/SessionTimeoutHandler';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Line } from 'react-chartjs-2';
import styles from '../../css/Buttons.module.css';
import dashstyles from '../../css/AdminDash.module.css'
import Loading from '../../components/shared-components/LoadingSpinner';
import ReactApexChart from 'react-apexcharts';



function AdminDashboard() {
  const { userData, isLoading } = useUserContext();
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [currentUsers, setCurrentUsers] = useState([]);
  const [rerender, setRerender] = useState(false);
  const [alertModal, setAlertModal] = useState({ show: false, message: '' });
  const [confirmModal, setConfirmModal] = useState({ show: false, onConfirm: () => {} });

  const [chartData, setChartData] = useState({
    series: [{
      name: 'Current Users',
      data: []
    }],
    options: {
      chart: {
        type: 'line',
        height: 350,
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: 'User Activity Over The Past 24 Hours',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: [],
        type: 'datetime',
        title: {
          text: 'Day'
        }
      },
      yaxis: {
        title: {
          text: 'Number of Users'
        },
        min: 0,
        tickAmount: 5
      }
    },
  });

  // Function to show confirm modal
  const showConfirmModal = (message, onConfirm) => {
    setConfirmModal({ show: true, message, onConfirm });
  };

  // Function to show alert modal
  const showAlertModal = (message) => {
    setAlertModal({ show: true, message });
  };

  // Function to handle confirm actions
  const handleConfirm = () => {
    confirmModal.onConfirm();
    setConfirmModal({ ...confirmModal, show: false }); // Hide modal after confirming
  };

  useEffect(() => {
    fetchCurrentUsers();
    const interval = setInterval(() => {
      fetchCurrentUsers();  // Fetch new data at a set interval
    }, 60000);  // 60 seconds

    return () => clearInterval(interval);  // Clean up the interval on component unmount
  }, []);

  const fetchCurrentUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/current_visitors`, {
        method: 'GET',
        credentials: 'include'
      });
      if(response.ok) { 
        const data = await response.json();
        console.log(data);
        const newTime = new Date().toISOString();
        const newSeriesData = chartData.series[0].data.concat({ x: newTime, y: data.current_visitors });
        const newXaxisCategories = chartData.options.xaxis.categories.concat(newTime);
        setChartData(prevChartData => ({
          ...prevChartData,
          series: [{ ...prevChartData.series[0], data: newSeriesData }],
          options: {
            ...prevChartData.options,
            xaxis: { ...prevChartData.options.xaxis, categories: newXaxisCategories }
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching current users:', error);
    }
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
    const fetchBlockedUsers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/get-blocked-users`, {
          method: 'GET',
          credentials: 'include'
        });
        const data = await response.json();
        setBlockedUsers(data);
      } catch (error) {
        console.error('Error fetching blocked users:', error);
      }
    };

    fetchBlockedUsers();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const closePopup = () => {
    setSelectedUser(null);
  };

  const blockAndDeleteUser = () => {
    // Confirm with the admin before proceeding
    showConfirmModal("Are you sure you want to block and delete this user? This action cannot be undone.", () => {
        if (!selectedUser) return;  // Guard clause if no user is selected
    
        fetch(`${import.meta.env.VITE_BACKEND_URL}/block-and-delete-user`, {
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
            showAlertModal('User has been blocked and deleted.');
            closePopup();
            // Use functional updates to ensure you are modifying the latest state
            setAllUsers(prevUsers => prevUsers.filter(user => user.email !== selectedUser.email));
            setFilteredUsers(prevUsers => prevUsers.filter(user => user.email !== selectedUser.email));
            setBlockedUsers(prevBlocked => [...prevBlocked, {
              email: selectedUser.email,
              first_name: selectedUser.first_name,
              last_name: selectedUser.last_name
            }]);
          } else {
            showAlertModal('Error: ' + data.message);
          }
        })
        .catch(error => {
          console.error('Error blocking and deleting user:', error);
          showAlertModal('Failed to block and delete the user.');
        });
    });
  };
  
  const removeUserFromBlockedList = async (email) => {
    showConfirmModal("Are you sure you want to remove this user from the block list?", async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/remove-user-from-block`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (data.status === 'success') {
          showAlertModal('User has been removed from the blocked list.');
          setBlockedUsers(blockedUsers.filter(user => user.email !== email));
        } else {
          showAlertModal('Error: ' + data.message);
        }
      } catch (error) {
        console.error('Error removing user from blocked list:', error);
        showAlertModal('Failed to remove the user from the blocked list.');
      }
    });
  };

  const handleLogout = (e) => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/logout`;
  };
  

  if (isLoading) {
    return (
      <>
        <AdminHeader />
        <Loading/>
      </>
    )
  }

  return (
    <>
    <SessionTimeoutHandler />
    <AdminHeader />
    <div style={{marginBottom: '5%', marginLeft: '5%', marginRight: '5%', paddingTop: '10em'}}>
      <div>
        <h2>Hello {userData.first_name} {userData.last_name}</h2>
        <br/>
        <div>
          <div style={{outline: '#F5EDED solid 10px', borderRadius: '1%', padding: '2%'}}>
            <h3 style={{marginLeft: '0%'}}>Website Analytics</h3>
            <ReactApexChart
              options={chartData.options}
              series={chartData.series}
              type="line"
              height={350}
            />
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
              <h3>Blocked Users</h3>
              <ul className='list-group' style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '20px', width: '50%' }}>
                {blockedUsers.map(user => (
                  <li className={'list-group-item'} key={user.email} style={{padding: 'auto'}}>
                    {user.first_name} {user.last_name} 
                    <button className={styles.smallSubmitButton} style={{marginLeft: '7%'}} onClick={() => removeUserFromBlockedList(user.email)}>Remove from Blocked List</button>
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
        <button className={styles.submitButton} variant="danger" onClick={blockAndDeleteUser}>Block and Delete</button>
        <button className={styles.cancelButton} variant="secondary" onClick={closePopup}>Close</button>
      </Modal.Footer>
    </Modal>
    )}
    <Modal show={confirmModal.show} onHide={() => setConfirmModal({ ...confirmModal, show: false })}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>{confirmModal.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmModal({ ...confirmModal, show: false })}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirm}>Confirm</Button>
        </Modal.Footer>
      </Modal>
      {/* Alert Modal */}
      <Modal show={alertModal.show} onHide={() => setAlertModal({ ...alertModal, show: false })}>
        <Modal.Header closeButton>
          <Modal.Title>Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body>{alertModal.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setAlertModal({ ...alertModal, show: false })}>Close</Button>
        </Modal.Footer>
      </Modal>
  </>
  );
}

export default AdminDashboard;
