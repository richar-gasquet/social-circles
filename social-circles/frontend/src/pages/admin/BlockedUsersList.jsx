import React from "react";
import styles from "../../css/Buttons.module.css";

/* Component to display the blocked users */
const BlockedUsersList = ({ blockedUsers, onRemove }) => {
  return (
    <div>
      <h3>Blocked Users</h3>
      <ul
        className="list-group"
        style={{
          maxHeight: "200px",
          overflowY: "auto",
          marginBottom: "20px",
          width: "50%",
        }}
      >
        {/* Map through each blocked user */}
        {blockedUsers.map((user) => (
          <li
            className={"list-group-item"}
            key={user.email}
            style={{ padding: "auto" }}
          >
            {user.first_name} {user.last_name}
            <button
              className={styles.smallSubmitButton}
              style={{ marginLeft: "7%" }}
              onClick={() => onRemove(user.email)}
            >
              Remove from Blocked List
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlockedUsersList;
