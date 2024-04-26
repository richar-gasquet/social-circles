import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useAuthContext } from "../../contexts/AuthContextHandler.jsx";
import moment from 'moment';
import UserHeader from '../../components/headers/UserHeader';
import AdminHeader from '../../components/headers/AdminHeader.jsx';
import Loading from '../../components/loading-component/loading.jsx';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function ReactCalendar() {
  const [events, setEvents] = useState([]);
  const [isQuerying, setQuerying] = useState(true);
  const [alert, setAlert] = useState(null)
  const { isAdmin } = useAuthContext();

  useEffect(() => {
    fetchCalendarEvents();
  }, []);

  const fetchCalendarEvents = async () => {
    try {
      setQuerying(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/calendar`,
        { credentials: "include" }
      );
      if (response.ok) {
        const data = await response.json();
        const transformedEvents = data.results.map((event, index) => ({
          id: parseInt(event.event_id),
          title: String(event.name),
          start: moment(event.start_time).toDate(),
          end: moment(event.end_time).toDate(),
        }));
        setEvents(transformedEvents);
      } else {
        setAlert({type: "danger",  
                  header: "Calendar display failed!",
                  text: "The calendar could not be displayed. Refresh the page or contact the administrator.." });
      }
    } catch (error) {
      setAlert({type: "danger",  
                header: "Calendar display not available!",
                text: "We could not connect to the server. Refresh the page or contact the administrator." });
    } finally {
      setQuerying(false);
    }
  };

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
            handleClose={() => setAlert(null)}>
          </AlertBox>
        )
      }
      {isQuerying ? (
        <Loading />
      ) : (
        <>
          <div className="height600" style = {{paddingTop: '9em'}}>
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
