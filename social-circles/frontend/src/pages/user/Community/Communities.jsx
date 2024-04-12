import { useState, useEffect } from 'react'
import AlertBox from '../AlertBox.jsx';
import UserHeader from "../../headers/UserHeader.jsx";
import CommunitiesAside from "./CommunitiesAside.jsx"
import CommunityCard from "./CommunityCard.jsx"
import AddCommunity from './AddCommunity.jsx';
import AddButton from "../../admin/AddButton.jsx";
import { useAuthContext } from '../../auth/AuthHandler.jsx';

function Communities() {
  const [comms, setComms] = useState([]);
  const [error, setError] = useState("");
  const [isQuerying, setQuerying] = useState(true);
  const [showAddCommunity, setShowAddCommunity] = useState(false);

  /* Stateful variables for handling alerts for registering/cancelling */
  const [successRegistrAlert, setSuccessRegistrAlert] = useState(false);
  const [errorRegistrAlert, setErrorRegistrAlert] = useState(false);
  const [successCancelAlert, setSuccessCancelAlert] = useState(false);
  const [errorCancelAlert, setErrorCancelAlert] = useState(false);

  /* Arrow functions to reset the alert states */
  const resetSuccessRegistrAlert = () => setSuccessRegistrAlert(false);
  const resetErrorRegistrAlert = () => setErrorRegistrAlert(false);
  const resetSuccessCancelAlert = () => setSuccessCancelAlert(false);
  const resetErrorCancelAlert = () => setErrorCancelAlert(false);

  const { isAdmin } = useAuthContext()

  useEffect(() => {
    fetchAllCommunities()
  }, []);

  const fetchAllCommunities = async () => {
    try {
      setQuerying(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/get-available-communities`,
        { credentials: "include" }
      )
      if (response.ok) {
        const data = await response.json();
        setComms(data.results);
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {
      console.error("Failed to fetch community data: ", error);
      setError("Server error. Please contact the administrator.")
    } finally {
      setQuerying(false);
    }
  };

  const handleShowAddCommunity = () => setShowAddCommunity(true)
  const handleCloseAddCommunity = () => {
    setShowAddComm(false);
    fetchAllCommunities();
  };

  return (
    <>
      <UserHeader />
      <div className={`container-fluid p-5`}>
        {successRegistrAlert && (
          <AlertBox
            type="success"
            header="Success!"
            text="You have registered for the event!"
            show={successRegistrAlert}
            handleClose={setSuccessRegistrAlert}>
          </AlertBox>
        )}
        {errorRegistrAlert && (
          <AlertBox
            type="danger"
            header="Error!"
            text="We couldn't register you for the event!
                  Please try again later or contact the administrator."
            show={errorRegistrAlert}
            handleClose={setErrorRegistrAlert}>
          </AlertBox>
        )}
        {successCancelAlert && (
          <AlertBox
            type="success"
            header="Success!"
            text="You have canceled your registration for the event!"
            show={successCancelAlert}
            handleClose={setSuccessCancelAlert}>
          </AlertBox>
        )}
        {errorCancelAlert && (
          <AlertBox
            type="danger"
            header="Error!"
            text="We couldn't cancel your registration you for the event!
                  Please try again later or contact the administrator."
            show={errorCancelAlert}
            handleClose={setErrorCancelAlert}>
          </AlertBox>
        )}
        <div className={`row container-fluid align-items-center`}>
          <div className="col">
            <h1 className={`ml-4`} style={{ fontSize: '2.5rem' }}>All Communities</h1>
          </div>
          {isAdmin && (
            <div className="col d-flex justify-content-end">
              <AddButton
                type="Add Community"
                action={handleShowAddCommunity}>
              </AddButton>
            </div>
          )}
        </div>
        <hr />
        <div className={`row`}>
          <CommunitiesAside />
          <div className={`col-lg-10 mt-3`}>
            <div className={`row`}>
              {isQuerying ? (
                <div className="col-12 d-flex justify-content-center">
                  <div className="spinner-border mt-5" role="status"
                    style={{ width: '10rem', height: '10rem'}}>
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : comms.length > 0 ? (
                comms.map((comm) => (
                  <div key={comm.group_id} className="col-lg-6 col-md-6 col-sm-12 mt-3">
                    <CommunityCard
                      group_id={comm.group_id}
                      name={comm.name}
                      desc={comm.desc}
                      count={comm.count}
                      image={comm.image}
                      isRegistered={comm.isRegistered}
                      isAdmin={isAdmin}
                      fetchCommunities={fetchAllCommunities}
                      setSuccessRegistrAlert={setSuccessRegistrAlert}
                      setErrorRegistrAlert={setErrorRegistrAlert}
                      setSuccessCancelAlert={setSuccessCancelAlert}
                      setErrorCancelAlert={setErrorCancelAlert}>
                    </CommunityCard>
                  </div>
                ))
              ) : (
                <h3 className="col-12">
                  There are no available communities.
                </h3>
              )}
            </div>
          </div>
        </div>
      </div>
      {showAddCommunity && isAdmin && (
        <AddCommunity
          isShown={showAddCommunity}
          handleClose={handleCloseAddCommunity}>
        </AddCommunity>
      )}
    </>
  );
}

export default Communities;

