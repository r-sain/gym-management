import React from 'react';

const StatsCards = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full mb-4">
      <div className="bg-card/80 backdrop-blur-md rounded-xl p-4 border border-slate-700/50 shadow">
        <p className="text-slate-400 text-xs font-semibold tracking-wide uppercase">Total Members</p>
        <p className="text-2xl font-extrabold text-blue-400 mt-1">{stats.totalMembers || 0}</p>
      </div>
      <div className="bg-card/80 backdrop-blur-md rounded-xl p-4 border border-slate-700/50 shadow">
        <p className="text-slate-400 text-xs font-semibold tracking-wide uppercase">Active Members</p>
        <p className="text-2xl font-extrabold text-emerald-400 mt-1">{stats.activeMembers || 0}</p>
      </div>
      <div className="bg-card/80 backdrop-blur-md rounded-xl p-4 border border-slate-700/50 shadow">
        <p className="text-slate-400 text-xs font-semibold tracking-wide uppercase">Expired Members</p>
        <p className="text-2xl font-extrabold text-rose-500 mt-1">{stats.expiredMembers || 0}</p>
      </div>
    </div>
  );
};

export default StatsCards;
