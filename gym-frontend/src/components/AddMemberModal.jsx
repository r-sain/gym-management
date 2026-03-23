import React, { useState } from 'react';
import { createUser } from '../services/api';

const AddMemberModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    planType: '1M',
    price: '',
    startDate: new Date().toISOString().split('T')[0],
    paymentDate: new Date().toISOString().split('T')[0],
    guardianName: '',
    alternatePhone: '',
    bloodGroup: '',
    birthdate: '',
    enrollmentFees: '',
    discountReason: '',
    billNumber: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createUser({ ...formData, price: Number(formData.price) });
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        name: '',
        phone: '',
        address: '',
        planType: '1M',
        price: '',
        startDate: new Date().toISOString().split('T')[0],
        paymentDate: new Date().toISOString().split('T')[0],
        guardianName: '',
        alternatePhone: '',
        bloodGroup: '',
        birthdate: '',
        enrollmentFees: '',
        discountReason: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-card border border-slate-700/50 rounded-3xl shadow-2xl w-full max-w-xl max-h-[95vh] flex flex-col relative animate-in fade-in zoom-in duration-200">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-3xl rounded-full pointer-events-none"></div>

        <div className="p-5 sm:p-7 border-b border-slate-700/50 relative z-10 flex justify-between items-center">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-0.5">New Member</h2>
            <p className="text-slate-500 text-xs">Register a new client to your gym.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-7 custom-scrollbar">
          {error && (
            <div className="mb-5 p-3 bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 rounded-xl text-xs text-rose-400">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
            </div>
          )}

          <form id="add-member-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-1">Full Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-primary transition-all placeholder-slate-600"
                  placeholder="John Doe" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-1">WhatsApp No. <span className="text-rose-500">*</span></label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  pattern="[0-9]{10}" maxLength="10" title="10 digits required"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-primary transition-all placeholder-slate-600"
                  placeholder="9876543210" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-1">Guardian's Name</label>
                <input type="text" name="guardianName" value={formData.guardianName} onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-primary transition-all placeholder-slate-600"
                  placeholder="e.g. Robert Doe" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-1">Alt. Phone Number</label>
                <input type="tel" name="alternatePhone" value={formData.alternatePhone} onChange={handleChange}
                  pattern="[0-9]{10}" maxLength="10"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-primary transition-all placeholder-slate-600"
                  placeholder="9876543210" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-1">Blood Group</label>
                <div className="relative">
                  <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 appearance-none focus:outline-none focus:border-primary transition-all cursor-pointer">
                    <option value="">Select Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-primary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-1">Birthdate</label>
                <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-primary transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-1">Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-primary transition-all placeholder-slate-600"
                placeholder="Street address, City" />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-1">Payment Date</label>
                <input required type="date" name="paymentDate" value={formData.paymentDate} onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-primary transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-1">Plan Start</label>
                <input required type="date" name="startDate" value={formData.startDate} onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-primary transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-1">Subscription</label>
                <div className="relative">
                  <select name="planType" value={formData.planType} onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 appearance-none focus:outline-none focus:border-primary transition-all cursor-pointer">
                    <option value="1M">1 Month</option>
                    <option value="3M">3 Months</option>
                    <option value="6M">6 Months</option>
                    <option value="1Y">1 Year</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-primary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-1">Amount Paid (₹)</label>
                <input required type="number" min="0" name="price" value={formData.price} onChange={handleChange}
                  onWheel={(e) => e.target.blur()}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-primary transition-all placeholder-slate-600"
                  placeholder="0" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-1">Enrollment Fees (₹)</label>
              <input type="number" min="0" name="enrollmentFees" value={formData.enrollmentFees} onChange={handleChange}
                onWheel={(e) => e.target.blur()}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-primary transition-all placeholder-slate-600"
                placeholder="Entry fees if applicable" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-1">Bill Number</label>
              <input required type="text" name="billNumber" value={formData.billNumber} onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-primary transition-all placeholder-slate-600"
                placeholder="e.g. 2024/001" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-1">Discount Reason / Special Note</label>
              <textarea name="discountReason" value={formData.discountReason} onChange={handleChange} rows="2"
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-primary transition-all placeholder-slate-600 resize-none"
                placeholder="Why was a discount given?" />
            </div>

          </form>
        </div>

        <div className="p-4 sm:p-6 border-t border-slate-700/50 flex items-center justify-end gap-3 bg-slate-900/20 rounded-b-3xl">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-5 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="add-member-form"
            disabled={loading} 
            className="px-7 py-2 rounded-xl text-sm font-bold text-white bg-primary hover:bg-blue-600 focus:ring-4 focus:ring-blue-500/20 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20 active:scale-95"
          >
            {loading ? 'Processing...' : 'Register Member'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
