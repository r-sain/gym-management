const User = require('../models/user.model');
const { calculateEndDate, calculateDaysLeft } = require('../utils/date.util');

/**
 * Create a new user with plan calculation
 */
const createUser = async userData => {
  const {
    name,
    phone,
    address,
    planType,
    price,
    startDate: reqStartDate,
    paymentDate: reqPaymentDate,
    guardianName,
    alternatePhone,
    bloodGroup,
    birthdate,
    enrollmentFees,
    discountReason,
    billNumber,
    dueAmount,
    idType,
    idNumber,
    enrollmentDate: reqEnrollmentDate,
  } = userData;

  const startDate = reqStartDate ? new Date(reqStartDate) : new Date();
  const paymentDate = reqPaymentDate ? new Date(reqPaymentDate) : new Date();
  const enrollmentDate = reqEnrollmentDate ? new Date(reqEnrollmentDate) : null;
  const endDate = calculateEndDate(startDate, planType);

  const newUser = new User({
    name,
    phone,
    address,
    plan: {
      type: planType,
      startDate,
      endDate,
    },
    price: price || 0,
    currentPlanPrice: price || 0,
    lastPaymentDate: paymentDate,
    guardianName,
    alternatePhone,
    bloodGroup,
    birthdate,
    enrollmentFees: enrollmentFees || 0,
    enrollmentDate,
    discountReason,
    billNumber,
    dueAmount: dueAmount || 0,
    idType,
    idNumber,
    paymentHistory: [
      {
        date: paymentDate,
        planType: planType,
        amount: price || 0,
        billNumber: billNumber || '',
      },
    ],
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
const searchUsers = async searchTerm => {
  const regex = new RegExp(searchTerm, 'i');
  return await User.find({
    $or: [{ name: regex }, { phone: regex }],
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
      $lte: targetDate,
    },
  })
    .sort({ 'plan.endDate': 1 })
    .lean();

  return users.map(user => ({
    ...user,
    daysLeft: calculateDaysLeft(user.plan.endDate),
  }));
};

/**
 * Get users with birthdays within N days (including past and future within range)
 */
const getBirthdayUsers = async (days = 3) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get users with birthdate field set
  const users = await User.find({
    birthdate: { $exists: true, $ne: null },
  }).lean();

  const birthdayUsers = users.filter(user => {
    if (!user.birthdate) return false;

    const birthDate = new Date(user.birthdate);
    const currentYear = today.getFullYear();

    // Calculate birthday this year
    const birthdayThisYear = new Date(
      currentYear,
      birthDate.getMonth(),
      birthDate.getDate(),
    );

    const diffTime = birthdayThisYear.getTime() - today.getTime();
    let daysUntilBirthday = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysUntilBirthday < -1) {
      // Birthday was more than 1 day ago, check next year
      birthdayThisYear.setFullYear(currentYear + 1);
      const newDiffTime = birthdayThisYear.getTime() - today.getTime();
      daysUntilBirthday = Math.ceil(newDiffTime / (1000 * 60 * 60 * 24));
    }

    return daysUntilBirthday >= -1 && daysUntilBirthday <= days;
  });

  return birthdayUsers
    .map(user => {
      const birthDate = new Date(user.birthdate);
      const currentYear = today.getFullYear();
      const birthdayThisYear = new Date(
        currentYear,
        birthDate.getMonth(),
        birthDate.getDate(),
      );
      const diffTime = birthdayThisYear.getTime() - today.getTime();
      let daysUntilBirthday = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (daysUntilBirthday < -1) {
        birthdayThisYear.setFullYear(currentYear + 1);
        const newDiffTime = birthdayThisYear.getTime() - today.getTime();
        daysUntilBirthday = Math.ceil(newDiffTime / (1000 * 60 * 60 * 24));
      }

      return {
        ...user,
        daysUntilBirthday,
      };
    })
    .sort((a, b) => a.daysUntilBirthday - b.daysUntilBirthday);
};

/**
 * Renew user plan
 */
