import React from 'react';

/* Component to display user details */
const UserDetails = ({ selectedUser }) => (
  <>
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
  </>
);

export default UserDetails;
