const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const ChargingStation = require('./models/ChargingStation');
const User = require('./models/User');

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    await ChargingStation.deleteMany();
    await User.deleteMany();


    const stations = [
      {
        name: 'GreenCharge Station',
        location: 'Pune, Maharashtra',
        latitude: 18.5204,
        longitude: 73.8567,
        status: 'available',
        power: '50kW',
        connectors: ['Type2', 'CCS'],
      },
      {
        name: 'VoltSpot Central',
        location: 'Mumbai, Maharashtra',
        latitude: 19.0760,
        longitude: 72.8777,
        status: 'occupied',
        power: '22kW',
        connectors: ['CHAdeMO'],
      },
      {
        name: 'EcoPlug Point',
        location: 'Bengaluru, Karnataka',
        latitude: 12.9716,
        longitude: 77.5946,
        status: 'offline',
        power: '11kW',
        connectors: ['Type2'],
      },
    ];
    await ChargingStation.insertMany(stations);

    const users = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
      },
      {
        name: 'Regular User',
        email: 'user@example.com',
        password: 'user123',
        role: 'user',
      },
      {
        name: 'Test User',
        email: 'teja@gmail.com', // Add the test user you're trying to login with
        password: 'teja1234',
        role: 'user',
    }
    ];
    // await User.insertMany(users);
    await User.create(users); // ✅ This triggers hashing via the schema hook


    console.log('✅ Charging stations and users seeded!');
    process.exit();
  } catch (err) {
    console.error(`❌ Seed error: ${err.message}`);
    process.exit(1);
  }
};

seedData();
