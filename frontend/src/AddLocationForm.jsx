import React, { useState } from 'react';
import axios from 'axios';

const AddLocationForm = () => {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    if (image) {
      formData.append('image', image); // เพิ่มไฟล์รูปภาพ
    }

    try {
      const response = await axios.post('http://localhost:5000/api/locations', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Location added:', response.data);
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Latitude:</label>
        <input
          type="number"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Longitude:</label>
        <input
          type="number"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Image:</label>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>
      <button type="submit">Add Location</button>
    </form>
  );
};

export default AddLocationForm;
