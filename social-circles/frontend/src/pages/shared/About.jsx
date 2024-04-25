import React from "react";
import GuestHeader from "../../components/headers/GuestHeader";
import SessionTimeoutHandler from "../../components/session-checker/SessionTimeoutHandler";

function About() {
  return (
    <>
      <SessionTimeoutHandler />
      <GuestHeader />

      <div className="row justify-content-center" style={{marginTop: '0px'}}>
        <div className="col-md-6 text-center" style={{marginTop: '20em'}}>
          <h1 className="display-4">Social Circles</h1>
          <p className="lead">(brief description)</p>
          <div className="btn-group mt-4">
            <button className="btn btn-primary btn-lg mr-3">Get Started</button>
            <a href="#" className="btn btn-outline-secondary btn-lg">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;