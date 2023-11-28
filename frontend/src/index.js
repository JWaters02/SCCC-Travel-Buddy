import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

window.addEventListener('unhandledrejection', function (event) {
  if (event.reason.message.toLowerCase().includes('tba') || event.reason.message.toLowerCase().includes('is undefined')) {
    console.warn('Unhandled Google Maps API error:', event.reason);
    event.preventDefault();
    document.querySelector('iframe').style.display = 'none';
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
