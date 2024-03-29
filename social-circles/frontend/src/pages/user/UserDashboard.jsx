import React, { useState, useEffect, useContext } from "react";
import UserHeader from "../user/UserHeader.jsx";
import LogoutButton from "../auth/LogoutButton.jsx";
import UserContext from '/src/contexts/UserContext';

function UserDashboard() {
      const { userData } = useContext(UserContext);

  return (
    <>
      <UserHeader />
      <h2>This is the User Dashboard.</h2>
      <p>
        This information is secret. You should only be able to see it if you're
        logged in
      </p>
      <p>Here's some info about you!</p>
      <div>
        <p>Name: {userData.name} </p>
        <p>Email: {userData.email} </p>
      </div>
      <LogoutButton />
    </>
  );
}

export default UserDashboard;
