const mongoose = require('mongoose');

const chargingStationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: String,
  latitude: Number,
  longitude: Number,
  status: {
    type: String,
    enum: ['available', 'occupied', 'offline'],
    default: 'available',
  },
  power: String,
  connectors: [String],
});

module.exports = mongoose.model('ChargingStation', chargingStationSchema);
