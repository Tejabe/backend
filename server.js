const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

// Make sure these imports point to the correct files
const authRoutes = require('./routes/authRoutes');
const stationRoutes = require('./routes/stations');

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Body parser middleware
app.use(express.json());

// Verify the imported routes are functions
console.log('authRoutes type:', typeof authRoutes); // Should be 'function'
console.log('stationRoutes type:', typeof stationRoutes); // Should be 'function'

// Route middleware
app.use('/api/auth', authRoutes);
app.use('/api/stations', stationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Database connection and server start
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => console.error('MongoDB connection error:', err));