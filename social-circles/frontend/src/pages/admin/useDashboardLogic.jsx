import { useState, useEffect } from "react";
import { useUserContext } from "../../contexts/UserContextHandler";

/* Logic for Admin Dashboard */
const useDashboardLogic = (backendUrl) => {
  const { userData, isLoading } = useUserContext();
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [alertModal, setAlertModal] = useState({ show: false, message: "" });
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    onConfirm: () => {},
  });
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Current Users",
        data: [],
      },
    ],
    options: {
      chart: {
        type: "line",
        height: 350,
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "User Activity Over The Past 24 Hours",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [],
        type: "datetime",
        title: {
          text: "Day",
        },
      },
      yaxis: {
        title: {
          text: "Number of Users",
        },
        min: 0,
        tickAmount: 5,
      },
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
      fetchCurrentUsers(); // Fetch new data at a set interval
    }, 60000); // 60 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  useEffect(() => {
    setIsFetching(true);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/all-users`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        // Filter out admin users
        const nonAdminUsers = data.filter((user) => !user.is_admin);
        setAllUsers(nonAdminUsers);
        setFilteredUsers(nonAdminUsers);
        setIsFetching(false);
      })
      .catch((error) => {
        console.error("Error fetching all users:", error);
        setIsFetching(false);
      });
  }, []);

  useEffect(() => {
    /* Retrieve blocked users from backend */
    const fetchBlockedUsers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/get-blocked-users`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        setBlockedUsers(data);
      } catch (error) {
        console.error("Error fetching blocked users:", error);
      }
    };

    fetchBlockedUsers();
  }, []);

  /* Get the current visitors in the website */
  const fetchCurrentUsers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/current_visitors`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) { // Fetch successful, update chart parameters
        const data = await response.json();
        const newTime = new Date().toISOString();
        const newSeriesData = chartData.series[0].data.concat({
          x: newTime,
          y: data.current_visitors,
        });
        const newXaxisCategories =
          chartData.options.xaxis.categories.concat(newTime);
        setChartData((prevChartData) => ({
          ...prevChartData,
          series: [{ ...prevChartData.series[0], data: newSeriesData }],
          options: {
            ...prevChartData.options,
            xaxis: {
              ...prevChartData.options.xaxis,
              categories: newXaxisCategories,
            },
          },
        }));
      }
    } catch (error) {
      console.error("Error fetching current users:", error);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    filterUsers(value);
  };

  /* Filter users based on all their details */
  const filterUsers = (term) => {
    const lowerCaseTerm = term.toLowerCase();
    const filtered = allUsers.filter((user) => {
      return (
        (user.first_name &&
          user.first_name.toLowerCase().includes(lowerCaseTerm)) ||
        (user.last_name &&
          user.last_name.toLowerCase().includes(lowerCaseTerm)) ||
        (user.email && user.email.toLowerCase().includes(lowerCaseTerm)) ||
        (user.phone_number &&
          user.phone_number.toLowerCase().includes(lowerCaseTerm)) ||
        (user.address && user.address.toLowerCase().includes(lowerCaseTerm)) ||
        (user.pronouns &&
          user.pronouns.toLowerCase().includes(lowerCaseTerm)) ||
        (user.marital_status &&
          user.marital_status.toLowerCase().includes(lowerCaseTerm)) ||
        (user.family_circumstance &&
          user.family_circumstance.toLowerCase().includes(lowerCaseTerm)) ||
        (user.community_status &&
          user.community_status.toLowerCase().includes(lowerCaseTerm)) ||
        (user.interests &&
          user.interests.toLowerCase().includes(lowerCaseTerm)) ||
        (user.personal_identity &&
          user.personal_identity.toLowerCase().includes(lowerCaseTerm))
      );
    });
    setFilteredUsers(filtered);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const closePopup = () => {
    setSelectedUser(null);
  };

  const blockAndDeleteUser = () => {
    // Confirm with the admin before proceeding
    showConfirmModal(
      "Are you sure you want to block and delete this user? This action cannot be undone.",
      () => {
        if (!selectedUser) return; // Guard clause if no user is selected

        fetch(`${import.meta.env.VITE_BACKEND_URL}/block-and-delete-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include", // Ensure cookies are sent with the request if sessions are used
          body: JSON.stringify({ email: selectedUser.email }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "success") {
              showAlertModal("User has been blocked and deleted.");
              closePopup();
              // Use functional updates to ensure the modification of the latest state
              setAllUsers((prevUsers) =>
                prevUsers.filter((user) => user.email !== selectedUser.email)
              );
              setFilteredUsers((prevUsers) =>
                prevUsers.filter((user) => user.email !== selectedUser.email)
              );
              setBlockedUsers((prevBlocked) => [
                ...prevBlocked,
                {
                  email: selectedUser.email,
                  first_name: selectedUser.first_name,
                  last_name: selectedUser.last_name,
                },
              ]);
            } else {
              showAlertModal("Error: " + data.message);
            }
          })
          .catch((error) => {
            console.error("Error blocking and deleting user:", error);
            showAlertModal("Failed to block and delete the user.");
          });
      }
    );
  };

  /* Unblock an user via FETCH */
  const removeUserFromBlockedList = async (email) => {
    showConfirmModal(
      "Are you sure you want to remove this user from the block list?",
      async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/remove-user-from-block`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ email }),
            }
          );
          const data = await response.json();
          if (data.status === "success") {
            showAlertModal("User has been removed from the blocked list.");
            setBlockedUsers(
              blockedUsers.filter((user) => user.email !== email)
            );
          } else {
            showAlertModal("Error: " + data.message);
          }
        } catch (error) {
          console.error("Error removing user from blocked list:", error);
          showAlertModal("Failed to remove the user from the blocked list.");
        }
      }
    );
  };

  const handleLogout = (e) => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/logout`;
  };

  return {
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
    handleLogout,
  };
};

export default useDashboardLogic;
