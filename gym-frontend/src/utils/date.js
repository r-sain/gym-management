export const calculateDaysLeft = (endDate) => {
  if (!endDate) return "Unknown";
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

export const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  }).format(new Date(dateString));
};
