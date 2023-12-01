import React from 'react';
import { Button, Card, CardBody, CardText, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const Trip = ({ trip, isPastDate, editTrip, handleDelete, viewTrip, userDetails, popoverOpen, togglePopover }) => {
    const formattedDate = (date) => {
        return new Date(date).toLocaleString();
    }

    const weatherDescription = (weather_forcast) => {
        return Object.keys(weather_forcast).length === 0 ? "N/A" : weather_forcast['description'];
    }

    const weatherPopoverContent = (weather_forcast) => {
        if (Object.keys(weather_forcast).length === 0 || weather_forcast['description'] === "N/A") {
            return "The weather API could not find a weather forecast for this location upon trip creation.";
        }
        const forecastDetails = [
            "If there are forecasts corresponding to the trip's period, the one closest to the trip's start date is selected.",
            "If the start and end dates are later than all available forecasts, the forecast for the last available date is provided."
        ];
        return forecastDetails.map((line, index) => (
            <React.Fragment key={index}>
                {line}<br /><br />
            </React.Fragment>
        ));
    }

    return (
        <Card>
            <CardBody className={
                `d-flex flex-column flex-md-row justify-content-between align-items-md-center 
                ${isPastDate(trip.end_date) ? "bg-light-red" : ""}`
            }>
                <CardText>
                    <strong>{trip.trip_name}</strong> - {trip.location}<br />
                    Start: {formattedDate(trip.start_date)}<br />
                    End: {formattedDate(trip.end_date)} <br />
                    Weather forecast: {weatherDescription(trip.weather_forcast)}
                    <Button id={`Popover-${trip.trip_id}`} type="button" color="link" className="p-0 ml-1" onClick={() => togglePopover(trip.trip_id)}>
                        <FontAwesomeIcon icon={faQuestionCircle} />
                    </Button>
                    <Popover
                        placement="right"
                        isOpen={popoverOpen === `Popover-${trip.trip_id}`}
                        target={`Popover-${trip.trip_id}`}
                        toggle={() => togglePopover(null)}
                        trigger="focus"
                    >
                        <PopoverHeader>How the weather forecast has been calculated</PopoverHeader>
                        <PopoverBody>
                            {weatherPopoverContent(trip.weather_forcast)}
                        </PopoverBody>
                    </Popover>
                </CardText>
                <div>
                    {isPastDate(trip.end_date) || userDetails.id !== trip.user_id ? null : (
                        <Button color="secondary" className="mr-2 mb-2 mb-md-0" onClick={() => editTrip(trip)}>Edit</Button>
                    )}
                    {userDetails.id === trip.user_id && (
                        <Button color="danger" className="mr-2 mb-2 mb-md-0" onClick={() => handleDelete(trip)}>Delete</Button>
                    )}
                    {userDetails.id !== trip.user_id && (
                        <Button color="info" className="mr-2 mb-2 mb-md-0" onClick={() => viewTrip(trip)}>View</Button>
                    )}
                </div>
            </CardBody>
        </Card>
    );
};

export default Trip;
