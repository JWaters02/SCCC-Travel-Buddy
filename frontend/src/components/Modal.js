import React, { Component } from "react";
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

export default class CustomModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalCreate: this.props.isModalCreate,
            existingTripId: this.props.existingTripId,
            activeItem: this.props.activeItem,
            markerLatitude: null,
            markerLongitude: null,
            coords_set: false,
            tripIdSet: false,
        };
    }

    componentDidMount() {
        if (this.props.isModalCreate) {
            getUUID()
                .then((uuid) => {
                    this.setState({
                        activeItem: {
                            ...this.state.activeItem,
                            tripId: uuid["uuid"],
                        },
                        tripIdSet: true,
                    });
                })
                .catch((error) => {
                    this.setState({
                        activeItem: {
                            ...this.state.activeItem,
                            tripId: 'error - please refresh the page',
                        },
                    });
                    console.error("UUID error", error);
                });
        } else {
            this.setState({
                activeItem: {
                    ...this.state.activeItem,
                    tripId: this.props.existingTripId,
                },
                coords_set: true,
            }, () => console.log("componentDidMount", this.state.activeItem));
        }
    }

    componentDidUpdate(prevProps) {
        console.log("componentDidUpdate");
        if (this.props.activeItem !== prevProps.activeItem) {
            console.log("componentDidUpdate - tripId changed");
            this.setState({ activeItem: this.props.activeItem });
        }
    }

    canSubmit = () => {
        const { activeItem } = this.state;
        const hasRequiredProps = activeItem.hasOwnProperty('tripName') &&
            activeItem.hasOwnProperty('startDate') &&
            activeItem.hasOwnProperty('endDate') &&
            activeItem.hasOwnProperty('latitude') &&
            activeItem.hasOwnProperty('longitude');

        if (!hasRequiredProps) {
            return false;
        }

        const tripNameIsValid = activeItem.tripName.length > 0 && activeItem.tripName.length <= 100;
        const datesAreValid = activeItem.startDate && activeItem.endDate && new Date(activeItem.startDate) <= new Date(activeItem.endDate);
        const coordsAreSet = this.state.coords_set;
        const inputsAreNotEmpty = activeItem.tripName && activeItem.startDate && activeItem.endDate && activeItem.latitude && activeItem.longitude;

        return tripNameIsValid && datesAreValid && coordsAreSet && inputsAreNotEmpty;
    };

    handleChange = (e) => {
        let { name, value } = e.target;
        const activeItem = {
            ...this.state.activeItem,
            [name]: value
        };
        this.setState({ activeItem });
    };

    handleMarkerPositionChange = (lat, lon) => {
        getLocation(lat, lon)
            .then(location => {
                const activeItem = {
                    ...this.state.activeItem,
                    location,
                    latitude: parseFloat(lat.toFixed(2)),
                    longitude: parseFloat(lon.toFixed(2)),
                };
                this.setState({ activeItem, coords_set: true });
            })
            .catch(error => {
                console.error("Location error", error);
            });
    };

    handleMapLoad = (map) => {
        //console.log("Map loaded!", map);
    };

    handleCoordinateChange = (e) => {
        const { name, value } = e.target;
        const activeItem = { ...this.state.activeItem, [name]: parseFloat(value) || '' };

        this.setState({ activeItem });

        if (!isNaN(activeItem.latitude) && !isNaN(activeItem.longitude)) {
            this.props.onMarkerPlaced(activeItem.latitude, activeItem.longitude);
        }
    };

    render() {
        const { toggle, onSave } = this.props;
        const { activeItem, coords_set } = this.state;
        console.log("render", activeItem);

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
                                onChange={this.handleChange}
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
                                onChange={this.handleChange}
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
                                onChange={this.handleChange}
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
                                onChange={this.handleChange}
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
                                onChange={this.handleChange}
                                placeholder="Enter trip end date"
                            />
                        </FormGroup>
                        <Map
                            onMarkerPlaced={this.handleMarkerPositionChange}
                            latitude={parseFloat(activeItem.latitude)}
                            longitude={parseFloat(activeItem.longitude)}
                            onMapLoad={this.handleMapLoad}
                        />
                        <FormGroup>
                            <Label for="trip-latitude">Latitude</Label>
                            <Input
                                type="number"
                                id="trip-latitude"
                                name="latitude"
                                disabled={!coords_set}
                                value={activeItem.latitude}
                                onChange={this.handleChange}
                                placeholder="Place a marker on the map">
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="trip-longitude">Longitude</Label>
                            <Input
                                type="number"
                                id="trip-longitude"
                                name="longitude"
                                disabled={!coords_set}
                                value={activeItem.longitude}
                                onChange={this.handleChange}
                                placeholder="Place a marker on the map">
                            </Input>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="success"
                        onClick={() => onSave(activeItem)}
                        disabled={!this.canSubmit()}
                    >
                        Save
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}