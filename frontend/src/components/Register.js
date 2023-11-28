import React, { Component } from 'react';
import { register, getUUID } from '../api';

const ErrorMessagesDisplay = ({ errorMessages }) => {
    if (!errorMessages || errorMessages.length === 0) {
        return null;
    }

    return (
        <div className="error-messages">
            {errorMessages.map((message, index) => (
                <div key={index} className="error-message">
                    {message}
                </div>
            ))}
        </div>
    );
};

class Register extends Component {
    state = {
        userId: '',
        username: '',
        email: '',
        password: '',
        password2: ''
    };

    componentDidMount() {
        getUUID()
            .then(uuid => {
                this.setState({ userId: uuid['uuid'] });
            })
            .catch(error => {
                console.error("UUID error", error);
            });
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        register(this.state)
            .then(response => {
                if (response && response.status === 'error') {
                    this.setState({ errorMessages: response.errorMessages });
                } else {
                    this.props.onRegisterSuccess(response);
                }
            })
            .catch(error => {
                console.error("Register error", error);
            });
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input
                        name="userId"
                        value={this.state.userId}
                        onChange={this.handleChange}
                        disabled={true}
                        placeholder="User ID"
                    />
                    <input
                        name="username"
                        value={this.state.username}
                        onChange={this.handleChange}
                        placeholder="Username"
                    />
                    <input
                        name="email"
                        type="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        placeholder="Email"
                    />
                    <input
                        name="password"
                        type="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        placeholder="Password"
                    />
                    <input
                        name="password2"
                        type="password"
                        value={this.state.password2}
                        onChange={this.handleChange}
                        placeholder="Confirm Password"
                    />
                    <button type="submit">Register</button>
                </form>
                <ErrorMessagesDisplay errorMessages={this.state.errorMessages} />
            </div>
        );
    }
}

export default Register;