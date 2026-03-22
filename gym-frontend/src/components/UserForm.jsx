import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../services/api';

const UserForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    planType: '1M',
    price: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createUser({ ...formData, price: Number(formData.price) });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-slate-700/50 rounded-3xl p-8 sm:p-10 max-w-xl mx-auto shadow-2xl w-full relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-3xl rounded-full pointer-events-none"></div>

      <div className="relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">New Member</h2>
        <p className="text-slate-400 text-sm mb-8">Register a new client to your gym management system.</p>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 rounded-xl text-sm text-rose-400">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2 pl-1">Full Name <span className="text-rose-500">*</span></label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-slate-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-slate-600"
              placeholder="e.g. John Doe" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2 pl-1">Phone Number <span className="text-rose-500">*</span></label>
            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange}
              pattern="[0-9]{10}" maxLength="10" title="Please enter exactly 10 digits"
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-slate-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-slate-600"
              placeholder="e.g. 9876543210" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2 pl-1">Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-slate-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-slate-600"
              placeholder="e.g. Burdwan, West Bengal" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2 pl-1">Start Date <span className="text-rose-500">*</span></label>
            <input required type="date" name="startDate" value={formData.startDate} onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-slate-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 pl-1">Subscription <span className="text-rose-500">*</span></label>
              <div className="relative">
                <select name="planType" value={formData.planType} onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-slate-100 appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer">
                  <option value="1M">1 Month Plan</option>
                  <option value="3M">3 Months Plan</option>
                  <option value="6M">6 Months Plan </option>
                  <option value="1Y">1 Year / Annual</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-primary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 pl-1">Amount Paid (₹) <span className="text-rose-500">*</span></label>
              <input required type="number" min="0" name="price" value={formData.price} onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-slate-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-slate-600"
                placeholder="0" />
            </div>
          </div>



        </div>

        <div className="mt-8 pt-6 border-t border-slate-700/50 flex items-center justify-end gap-4">
          <button type="button" onClick={() => navigate('/')} className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-8 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-blue-600 focus:ring-4 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20">
            {loading ? 'Processing...' : 'Register Member'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default UserForm;
