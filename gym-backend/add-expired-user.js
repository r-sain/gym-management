require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/user.model');

const insertUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const now = new Date();

    // Exactly 2 days ago!
    const expiryDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    const testUser = new User({
      name: 'Expiring Test User',
      phone: '9876543210',
      address: 'Simulated Expired Member',
      price: 2500,
      currentPlanPrice: 2500,
      plan: {
        type: '1M',
        startDate: new Date(expiryDate.getTime() - 30 * 24 * 60 * 60 * 1000),
        endDate: expiryDate
      }
    });

    await testUser.save();
    console.log('✅ Successfully added an EXPIRED user!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

insertUser();
