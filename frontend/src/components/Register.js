import React, { useState, useEffect } from 'react';
import { ErrorMessagesDisplay } from './AlertDisplays';
import { register, getUUID } from '../api';
import { Button, Form, FormGroup, Input, Container } from 'reactstrap';

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
        <Container>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Input
                        type="text"
                        name="userId"
                        value={userId}
                        onChange={handleChange}
                        disabled={true}
                        placeholder="User ID"
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        type="text"
                        name="username"
                        value={username}
                        onChange={handleChange}
                        placeholder="Username"
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        placeholder="Email"
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        placeholder="Password"
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        type="password"
                        name="password2"
                        value={password2}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                    />
                </FormGroup>
                <Button type="submit" color="primary">Register</Button>
            </Form>
            <br />
            <ErrorMessagesDisplay errorMessages={errorMessages} />
        </Container>
    );
};

export default Register;