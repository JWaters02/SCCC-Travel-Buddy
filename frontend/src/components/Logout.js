import React from 'react';
import { logout } from '../api';

const Logout = (props) => {
    const handleSubmit = (event) => {
        event.preventDefault();
        logout()
            .then(response => {
                props.onLogoutSuccess();
            })
            .catch(error => {
                console.error("Logout error", error);
            });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <button type="submit">Logout</button>
            </form>
        </div>
    );
}

export default Logout;