import React from "react";
import useDashboardLogic from "./useDashboardLogic";
import UserList from "./UserList";
import UserAnalyticsChart from "./UserAnalyticsChart";
import UserDetails from "./UserDetails";
import BlockedUsersList from "./BlockedUsersList";
import CustomModal from "./AdminModals";
import AdminHeader from "../../components/headers/AdminHeader";
import SessionTimeoutHandler from "../../components/session-checker/SessionTimeoutHandler";
import { Link } from "react-router-dom";
import styles from "../../css/Buttons.module.css";
import Loading from "../../components/shared-components/LoadingSpinner";

/* Dashboard component for the administrator */
function AdminDashboard() {
  const {
    userData,
    isLoading,
    selectedUser,
    chartData,
    handleConfirm,
    filteredUsers,
    searchTerm,
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
    handleLogout,
  } = useDashboardLogic(`${import.meta.env.VITE_BACKEND_URL}`);

  /* Display loading spinner while fetching user data*/
  if (isLoading) {
    return (
      <>
        <AdminHeader />
        <Loading />
      </>
    );
  }

  return (
    <>
      <SessionTimeoutHandler />
      <AdminHeader />
      <div
        style={{
          marginBottom: "5%",
          marginLeft: "5%",
          marginRight: "5%",
          paddingTop: "10em",
        }}
      >
        <div>
          <div className="row">
            <div className="col">
              <h2>
                Hello {userData.first_name} {userData.last_name}
              </h2>
            </div>
            <button className={styles.submitButton} style={{ float: "right" }}>
              <Link
                to="/user-dashboard"
                className="nav-link"
                style={{ color: "white" }}
              >
                User Dashboard
              </Link>
            </button>
          </div>
          <br />
          <div>
            {/* Create website analytics chart */}
            <div
              style={{
                outline: "#F5EDED solid 10px",
                borderRadius: "1%",
                padding: "2%",
              }}
            >
              <h3 style={{ marginLeft: "0%" }}>Website Analytics</h3>
              <UserAnalyticsChart chartData={chartData} />
            </div>
            <hr style={{ marginTop: "5%" }} />
            <div
              className="row"
              style={{
                marginTop: "5%",
                marginBottom: "3%",
                padding: "2%",
                outline: "#F5EDED solid 10px",
                borderRadius: "1%",
              }}
            >
              {/* Display user list and blocked user list */}
              <div className="col-md-6">
                <UserList
                  users={filteredUsers}
                  handleUserClick={handleUserClick}
                  handleSearchChange={handleSearchChange}
                  searchTerm={searchTerm}
                  isFetching={isFetching}
                />
              </div>
              <div className="col-md-6">
                <BlockedUsersList
                  blockedUsers={blockedUsers}
                  onRemove={removeUserFromBlockedList}
                />
              </div>
            </div>
          </div>
        </div>
        <button className={styles.submitButton} onClick={handleLogout}>
          Log Out
        </button>
      </div>
      {selectedUser && (
        <CustomModal
          show={Boolean(selectedUser)}
          onHide={closePopup}
          title="User Details"
          body={<UserDetails selectedUser={selectedUser} />}
          confirmAction={blockAndDeleteUser}
          confirmButtonText="Block and Delete"
        />
      )}
      <CustomModal
        show={confirmModal.show}
        onHide={() => setConfirmModal({ ...confirmModal, show: false })}
        title="Confirm Action"
        body={confirmModal.message}
        confirmAction={handleConfirm}
      />
      <CustomModal
        show={alertModal.show}
        onHide={() => setAlertModal({ ...alertModal, show: false })}
        title="Alert"
        body={alertModal.message}
      />
    </>
  );
}

export default AdminDashboard;
