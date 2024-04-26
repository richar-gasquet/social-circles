import { useEffect } from "react"
import { NavLink } from "react-router-dom";
import GuestHeader from '../../components/headers/GuestHeader';
import SessionTimeoutHandler from "../../components/session-checker/SessionTimeoutHandler";
import Carousel from "react-bootstrap/Carousel";
import danaImg from "../../assets/dana.webp";
import logo from "../../assets/social-circles-logo.png";
import styles from "../../css/LandingPage.module.css";


function LandingPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)  {
            entry.target.classList.add(styles.fadeIn)
          }
        })
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.8
      }
    );

    const observedElements = document.querySelectorAll(`.${styles.animated}`);
    observedElements.forEach(element => {
      observer.observe(element);
    });

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <GuestHeader/>
        <SessionTimeoutHandler />
        <div className={`container-fluid ${styles.carouselContainer}`}>
          <Carousel fade indicators={false} controls={false}>
            <Carousel.Item className={`${styles.carouselItem}`}>
              <div className={styles.carouselGradient}></div>
              <img
                className={`w-100 ${styles.carouselImg}`}
                alt="900x500"
                src="https://www.eventbrite.com/blog/wp-content/uploads/2022/04/xxu.jpg"
              />
            </Carousel.Item>
            <Carousel.Item className={`${styles.carouselItem}`}>
              <div className={styles.carouselGradient}></div>
              <img
                className={`w-100 ${styles.carouselImg}`}
                alt="900x500"
                src="https://www.cambridgema.gov/-/media/Images/publicworks/specialevents/Danehy/DanehyFamilyDay_KyleKlein_KKP17278.jpg?mw=1920"
              />
            </Carousel.Item>
          </Carousel>
          <div className={`${styles.textOverlay} ${styles.carouselText}`}>
            <h2>Social Circles: Empowering Princeton's Marginalized Communities Through Connection and Support</h2>
            <br/>
            <h4 style={{color: '#cca3a3'}}>Scroll below to learn more or get started by logging in</h4>
            <div className="d-flex justify-content-center align-items-center mt-4 pt-3">
              <NavLink to="/login">
                <button type="button" className={`btn btn-primary mr-5 ${styles.button} ${styles.startButton}`}>
                  Get Started
                </button>
              </NavLink>
            </div>
          </div>
        </div>
        <div className={`container-fluid py-5 px-5 d-flex flex-column justify-content-center ${styles.descContainer}`}>
          <h1 className={`text-center ${styles.animated}`}>
            What is Social Circles?
          </h1>
          <div className='container' style={{maxWidth: '100%', display: 'flex', marginTop: '3em'}}>
            <div className='col-md-6' style={{backgroundColor: '#F5EDED', marginLeft: '1em', padding: '2em', borderRadius: '1em'}}>
              <p className={`${styles.animated} ${styles.text}`}>
                Social Circles is a transformative web-based community service platform 
                designed to foster <strong>connection</strong> and <strong>support</strong> for historically marginalized groups
                of people in Princeton, New Jersey. 
              </p>
            </div>
            <div className='col-md-6' style={{backgroundColor: '#F5EDED', marginLeft: '1em', padding: '2em', borderRadius: '1em'}}>
              <p className={`${styles.animated} ${styles.text}`}>
                Through our platform, members can seamlessly join 
                <strong> identity-based communities</strong>, register for events that facilitate access to the 
                 <strong> arts</strong>, <strong> nature</strong>, and <strong> education</strong>, as well as tap into an amazing network of supportive resources,
                all which have been curated by our amazing founder, Dana H. Moorhead.
              </p>
            </div>
          </div>
        </div>
        <div className={`container-fluid py-5 px-5 ${styles.danaContainer}`}>
          <h1 className={`text-center ${styles.animated}`}>
            Who is Dana H. Moorhead?
          </h1>
          <div className={`d-flex flex-column flex-md-row ${styles.animated}`}>
            <div className={`flex-fill mt-3 px-5 py-3 d-flex justify-content-center align-items-center`}>
              <img src={danaImg} alt="Dana H. Moorhead" className={`${styles.danaImg}`} />
            </div>
            <div className={`flex-fill mt-3 px-5 py-3`}>
              <p className={styles.text}>
                Dana H. Moorhead, a <strong>third-generation</strong> and <strong>lifelong Princeton local</strong>, 
                has made it her life mission to <strong>connect people</strong> with each other and to create 
                inclusive environments for her fellow Princetonians.
              </p>
              <p className={`pt-3 ${styles.text}`} style={{fontSize: '20px'}}>
                Highly regarded as a <strong>trusted messenger</strong> within the community, 
                she is often approached by venues and institutions to promote information
                about <strong>free</strong> or <strong>low-cost events</strong>, which she then shares with members who will
                benefit from them the most.
              </p>
              <p className={`pt-3 ${styles.text}`} style={{fontSize: '20px'}}>
                To demonstrate her impact, examples of the experiences she brings people into,
                sometimes for the very <strong>first time</strong> in their lives, include a <strong>hiking trip in Vermont</strong>,
                a famous <strong>Broadway show</strong>, and a <strong>lecture</strong> at Princeton University.
              </p>
            </div>
          </div>
        </div>
        <div className={`text-center ${styles.animated} py-5 px-5 ${styles.joinContainer}`}>
            <h1>
             Ready to join us?
            </h1>
            <h3 className={`py-5`}>
              <NavLink to="/login" className={`${styles.joinText}`}>
                We'd love to have you join our family.
              </NavLink>
            </h3>
          </div>
    </>
  );
}

export default LandingPage;
