const express = require('express');
const mongoose = require('mongoose');
const Location = require('./models/Location');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();

// ตั้งค่าการจัดเก็บไฟล์
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // ใช้ timestamp เพื่อให้ชื่อไฟล์ไม่ซ้ำ
  },
});

const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',  // อนุญาตให้แอป React เข้าถึง
    methods: ['GET', 'POST'],        // อนุญาตวิธีการ HTTP ที่ต้องการ
  }));

// เชื่อมต่อ MongoDB
mongoose.connect('mongodb+srv://narongsak05n:database0053info@cluster0.z3xpb.mongodb.net/locationDB').then(() => {
    console.log('MongoDB connected');
})
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

// API endpoint เพื่อดึงข้อมูลจุดปักหมุด
app.get('/api/locations', async (req, res) => {
    try {
        const locations = await Location.find();
        res.json(locations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// API endpoint เพื่อเพิ่มข้อมูลปักหมุด พร้อมกับอัพโหลดรูปภาพ
app.post('/api/locations', upload.single('image'), async (req, res) => {
    const { name, latitude, longitude } = req.body;
    const imagePath = req.file ? req.file.path : null; // ถ้ามีไฟล์อัพโหลด จะเก็บ path ของไฟล์นั้น

    const location = new Location({
        name,
        latitude,
        longitude,
        image: imagePath, // เก็บ path รูปภาพในฐานข้อมูล
    });

    try {
        await location.save();
        res.status(201).json(location);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(5000, () => console.log('Server running on port 5000'));
