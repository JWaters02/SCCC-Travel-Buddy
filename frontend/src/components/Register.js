import React, { useState, useEffect } from 'react';
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

const Register = (props) => {
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [errorMessages, setErrorMessages] = useState([]);

    useEffect(() => {
        getUUID()
            .then(uuid => {
                setUserId(uuid['uuid']);
            })
            .catch(error => {
                console.error("UUID error", error);
            });
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        switch(name) {
            case 'username':
                setUsername(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'password2':
                setPassword2(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const userData = { userId, username, email, password, password2 };
        register(userData)
            .then(response => {
                if (response && response.status === 'error') {
                    setErrorMessages(response.errorMessages);
                } else {
                    props.onRegisterSuccess(response);
                }
            })
            .catch(error => {
                console.error("Register error", error);
            });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    name="userId"
                    value={userId}
                    onChange={handleChange}
                    disabled={true}
                    placeholder="User ID"
                />
                <input
                    name="username"
                    value={username}
                    onChange={handleChange}
                    placeholder="Username"
                />
                <input
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Email"
                />
                <input
                    name="password"
                    type="password"
                    value={password}
                    onChange={handleChange}
                    placeholder="Password"
                />
                <input
                    name="password2"
                    type="password"
                    value={password2}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                />
                <button type="submit">Register</button>
            </form>
            <ErrorMessagesDisplay errorMessages={errorMessages} />
        </div>
    );
};

export default Register;
