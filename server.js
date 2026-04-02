const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './'))); // Serve static files from root

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Models
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  imgPass: [String]
});
const User = mongoose.model('User', userSchema);

const appointmentSchema = new mongoose.Schema({
  name: String,
  email: String,
  number: String,
  date: String,
  department: String,
  doctor: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});
const Appointment = mongoose.model('Appointment', appointmentSchema);

// API Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, imgPass } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ email, password, imgPass });
    await newUser.save();
    res.status(201).json({ message: 'Account Created Successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, imgPass } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ message: 'Login Failed' });

    // Compare imgPass (optional, but requested for the pattern)
    if (imgPass && user.imgPass.toString() !== imgPass.toString()) {
      return res.status(401).json({ message: 'Login Failed (Incorrect Pattern)' });
    }

    res.status(200).json({ message: 'Login is successful', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/appointments', async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json({ message: 'Appointment Booked Successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
