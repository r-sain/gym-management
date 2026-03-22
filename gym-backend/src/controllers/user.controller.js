const userService = require('../services/user.service');

/**
 * Helper to structure responses consistently
 */
const sendResponse = (res, statusCode, success, data, message) => {
  res.status(statusCode).json({ success, data, message });
};

/**
 * Create user route handler
 */
const createUser = async (req, res) => {
  try {
    const { name, phone, plan, planType } = req.body;
    const resolvedPlanType = plan || planType;
    
    if (!name || !phone || !resolvedPlanType) {
      return sendResponse(res, 400, false, null, "Name, phone, and plan are required.");
    }
    
    // Ensure the plan type is valid before proceeding
    const validPlans = ['1M', '3M', '6M', '1Y'];
    if (!validPlans.includes(resolvedPlanType)) {
      return sendResponse(res, 400, false, null, "Invalid plan. Must be '1M', '3M', '6M', or '1Y'.");
    }

    const userData = {
      name,
      phone,
      address: req.body.address,
      planType: resolvedPlanType,
      price: req.body.price,
      startDate: req.body.startDate,
      billImage: req.body.billImage
    };
    
    const createdUser = await userService.createUser(userData);
    return sendResponse(res, 201, true, createdUser, "User created successfully.");
  } catch (error) {
    return sendResponse(res, 500, false, null, `Server error: ${error.message}`);
  }
};

/**
 * Get all users or search users (if search query provided)
 */
const getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let users;
    
    if (search) {
      users = await userService.searchUsers(search);
      return sendResponse(res, 200, true, users, `Found ${users.length} users matching search.`);
    } else {
      users = await userService.getAllUsers();
      return sendResponse(res, 200, true, users, "Users retrieved successfully.");
    }
  } catch (error) {
    return sendResponse(res, 500, false, null, `Server error: ${error.message}`);
  }
};

/**
 * Get expiring users route handler
 */
const getExpiringUsers = async (req, res) => {
  try {
    const days = req.query.days !== undefined ? parseInt(req.query.days, 10) : 5;
    
    if (isNaN(days)) {
      return sendResponse(res, 400, false, null, "Please provide a valid number of days in the query string (e.g., ?days=5).");
    }
    
    const users = await userService.getExpiringUsers(days);
    return sendResponse(res, 200, true, users, `Retrieved users expiring in next ${days} days.`);
  } catch (error) {
    return sendResponse(res, 500, false, null, `Server error: ${error.message}`);
  }
};

const getStats = async (req, res) => {
  try {
    const stats = await userService.getStats();
    return sendResponse(res, 200, true, stats, "Stats retrieved successfully.");
  } catch (error) {
    return sendResponse(res, 500, false, null, `Server error: ${error.message}`);
  }
};

const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    return sendResponse(res, 200, true, null, "User deleted successfully.");
  } catch (error) {
    return sendResponse(res, 500, false, null, `Server error: ${error.message}`);
  }
};

const renewUser = async (req, res) => {
  try {
    const { plan, planType, price, startDate } = req.body;
    const resolvedPlanType = plan || planType;
    
    if (!resolvedPlanType) {
      return sendResponse(res, 400, false, null, "Valid plan required to renew.");
    }
    
    const updatedUser = await userService.renewUser(req.params.id, resolvedPlanType, price, startDate);
    return sendResponse(res, 200, true, updatedUser, "User renewed successfully.");
  } catch (error) {
    return sendResponse(res, 500, false, null, `Server error: ${error.message}`);
  }
};

module.exports = {
  createUser,
  getUsers,
  getExpiringUsers,
  getStats,
  deleteUser,
  renewUser
};
