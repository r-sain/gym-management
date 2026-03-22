import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === '560066') {
      onLogin();
    } else {
      setError('Incorrect PIN');
      setPin('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark p-4 font-sans">
      <div className="bg-card border border-slate-700/50 p-8 sm:p-10 rounded-3xl w-full max-w-sm shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-3xl rounded-full pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex justify-center mb-0">
             <img src="/logo.png" alt="Akhara Gym" className="w-32 h-auto [filter:invert(1)] mix-blend-screen" />
          </div>
          <h2 className="text-3xl font-extrabold text-white text-center mb-2">Akhara Gym</h2>
          <p className="text-slate-400 text-sm text-center mb-8 pr-1">Enter your 6-digit PIN to continue</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="password"
                maxLength="6"
                placeholder="------"
                value={pin}
                onChange={(e) => {
                  setError('');
                  setPin(e.target.value.replace(/\D/g, ''));
                }}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-4 text-center text-3xl tracking-[0.75em] indent-[0.75em] text-slate-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-700/50"
              />
              {error && <p className="text-rose-500 text-sm text-center mt-3 font-medium animate-pulse">{error}</p>}
            </div>
            
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-blue-600 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-lg shadow-blue-500/20"
            >
              Verify PIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
