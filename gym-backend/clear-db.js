require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/user.model');

const clearDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await User.deleteMany({});
    console.log('✅ All users successfully wiped from the database!');
    process.exit(0);
  } catch (err) {
    console.error('Error clearing database:', err);
    process.exit(1);
  }
};

clearDb();
