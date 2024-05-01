import React from 'react';
import useDashboardLogic from './useDashboardLogic';
import UserList from './UserList';
import UserAnalyticsChart from './UserAnalyticsChart';
import UserDetails from './UserDetails';
import BlockedUsersList from './BlockedUsersList';
import CustomModal from './AdminModals';
import AdminHeader from '../../components/headers/AdminHeader';
import SessionTimeoutHandler from '../../components/session-checker/SessionTimeoutHandler';
import Loading from '../../components/shared-components/LoadingSpinner';
import styles from '../../css/Buttons.module.css';

function AdminDashboard() {
  const {
    userData,
    isLoading,
    allUsers,
    selectedUser,
    setSelectedUser,
    chartData,
    handleConfirm,
    filteredUsers,
    searchTerm,
    setSearchTerm,
    handleSearchChange,
    isFetching,
    blockedUsers,
    blockAndDeleteUser,
    removeUserFromBlockedList,
    closePopup,
    alertModal,
    setAlertModal,
    confirmModal,
    setConfirmModal,
    handleUserClick,
    handleLogout
  } = useDashboardLogic(`${import.meta.env.VITE_BACKEND_URL}`);

  
  

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
            <UserAnalyticsChart chartData={chartData} />
          </div>
          <hr style={{marginTop: '5%'}}/>
          <div className='row' style={{marginTop: '5%', marginBottom: '3%', padding: '2%', outline: '#F5EDED solid 10px', borderRadius: '1%'}}>
            <div className='col-md-6'>
              <UserList users={filteredUsers} handleUserClick={handleUserClick} handleSearchChange={handleSearchChange} searchTerm={searchTerm} isFetching={isFetching} />
            </div>
            <div className='col-md-6'>
              <BlockedUsersList blockedUsers={blockedUsers} onRemove={removeUserFromBlockedList} />
            </div>
          </div>
        </div>
      </div>
      <button className={styles.submitButton} onClick={handleLogout}>Log Out</button>
    </div>
    {selectedUser && (
        <CustomModal show={Boolean(selectedUser)} onHide={closePopup} title="User Details" body={<UserDetails selectedUser={selectedUser} />} confirmAction={blockAndDeleteUser} confirmButtonText="Block and Delete" />
      )}
      <CustomModal show={confirmModal.show} onHide={() => setConfirmModal({...confirmModal, show: false})} title="Confirm Action" body={confirmModal.message} confirmAction={handleConfirm} />
      <CustomModal show={alertModal.show} onHide={() => setAlertModal({...alertModal, show: false})} title="Alert" body={alertModal.message} />
  </>
  );
}

export default AdminDashboard;
