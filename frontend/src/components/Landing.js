import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const Landing = (props) => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleLogin = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div>
            {isLogin ? (
                <Login onLoginSuccess={props.onLoginSuccess} />
            ) : (
                <Register onRegisterSuccess={props.onRegisterSuccess} />
            )}
            <button onClick={toggleLogin}>
                {isLogin ? 'Register' : 'Login'}
            </button>
        </div>
    );
};

export default Landing;