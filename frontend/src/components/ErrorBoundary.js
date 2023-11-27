import { Component } from "react";

class ErrorBoundary extends Component {
    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
        if (error.message.includes('is undefined')) {
            console.warn('Google Maps API error ignored:', error);
        } else {
            console.error('An error occurred:', error);
        }
    }

    render() {
        return this.props.children;
    }
}

export default ErrorBoundary;