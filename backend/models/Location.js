const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    image: {
        type: String, // เก็บ path ของไฟล์รูปภาพ
        required: false,
    },
});

module.exports = mongoose.model('Location', locationSchema);
