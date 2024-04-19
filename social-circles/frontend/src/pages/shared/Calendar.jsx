import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment)

function ReactCalendar() {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState("");
    const [isQuerying, setQuerying] = useState(true);

    useEffect(() => {
        fetchCalendarEvents()
    }, []);
    
    const transformedEvents = events.map(event => ({
        id: event.event_id,
        title: event.name,
        start: new Date(event.start_time),
        end: new Date(event.end_time),
    }));

    const fetchCalendarEvents = async () => {
        try {
        setQuerying(true);
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/calendar`,
            { credentials: "include" }
        )
        if (response.ok) {
            const data = await response.json();
            console.log(data.results);
            setEvents(data.results);
            setEvents(transformedEvents);
        } else {
            const errorData = await response.json();
            setError(errorData.message);
        }
        } catch (error) {
        console.error("Failed to fetch event data: ", error);
        setError("Server error. Please contact the administrator.")
        } finally {
        setQuerying(false);
        }
  };

  return (
    <>
      <div className="height600">
        <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        />
    </div>
    </>
  );
}

export default ReactCalendar;