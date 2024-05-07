import React from "react";
import GuestHeader from "../../components/headers/GuestHeader";
import SessionTimeoutHandler from "../../components/session-checker/SessionTimeoutHandler";

/* Contact Us page */
function Contact() {
  return (
    <>
      <SessionTimeoutHandler />
      <GuestHeader />
      <div className="container" >
        <div className="row justify-content-center" >
          <div className="col-md-8" style={{marginTop: '20em'}}>
            <h2 className="mb-4">Contact Social Circles</h2>
            <p>
              You can directly contact the administrator, Dana H. Moorhead at:
            </p>
            <p>+ 1 (phone number)</p>
            <p>danamoorhead@gmail.com</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
