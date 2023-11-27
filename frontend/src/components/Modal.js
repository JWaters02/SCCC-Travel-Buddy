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

export default class CustomModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: this.props.activeItem,
            markerLatitude: null,
            markerLongitude: null,
            coords_set: false,
        };
    }

    canSubmit = () => {
        const { activeItem } = this.state;
        const hasRequiredProps = activeItem.hasOwnProperty('name') &&
            activeItem.hasOwnProperty('startDate') &&
            activeItem.hasOwnProperty('endDate') &&
            activeItem.hasOwnProperty('latitude') &&
            activeItem.hasOwnProperty('longitude');

        if (!hasRequiredProps) {
            return false;
        }

        const nameIsValid = activeItem.name.length > 0 && activeItem.name.length <= 100;
        const datesAreValid = activeItem.startDate && activeItem.endDate &&
            new Date(activeItem.startDate) <= new Date(activeItem.endDate);
        const coordsAreSet = this.state.coords_set;
        const inputsAreNotEmpty = activeItem.name && activeItem.startDate &&
            activeItem.endDate && activeItem.latitude &&
            activeItem.longitude;

        return nameIsValid && datesAreValid && coordsAreSet && inputsAreNotEmpty;
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
        const activeItem = {
            ...this.state.activeItem,
            latitude: parseFloat(lat.toFixed(2)),
            longitude: parseFloat(lon.toFixed(2)),
        };
        this.setState({ activeItem, coords_set: true });
    };


    handleCoordinateChange = (e) => {
        const { name, value } = e.target;
        const activeItem = { ...this.state.activeItem, [name]: parseFloat(value) || '' };

        this.setState({ activeItem });

        // Call the onMarkerPlaced prop only if both latitude and longitude are numbers
        if (!isNaN(activeItem.latitude) && !isNaN(activeItem.longitude)) {
            this.props.onMarkerPlaced(activeItem.latitude, activeItem.longitude);
        }
    };

    render() {
        const { toggle, onSave } = this.props;

        return (
            <Modal isOpen={true} toggle={toggle}>
                <ModalHeader toggle={toggle}>Trips</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="trip-name">Trip Name</Label>
                            <Input
                                type="text"
                                id="trip-name"
                                name="name"
                                value={this.state.activeItem.name}
                                onChange={this.handleChange}
                                placeholder="Enter trip name"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="trip-startDate">Start Date</Label>
                            <Input
                                type="date"
                                id="trip-startDate"
                                name="startDate"
                                value={this.state.activeItem.startDate}
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
                                value={this.state.activeItem.endDate}
                                onChange={this.handleChange}
                                placeholder="Enter trip end date"
                            />
                        </FormGroup>
                        <Map
                            onMarkerPlaced={this.handleMarkerPositionChange}
                            latitude={parseFloat(this.state.activeItem.latitude)}
                            longitude={parseFloat(this.state.activeItem.longitude)}
                        />
                        <FormGroup>
                            <Label for="trip-latitude">Latitude</Label>
                            <Input
                                type="number"
                                id="trip-latitude"
                                name="latitude"
                                disabled={!this.state.coords_set}
                                value={this.state.activeItem.latitude}
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
                                disabled={!this.state.coords_set}
                                value={this.state.activeItem.longitude}
                                onChange={this.handleChange}
                                placeholder="Place a marker on the map">
                            </Input>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="success"
                        onClick={() => onSave(this.state.activeItem)}
                        disabled={!this.canSubmit()}
                    >
                        Save
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}