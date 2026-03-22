const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/user.model');

async function addTenUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const now = new Date();
    
    // Helper to create dates
    const daysAgo = (d) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
    const daysFromNow = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);

    const testUsers = [
      {
        name: 'Rahul Sharma',
        phone: '9876543210',
        address: 'HSR Layout, Bangalore',
        plan: {
          type: '3M',
          startDate: daysAgo(30),
          endDate: daysFromNow(60)
        },
        price: 5000,
        currentPlanPrice: 5000
      },
      {
        name: 'Priya Singh',
        phone: '9123456789',
        address: 'Koramangala 4th Block',
        plan: {
          type: '1M',
          startDate: daysAgo(29),
          endDate: daysFromNow(1) // Expiring Soon
        },
        price: 2000,
        currentPlanPrice: 2000
      },
      {
        name: 'Amit Patel',
        phone: '8887776665',
        address: 'Indiranagar, Metro Station',
        plan: {
          type: '6M',
          startDate: daysAgo(100),
          endDate: daysFromNow(80)
        },
        price: 9000,
        currentPlanPrice: 9000
      },
      {
        name: 'Sneha Reddy',
        phone: '7776665554',
        address: 'Whitefield, ITPL Road',
        plan: {
          type: '1M',
          startDate: daysAgo(40),
          endDate: daysAgo(10) // Expired
        },
        price: 2000,
        currentPlanPrice: 2000
      },
      {
        name: 'Vikram Malhotra',
        phone: '6665554443',
        address: 'MG Road, Residency Cross',
        plan: {
          type: '1Y',
          startDate: daysAgo(10),
          endDate: daysFromNow(355)
        },
        price: 15000,
        currentPlanPrice: 15000
      },
      {
        name: 'Anjali Gupta',
        phone: '9988776655',
        address: 'BTM Layout 2nd Stage',
        plan: {
          type: '3M',
          startDate: daysAgo(89),
          endDate: daysFromNow(1) // Expiring Soon
        },
        price: 5000,
        currentPlanPrice: 5000
      },
      {
        name: 'Suresh Raina',
        phone: '9555444333',
        address: 'Jayanagar 9th Block',
        plan: {
          type: '1M',
          startDate: daysAgo(5),
          endDate: daysFromNow(25)
        },
        price: 2000,
        currentPlanPrice: 2000
      },
      {
        name: 'Meera Nair',
        phone: '9444333222',
        address: 'Electronic City Phase 1',
        plan: {
          type: '6M',
          startDate: daysAgo(190),
          endDate: daysAgo(10) // Expired
        },
        price: 9000,
        currentPlanPrice: 9000
      },
      {
        name: 'Deepak Verma',
        phone: '9333222111',
        address: 'Marathahalli, Bridge Road',
        plan: {
          type: '3M',
          startDate: daysAgo(92),
          endDate: daysAgo(2) // Expired
        },
        price: 5000,
        currentPlanPrice: 5000
      },
      {
        name: 'Kavita Iyer',
        phone: '9222111000',
        address: 'Malleshwaram, 15th Cross',
        plan: {
          type: '1M',
          startDate: daysAgo(0),
          endDate: daysFromNow(30)
        },
        price: 2000,
        currentPlanPrice: 2000
      }
    ];

    await User.insertMany(testUsers);
    console.log('✅ Successfully added 10 correctly structured test users!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error adding users:', err);
    process.exit(1);
  }
}

addTenUsers();
