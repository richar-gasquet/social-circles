import { useState, useEffect } from 'react';
import { useUserContext } from '../../../contexts/UserContextHandler';
import AdminHeader from '../../../components/headers/AdminHeader';
import UserHeader from '../../../components/headers/UserHeader';
import GuestHeader from '../../../components/headers/GuestHeader';
import Loading from '../../../components/loading-component/loading';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import styles from '../../../css/ProfileForm.module.css';
import SessionTimeoutHandler from '../../../components/session-checker/SessionTimeoutHandler';


function Profile() {
  const { userData, isLoading} = useUserContext();
  const [editMode, setEditMode] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [confirmModal, setConfirmModal] = useState({ show: false, onConfirm: () => {} });
  const [welcomeModal, setWelcomeModal] = useState(false);
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
    // Reset error for that field
    if (formErrors[name]) {
      setFormErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    // Include validation for both regular and "Other" fields
    if ((['first_name', 'last_name', 'address', 'phone_number', 'pronouns', 'marital_status'].includes(name) ||
        name.endsWith('Other')) && !value.trim()) {
      setFormErrors(prevErrors => ({ ...prevErrors, [name]: 'Please complete this field.' }));
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
      const pronounsOptions = ['He/His', 'She/Her', 'They/Them'];
      if (!pronounsOptions.includes(userData.pronouns)) {
        updatedFormData.pronouns = 'Other';
        updatedFormData.pronounsOther = userData.pronouns;
      }

      // Check for marital status
      const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];
      if (!maritalStatusOptions.includes(userData.marital_status)) {
        updatedFormData.marital_status = 'Other';
        updatedFormData.marital_statusOther = userData.marital_status;
      }
      setFormData(updatedFormData);
   }
  };

  const handleLogout = (e) => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/logout`;
  };

  const updateUserData = (newData) => {
    setUserContext(prev => ({...prev, ...newData}));
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Handle validation
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      if (field.endsWith('Other') && formData[field] === '' && formData[field.replace('Other', '')] === 'Other') {
        newErrors[field] = 'Please complete this field.';
      } else if (['first_name', 'last_name', 'address', 'phone_number'].includes(field) && !formData[field].trim()) {
        newErrors[field] = 'Please complete this field.';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    // Adjust formData for submission
    const submissionData = { ...formData };
    ['pronouns', 'marital_status'].forEach(field => {
      if (submissionData[field] === 'Other' && submissionData[`${field}Other`] !== undefined) {
        submissionData[field] = submissionData[`${field}Other`];
      }
    });
    // API call to update user data
    const endpoint = userData.is_admin === undefined ? '/add-user' : '/update-user';
    try {
      const request = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });
      if (request.ok) {
        setEditMode(false);
        if(endpoint === '/add-user') {
          setWelcomeModal(true);
          userData.is_admin = false;
          updateUserData(submissionData)
        }
        else{
          window.location.reload();
        }
      } else {
        console.error('Failed to submit form request');
      }
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };

  const handleDelete = () => {
    showConfirmModal("Are you sure you want to delete your account? This action cannot be undone.", async () => {
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
    });
  };

  const handleDynamicSelectChange = (e) => {
    const { name, value } = e.target;
    if (value === "Other") {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value,
        [`${name}Other`]: ''  // Initialize the "Other" field to ensure it's treated as empty for validation
      }));
    } else {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value,
        [`${name}Other`]: undefined  // Properly handle other values
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

  const redirectToEvents = () => {
    window.location.href = '/events'; // Modify as needed to match your routing setup
  };



  const pronounsOptions = ['He/His', 'She/Her', 'They/Them', 'Other'];
  const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed', 'Other'];


  

  // Determine which header to use based on whether is_admin is undefined
  const Header = userData.is_admin ? AdminHeader : (userData.is_admin === false ? UserHeader : GuestHeader);

  if (isLoading) {
    return (
      <>
      <Header />
      <Loading/>
      </>
    )
  }

  if (!userData || userData.email === undefined || userData.is_admin === undefined || editMode === true) {
    return (
      <>
      {userData && <SessionTimeoutHandler />}
      <Header />
      <div className="container" style={{paddingTop: '10em'}}>
        <div style={{padding: '2em', outline: '#F5EDED solid 10px', borderRadius: '1%'}}>
            <h2>Profile</h2>
            <p>Please fill in the information to complete your account</p>
            <form onSubmit={handleSubmit} className="mb-3">
              {Object.keys(formData).map(key => {
                if (['is_admin', 'picture'].includes(key) || key.endsWith('Other')) return null;
                const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                const isSelect = key === 'pronouns' || key === 'marital_status';
                const isOtherField = formData[`${key}Other`] !== undefined;
                // Define character limits based on field names
                const characterLimits = {
                  first_name: 50,
                  last_name: 50,
                  address: 100,
                  phone_number: 15,
                  email: 100,
                  preferred_name: 50,
                  pronouns: 50,
                  marital_status: 50,
                  family_circumstance: 255,
                  community_status: 255,
                  interests: 255,
                  personal_identity: 100
                };
                const placeholders = {
                  first_name: 'Enter your first name',
                  last_name: 'Enter your last name',
                  address: 'Enter your complete address',
                  email: 'Enter your email',
                  preferred_name: 'Enter your preferred name if different from your first name',
                  family_circumstance: 'Describe any aspects of your family life that are important to you (e.g., single parent, large family)',
                  community_status: 'Describe your role or status in your local or professional community (e.g., community leader, active volunteer)',
                  interests: 'List your hobbies or interests (e.g., reading, hiking, painting)',
                  personal_identity: 'Describe elements of your personal identity that are important to you (e.g., cultural, professional, personal beliefs)'
                };
                return (
                  <div style={{marginTop: '4%'}} className="input-group mb-3" key={key}>
                    <label className="input-group-text">{label}</label>
                    {isSelect ? (
                      <select
                        className={`form-select ${formErrors[key] ? 'is-invalid' : ''}`}
                        name={key}
                        value={formData[key]}
                        onChange={handleDynamicSelectChange}
                        onBlur={handleBlur}
                        required
                      >
                        <option value="Select">Select</option>
                        {key === 'pronouns' ? pronounsOptions.map(option => <option key={option} value={option}>{option}</option>) : maritalStatusOptions.map(option => <option key={option} value={option}>{option}</option>)}
                      </select>
                    ) : key === 'phone_number' ? (
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`form-control ${formErrors.phone_number ? 'is-invalid' : ''}`}
                        required={true}
                        disabled={false}
                        maxLength={15}  // Assuming phone numbers won't be longer than 15 digits
                        pattern="[0-9]*"
                        inputMode="numeric"  // Helps mobile users to have a numeric keypad
                        placeholder="Enter phone number, do not enter dashes, just numbers (e.g. 1234567890)"
                      />
                    ) :  (
                      <input
                        type="text"
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`form-control ${formErrors[key] ? 'is-invalid' : ''}`}
                        required={key === 'first_name' || key === 'last_name' || key === 'address' || key === 'phone_number'}
                        disabled={key === 'email'}
                        maxLength={characterLimits[key] || 255}
                        placeholder={placeholders[key]}
                      />
                    )}
                    {isOtherField && (
                      <input
                        type="text"
                        name={`${key}Other`}
                        value={formData[`${key}Other`]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`form-control ${formErrors[`${key}Other`] ? 'is-invalid' : ''}`}
                        placeholder="Please specify" 
                        required 
                        maxLength={characterLimits[key] || 255}
                        />
                      )}
                      {formErrors[key] && (
                        <div className="invalid-feedback">
                          {formErrors[key]}
                        </div>
                      )}
                      {formErrors[`${key}Other`] && (
                        <div className="invalid-feedback">
                          {formErrors[`${key}Other`]}
                        </div>
                      )}
                  </div>
                        );
                })}
            <button style={{marginTop: '3em'}} type="submit" className={styles.submitButton}>Submit</button>
            <button type="button" onClick={handleCancel} className={styles.handleCancel}>Cancel</button>
          </form>
        </div>
      </div>
      </>
    );
  } else {
    return (
      <>
        {userData && <SessionTimeoutHandler />}
        <Header />
        <div className="container" style={{paddingTop: '10em'}}>
          <div className={styles.profileRow}>
            <div className={`col-md-6 ${styles.userLeft}`}>
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
            <div className={`col-md-6 ${styles.userInfo}`} style={{outline: '#F5EDED solid 10px', borderRadius: '1%'}}>
              <h3 className={styles.infoH3}>Your Information</h3>
              {Object.keys(formData).map(key => {
                if (['is_admin', 'picture'].includes(key)) return null;
                const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter
                return <p key={key}><strong>{label}:</strong> {formData[key]}</p>;
              })}
            </div>
          </div>
        </div>
        <Modal show={confirmModal.show} onHide={() => setConfirmModal({ ...confirmModal, show: false })}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Action</Modal.Title>
          </Modal.Header>
          <Modal.Body>{confirmModal.message}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setConfirmModal({ ...confirmModal, show: false })}>
              Close
            </Button>
            <Button variant="danger" onClick={handleConfirm}>
              Delete Account
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal 
          show={welcomeModal} 
          onHide={() => {
            setWelcomeModal(false); 
            window.location.reload();  
          }}> 
          <Modal.Header closeButton>
            <Modal.Title>Welcome!</Modal.Title>
          </Modal.Header>
          <Modal.Body>Thank you for signing up, get started with your first event</Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={redirectToEvents}>
              To Events
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
  
export default Profile;