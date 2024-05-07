import { useState, useEffect } from "react";
import { useUserContext } from "../../../contexts/UserContextHandler";

export const useFormLogic = (initialUserData) => {
  const { userData, isLoading } = useUserContext();
  const [editMode, setEditMode] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    onConfirm: () => {},
  });
  const [welcomeModal, setWelcomeModal] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    preferred_name: "",
    pronouns: "Select",
    phone_number: "",
    marital_status: "Select",
    family_circumstance: "",
    community_status: "",
    interests: "",
    personal_identity: "",
  });

  useEffect(() => {
    if (userData) {
      // Populate form data if user data exists
      setFormData((prevFormData) => ({ ...prevFormData, ...userData }));
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Reset error for that field
    if (formErrors[name]) {
      setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    // Include validation for both regular and "Other" fields
    if (
      ([
        "first_name",
        "last_name",
        "address",
        "phone_number",
        "pronouns",
        "marital_status",
      ].includes(name) ||
        name.endsWith("Other")) &&
      !value.trim()
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Please complete this field.",
      }));
    }
  };

  const handleCancel = () => {
    if (userData.is_admin === undefined) {
      window.location.href = `${import.meta.env.VITE_BACKEND_URL}/logout`;
    } else {
      // Reset form data to the initial user data and conditionally set 'Other' fields
      setFormData(userData);
      setEditMode(false);
    }
  };

  const toggleEdit = () => {
    setEditMode(true);
    if (userData) {
      // Populate form data if user data exists
      const updatedFormData = { ...userData };

      // Check for pronouns
      const pronounsOptions = ["He/His", "She/Her", "They/Them"];
      if (!pronounsOptions.includes(userData.pronouns)) {
        updatedFormData.pronouns = "Other";
        updatedFormData.pronounsOther = userData.pronouns;
      }

      // Check for marital status
      const maritalStatusOptions = ["Single", "Married", "Divorced", "Widowed"];
      if (!maritalStatusOptions.includes(userData.marital_status)) {
        updatedFormData.marital_status = "Other";
        updatedFormData.marital_statusOther = userData.marital_status;
      }
      setFormData(updatedFormData);
    }
  };

  const updateUserData = (newData) => {
    setUserContext((prev) => ({ ...prev, ...newData }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Character limits definition
    const maxChar = {
      first_name: 50,
      last_name: 50,
      address: 50,
      phone_number: 15,
      email: 50,
      preferred_name: 50,
      pronouns: 50,
      marital_status: 50,
      family_circumstance: 50,
      community_status: 50,
      interests: 50,
      personal_identity: 50,
    };

    // Handle validation and character limit
    const newErrors = {};

    Object.keys(formData).forEach((field) => {
      if (
        field.endsWith("Other") &&
        formData[field] === "" &&
        formData[field.replace("Other", "")] === "Other"
      ) {
        newErrors[field] = "Please complete this field.";
      } else if (
        ["first_name", "last_name", "address", "phone_number"].includes(
          field
        ) &&
        !formData[field].trim()
      ) {
        newErrors[field] = "Please complete this field.";
      }
      // Check for character limits
      if (
        maxChar[field] &&
        formData[field] &&
        formData[field].length > maxChar[field]
      ) {
        newErrors[field] = `Character limit of ${maxChar[field]} exceeded.`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    // Adjust formData for submission
    const submissionData = { ...formData };
    ["pronouns", "marital_status"].forEach((field) => {
      if (
        submissionData[field] === "Other" &&
        submissionData[`${field}Other`] !== undefined
      ) {
        submissionData[field] = submissionData[`${field}Other`];
      }
    });
    // API call to update user data
    const endpoint =
      userData.is_admin === undefined ? "/add-user" : "/update-user";
    try {
      const request = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        }
      );
      if (request.ok) {
        setEditMode(false);
        if (endpoint === "/add-user") {
          setWelcomeModal(true);
          userData.is_admin = false;
          updateUserData(submissionData);
        } else {
          window.location.reload();
        }
      } else {
        console.error("Failed to submit form request");
      }
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  const handleDelete = () => {
    showConfirmModal(
      "Are you sure you want to delete your account? This action cannot be undone.",
      async () => {
        try {
          const request = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/delete-user`,
            {
              credentials: "include",
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email: userData.email }),
            }
          );
          if (request.ok) {
            console.log("User deleted successfully");
            window.location.href = `${import.meta.env.VITE_BACKEND_URL}/logout`;
          } else {
            console.error("Failed to delete user");
          }
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      }
    );
  };

  const handleDynamicSelectChange = (e) => {
    const { name, value } = e.target;
    if (value === "Other") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
        [`${name}Other`]: "", // Initialize the "Other" field to ensure it's treated as empty for validation
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
        [`${name}Other`]: undefined, // Properly handle other values
      }));
    }
  };

  // Function to show confirm modal
  const showConfirmModal = (message, onConfirm) => {
    setConfirmModal({ show: true, message, onConfirm });
  };

  // Function to handle confirm actions
  const handleConfirm = () => {
    confirmModal.onConfirm();
    setConfirmModal({ ...confirmModal, show: false }); // Hide modal after confirming
  };

  return {
    formData,
    setFormData,
    formErrors,
    isLoading,
    editMode,
    handleBlur,
    handleChange,
    handleSubmit,
    handleCancel,
    handleDelete,
    toggleEdit,
    confirmModal,
    handleDynamicSelectChange,
    showConfirmModal,
    handleConfirm,
    userData,
    welcomeModal,
  };
};
