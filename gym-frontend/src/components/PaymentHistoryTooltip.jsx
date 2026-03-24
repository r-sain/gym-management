import React, { useState } from 'react';

const PaymentHistoryTooltip = ({ paymentHistory, children }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Position tooltip above the element with slight offset
    setTooltipPosition({
      top: rect.top - 10,
      left: rect.left + rect.width / 2
    });
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const sortedHistory = paymentHistory && paymentHistory.length > 0
    ? [...paymentHistory].reverse() // Show most recent first
    : [];

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative inline-block cursor-help"
    >
      {children}

      {isHovering && sortedHistory.length > 0 && (
        <div
          className="fixed z-[9999] bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-3 min-w-max max-w-xs"
          style={{
            top: `${tooltipPosition.top - 180}px`,
            left: `${tooltipPosition.left - 100}px`,
            transform: 'translateX(-50%)',
            animation: 'fadeIn 0.2s ease-in-out'
          }}
        >
          {/* Tooltip Arrow */}
          <div
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid rgb(15, 23, 42)'
            }}
          ></div>

          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 pb-2 border-b border-slate-700">
            Payment History
          </div>

          <div className="space-y-1.5">
            {sortedHistory.map((payment, index) => (
              <div key={index} className="text-xs text-slate-300 flex justify-between gap-4">
                <span className="font-semibold text-primary">
                  {index + 1}. ₹{typeof payment.amount === 'number' ? payment.amount.toLocaleString() : payment.amount}
                </span>
                <span className="text-slate-400">{payment.planType}</span>
                <span className="text-slate-500 whitespace-nowrap">{formatDate(payment.date)}</span>
              </div>
            ))}
          </div>

          <style>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateX(-50%) translateY(5px);
              }
              to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
              }
            }
          `}</style>
        </div>
      )}

      {isHovering && sortedHistory.length === 0 && (
        <div
          className="fixed z-[9999] bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-3"
          style={{
            top: `${tooltipPosition.top - 80}px`,
            left: `${tooltipPosition.left - 80}px`,
            transform: 'translateX(-50%)',
            animation: 'fadeIn 0.2s ease-in-out'
          }}
        >
          <div className="text-xs text-slate-400">No payment history</div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistoryTooltip;
