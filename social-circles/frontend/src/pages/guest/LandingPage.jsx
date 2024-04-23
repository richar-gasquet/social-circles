import { NavLink } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import danaImg from "../../assets/dana.webp";
import moorheadImg from "../../assets/moorhead.jpg";
import logo from "../../assets/social-circles-logo.png";
import styles from "../../css/LandingPage.module.css";
import SessionTimeoutHandler from "../../components/session-checker/SessionTimeoutHandler";

function LandingPage() {
  return (
    <div className={`${styles.overallContainer}`}>
      <SessionTimeoutHandler />
      <div className={`container-fluid ${styles.carouselContainer}`}>
        <Carousel fade indicators={false} controls={false}>
          <Carousel.Item className={`${styles.carouselItem}`}>
            <div className={styles.carouselGradient}></div>
            <img
              className={`w-100 ${styles.carouselImg}`}
              alt="900x500"
              src="https://placehold.co/1800x1200"
            />
          </Carousel.Item>
          <Carousel.Item className={`${styles.carouselItem}`}>
            <div className={styles.carouselGradient}></div>
            <img
              className={`w-100 ${styles.carouselImg}`}
              alt="900x500"
              src="https://placehold.co/1800x1200"
            />
          </Carousel.Item>
        </Carousel>
        <div className={`${styles.textOverlay} ${styles.carouselText}`}>
          <h2>Welcome to</h2>
          <div>
            <img
              src={logo}
              alt="Social Circles Logo"
              className={`img-fluid ${styles.logo}`}
            />
            <h1>Social Circles</h1>
          </div>
          <div className="d-flex justify-content-center align-items-center mt-4 pt-3">
            <NavLink to="/login">
              <button type="button" className={`btn btn-primary mr-5 ${styles.button} ${styles.startButton}`}>
                Get Started
              </button>
            </NavLink>
            <NavLink to="/about">
              <button type="button" className={`btn btn-outline-secondary ${styles.button} ${styles.learnButton}`}>
                Learn More
              </button>
            </NavLink>
          </div>
        </div>
      </div>
      <div className={`container-fluid py-5 px-5 d-flex flex-column justify-content-center ${styles.descContainer}`}>
        <h1 className={`text-center`}>
          What is Social Circles?
        </h1>
        <h3 className={`text-center mt-4`}>
          Social Circles is a transformative web-based community service platform 
          designed to foster connection and support for historically marginalized groups
          of people in Princeton, New Jersey. 
        </h3>
        <h3 className={`text-center mt-5 pb-5`}>
          Through our platform, members can seamlessly join 
          identity-based communities, register for events that facilitate access to the 
          arts, nature, and education, as well as tap into an amazing network of supportive resources,
          all which have been curated by our amazing founder, Dana H. Moorhead.
        </h3>
      </div>
      <div className={`container-fluid py-5 px-5 ${styles.danaContainer}`}>
        <h1 className={`text-center`}>
          Who is Dana H. Moorhead?
        </h1>
        <div className={`d-flex flex-column flex-md-row`}>
          <div className={`flex-fill mt-3 px-5 py-3 d-flex justify-content-center align-items-center`}>
            <img src={danaImg} alt="Dana H. Moorhead" className={`${styles.danaImg}`} />
          </div>
          <div className={`flex-fill mt-3 px-5 py-3`}>
            <h3>
              Dana H. Moorhead, a third-generation and lifelong Princeton local, 
              has made it her life mission to connect people with each other and to create 
              inclusive environments for her fellow Princetonians.
            </h3>
            <h3 className={`pt-3`}>
              Highly regarded as a trusted messenger within the community, 
              she is often approached by venues and institutions to promote information
              about free or low-cost events, which she then shares with members who will
              benefit from them the most.
            </h3>
            <h3 className={`pt-3`}>
              To demonstrate her impact, examples of the experiences she brings people into,
              sometimes for the very first time in their lives, include a hiking trip in Vermont,
              a famous Broadway show, and a lecture at Princeton University.
            </h3>
          </div>
        </div>
      </div>
      <div className={`text-center py-5 px-5 ${styles.joinContainer}`}>
          <h1>
            Convinced?
          </h1>
          <h3 className={`py-5`}>
            <NavLink to="/login" className={`${styles.joinText}`}>
              We'd love to have you join our family.
            </NavLink>
          </h3>
        </div>
    </div>
  );
}

export default LandingPage;
