import React, { Component } from 'react';
import Login from './Login';
import Register from './Register';

class Landing extends Component {
    state = {
        isLogin: true
    };

    toggleLogin = () => {
        this.setState({ isLogin: !this.state.isLogin });
    };

    render() {
        return (
            <div>
                {this.state.isLogin ? (
                    <Login onLoginSuccess={this.props.onLoginSuccess} />
                ) : (
                    <Register onRegisterSuccess={this.props.onRegisterSuccess} />
                )}
                <button onClick={this.toggleLogin}>
                    {this.state.isLogin ? 'Register' : 'Login'}
                </button>
            </div>
        );
    }
}

export default Landing;