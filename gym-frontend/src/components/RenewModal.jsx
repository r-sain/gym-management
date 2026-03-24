import React, { useState } from 'react';

const RenewModal = ({ isOpen, onClose, onRenew, userName }) => {
  const [formData, setFormData] = useState({ 
    planType: '1M', 
    price: '', 
    startDate: new Date().toISOString().split('T')[0],
    paymentDate: new Date().toISOString().split('T')[0],
    billNumber: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onRenew(formData.planType, Number(formData.price), formData.startDate, formData.paymentDate, formData.billNumber);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-card border border-slate-700/50 w-full max-w-sm rounded-2xl shadow-2xl p-6">
        <h3 className="text-xl font-bold text-slate-100 mb-1">Renew Membership</h3>
        <p className="text-slate-400 text-sm mb-6">Extend plan for <span className="font-semibold text-white">{userName}</span>.</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
             <label className="block text-sm font-medium text-slate-400 mb-2">Select Plan</label>
             <select name="planType" value={formData.planType} onChange={(e) => setFormData({...formData, planType: e.target.value})}
               className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 appearance-none focus:outline-none focus:border-primary">
               <option value="1M">1 Month Plan</option>
               <option value="3M">3 Months Plan</option>
               <option value="6M">6 Months Plan </option>
               <option value="1Y">1 Year / Annual</option>
             </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Amount Paid (₹)</label>
            <input required type="number" min="0" name="price" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} 
              onWheel={(e) => e.target.blur()}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-primary" 
              placeholder="e.g. 1500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Bill Number</label>
            <input required type="text" name="billNumber" value={formData.billNumber} onChange={(e) => setFormData({...formData, billNumber: e.target.value})}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-primary"
              placeholder="Paper bill number" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Payment Date</label>
              <input required type="date" name="paymentDate" value={formData.paymentDate} onChange={(e) => setFormData({...formData, paymentDate: e.target.value})} 
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-primary [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Start Date</label>
              <input required type="date" name="startDate" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} 
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-primary [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-blue-600 transition-colors disabled:opacity-50">
              {loading ? 'Processing...' : 'Confirm Renewal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenewModal;
