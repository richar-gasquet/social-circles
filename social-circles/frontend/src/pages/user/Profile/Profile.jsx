import React from 'react';
import { useFormLogic } from './ProfileFormLogic';
import { ConfirmModal, WelcomeModal } from './ProfileModals';
import AdminHeader from '../../../components/headers/AdminHeader';
import UserHeader from '../../../components/headers/UserHeader';
import GuestHeader from '../../../components/headers/GuestHeader';
import Loading from '../../../components/shared-components/LoadingSpinner';
import SessionTimeoutHandler from '../../../components/session-checker/SessionTimeoutHandler';
import logo from "../../../assets/social-circles-logo.png";
import styles from '../../../css/ProfileForm.module.css';

function Profile() {
  const {
    formData, setFormData, formErrors, isLoading, editMode, handleBlur, handleChange,
    handleSubmit, handleCancel, handleDelete, toggleEdit, confirmModal, showConfirmModal,
    handleDynamicSelectChange, handleConfirm, userData, welcomeModal
  } = useFormLogic();

  const Header = formData.is_admin ? AdminHeader : (formData.is_admin === false ? UserHeader : GuestHeader);

  const pronounsOptions = ['He/His', 'She/Her', 'They/Them', 'Other'];
  const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed', 'Other'];


  if (isLoading) {
    return (
      <>
      <Loading/>
      </>
    )
  }
  const handleLogout = (e) => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/logout`;
  };

  const redirectToEvents = () => {
    window.location.href = '/events'; 
  };

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
                  first_name: 55,
                  last_name: 55,
                  address: 55,
                  phone_number: 15,
                  email: 55,
                  preferred_name: 55,
                  pronouns: 55,
                  marital_status: 55,
                  family_circumstance: 55,
                  community_status: 55,
                  interests: 55,
                  personal_identity: 55
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
                        maxLength={characterLimits[key] || 50}
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
                        maxLength={characterLimits[key] || 50}
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
                <img src={userData.picture ? userData.picture :  logo} alt="Profile Photo" className={styles.profilePic} referrerPolicy="no-referrer"/>
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
        <ConfirmModal {...confirmModal} onHide={() => setConfirmModal({ ...confirmModal, show: false })} />
        <WelcomeModal show={welcomeModal} onHide={() => setWelcomeModal(false)} onRedirect={redirectToEvents} />
      </>
    );
  }
}
  
export default Profile;