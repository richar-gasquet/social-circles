import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useAuthContext } from "../../contexts/AuthContextHandler.jsx";
import moment from 'moment';
import UserHeader from '../../components/headers/UserHeader';
import AdminHeader from '../../components/headers/AdminHeader.jsx';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function ReactCalendar() {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState("");
    const [isQuerying, setQuerying] = useState(true);
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
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error) {
            console.error("Failed to fetch event data: ", error);
            setError("Server error. Please contact the administrator.");
        } finally {
            setQuerying(false);
        }
    };

    const Header = isAdmin ? AdminHeader : UserHeader;

    return (
        <>
            <Header />
            <div className="height600" style={{paddingTop: '12em', marginBottom: '5em'}}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    defaultDate={moment().toDate()}
                    defaultView="month"
                    style={{ height: '80vh',width: '95%', margin: '10px auto 0' }}
                />
            </div>
        </>
    );
}

export default ReactCalendar;