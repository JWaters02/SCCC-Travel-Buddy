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

const CustomModal = ({ modalMode, activeItem, setActiveItem, toggle, onSave }) => {
    const [coordsSet, setCoordsSet] = useState(false);
    const [viewOnly, setViewOnly] = useState(false);
    const [center, setCenter] = useState({ lat: 52.954, lng: -1.252 });

    useEffect(() => {
        switch (modalMode) {
            case "Create":
                getUUID()
                .then((uuid) => {
                    setActiveItem(prevActiveItem => ({
                        ...prevActiveItem,
                        trip_id: uuid["uuid"],
                    }));
                })
                .catch((error) => {
                    setActiveItem(prevActiveItem => ({
                        ...prevActiveItem,
                        trip_id: 'error - please refresh the page',
                    }));
                    console.error("UUID error", error);
                });
                break;
            case "Edit":
                setCoordsSet(true);
                setCenter({ lat: parseFloat(activeItem.latitude), lng: parseFloat(activeItem.longitude) });
                break;
            case "View":
                setViewOnly(true);
                setCenter({ lat: parseFloat(activeItem.latitude), lng: parseFloat(activeItem.longitude) });
                break;
            default:
                break;
        }
    }, [modalMode, setActiveItem, activeItem.latitude, activeItem.longitude]);

    const canSubmit = () => {
        const hasRequiredProps = 'trip_name' in activeItem &&
            'start_date' in activeItem &&
            'end_date' in activeItem &&
            'latitude' in activeItem &&
            'longitude' in activeItem;
    
        if (!hasRequiredProps) {
            return false;
        }
        
        const tripNameIsValid = activeItem.trip_name.length > 0 && activeItem.trip_name.length <= 100;
        const datesAreValid = activeItem.start_date && activeItem.end_date && new Date(activeItem.start_date) <= new Date(activeItem.end_date);
        const inputsAreNotEmpty = activeItem.trip_name && activeItem.start_date && activeItem.end_date && activeItem.latitude && activeItem.longitude;
    
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
                            name="trip_id"
                            value={activeItem.trip_id}
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
                            name="trip_name"
                            value={activeItem.trip_name}
                            onChange={handleChange}
                            disabled={viewOnly}
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
                            disabled={true || viewOnly}
                            placeholder="Place a marker on the map to get the location!"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="trip-start_date">Start Date</Label>
                        <Input
                            type="datetime-local"
                            id="trip-start_date"
                            name="start_date"
                            value={activeItem.start_date}
                            onChange={handleChange}
                            disabled={viewOnly}
                            placeholder="Enter trip start date"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="trip-end_date">End Date</Label>
                        <Input
                            type="datetime-local"
                            id="trip-end_date"
                            name="end_date"
                            value={activeItem.end_date}
                            onChange={handleChange}
                            disabled={viewOnly}
                            placeholder="Enter trip end date"
                        />
                    </FormGroup>
                        <Map
                            onMarkerPlaced={handleMarkerPositionChange}
                            latitude={parseFloat(activeItem.latitude)}
                            longitude={parseFloat(activeItem.longitude)}
                            onMapLoad={handleMapLoad}
                            viewOnly={viewOnly}
                            center={center}
                        />
                    <FormGroup>
                        <Label for="trip-latitude">Latitude</Label>
                        <Input
                            type="number"
                            id="trip-latitude"
                            name="latitude"
                            disabled={!coordsSet || viewOnly}
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
                            disabled={!coordsSet || viewOnly}
                            value={activeItem.longitude}
                            onChange={handleChange}
                            placeholder="Place a marker on the map">
                        </Input>
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                {!viewOnly && (
                    <Button
                    color="success"
                    onClick={() => onSave(activeItem)}
                    disabled={!canSubmit()}
                    >
                        Save
                    </Button>
                )}
            </ModalFooter>
        </Modal>
    );
}

export default CustomModal;