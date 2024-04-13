import { useState, useEffect } from 'react';
import { useUserContext } from '../../../contexts/UserContextHandler';
import UserHeader from '../../../components/headers/UserHeader';
import GuestHeader from '../../../components/headers/GuestHeader';
import styles from '../../../css/ProfileForm.module.css';


function Profile() {
  const { userData, isLoading} = useUserContext();
  console.log(userData)
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    preferred_name: '',
    pronouns: '',
    phone_number: '',
    marital_status: '',
    family_circumstance: '',
    community_status: '',
    interests: '',
    personal_identity: '',
  });

  useEffect(() => {
    if (userData) {
      // Populate form data if user data exists
      setFormData(prevFormData => ({ ...prevFormData, ...userData }));
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCancel = () => {
    if (userData.is_admin === undefined) {
      window.location.href = `${import.meta.env.VITE_BACKEND_URL}/logout`; 
    } else {
      setEditMode(false);
    }
  };

  const toggleEdit = () => {
    setEditMode(true);
    setFormData(userData);
  };

  const handleLogout = (e) => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/logout`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // API call to update user data
    const endpoint = userData.is_admin === undefined ? '/add-user' : '/update-user';
    try {
      const request = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (request.ok) {
        setEditMode(false);
        window.location.reload();
      } else {
        console.error('Failed to submit form request');
      }
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const request = await fetch(`${import.meta.env.VITE_BACKEND_URL}/delete-user`, {
          credentials: "include",
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userData.email })
        });
        if (request.ok) {
          console.log('User deleted successfully');
          window.location.href = `${import.meta.env.VITE_BACKEND_URL}/logout`; 
        } else {
          console.error('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };


  if (isLoading) {
    return <div>Loading...</div>; // Or a more sophisticated loader/spinner
  }

  // Determine which header to use based on whether is_admin is undefined
  const Header = typeof userData.is_admin === 'boolean' ? UserHeader : GuestHeader;

  if (!userData || userData.email === undefined || userData.is_admin === undefined || editMode === true) {
    return (
        <>
        <Header />
        <div>
            <h2 className={styles.h2Profile}>Profile</h2>
            <p className={styles.pProfile}>Please fill in the information to complete your account</p>
        </div>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
        {/* Iterate over form fields to create form elements, excluding specified fields */}
        {Object.keys(formData).map((key) => {
            // Skip fields we don't want to include in the form
            if (['is_admin', 'picture'].includes(key)) return null;

            // Function to capitalize the first letter of each word in the label
            const capitalizeLabel = (label) => {
            return label.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            };

            return (
            <div key={key} className={styles.formGroup} hidden={key === 'email' ? true : false}>
                <label>{capitalizeLabel(key)}:</label>
                <input
                type="text"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                />
            </div>
            );
        })}
        <button className={styles.submitButton} type="submit">Submit</button>
        <button className={styles.handleCancel} type="button" onClick={handleCancel}>Cancel</button>
        </form>
      </>
    );
  } else {
    return (
      <>
        <Header />
        {/* Display user information */}
        <div className={styles.userProfile}>
          <div className={styles.userProfileLeft}>
            <img className={styles.profilePic} src={userData.picture}/>
            <h3 className={styles.name}>{userData.first_name} {userData.last_name}</h3>
            <button className={styles.toggleEdit} onClick={toggleEdit}>Update Information</button>
            <button className={styles.handleLogout} onClick={handleLogout}>Log Out</button>
            <button className={styles.handleDelete} onClick={handleDelete}>Delete Account</button>
          </div>
          <div className={styles.userProfileRight}>
            <h3>Your Information</h3>
            {Object.keys(formData).map((key) => {
              // Skip fields we don't want to include in the form
              if (['is_admin', 'picture'].includes(key)) return null;

              // Function to capitalize the first letter of each word in the label
              const capitalizeLabel = (label) => {
              return label.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
              };

              return (
                <>
                <p>{capitalizeLabel(key)}: {formData[key]}</p>
                </>
              );
            })}
          </div>
        </div>
        {/* Add more fields as needed */}
        
      </>
    );
  }
}
  
export default Profile;