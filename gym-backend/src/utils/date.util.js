/**
 * Utility to calculate the end date based on plan type using fixed day durations.
 * 1M = 30 days, 3M = 90 days, 6M = 180 days, 1Y = 365 days
 * @param {Date} startDate 
 * @param {String} planType ("1M", "3M", "6M", "1Y")
 * @returns {Date} endDate
 */
const PLAN_DAYS = {
  '1M': 30,
  '3M': 90,
  '6M': 180,
  '1Y': 365
};

const calculateEndDate = (startDate, planType) => {
  const days = PLAN_DAYS[planType];
  if (!days) throw new Error("Invalid plan type");
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + days);
  return endDate;
};

/**
 * Utility to calculate days left from today to the given end date.
 * @param {Date} endDate 
 * @returns {String} formatted days left message
 */
const calculateDaysLeft = (endDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const target = new Date(endDate);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Expired";
  if (diffDays === 0) return "Expires Today";
  if (diffDays === 1) return "Tomorrow";
  return `${diffDays} days left`;
};

module.exports = {
  calculateEndDate,
  calculateDaysLeft
};
