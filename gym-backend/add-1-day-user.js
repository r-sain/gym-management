require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/user.model');

const insertUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const now = new Date();

    // Exactly 1 Calendar Day from today!
    const expiryDate = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);

    const testUser = new User({
      name: '1-Day Expiry Tester',
      phone: '7896541230',
      address: 'Simulated User',
      price: 2500,
      currentPlanPrice: 2500,
      plan: {
        type: '1M', // Valid Enum dummy value
        startDate: now,
        endDate: expiryDate,
      },
    });

    await testUser.save();
    console.log(
      '✅ Successfully added a user that expires tomorrow (1 day left)!',
    );
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

insertUser();
