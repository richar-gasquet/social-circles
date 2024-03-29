import React, { useState } from 'react';

function addEventInfoForm() {
    const [formData, setFormData] = useState({
        eventId: '',
        eventName: '',
        dateAndTime: '',
        capacity: '',
        filledSpots: ''
    });
  
    const handleChange = (e) => {
      const { eventId, value1 } = e.target;
      const { eventName, value2 } = e.target;
      const { dateAndTime, value3 } = e.target;
      const { capacity, value4 } = e.target;
      const { filledSpots, value5 } = e.target;
      setFormData({ ...formData, [eventId]: value1, [eventName]: value2, [dateAndTime]: value3, [capacity]: value4, [filledSpots]: value5 });
    };
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
                // what would this api add data be???
                const response = await fetch('/api/addData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                });
                if (response.ok) {
                console.log('Data added successfully');
                // Reset form fields
                setFormData({ eventId: '', eventName: '', dateAndTime: '', capacity: '', filledSpots: '' });
                } else {
                console.error('Failed to add data');
                }
            } catch (error) {
                console.error('Error:', error);
            }
    };
  
    return (
        <form onSubmit={handleSubmit}>
        <div>
            <label>Name:</label>
            <input
            type="text"
            name="eventId"
            value={formData.eventId}
            onChange={handleChange}
            />
        </div>
        <div>
            <label>Event Name:</label>
            <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            />
        </div>
        <div>
            <label>Date and Time:</label>
            <input
            type="datetime-local"
            name="dateAndTime"
            value={formData.dateAndTime}
            onChange={handleChange}
            />
        </div>
        <div>
            <label>Capacity:</label>
            <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            />
        </div>
        <div>
            <label>Filled Spots:</label>
            <input
            type="number"
            name="filledSpots"
            value={formData.filledSpots}
            onChange={handleChange}
            />
        </div>
        <button type="submit">Submit</button>
        </form>
    );
  }

export default addEventInfoForm;