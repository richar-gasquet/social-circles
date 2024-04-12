import { useState, useEffect } from 'react'
import AlertBox from '../AlertBox.jsx';
import UserHeader from "../../headers/UserHeader.jsx";
import CommunitiesAside from "./CommunitiesAside.jsx"
import CommunityCard from "./CommunityCard.jsx"
import AddCommunity from './AddCommunity.jsx';
import AddButton from "../../admin/AddButton.jsx";
import { useAuthContext } from '../../auth/AuthHandler.jsx';

function Communities() {
  const [communities, setCommunities] = useState([]);
  const [alerts, setAlerts] = useState([])
  const [isQuerying, setQuerying] = useState(true);
  const [showAddCommunity, setShowAddCommunity] = useState(false);

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
        setCommunities(data.results);
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

  const updateCommunities = (group_id, registration) => {
    setCommunities(communities.map(community => {
      if (community.group_id === group_id) {
        return {...community, isRegistered: registration};
      } else {
        return community;
      }
    }))
  }

  const addAlert = (type, header, text) => {
    setAlerts(prevAlerts => [...prevAlerts, {id: Date.now(), type, header, text }]);
  }

  const removeAlert= (id) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  }

  const handleShowAddCommunity = () => setShowAddCommunity(true)
  const handleCloseAddCommunity = () => {
    setShowAddComm(false);
    fetchAllCommunities();
  };

  return (
    <>
      <UserHeader />
      <div className={`container-fluid p-5`}>
        {alerts.map((alert) => (
          <AlertBox 
            key={alert.id} 
            type={alert.type} 
            header={alert.header} 
            text={alert.text} 
            handleClose={() => removeAlert(alert.id)}>
          </AlertBox>
        ))}
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
              ) : communities.length > 0 ? (
                communities.map((comm) => (
                  <div key={comm.group_id} className="col-lg-6 col-md-6 col-sm-12 mt-3">
                    <CommunityCard
                      group_id={comm.group_id}
                      name={comm.name}
                      desc={comm.desc}
                      count={comm.count}
                      image={comm.image}
                      isRegistered={comm.isRegistered}
                      isAdmin={isAdmin}
                      updateCommunities={updateCommunities}
                      addAlert={addAlert}>
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