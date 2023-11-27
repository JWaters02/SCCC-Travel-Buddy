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

export default class CustomModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: this.props.activeItem,
        };
    }

    handleChange = (e) => {
        let { name, value } = e.target;
        const activeItem = { ...this.state.activeItem, [name]: value };
        this.setState({ activeItem });
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
                            <Label for="trip-location">Location</Label>
                            <Input
                                type="text"
                                id="trip-location"
                                name="location"
                                value={this.state.activeItem.location}
                                onChange={this.handleChange}
                                placeholder="Enter trip location"
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
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="success"
                        onClick={() => onSave(this.state.activeItem)}
                    >
                        Save
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}