// AddLocation.js
import React, { useState } from 'react';
import axios from 'axios';

const AddLocation = () => {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [message, setMessage] = useState('');

  // ฟังก์ชันสำหรับจัดการการส่งข้อมูล
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบให้แน่ใจว่า latitude และ longitude เป็นตัวเลข
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
      // เคลียร์ฟอร์มหลังจากเพิ่มข้อมูล
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
    </div>
  );
};

export default AddLocation;
