import React, { useContext, useEffect, useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import MapContext from '../contexts/MapContext';

const Map = (props) => {
    const map = useContext(MapContext);
    const [markerPosition, setMarkerPosition] = useState(null);

    useEffect(() => {
        if (map && !isNaN(props.latitude) && !isNaN(props.longitude)) {
            setMarkerPosition({
                lat: props.latitude,
                lng: props.longitude
            });
        }
    }, [map, props.latitude, props.longitude]);

    const onMapClick = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarkerPosition({ lat, lng });
        props.onMarkerPlaced(lat, lng);
    };

    const containerStyle = {
        width: '400px',
        height: '400px'
    };

    const center = {
        lat: 52.954,
        lng: -1.252
    };

    if (!map) {
        return <div>Map loading...</div>;
    }

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onClick={onMapClick}
            onLoad={map => props.onMapLoad(map)}
        >
            {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>
    );
};

export default Map;
