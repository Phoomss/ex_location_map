import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapWithDistanceAndAddLocation = () => {
  const [currentPosition, setCurrentPosition] = useState(null); // ตำแหน่งปัจจุบัน
  const [locations, setLocations] = useState([
    // { name: 'Location 1', latitude: 13.7563, longitude: 100.5018 },
    // { name: 'Location 2', latitude: 13.7271, longitude: 100.5241 },
  ]);
  const [distances, setDistances] = useState([]); // ระยะทาง
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [message, setMessage] = useState('');

  // ดึงตำแหน่งปัจจุบัน
  const fetchCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error('Error fetching location:', error)
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // คำนวณระยะทาง (Haversine Formula)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // คำนวณระยะทางเมื่อมีตำแหน่งปัจจุบัน
  useEffect(() => {
    if (currentPosition) {
      const newDistances = locations.map((location) =>
        calculateDistance(
          currentPosition.lat,
          currentPosition.lng,
          location.latitude,
          location.longitude
        )
      );
      setDistances(newDistances);
    }
  }, [currentPosition, locations]);

  // ดึงตำแหน่งเมื่อ Component โหลด
  useEffect(() => {
    fetchCurrentPosition();
  }, []);

  // ฟังก์ชันจัดการการคลิกบนแผนที่
  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setLatitude(lat.toFixed(6)); // จำกัดจำนวนจุดทศนิยม
    setLongitude(lng.toFixed(6));
  };

  // จัดการการส่งฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isNaN(latitude) || isNaN(longitude)) {
      setMessage('Please enter valid latitude and longitude.');
      return;
    }

    const locationData = {
      name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    try {
      await axios.post('http://localhost:5000/api/locations', locationData);
      setLocations((prevLocations) => [...prevLocations, locationData]);
      setMessage(`Location added successfully: ${name}`);
      setName('');
      setLatitude('');
      setLongitude('');
    } catch (error) {
      setMessage('Error adding location: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Map with Distance Calculation and Location Adding</h1>
      {currentPosition && (
        <p>
          Your Location: Latitude: {currentPosition.lat}, Longitude:{' '}
          {currentPosition.lng}
        </p>
      )}

      <LoadScript googleMapsApiKey="AIzaSyAsmDXCfNp6EVrsaRMj2okavlxRrty_oLE">
        <GoogleMap
          id="map"
          mapContainerStyle={{ width: '100%', height: '400px' }}
          center={currentPosition || { lat: 13.7367, lng: 100.5232 }}
          zoom={12}
          onClick={handleMapClick}
        >
          {locations.map((location, index) => (
            <Marker
              key={index}
              position={{
                lat: location.latitude,
                lng: location.longitude,
              }}
            />
          ))}
          {currentPosition && (
            <Marker
              position={currentPosition}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>

      <div>
        <h3>Add New Location</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
          />
          <button type="submit">Add Location</button>
        </form>
        {message && <p>{message}</p>}
      </div>

      <div>
        <h3>Distances from Your Location:</h3>
        <ul>
          {locations.map((location, index) => (
            <li key={index}>
              {location.name}: {distances[index]?.toFixed(2)} km
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MapWithDistanceAndAddLocation;
