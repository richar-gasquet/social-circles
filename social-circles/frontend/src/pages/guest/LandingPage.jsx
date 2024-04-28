import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import GuestHeader from "../../components/headers/GuestHeader";
import SessionTimeoutHandler from "../../components/session-checker/SessionTimeoutHandler";
import Carousel from "react-bootstrap/Carousel";
import danaImg from "../../assets/dana.webp";
import styles from "../../css/LandingPage.module.css";

function LandingPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.fadeIn);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.8,
      }
    );

    const observedElements = document.querySelectorAll(`.${styles.animated}`);
    observedElements.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <GuestHeader />
      <SessionTimeoutHandler />
      <div className={`container-fluid w-100 ${styles.carouselContainer}`}>
        <Carousel fade indicators={false} controls={false}>
          <Carousel.Item className={`${styles.carouselItem}`}>
            <div className={styles.carouselGradient}></div>
            <img
              className={`w-100 ${styles.carouselImg}`}
              src="https://www.eventbrite.com/blog/wp-content/uploads/2022/04/xxu.jpg"
            />
          </Carousel.Item>
          <Carousel.Item className={`${styles.carouselItem}`}>
            <div className={styles.carouselGradient}></div>
            <img
              className={`w-100 ${styles.carouselImg}`}
              src="https://www.cambridgema.gov/-/media/Images/publicworks/specialevents/Danehy/DanehyFamilyDay_KyleKlein_KKP17278.jpg?mw=1920"
            />
          </Carousel.Item>
        </Carousel>
        <div
          className={`text-center ${styles.textOverlay} ${styles.carouselText}`}
          style={{ paddingTop: "7em" }}
        >
          <h1>Social Circles</h1>
          <br />
          <h4>
            Empowering Princeton's Marginalized Communities Through Connection
            and Support
          </h4>
          <br />
          <div className = {styles.getStartedText} style={{ color: "#cca3a3" }}>
            <h5 >
              Scroll Below to Learn More 
            </h5>
            <h5>
              or 
            </h5>
          </div>
          <NavLink to="/login">
            <button
              type="button"
              className={`btn btn-primary ${styles.startButton}`}
            >
              Sign In
            </button>
          </NavLink>
        </div>
      </div>
      <div
        className={`container-fluid px-5 py-5 d-flex flex-column justify-content-center ${styles.descContainer}`}
      >
        <h1 className={`text-center pb-3  ${styles.animated}`}>
          What is Social Circles?
        </h1>
        <div className="row">
          <div className="col-md-6 mt-3">
            <div
              style={{
                backgroundColor: "#F5EDED",
                padding: "2em",
                borderRadius: "1em",
                minHeight: "230px"
              }}
            >
              <p className={`${styles.animated} ${styles.text}`}>
                Social Circles is a transformative web-based community service
                platform designed to foster <strong>connection and
                support for historically marginalized groups </strong> in <strong>Princeton, New Jersey.</strong>{' '}
                We believe that we can make a <strong>difference</strong> by creating inclusive spaces for those
                who often face challenges accessing such social groups.
              </p>
            </div>
          </div>
          <div className="col-md-6 mt-3">
            <div
              style={{
                backgroundColor: "#F5EDED",
                padding: "2em",
                borderRadius: "1em",
                minHeight: "230px"
              }}
            >
              <p className={`${styles.animated} ${styles.text}`}>
                Through our platform, members can seamlessly join
                <strong> identity-based communities</strong>, register for{" "} 
                <strong>events</strong> that facilitate access to the
                <strong> arts</strong>, <strong> nature</strong>, and{" "}
                <strong> education</strong>, and tap into an amazing network of
                supportive <strong>resources</strong>, all which have been curated by our amazing
                founder, Dana H. Moorhead.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={`container-fluid py-5 px-5 ${styles.danaContainer}`}>
        <h1 className={`text-center ${styles.animated}`}>
          Who is Dana H. Moorhead?
        </h1>
        <div className={`d-flex flex-column flex-md-row ${styles.animated}`}>
          <div
            className={`flex-fill mt-3 px-5 py-3 d-flex justify-content-center align-items-center`}
          >
            <img
              src={danaImg}
              alt="Dana H. Moorhead"
              className={`${styles.danaImg}`}
            />
          </div>
          <div className={`flex-fill mt-3 px-5 py-3`}>
            <p className={styles.text}>
              Dana, a <strong>third-generation</strong> and{" "}
              <strong>lifelong Princeton local</strong>, has made it her life
              mission <strong>to connect people</strong> with each other and <strong>to
              create inclusive environments</strong> for her fellow Princetonians.
            </p>
            <p className={`pt-3 ${styles.text}`} style={{ fontSize: "20px" }}>
              Highly regarded as a <strong>trusted messenger</strong> within the
              community, she is often approached by venues and institutions to
              promote information about <strong>free</strong> or{" "}
              <strong>low-cost events</strong>, which she then shares with
              members who will benefit from them the most.
            </p>
            <p className={`pt-3 ${styles.text}`} style={{ fontSize: "20px" }}>
              To demonstrate her impact, examples of the experiences she brings
              people into, sometimes for the very <strong>first time in
              their lives</strong>, include a <strong>hiking trip in Vermont</strong>, a
              famous <strong>Broadway show</strong>, and a{" "}
              <strong>lecture</strong> at Princeton University.
            </p>
          </div>
        </div>
      </div>
      <div
        className={`text-center ${styles.animated} py-5 px-5 ${styles.quoteContainer}`}
      >
        <h3 className={`pt-5 px-5`}>     
        "My inspiration simply has been the people in my life who have done this for me. 
        I have been incredibly fortunate to have had mentors and friends connecting me to people and experiences 
        that I never could have accessed on my own."
        </h3>
        <h3 className="text-center pb-5">
          <em>- Dana Hughes Moorhead</em>
        </h3>
      </div>
      <div
        className={`text-center py-5 px-5 ${styles.joinContainer}`}
      >
        <h1 className= {`${styles.animated}`} >Ready to join us?</h1>
        <h3 className={`py-5  ${styles.animated}`}>
          <NavLink to="/login" className={`${styles.joinText}  ${styles.animated}`}>
            We'd love to have you become a part of Social Circles.
          </NavLink>
        </h3>
      </div>
    </>
  );
}

export default LandingPage;
