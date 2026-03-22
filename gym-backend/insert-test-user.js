require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/user.model');

const generateRandomUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const now = new Date();
    const usersToInsert = [];
    
    const names = ['Aarav Sharma', 'Vivaan Gupta', 'Aditya Singh', 'Diya Patel', 'Ananya Kumar', 'Kavya Reddy', 'Rohan Das', 'Neha Mishra', 'Arjun Verma', 'Priya Menon'];
    
    for (let i = 0; i < 10; i++) {
      const planLengths = { '1M': 30, '3M': 90, '6M': 180, '1Y': 365 };
      const planKeys = Object.keys(planLengths);
      const chosenPlan = planKeys[Math.floor(Math.random() * planKeys.length)];
      
      // Start date between 50 days ago and today
      const startOffsetData = Math.floor(Math.random() * 50);
      const startDate = new Date(now.getTime() - startOffsetData * 24 * 60 * 60 * 1000);
      const endDate = new Date(startDate.getTime() + planLengths[chosenPlan] * 24 * 60 * 60 * 1000);
      
      usersToInsert.push({
        name: names[i],
        phone: `998877665${i}`,
        address: 'City Center',
        price: Math.floor(Math.random() * 5000) + 1000,
        plan: {
          type: chosenPlan,
          startDate: startDate,
          endDate: endDate
        }
      });
    }

    await User.insertMany(usersToInsert);
    console.log(`✅ Successfully generated ${usersToInsert.length} realistic members!`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

generateRandomUsers();
