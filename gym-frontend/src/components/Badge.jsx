import React from 'react';

const Badge = ({ text }) => {
  const getBadgeStyle = text => {
    if (!text) return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    const t = text.toLowerCase();
    if (t === 'expired') return 'bg-red-500/20 text-red-500 border-red-500/30';
    
    // Check if it's explicitly 1, 2, or 3 days left
    const match = t.match(/(\d+)\s*days/);
    if (t === 'expires today' || t === 'tomorrow' || (match && parseInt(match[1]) <= 3)) {
      return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
    }
    return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30';
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap border ${getBadgeStyle(text)} transition-colors duration-200`}>
      {text}
    </span>
  );
};

export default Badge;
