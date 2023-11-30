import React, { useState, useEffect } from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Input,
    Label,
} from "reactstrap";
import Map from "./Map";
import { getLocation, getUUID } from "../api";

const CustomModal = ({ isModalCreate, activeItemProp, toggle, onSave }) => {
    const [activeItem, setActiveItem] = useState(activeItemProp);
    const [coordsSet, setCoordsSet] = useState(false);

    console.log(activeItemProp)

    useEffect(() => {
        if (isModalCreate) {
            getUUID()
                .then((uuid) => {
                    setActiveItem(prevActiveItem => ({
                        ...prevActiveItem,
                        tripId: uuid["uuid"],
                    }));
                })
                .catch((error) => {
                    setActiveItem(prevActiveItem => ({
                        ...prevActiveItem,
                        tripId: 'error - please refresh the page',
                    }));
                    console.error("UUID error", error);
                });
        } else {
            setCoordsSet(true);
        }
    }, [isModalCreate]);

    useEffect(() => {
        setActiveItem(activeItemProp);
    }, [activeItemProp]);

    const canSubmit = () => {
        const hasRequiredProps = 'tripName' in activeItem &&
            'startDate' in activeItem &&
            'endDate' in activeItem &&
            'latitude' in activeItem &&
            'longitude' in activeItem;
    
        if (!hasRequiredProps) {
            return false;
        }
        
        const tripNameIsValid = activeItem.tripName.length > 0 && activeItem.tripName.length <= 100;
        const datesAreValid = activeItem.startDate && activeItem.endDate && new Date(activeItem.startDate) <= new Date(activeItem.endDate);
        const inputsAreNotEmpty = activeItem.tripName && activeItem.startDate && activeItem.endDate && activeItem.latitude && activeItem.longitude;
    
        return tripNameIsValid && datesAreValid && coordsSet && inputsAreNotEmpty;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setActiveItem(prevActiveItem => ({
            ...prevActiveItem,
            [name]: value,
        }));
    
        if (name === 'latitude' || name === 'longitude') {
            updateLocationFromCoords();
        }
    };
    
    const updateLocationFromCoords = () => {
        const lat = parseFloat(activeItem.latitude);
        const lon = parseFloat(activeItem.longitude);
    
        getLocation(lat, lon)
            .then(location => {
                setActiveItem(prevActiveItem => ({
                    ...prevActiveItem,
                    location
                }));
            })
            .catch(error => {
                console.error("Location error", error);
            });
    };

    const handleMarkerPositionChange = (lat, lon) => {
        getLocation(lat, lon)
            .then(location => {
                setActiveItem(prevActiveItem => ({
                    ...prevActiveItem,
                    location,
                    latitude: parseFloat(lat.toFixed(2)),
                    longitude: parseFloat(lon.toFixed(2)),
                }));
                setCoordsSet(true);
            })
            .catch(error => {
                console.error("Location error", error);
            });
    };    

    const handleMapLoad = (map) => {
        //console.log("Map loaded!", map);
    };

    return (
        <Modal isOpen={true} toggle={toggle}>
            <ModalHeader toggle={toggle}>Trips</ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label for="trip-id">Trip ID</Label>
                        <Input
                            type="text"
                            id="trip-id"
                            name="tripId"
                            value={activeItem.tripId}
                            onChange={handleChange}
                            disabled={true}
                            placeholder="Trip ID"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="trip-name">Trip Name</Label>
                        <Input
                            type="text"
                            id="trip-name"
                            name="tripName"
                            value={activeItem.name}
                            onChange={handleChange}
                            placeholder="Enter trip name"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="trip-location">Location</Label>
                        <Input
                            type="text"
                            id="trip-location"
                            name="location"
                            value={activeItem.location}
                            onChange={handleChange}
                            disabled={true}
                            placeholder="Place a marker on the map to get the location!"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="trip-startDate">Start Date</Label>
                        <Input
                            type="date"
                            id="trip-startDate"
                            name="startDate"
                            value={activeItem.startDate}
                            onChange={handleChange}
                            placeholder="Enter trip start date"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="trip-endDate">End Date</Label>
                        <Input
                            type="date"
                            id="trip-endDate"
                            name="endDate"
                            value={activeItem.endDate}
                            onChange={handleChange}
                            placeholder="Enter trip end date"
                        />
                    </FormGroup>
                    <Map
                        onMarkerPlaced={handleMarkerPositionChange}
                        latitude={parseFloat(activeItem.latitude)}
                        longitude={parseFloat(activeItem.longitude)}
                        onMapLoad={handleMapLoad}
                    />
                    <FormGroup>
                        <Label for="trip-latitude">Latitude</Label>
                        <Input
                            type="number"
                            id="trip-latitude"
                            name="latitude"
                            disabled={!coordsSet}
                            value={activeItem.latitude}
                            onChange={handleChange}
                            placeholder="Place a marker on the map">
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="trip-longitude">Longitude</Label>
                        <Input
                            type="number"
                            id="trip-longitude"
                            name="longitude"
                            disabled={!coordsSet}
                            value={activeItem.longitude}
                            onChange={handleChange}
                            placeholder="Place a marker on the map">
                        </Input>
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button
                    color="success"
                    onClick={() => onSave(activeItem)}
                    disabled={!canSubmit()}
                >
                    Save
                </Button>
            </ModalFooter>
        </Modal>
    );
}

export default CustomModal;