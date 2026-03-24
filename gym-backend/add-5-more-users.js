require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/user.model');

const add5Users = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const now = new Date();
    
    // Helper functions
    const daysAgo = (d) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
    const daysFromNow = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);

    const newUsers = [
      {
        name: 'Karan Verma',
        phone: '9111222333',
        address: 'Viveknagar, Main Road',
        plan: {
          type: '1M',
          startDate: daysAgo(28),
          endDate: daysFromNow(2) // Expiring in 2 days - EXPIRING TAG
        },
        price: 2000,
        currentPlanPrice: 2000,
        lastPaymentDate: daysAgo(28),
        billNumber: 'BILL-5001',
        paymentHistory: [
          {
            date: daysAgo(28),
            planType: '1M',
            amount: 2000,
            billNumber: 'BILL-5001'
          }
        ]
      },
      {
        name: 'Zara Khan',
        phone: '9444555666',
        address: 'JP Nagar 1st Phase',
        plan: {
          type: '3M',
          startDate: daysAgo(95),
          endDate: daysAgo(5) // Expired 5 days ago - EXPIRED TAG
        },
        price: 5000,
        currentPlanPrice: 5000,
        lastPaymentDate: daysAgo(95),
        billNumber: 'BILL-5002',
        paymentHistory: [
          {
            date: daysAgo(95),
            planType: '3M',
            amount: 5000,
            billNumber: 'BILL-5002'
          }
        ]
      },
      {
        name: 'Nikhil Desai',
        phone: '9777888999',
        address: 'Banashankari 3rd Stage',
        plan: {
          type: '1M',
          startDate: daysAgo(3),
          endDate: daysFromNow(27) // Active, just started - NO TAG
        },
        price: 2000,
        currentPlanPrice: 2000,
        lastPaymentDate: daysAgo(3),
        billNumber: 'BILL-5003',
        paymentHistory: [
          {
            date: daysAgo(3),
            planType: '1M',
            amount: 2000,
            billNumber: 'BILL-5003'
          }
        ]
      },
      {
        name: 'Sanya Chopra',
        phone: '8866554433',
        address: 'Bellandur, Tech Park',
        plan: {
          type: '6M',
          startDate: daysAgo(30),
          endDate: daysFromNow(150) // Long term active - NO TAG
        },
        price: 10000,
        currentPlanPrice: 10000,
        lastPaymentDate: daysAgo(30),
        billNumber: 'BILL-5004',
        paymentHistory: [
          {
            date: daysAgo(30),
            planType: '6M',
            amount: 10000,
            billNumber: 'BILL-5004'
          },
          {
            date: daysAgo(180),
            planType: '6M',
            amount: 9500,
            billNumber: 'BILL-4980'
          }
        ]
      },
      {
        name: 'Aryan Iyer',
        phone: '9555111222',
        address: 'Ulsoor, Lake Road',
        plan: {
          type: '1M',
          startDate: daysAgo(32),
          endDate: daysAgo(2) // Expired 2 days ago - EXPIRED TAG
        },
        price: 2000,
        currentPlanPrice: 2000,
        lastPaymentDate: daysAgo(32),
        billNumber: 'BILL-5005',
        paymentHistory: [
          {
            date: daysAgo(32),
            planType: '1M',
            amount: 2000,
            billNumber: 'BILL-5005'
          }
        ]
      }
    ];

    const result = await User.insertMany(newUsers);
    console.log(`\n✅ Successfully added 5 new users!\n`);
    console.log(`Summary:`);
    console.log(`  - 1 EXPIRING (expires in 2 days) - Karan Verma`);
    console.log(`  - 2 EXPIRED (expired 5 & 2 days ago) - Zara Khan, Aryan Iyer`);
    console.log(`  - 2 ACTIVE - Nikhil Desai, Sanya Chopra`);
    console.log(`\nTotal users in database: ${result.length}`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

add5Users();
