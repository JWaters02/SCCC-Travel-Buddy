import React, { useState, Component } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            markerPosition: null
        };
        this.onMapClick = this.onMapClick.bind(this);
        this.API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
        console.log(this.API_KEY);
    }

    containerStyle = {
        width: '400px',
        height: '400px'
    };

    center = {
        lat: 52.954,
        lng: -1.252
    };

    onMapClick = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        this.setState({
            markerPosition: { lat, lng }
        });

        if (this.props.onMarkerPlaced) {
            this.props.onMarkerPlaced(lat, lng);
        }
    }

    render() {
        const { markerPosition } = this.state;
        return (
            <LoadScript googleMapsApiKey={this.API_KEY}>
                <GoogleMap
                    mapContainerStyle={this.containerStyle}
                    center={this.center}
                    zoom={10}
                    onClick={this.onMapClick}
                >
                    {markerPosition && <Marker position={markerPosition} />}
                </GoogleMap>
            </LoadScript>
        );
    }
}

export default Map;
