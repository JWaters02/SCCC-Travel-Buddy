// Trip.js
import React from 'react';
import { Button } from 'reactstrap';

const Trip = ({ trip, isPastDate, editTrip, handleDelete, viewTrip, userDetails }) => {
    return (
        <div className="d-flex justify-content-between w-100">
            <span>
                <span className="mr-2">{trip.trip_name}:</span>
                <span className="mr-2">{trip.location},</span>
                <span className="mr-2">{trip.start_date}</span>
                <span className="mr-2">{trip.end_date}</span>
                <span className="mr-2">{trip.interests}</span>
            </span>
            <span>
                {isPastDate(trip.end_date) || userDetails.id !== trip.user_id ? null : (
                    <Button color="secondary" className="mr-2" onClick={() => editTrip(trip)}>Edit</Button>
                )}
                {userDetails.id === trip.user_id && (
                    <Button color="danger" onClick={() => handleDelete(trip)}>Delete</Button>
                )}
                {userDetails.id !== trip.user_id && (
                    <Button color="info" onClick={() => viewTrip(trip)}>View</Button>
                )}
            </span>
        </div>
    );
};

export default Trip;
