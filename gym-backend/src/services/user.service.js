const User = require('../models/user.model');
const { calculateEndDate, calculateDaysLeft } = require('../utils/date.util');

/**
 * Create a new user with plan calculation
 */
const createUser = async (userData) => {
  const { name, phone, address, planType, price, billImage, startDate: reqStartDate } = userData;
  
  const startDate = reqStartDate ? new Date(reqStartDate) : new Date();
  const endDate = calculateEndDate(startDate, planType);
  
  const newUser = new User({
    name,
    phone,
    address,
    plan: {
      type: planType,
      startDate,
      endDate
    },
    price: price || 0,
    currentPlanPrice: price || 0,
    billImage
  });
  
  return await newUser.save();
};

/**
 * Get all users
 */
const getAllUsers = async () => {
  return await User.find().sort({ createdAt: -1 });
};

/**
 * Search users by name or phone (case insensitive)
 */
const searchUsers = async (searchTerm) => {
  const regex = new RegExp(searchTerm, 'i');
  return await User.find({
    $or: [{ name: regex }, { phone: regex }]
  }).sort({ createdAt: -1 });
};

/**
 * Get users whose plan is expiring within N days
 */
const getExpiringUsers = async (days = 5) => {
  // Start of today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Target date calculated to end of the Nth day in future
  const targetDate = new Date(today);
  targetDate.setDate(targetDate.getDate() + parseInt(days, 10));
  targetDate.setHours(23, 59, 59, 999);

  const users = await User.find({
    'plan.endDate': {
      $gte: today,
      $lte: targetDate
    }
  }).sort({ 'plan.endDate': 1 }).lean();

  return users.map(user => ({
    ...user,
    daysLeft: calculateDaysLeft(user.plan.endDate)
  }));
};

/**
 * Renew user plan
 */
const renewUser = async (id, additionalPlanType, additionalPrice, reqStartDate) => {
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');
  
  const today = new Date();
  const startCalculationDate = reqStartDate ? new Date(reqStartDate) : (user.plan.endDate > today ? user.plan.endDate : today);
  const newEndDate = calculateEndDate(startCalculationDate, additionalPlanType);
  
  user.plan.type = additionalPlanType;
  user.plan.endDate = newEndDate;
  user.price += Number(additionalPrice || 0);
  user.currentPlanPrice = Number(additionalPrice || 0);
  
  return await user.save();
};

/**
 * Delete user
 */
const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

/**
 * Get dashboard stats
 */
const getStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const total = await User.countDocuments();
  const active = await User.countDocuments({ 'plan.endDate': { $gte: today } });
  const expired = await User.countDocuments({ 'plan.endDate': { $lt: today } });
  
  const users = await User.find({}, 'price');
  const revenue = users.reduce((acc, user) => acc + (user.price || 0), 0);

  return {
    totalMembers: total,
    activeMembers: active,
    expiredMembers: expired,
    totalRevenue: revenue
  };
};

module.exports = {
  createUser,
  getAllUsers,
  searchUsers,
  getExpiringUsers,
  renewUser,
  deleteUser,
  getStats
};
