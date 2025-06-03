const express = require('express');
const router = express.Router();
const ChargingStation = require('../models/ChargingStation');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes

router.post('/', authMiddleware, async (req, res) => {
  const station = new ChargingStation(req.body);
  await station.save();
  res.json(station);
});

router.get('/', async (req, res) => {
  const stations = await ChargingStation.find();
  res.json(stations);
});

router.put('/:id', authMiddleware, async (req, res) => {
  const station = await ChargingStation.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(station);
});

router.delete('/:id', authMiddleware, async (req, res) => {
  await ChargingStation.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
