import { useState, useEffect } from 'react'
import UserHeader from "../../headers/UserHeader.jsx";
import CommunitiesAside from "./CommunitiesAside.jsx"
import CommunityCard from "./CommunityCard.jsx"
import AdminButton from "../../admin/AdminButton.jsx";
import { useAuthContext } from '../../auth/AuthHandler.jsx';

function MyCommunities() {
  const [comms, setComms] = useState([]);
  const [error, setError] = useState("");
  const [isQuerying, setQuerying] = useState(true);

  const { isAdmin } = useAuthContext()

  useEffect(() => {
    const getAllComms = async () => {
      try {
        setQuerying(true);
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/get-registered-communities`,
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
    }
    getAllComms()
  }, []);


  return (
    <>
      <UserHeader />
      <div className={`container-fluid p-5`}>
        <div className={`row container-fluid align-items-center`}>
          <div className="col">
            <h1 className={`ml-4`} style={{ fontSize: '2.5rem' }}>My Communities</h1>
          </div>
          {isAdmin && (
            <div className="col d-flex justify-content-end">
              <AdminButton
                type="Add Community"
                action={() => console.log(hello)}
              />
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
                      name={comm.name}
                      desc={comm.desc}
                      count={comm.count}
                      image={comm.image}>
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
    </>
  );
}

export default MyCommunities;

