import React, { useState, useEffect } from 'react'
import UserHeader from '../user/UserHeader.jsx'

function Events() {
    const [events, setEvents] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        const getUserEvents = async () => {
            try {
                const response = await fetch('https://localhost:5000/get-available-events', 
                                            {credentials: 'include'});
                if (response.ok) {
                    const data = await response.json();
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
        getUserEvents()
    }, []);


    return <>
        <UserHeader />
        <h2>This is the Events page.</h2>
        <p>Here are the events you have signed up for: </p>
        <ul>
            {events.map(event => (
                <li key = {event.event_id}>
                    {event.event_name} - {event.date_and_time} - {event.capacity} - {event.filled_spots}
                </li>
            ))}
        </ul>
    </>
}

export default Events