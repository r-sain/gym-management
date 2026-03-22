/**
 * Utility to calculate the end date based on plan type.
 * @param {Date} startDate 
 * @param {String} planType ("1M", "3M", "6M", "1Y")
 * @returns {Date} endDate
 */
const calculateEndDate = (startDate, planType) => {
  const endDate = new Date(startDate);
  
  switch (planType) {
    case '1M':
      endDate.setMonth(endDate.getMonth() + 1);
      break;
    case '3M':
      endDate.setMonth(endDate.getMonth() + 3);
      break;
    case '6M':
      endDate.setMonth(endDate.getMonth() + 6);
      break;
    case '1Y':
      endDate.setFullYear(endDate.getFullYear() + 1);
      break;
    default:
      throw new Error("Invalid plan type");
  }

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