const renewUser = async (
  id,
  additionalPlanType,
  additionalPrice,
  reqStartDate,
  reqPaymentDate,
  billNumber,
  dueAmount,
) => {
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');

  const today = new Date();
  const startCalculationDate = reqStartDate
    ? new Date(reqStartDate)
    : user.plan.endDate > today
      ? user.plan.endDate
      : today;
  const newEndDate = calculateEndDate(startCalculationDate, additionalPlanType);
  const paymentDate = reqPaymentDate ? new Date(reqPaymentDate) : new Date();

  user.plan.type = additionalPlanType;
  user.plan.startDate = startCalculationDate;
  user.plan.endDate = newEndDate;
  user.price += Number(additionalPrice || 0);
  user.currentPlanPrice = Number(additionalPrice || 0);
  user.lastPaymentDate = paymentDate;
  user.billNumber = billNumber;
  if (dueAmount !== undefined) {
    user.dueAmount = (user.dueAmount || 0) + Number(dueAmount || 0);
  }

  // Add to payment history and keep only last 3 payments
  if (!user.paymentHistory) {
    user.paymentHistory = [];
  }
  user.paymentHistory.push({
    date: paymentDate,
    planType: additionalPlanType,
    amount: Number(additionalPrice || 0),
    billNumber: billNumber || '',
  });
  // Keep only last 3 payments
  if (user.paymentHistory.length > 3) {
    user.paymentHistory = user.paymentHistory.slice(-3);
  }

  return await user.save();
};

/**
 * Update user photo (base64)
 */
const updateUserPhoto = async (id, photo) => {
  const user = await User.findByIdAndUpdate(id, { photo }, { new: true });
  if (!user) throw new Error('User not found');
  return user;
};

/**
 * Update user details
 */
const updateUser = async (id, updateData) => {
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');

  // Handle due amount sync
  if (updateData.dueAmount !== undefined) {
    const diff = (user.dueAmount || 0) - Number(updateData.dueAmount);
    user.price = (user.price || 0) + diff;
    user.currentPlanPrice = (user.currentPlanPrice || 0) + diff;
    
    // Update last payment date if payment was made (due reduced)
    if (diff > 0) {
      user.lastPaymentDate = new Date();
    }
    
    user.dueAmount = Number(updateData.dueAmount);
    
    // Also update any other fields in updateData
    Object.keys(updateData).forEach(key => {
      if (key !== 'dueAmount') {
        user[key] = updateData[key];
      }
    });

    return await user.save();
  }

  // Generic update if dueAmount is not present
  Object.assign(user, updateData);
  return await user.save();
};

/**
 * Delete user
 */
const deleteUser = async id => {
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
    totalRevenue: revenue,
  };
};

/**
 * Get payment history for a user
 */
const getPaymentHistory = async id => {
  const user = await User.findById(id, 'paymentHistory');
  if (!user) throw new Error('User not found');
  return user.paymentHistory || [];
};

/**
 * Get all users formatted for Excel export
 */
const getAllUsersForExport = async () => {
  const users = await User.find().sort({ createdAt: -1 }).lean();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return users.map(user => ({
    'Member Name': user.name || 'N/A',
    Phone: user.phone || 'N/A',
    Plan: user.plan?.type || 'N/A',
    'Current Plan Price': user.currentPlanPrice || 0,
    Status: user.plan?.endDate > today ? 'Active' : 'Expired',
    'Plan Start': user.plan?.startDate
      ? new Date(user.plan.startDate).toLocaleDateString('en-IN')
      : 'N/A',
    'Plan End': user.plan?.endDate
      ? new Date(user.plan.endDate).toLocaleDateString('en-IN')
      : 'N/A',
    'Days Left': user.plan?.endDate
      ? calculateDaysLeft(user.plan.endDate)
      : 'N/A',
    'Total Paid': user.price || 0,
    'Due Amount': user.dueAmount || 0,
    Address: user.address || 'N/A',
    'ID Type': user.idType || 'N/A',
    'ID Number': user.idNumber || 'N/A',
    'Guardian Name': user.guardianName || 'N/A',
    'Blood Group': user.bloodGroup || 'N/A',
    'Enrollment Fee': user.enrollmentFees || 0,
    'Enrollment Date': user.enrollmentDate
      ? new Date(user.enrollmentDate).toLocaleDateString('en-IN')
      : 'N/A',
  }));
};

module.exports = {
  createUser,
  getAllUsers,
  searchUsers,
  getExpiringUsers,
  getBirthdayUsers,
  renewUser,
  updateUserPhoto,
  updateUser,
  deleteUser,
  getStats,
  getPaymentHistory,
  getAllUsersForExport,
};
