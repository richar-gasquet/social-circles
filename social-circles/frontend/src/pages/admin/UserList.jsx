import React from 'react';
import styles from '../../css/AdminDash.module.css';

const UserList = ({ users, handleUserClick, handleSearchChange, searchTerm, isFetching }) => {
  return (
    <div>
      <h3>All Users</h3>
      <input className='form-control mb-2' style={{width: '50%'}} type="text" placeholder="Search users and their info..." onChange={handleSearchChange} value={searchTerm}/>
      {isFetching ? (
        <p>Loading users...</p>
      ) : (
        <ul className='list-group' style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '20px', width: '50%' }}>
          {users.map(user => (
            <li className={`list-group-item ${styles.userName}`} key={user.email} onClick={() => handleUserClick(user)} style={{ cursor: 'pointer'}}>
              {user.first_name} {user.last_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
