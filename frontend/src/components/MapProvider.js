import React, { useState, useEffect } from 'react';
import MapContext from '../contexts/MapContext';
import ErrorBoundary from './ErrorBoundary';

const MapProvider = ({ children }) => {
    const [map, setMap] = useState(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?v=weekly&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&callback=initMap`;
        script.async = true;
        document.head.appendChild(script);

        window.initMap = () => {
            setMap(new window.google.maps.Map(document.createElement('div')));
        };

        return () => {
            document.head.removeChild(script);
            window.initMap = undefined;
        };
    }, []);

    return (
        <ErrorBoundary>
            <MapContext.Provider value={map}>
                {children}
            </MapContext.Provider>
        </ErrorBoundary>
    );
};

export default MapProvider;
