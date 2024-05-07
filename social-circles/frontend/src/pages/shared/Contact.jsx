import React from "react";
import UserHeader from "../../components/headers/UserHeader";
import GuestHeader from "../../components/headers/GuestHeader";
import AdminHeader from "../../components/headers/AdminHeader";
import Loading from "../../components/shared-components/LoadingSpinner";
import SessionTimeoutHandler from "../../components/session-checker/SessionTimeoutHandler";
import { useUserContext } from "../../contexts/UserContextHandler";


/* Contact Us page */
function Contact() {
  const { userData, isLoading } = useUserContext();

  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  const Header = userData.is_admin 
  ? AdminHeader
  : userData.is_admin === false
  ? UserHeader
  : GuestHeader;
  
  return (
    <>
      <SessionTimeoutHandler />
      <Header />
      <div className="container" >
        <div className="row justify-content-center" >
          <div className="col-md-8" style={{marginTop: '15em'}}>
            <h2 className="mb-4">Contact Social Circles</h2>
            <p>
              You can directly contact the administrator, Dana H. Moorhead at:
            </p>
            <p>+ 1 (609) 731-2847</p>
            <p>danamoorhead@gmail.com</p>
            <br />
            <p>For <strong>technical support</strong> please contact:</p>
            <p>socialcircles333@gmail.com</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
