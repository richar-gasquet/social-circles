import React, { useState, useEffect } from "react"
import UserHeader from "./UserHeader"

function EventRegistrations() {
    const [events, setEvents] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        const getRegisteredEvents = async () => {
            try {
                const response = await fetch('https://localhost:5000/get-registered-events', 
                                            {credentials: 'include'});
                if (response.ok) {
                    const data = response.json()
                    setEvents(data.results)
                } else {
                    const errorData = await response.json()
                    setError(errorData.message);
                }
            } catch (error) {
                console.error('Failed to fetch event data: ', error);
                setError('Server error. Please contact the administrator')
            }
        }
        getRegisteredEvents()
    }, [])

    return (
        <>
            <UserHeader />
            <h2>This is the Registered Events Page</h2>
            <p>Here are the events you registered for: </p>
            <ul>
                {events.map(event => (
                    <li key = {event.event_id}>
                        {event.event_name} - {event.date_and_time} - {event.capacity} - {event.filled_spots}
                    </li>
                ))}
            </ul>
        </>
    )
}

export default EventRegistrations