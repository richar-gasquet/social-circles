import { useState, useEffect } from 'react';
import { useUserContext } from '../../../contexts/UserContextHandler';
import AdminHeader from '../../../components/headers/AdminHeader';
import UserHeader from '../../../components/headers/UserHeader';
import GuestHeader from '../../../components/headers/GuestHeader';
import styles from '../../../css/ProfileForm.module.css';
import SessionTimeoutHandler from '../../../components/session-checker/SessionTimeoutHandler';


function Profile() {
  const {userData, isLoading} = useUserContext();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    preferred_name: '',
    pronouns: 'Select',
    phone_number: '',
    marital_status: 'Select',
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

  const handleDynamicSelectChange = (e) => {
    const { name, value } = e.target;
    if (value === "Other") {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value,
        [`${name}Other`]: ''
      }));
    } else {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value,
        [`${name}Other`]: undefined
      }));
    }
  };

  const pronounsOptions = ['He/His', 'She/Her', 'They/Them', 'Other'];
  const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed', 'Other'];

  // Determine which header to use based on whether is_admin is undefined
  const Header = userData.is_admin ? AdminHeader : (userData.is_admin === false ? UserHeader : GuestHeader);

  if (isLoading) {
    return (
      <>
      <Header />
      <div className="col-12 d-flex justify-content-center">
        <div className="spinner-border mt-5" role="status"
          style={{ width: '10rem', height: '10rem'}}>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
      </>
    )
  }

  if (!userData || userData.email === undefined || userData.is_admin === undefined || editMode === true) {
    return (
      <>
      {userData && <SessionTimeoutHandler />}
      <Header />
      <div className="container mt-4">
          <h2>Profile</h2>
          <p>Please fill in the information to complete your account</p>
          <form onSubmit={handleSubmit} className="mb-3">
            {Object.keys(formData).map(key => {
              if (['is_admin', 'picture'].includes(key) || key.endsWith('Other')) return null;
              const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              const isSelect = key === 'pronouns' || key === 'marital_status';
              const isOtherField = formData[`${key}Other`] !== undefined;
              return (
                <div style={{marginTop: '4%'}} className="input-group mb-3" key={key}>
                  <label className="input-group-text">{label}</label>
                  {isSelect ? (
                    <select
                      className="form-select"
                      name={key}
                      value={formData[key]}
                      onChange={handleDynamicSelectChange}
                      required
                    >
                      <option value="Select">Select</option>
                      {key === 'pronouns' ? pronounsOptions.map(option => <option key={option} value={option}>{option}</option>) : maritalStatusOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className="form-control"
                      required={key === 'first_name' || key === 'last_name' || key === 'address' || key === 'phone_number'}
                    />
                  )}
                  {isOtherField && (
                    <input
                      type="text"
                      name={`${key}Other`}
                      value={formData[`${key}Other`]}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Please specify" required />
                      )}
                </div>
                      );
              })}
          <button type="submit" className={styles.submitButton}>Submit</button>
          <button type="button" onClick={handleCancel} className={styles.handleCancel}>Cancel</button>
        </form>
      </div>
      </>
    );
  } else {
    return (
      <>
        {userData && <SessionTimeoutHandler />}
        <Header />
        <div className="container mt-4">
          <div className={styles.profileRow} >
            <div className="col-md-6">
              <div className={styles.profilePicWrap}>
                <img src={userData.picture} alt="Profile" className={styles.profilePic} referrerPolicy="no-referrer"/>
              </div>
              <h3 className={styles.name}>{userData.first_name} {userData.last_name}</h3>
              <div className={styles.buttonWrap}>
                <button onClick={toggleEdit} className={styles.toggleEdit}>Update Information</button>
              </div>
              <div className={styles.buttonWrap}>
                <button onClick={handleLogout} className={styles.handleLogout}>Log Out</button>
              </div>
              <div className={styles.buttonWrap}>
                <button onClick={handleDelete} className={styles.handleDelete}>Delete Account</button>
              </div>
            </div>
            <div className={`col-md-6 ${styles.userInfo}`}>
              <h3 className={styles.infoH3}>Your Information</h3>
              {Object.keys(formData).map(key => {
                if (['is_admin', 'picture'].includes(key)) return null;
                const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter
                return <p key={key}><strong>{label}:</strong> {formData[key]}</p>;
              })}
            </div>
          </div>
        </div>
      </>
    );
  }
}
  
export default Profile;