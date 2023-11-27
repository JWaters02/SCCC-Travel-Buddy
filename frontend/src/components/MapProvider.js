import React, { useState, useEffect } from 'react';
import MapContext from '../contexts/MapContext';

const MapProvider = ({ children }) => {
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    useEffect(() => {
        if (window.google && window.google.maps) {
            setIsScriptLoaded(true);
            return;
        }

        window.initMap = () => setIsScriptLoaded(true);

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        return () => {
            window.initMap = undefined;
            document.head.removeChild(script);
        };
    }, []);

    return (
        <MapContext.Provider value={isScriptLoaded}>
            {children}
        </MapContext.Provider>
    );
};

export default MapProvider;