import { useState, useEffect } from 'react'
import UserHeader from "../headers/UserHeader";
import CommunitiesAside from "./CommunitiesAside"
import CommunityCard from "./CommunityCard"

function Communities() {
  const [comms, setComms] = useState([]);
  const [error, setError] = useState("");
  const [isQuerying, setQuerying] = useState(true);

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
        <div className={`row`}>
          <h1 className={`ml-4`} style={{ fontSize: '2.5rem' }}>Upcoming Events</h1>
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

export default Communities;

