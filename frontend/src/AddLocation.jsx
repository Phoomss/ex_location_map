import React, { useState } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import axios from 'axios';

const AddLocation = () => {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [message, setMessage] = useState('');

  // ฟังก์ชันจัดการคลิกบนแผนที่
  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setLatitude(lat.toFixed(6)); // จำกัดจำนวนจุดทศนิยม
    setLongitude(lng.toFixed(6));
  };

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
      const response = await axios.post('http://localhost:5000/api/locations', locationData);
      setMessage(`Location added successfully: ${response.data.name}`);
      setName('');
      setLatitude('');
      setLongitude('');
    } catch (error) {
      setMessage('Error adding location: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Add New Location</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter location name"
            required
          />
        </div>

        <div>
          <label>Latitude</label>
          <input
            type="number"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="Enter latitude"
            required
          />
        </div>

        <div>
          <label>Longitude</label>
          <input
            type="number"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="Enter longitude"
            required
          />
        </div>

        <button type="submit">Add Location</button>
      </form>

      {message && <p>{message}</p>}

      <div style={{ marginTop: '20px' }}>
        <h3>Click on the map to select a location</h3>
        <LoadScript googleMapsApiKey="AIzaSyAsmDXCfNp6EVrsaRMj2okavlxRrty_oLE">
          <GoogleMap
            id="map"
            mapContainerStyle={{ width: '100%', height: '400px' }}
            // center={{ lat: 13.7367, lng: 100.5232 }} // จุดศูนย์กลาง (กรุงเทพฯ)
            zoom={12}
            onClick={handleMapClick} // เรียกเมื่อคลิกบนแผนที่
          />
        </LoadScript>
      </div>
    </div>
  );
};

export default AddLocation;
