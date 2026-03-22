import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserTable from '../components/UserTable';
import ExpiryList from '../components/ExpiryList';
import SearchBar from '../components/SearchBar';
import StatsCards from '../components/StatsCards';
import RenewModal from '../components/RenewModal';
import { getUsers, getExpiringUsers, getStats, deleteUser, renewUser } from '../services/api';

const Dashboard = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [expiringUsers, setExpiringUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modals state
  const [renewTarget, setRenewTarget] = useState(null); // stores user obj

  // Debounce search
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData(searchTerm);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchData = async (search = '') => {
    try {
      setLoading(true);
      const [usersRes, expiringRes, statsRes] = await Promise.all([
        getUsers(search),
        search ? Promise.resolve({ data: expiringUsers }) : getExpiringUsers(3),
        search ? Promise.resolve({ data: stats }) : getStats()
      ]);
      setUsers(usersRes.data);
      if (!search) {
        setExpiringUsers(expiringRes.data);
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      fetchData(); // Reset totally
    } catch (error) {
      alert("Failed to delete user.");
    }
  };

  const handleRenew = async (planType, price, startDate) => {
    try {
      await renewUser(renewTarget._id, { planType, price, startDate });
      fetchData();
    } catch (error) {
      alert("Failed to renew user.");
    }
  };

  return (
    <div className="h-screen flex flex-col pt-5 pb-0 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden relative">
      {/* Header (Fixed Top Half) */}
      <div className="shrink-0 space-y-4 flex flex-col relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt="Akhara Gym Logo"
              className="w-20 h-auto [filter:invert(1)] mix-blend-screen"
            />
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight leading-tight">Akhara Gym</h1>
              <p className="text-slate-500 text-xs font-medium text-center sm:text-left">Dashboard & Member Management</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 text-slate-300 text-sm font-semibold rounded-xl hover:bg-slate-700 hover:text-white border border-slate-700/50 transition-all active:scale-95 group"
              title="Lock Application"
            >
              <svg className="w-5 h-5 text-slate-500 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              Lock App
            </button>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-rose-500/10 text-rose-500 text-sm font-semibold rounded-xl hover:bg-rose-500/20 border border-rose-500/20 transition-all active:scale-95">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Expiring Soon ({expiringUsers.length})
            </button>
            <Link to="/add" className="shrink-0 flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-blue-600 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
              New Member
            </Link>
          </div>
        </div>

        <StatsCards stats={stats} />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pb-1">
          <h2 className="text-lg font-semibold text-slate-200">Active Directory</h2>
          <SearchBar onSearch={setSearchTerm} />
        </div>
      </div>

      {/* Main Table */}
      <div className="mt-2 flex-1 min-h-0 pb-4">
        {loading ? (
          <div className="h-64 flex items-center justify-center bg-card/20 rounded-2xl border border-slate-800">
            <div className="w-10 h-10 border-4 border-slate-700 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <UserTable users={users} onRenew={setRenewTarget} onDelete={handleDelete} />
        )}
      </div>

      {/* Expiry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center p-5 border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-500/20 rounded-lg">
                  <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wider">Expiring Soon</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors bg-slate-800/80 hover:bg-slate-700 rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-slate-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <ExpiryList users={expiringUsers} />
            </div>
          </div>
        </div>
      )}

      {/* Renew Modal */}
      <RenewModal
        isOpen={!!renewTarget}
        onClose={() => setRenewTarget(null)}
        userName={renewTarget?.name}
        onRenew={handleRenew}
      />

    </div>
  );
};

export default Dashboard;
