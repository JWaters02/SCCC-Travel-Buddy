import React from 'react';
import { Alert } from 'reactstrap';

const ErrorMessagesDisplay = ({ errorMessages }) => {
    if (!errorMessages || errorMessages.length === 0) {
        return null;
    }

    return (
        <div>
            {errorMessages.map((message, index) => (
                <Alert key={index} color="danger">
                    {message}
                </Alert>
            ))}
        </div>
    );
};

export default ErrorMessagesDisplay;