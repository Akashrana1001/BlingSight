const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User.js');
const Contact = require('./models/Contact.js');
const Log = require('./models/Log.js');
const connectDB = require('./config/db.js');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Contact.deleteMany();
    await Log.deleteMany();

    const createdUser = await User.create({
      name: 'Demo User',
      email: 'demo@sightguide.com',
      password: 'password123',
    });

    const adminUser = createdUser._id;

    const contacts = [
      {
        user: adminUser,
        name: 'Guardian',
        phone: '123-456-7890',
      },
      {
        user: adminUser,
        name: 'Parent',
        phone: '987-654-3210',
      },
      {
        user: adminUser,
        name: 'Friend',
        phone: '555-555-5555',
      },
    ];

    await Contact.insertMany(contacts);

    const logs = [
      {
        user: adminUser,
        objectName: 'person',
        confidence: 0.95,
      },
      {
        user: adminUser,
        objectName: 'chair',
        confidence: 0.88,
      },
      {
        user: adminUser,
        objectName: 'bottle',
        confidence: 0.92,
      },
      {
        user: adminUser,
        objectName: 'phone',
        confidence: 0.99,
      },
      {
        user: adminUser,
        objectName: 'car',
        confidence: 0.90,
      },
    ];

    await Log.insertMany(logs);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
