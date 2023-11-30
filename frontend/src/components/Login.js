import React, { useState } from 'react';
import { login } from '../api';

const Login = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'username') {
            setUsername(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const userCredentials = { username, password };
        login(userCredentials)
            .then(userDetails => {
                props.onLoginSuccess(userDetails);
            })
            .catch(error => {
                console.error("Login error", error);
            });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    name="username"
                    value={username}
                    onChange={handleChange}
                    placeholder="Username"
                />
                <input
                    name="password"
                    type="password"
                    value={password}
                    onChange={handleChange}
                    placeholder="Password"
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
