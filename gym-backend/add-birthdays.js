require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/user.model');

const addBirthdaysToUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Get all users
    const users = await User.find();

    // Add birthdays to some users (within 3 days, today, and tomorrow for testing)
    const today = new Date();
    const birthdays = [
      new Date(today.getFullYear(), today.getMonth(), today.getDate()), // Today
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1), // Tomorrow
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2), // Day after tomorrow
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3), // 3 days from now
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5), // 5 days ago (should not show)
    ];

    for (let i = 0; i < Math.min(users.length, birthdays.length); i++) {
      await User.findByIdAndUpdate(users[i]._id, {
        birthdate: birthdays[i]
      });
      console.log(`✅ Added birthday to ${users[i].name}: ${birthdays[i].toDateString()}`);
    }

    console.log(`✅ Successfully added birthdays to ${Math.min(users.length, birthdays.length)} users!`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

addBirthdaysToUsers();