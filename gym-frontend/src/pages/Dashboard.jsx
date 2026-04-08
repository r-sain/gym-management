import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserTable from '../components/UserTable';
import ExpiryList from '../components/ExpiryList';
import BirthdayList from '../components/BirthdayList';
import SearchBar from '../components/SearchBar';
import StatsCards from '../components/StatsCards';
import RenewModal from '../components/RenewModal';
import AddMemberModal from '../components/AddMemberModal';
import UserDetailsModal from '../components/UserDetailsModal';
import LifterLoader from '../components/LifterLoader';
import {
  getUsers,
  getExpiringUsers,
  getBirthdayUsers,
  getStats,
  deleteUser,
  renewUser,
  updatePhoto,
  exportUsers,
  updateUser,
} from '../services/api';

const Dashboard = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [expiringUsers, setExpiringUsers] = useState([]);
  const [birthdayUsers, setBirthdayUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [takingLong, setTakingLong] = useState(false);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Modals state
  const [renewTarget, setRenewTarget] = useState(null); // stores user obj
  const [viewTarget, setViewTarget] = useState(null);

  // Debounce search
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Handle slow loading (cold start) feedback
  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => {
        setTakingLong(true);
      }, 3000); // 3 seconds
    } else {
      setTakingLong(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData(searchTerm);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchData = async (search = '', currentRetry = 0) => {
    try {
      setLoading(true);
      setError(false);
      const [usersRes, expiringRes, birthdayRes, statsRes] = await Promise.all([
        getUsers(search),
        search ? Promise.resolve({ data: expiringUsers }) : getExpiringUsers(3),
        search ? Promise.resolve({ data: birthdayUsers }) : getBirthdayUsers(3),
        search ? Promise.resolve({ data: stats }) : getStats(),
      ]);
      // Capitalize names for display
      const capitalizeName = u => ({ ...u, name: u.name?.toUpperCase() || '' });
      setUsers(usersRes.data.map(capitalizeName));
      if (!search) {
        setExpiringUsers(expiringRes.data.map(capitalizeName));
        setBirthdayUsers(birthdayRes.data.map(capitalizeName));
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);

      // Auto-retry once if it fails on the first load (likely cold start)
      if (currentRetry < 1 && !search) {
        setTimeout(() => fetchData(search, currentRetry + 1), 2000); // Wait 2s and try again
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    try {
      await deleteUser(id);
      fetchData(); // Reset totally
    } catch (error) {
      alert('Failed to delete user.');
    }
  };

  const handleRenew = async (
    planType,
    price,
    startDate,
    paymentDate,
    billNumber,
    dueAmount,
  ) => {
    try {
      await renewUser(renewTarget._id, {
        planType,
        price,
        startDate,
        paymentDate,
        billNumber,
        dueAmount,
      });
      fetchData();
    } catch (error) {
      alert('Failed to renew user.');
    }
  };

  const handleUpdateDue = async (id, dueAmount) => {
    try {
      await updateUser(id, { dueAmount });
      fetchData();
    } catch (error) {
      console.error('Failed to update due amount:', error);
      alert('Failed to update due amount.');
    }
  };

  const handleSavePhoto = async (userId, photo) => {
    try {
      await updatePhoto(userId, photo);
      fetchData();
    } catch (error) {
      console.error('Failed to save photo:', error);
    }
  };

  const handleUserUpdated = updatedUser => {
    const uppercaseUser = { ...updatedUser, name: updatedUser.name?.toUpperCase() || '' };
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user._id === uppercaseUser._id ? uppercaseUser : user,
      ),
    );
    if (viewTarget && viewTarget._id === uppercaseUser._id) {
      setViewTarget(uppercaseUser);
    }
  };

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      await exportUsers();
    } catch (error) {
      alert('Failed to export data. Please try again.');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
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
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight leading-tight">
                Akhara Gym
              </h1>
              <p className="text-slate-500 text-xs font-medium text-center sm:text-left">
                Dashboard & Member Management
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 text-slate-300 text-sm font-semibold rounded-xl hover:bg-slate-700 hover:text-white border border-slate-700/50 transition-all active:scale-95 group"
              title="Lock Application"
            >
              <svg
                className="w-5 h-5 text-slate-500 group-hover:text-primary transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
              Lock App
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-500/10 text-rose-500 text-sm font-semibold rounded-xl hover:bg-rose-500/20 border border-rose-500/20 transition-all active:scale-95"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              Expiring Soon ({expiringUsers.length})
            </button>{' '}
            <button
              onClick={() => setIsBirthdayModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-orange-500/10 text-orange-500 text-sm font-semibold rounded-xl hover:bg-orange-500/20 border border-orange-500/20 transition-all active:scale-95"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,6C13.11,6 14,5.1 14,4C14,3.62 13.9,3.27 13.71,2.97L12,0L10.29,2.97C10.1,3.27 10,3.62 10,4A2,2 0 0,0 12,6M16.6,16L15.53,14.92L14.45,16C13.15,17.29 10.87,17.3 9.56,16L8.5,14.92L7.4,16C6.75,16.64 5.88,17 4.96,17C4.23,17 3.56,16.77 3,16.39V21A1,1 0 0,0 4,22H20A1,1 0 0,0 21,21V16.39C20.44,16.77 19.77,17 19.04,17C18.12,17 17.25,16.64 16.6,16M18,9H13V7H11V9H6A3,3 0 0,0 3,12V13.54C3,14.62 3.88,15.5 4.96,15.5C5.5,15.5 6,15.3 6.34,14.93L8.5,12.8L10.61,14.93C11.35,15.67 12.64,15.67 13.38,14.93L15.5,12.8L17.65,14.93C18,15.3 18.5,15.5 19.03,15.5C20.11,15.5 21,14.62 21,13.54V12A3,3 0 0,0 18,9Z" />
              </svg>
              Birthdays ({birthdayUsers.length})
            </button>{' '}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="shrink-0 flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-blue-600 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              New Member
            </button>
          </div>
        </div>

        <StatsCards stats={stats} />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pb-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-200">
              Active Directory
            </h2>
            <button
              onClick={handleExportExcel}
              disabled={isExporting}
              className="flex items-center justify-center w-8 h-8 bg-slate-800/50 text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white border border-slate-700/50 transition-all active:scale-95 disabled:opacity-50"
              title={
                isExporting ? 'Exporting...' : 'Export members list as Excel'
              }
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                ></path>
              </svg>
            </button>
          </div>
          <SearchBar onSearch={setSearchTerm} />
        </div>
      </div>

      {/* Main Table */}
      <div className="mt-2 flex-1 min-h-0 pb-4">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center bg-card/20 rounded-2xl border border-slate-800 gap-4">
            <LifterLoader />
            {takingLong && (
              <div className="text-center animate-pulse">
                <p className="text-slate-300 font-medium">
                  Waking up server...
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  This might take up to 60 seconds on the first load.
                </p>
              </div>
            )}
          </div>
        ) : error ? (
          <div className="h-64 flex flex-col items-center justify-center bg-card/20 rounded-2xl border border-rose-500/20 gap-4">
            <div className="p-3 bg-rose-500/10 rounded-full">
              <svg
                className="w-8 h-8 text-rose-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-slate-300 font-medium">
                Oops! Server is still sleepy.
              </p>
              <p className="text-slate-500 text-xs mt-1">
                We couldn't reach the gym database. Please refresh the page in a
                few seconds.
              </p>
            </div>
          </div>
        ) : (
          <UserTable
            users={users}
            onRenew={setRenewTarget}
            onDelete={handleDelete}
            onViewProfile={setViewTarget}
            onUpdateDue={handleUpdateDue}
          />
        )}
      </div>

      {/* Expiry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center p-5 border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-500/20 rounded-lg">
                  <svg
                    className="w-5 h-5 text-rose-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wider">
                  Expiring Soon
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors bg-slate-800/80 hover:bg-slate-700 rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <ExpiryList users={expiringUsers} />
            </div>
          </div>
        </div>
      )}

      {/* Birthday Modal */}
      {isBirthdayModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center p-5 border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <svg
                    className="w-5 h-5 text-orange-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12,6C13.11,6 14,5.1 14,4C14,3.62 13.9,3.27 13.71,2.97L12,0L10.29,2.97C10.1,3.27 10,3.62 10,4A2,2 0 0,0 12,6M16.6,16L15.53,14.92L14.45,16C13.15,17.29 10.87,17.3 9.56,16L8.5,14.92L7.4,16C6.75,16.64 5.88,17 4.96,17C4.23,17 3.56,16.77 3,16.39V21A1,1 0 0,0 4,22H20A1,1 0 0,0 21,21V16.39C20.44,16.77 19.77,17 19.04,17C18.12,17 17.25,16.64 16.6,16M18,9H13V7H11V9H6A3,3 0 0,0 3,12V13.54C3,14.62 3.88,15.5 4.96,15.5C5.5,15.5 6,15.3 6.34,14.93L8.5,12.8L10.61,14.93C11.35,15.67 12.64,15.67 13.38,14.93L15.5,12.8L17.65,14.93C18,15.3 18.5,15.5 19.03,15.5C20.11,15.5 21,14.62 21,13.54V12A3,3 0 0,0 18,9Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wider">
                  Birthdays
                </h3>
              </div>
              <button
                onClick={() => setIsBirthdayModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors bg-slate-800/80 hover:bg-slate-700 rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <BirthdayList users={birthdayUsers} />
            </div>
          </div>
        </div>
      )}

      {/* Renew Modal */}
      <RenewModal
        isOpen={!!renewTarget}
        onClose={() => setRenewTarget(null)}
        userName={renewTarget?.name}
        currentDue={renewTarget?.dueAmount}
        onRenew={handleRenew}
      />

      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchData}
      />
      <UserDetailsModal
        isOpen={!!viewTarget}
        onClose={() => setViewTarget(null)}
        user={viewTarget}
        onPhotoSaved={handleSavePhoto}
        onUserUpdated={handleUserUpdated}
      />
    </div>
  );
};

export default Dashboard;
