const mongoose = require('mongoose');
const User = require('./src/models/user.model');
require('dotenv').config();

const migratePaymentHistory = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gym-management');
    console.log('Connected to MongoDB');

    // Find all users without paymentHistory
    const usersWithoutHistory = await User.find({ paymentHistory: { $exists: false } });
    console.log(`Found ${usersWithoutHistory.length} users without payment history`);

    if (usersWithoutHistory.length === 0) {
      console.log('All users already have payment history initialized.');
      await mongoose.disconnect();
      return;
    }

    // Initialize paymentHistory for each user based on existing price and lastPaymentDate
    for (const user of usersWithoutHistory) {
      user.paymentHistory = [
        {
          date: user.lastPaymentDate || new Date(),
          planType: user.plan?.type || '1M',
          amount: user.price || 0,
          billNumber: user.billNumber || ''
        }
      ];
      await user.save();
      console.log(`✓ Initialized payment history for ${user.name}`);
    }

    console.log(`\n✅ Migration complete! Updated ${usersWithoutHistory.length} users`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migratePaymentHistory();
