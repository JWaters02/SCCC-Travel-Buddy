import React, { Component } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            markerPosition: null,
            mapLoaded: false,
            mapLoadError: false
        };
        this.API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    }

    containerStyle = {
        width: '400px',
        height: '400px'
    };

    center = {
        lat: 52.954,
        lng: -1.252
    };

    componentDidMount() {
        this.updateMarkerPosition();
    }

    componentDidUpdate(prevProps) {
        this.updateMarkerPosition(prevProps);
    }

    updateMarkerPosition(prevProps = {}) {
        if ((!isNaN(this.props.latitude) && this.props.latitude !== prevProps.latitude) ||
            (!isNaN(this.props.longitude) && this.props.longitude !== prevProps.longitude)) {
            try {
                this.setState({
                    markerPosition: {
                        lat: this.props.latitude,
                        lng: this.props.longitude,
                    },
                });
            } catch (error) {
                console.error("Error updating marker position: ", error);
            }
        }
    }

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

    handleMapLoad = () => {
        this.setState({ mapLoaded: true, mapLoadError: false });
    }

    handleMapLoadError = (e) => {
        console.error("Error loading Google Maps", e);
        this.setState({ mapLoadError: true });
    }

    render() {
        const { markerPosition, mapLoaded, mapLoadError } = this.state;

        if (mapLoadError) {
            return <div>Error loading map. Please try again later.</div>;
        }

        return (
            <LoadScript 
                googleMapsApiKey={this.API_KEY}
                onLoad={this.handleMapLoad}
                onError={this.handleMapLoadError}
            >
                {mapLoaded ? (
                    <GoogleMap
                        mapContainerStyle={this.containerStyle}
                        center={this.center}
                        zoom={10}
                        onClick={this.onMapClick}
                    >
                        {markerPosition && <Marker position={markerPosition} />}
                    </GoogleMap>
                ) : <div>Map won't load</div>}
            </LoadScript>
        );
    }
}

export default Map;
