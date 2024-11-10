import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';

const MapComponent = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/locations')
      .then(response => {
        setLocations(response.data);
      })
      .catch(error => console.error('Error fetching locations:', error));
  }, []);

  return (
    <LoadScript googleMapsApiKey="GG_MAP_KEY">
      <GoogleMap
        id="map"
        mapContainerStyle={{ width: '100%', height: '400px' }}
        center={{ lat: 13.7367, lng: 100.5232 }} // จุดศูนย์กลาง
        zoom={12}
      >
        {locations.map((location) => (
          <Marker
            key={location._id}
            position={{
              lat: location.latitude,
              lng: location.longitude,
            }}
            icon={{
              url: location.image ? `http://localhost:5000/${location.image}` : null,
              scaledSize: new window.google.maps.Size(50, 50), // ขนาดของ marker
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
