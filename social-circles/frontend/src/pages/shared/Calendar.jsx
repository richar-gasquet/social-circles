import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useAuthContext } from "../../contexts/AuthContextHandler.jsx";
import { useUserContext } from "../../contexts/UserContextHandler";
import he from "he";
import moment from "moment";
import UserHeader from "../../components/headers/UserHeader";
import AdminHeader from "../../components/headers/AdminHeader.jsx";
import AlertBox from "../../components/shared-components/AlertBox.jsx";
import Loading from "../../components/shared-components/LoadingSpinner.jsx";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

/* Calendar component for events */
function ReactCalendar() {
  const [events, setEvents] = useState([]);
  const [isQuerying, setQuerying] = useState(true);
  const [alert, setAlert] = useState(null);
  const { isAdmin } = useAuthContext();
  const { userData, isLoading } = useUserContext();

  useEffect(() => {
    fetchCalendarEvents();
  }, []);

  /* Retrieve events from calendar backend */
  const fetchCalendarEvents = async () => {
    try {
      setQuerying(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/calendar`,
        { credentials: "include" }
      );
      if (response.ok) {
        const data = await response.json();
        const transformedEvents = data.results.map((event) => ({
          id: parseInt(event.event_id),
          title: he.decode(String(event.name)),
          start: moment(event.start_time).toDate(),
          end: moment(event.end_time).toDate(),
        }));
        setEvents(transformedEvents);
      } else { // Connected to database, but server error
        setAlert({
          type: "danger",
          header: "Calendar display failed!",
          text: "The calendar could not be displayed. Refresh the page or contact the administrator..",
        });
      }
    } catch (error) { // Could not connect to server
      setAlert({
        type: "danger",
        header: "Calendar display not available!",
        text: "We could not connect to the server. Refresh the page or contact the administrator.",
      });
    } finally {
      setQuerying(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Loading/>
      </>
    );
  }

  // Checking if userData is undefined or email is empty 
  if (userData.is_admin === undefined || userData.is_admin === null) {
    return <Navigate to={"/profile"} />;
  }
  if (userData.email === '') {
    return <Navigate to={"/"} />;
  }


  const Header = isAdmin ? AdminHeader : UserHeader;

  return (
    <>
      <Header />
      {alert && (
        <AlertBox
          type={alert.type}
          header={alert.header}
          text={alert.text}
          wantTimer={false}
          handleClose={() => setAlert(null)}
        ></AlertBox>
      )}
      {isQuerying ? (
        <Loading />
      ) : (
        <>
          <div className="height600" style={{ paddingTop: "9em" }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              defaultDate={moment().toDate()}
              defaultView="month"
              style={{ height: "80vh", width: "95%", margin: "10px auto 0" }}
            />
          </div>
          <div style={{ height: "50px" }}></div>
        </>
      )}
    </>
  );
}

export default ReactCalendar;
