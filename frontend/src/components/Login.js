import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

class Login extends Component {
    state = {
        username: '',
        password: ''
    };

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        axios.post('/api/login/', this.state)
            .then(response => {
                const { token, user_id, email, username } = response.data;
                Cookies.set('token', token);
                console.log(response.data)
                this.props.onLoginSuccess({ id: user_id, email: email, username: username });
            })
            .catch(error => {
                console.error("Login error", error);
            });
    };
    

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input
                        name="username"
                        value={this.state.username}
                        onChange={this.handleChange}
                        placeholder="Username"
                    />
                    <input
                        name="password"
                        type="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        placeholder="Password"
                    />
                    <button type="submit">Login</button>
                </form>
            </div>
        );
    }
}

export default Login;
