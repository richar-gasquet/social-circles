import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function RegistrationModal(props) {
    const formattedStart = new Date(props.start).toLocaleString();
    const formattedEnd = new Date(props.end).toLocaleString();
    const [show, setShow] = useState(props.show);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/add-event-registration`, { 
                credentials: "include",
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(props.id)
            });
            if (response.ok) {
                console.log('Registration successful');
                alert("Registration Successful!");
            } else {
                console.error('Registration failed');
                alert("Registration Failed");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <button
                onClick={props.toggleShow}
                className="block m-2 text-black font-bold py-2 px-4 rounded"
            >
                + Register Here
            </button>

            <Modal
                show={props.show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Registration Page</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="">
                        <img className="img-responsive" src={props.image} alt="Event" />
                        <div id="events_info">
                            <p>{props.name}</p>
                            <p>{props.desc}</p>
                            <p>{formattedStart}</p>
                            <p>{formattedEnd}</p>
                            <p>{props.capacity}</p>
                            <p>{props.filled}</p>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="bg-slate-400 hover:bg-slate-500 text-black font-bold py-2 px-4 rounded"
                        onClick={props.toggleShow}
                    >
                        Close
                    </button>
                    <form onSubmit={handleSubmit}>
                        <button type="submit"
                            className="bg-purple-600 hover:bg-purple-700 text-black font-bold py-2 px-4 rounded"
                        >
                            Click to Register
                        </button>
                    </form>
                </Modal.Footer>
            </Modal>
        </>
    );
}
  
RegistrationModal.defaultProps = {
    name: "No Event Name",
    desc: "No Event Description",
    start: "N/A",
    end: "N/A",
    capacity: 0,
    filled: 0,
    image: "https://via.placeholder.com/200"
};