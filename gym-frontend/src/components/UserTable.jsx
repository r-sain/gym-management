import React, { useState, useMemo } from 'react';
import Badge from './Badge';
import { calculateDaysLeft, formatDate } from '../utils/date';

const sendWhatsAppReminder = (user) => {
  const phoneNumber = `91${user.phone}`; // Assuming +91 for India
  const diffTime = new Date(user.plan?.endDate).getTime() - new Date().getTime();
  const rawDaysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let dayText = '';
  if (rawDaysLeft < 0) dayText = 'expired';
  else if (rawDaysLeft === 0) dayText = 'expiring today';
  else dayText = `expiring in ${rawDaysLeft} days`;

  const message = `Hi *${user.name}*, this is a reminder from *Akhara Gym*. Your membership is *${dayText}*. Please visit the gym to renew your plan!`;
  
  const encodedMessage = encodeURIComponent(message);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const waUrl = isMobile 
    ? `https://wa.me/${phoneNumber}?text=${encodedMessage}` 
    : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

  window.open(waUrl, '_blank');
};

const UserTable = ({ users, onRenew, onDelete }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortedUsers = useMemo(() => {
    let sortableItems = [...users];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === 'expiry' || sortConfig.key === 'status') {
          aValue = new Date(a.plan?.endDate).getTime();
          bValue = new Date(b.plan?.endDate).getTime();
        }
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [users, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <span className="opacity-30 inline-block w-3 ml-1 text-[10px]">↕</span>;
    return sortConfig.direction === 'asc' ? <span className="text-primary inline-block w-3 ml-1 text-sm font-black">↑</span> : <span className="text-primary inline-block w-3 ml-1 text-sm font-black">↓</span>;
  };

  if (!users || users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400 bg-card/50 rounded-2xl border border-slate-700/50">
        <svg className="w-12 h-12 mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        <p className="text-lg font-medium">No members found.</p>
        <p className="text-sm mt-1">Try to search for another name or add a new member.</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto h-full bg-card rounded-2xl border border-slate-700/50 shadow-xl custom-scrollbar">
      <table className="w-full text-sm text-left text-slate-300">
        <thead className="sticky top-0 z-10 text-xs uppercase bg-slate-800/95 backdrop-blur-md text-slate-400 border-b border-slate-700/50 shadow-sm">
          <tr>
            <th scope="col" className="px-6 py-4">Name</th>
            <th scope="col" className="px-6 py-4">Phone</th>
            <th scope="col" className="px-6 py-4">Plan & Price</th>
            <th scope="col" className="px-6 py-4">Last Payment</th>
            <th scope="col" className="px-6 py-4 cursor-pointer hover:text-white transition-colors select-none" onClick={() => requestSort('expiry')} title="Sort by Expiry">
              Expiry Date {getSortIcon('expiry')}
            </th>
            <th scope="col" className="px-6 py-4 cursor-pointer hover:text-white transition-colors select-none" onClick={() => requestSort('status')} title="Sort by Status">
              Status {getSortIcon('status')}
            </th>
            <th scope="col" className="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {sortedUsers.map((user) => {
            const daysLeftStr = user.daysLeft || calculateDaysLeft(user.plan?.endDate);
            const diffTime = new Date(user.plan?.endDate).getTime() - new Date().getTime();
            const rawDaysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            return (
              <tr key={user._id} className="hover:bg-slate-800/30 transition-colors duration-150 group">
                <td className="px-6 py-4 font-medium text-slate-100 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {user.name}
                  </div>
                  {user.address && (
                    <div 
                      className="text-xs font-normal text-slate-500 mt-1 max-w-[200px] truncate" 
                      title={user.address}
                    >
                      {user.address}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-300">{user.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded text-xs font-semibold border border-slate-700">{user.plan?.type || '-'}</span>
                  <div className="text-xs text-amber-400 mt-1.5 font-medium ml-1 flex items-center">
                    ₹{(user.currentPlanPrice || user.price || 0).toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                  {formatDate(user.updatedAt || user.createdAt || user.plan?.startDate)}
                </td>
                <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                  {formatDate(user.plan?.endDate)}
                </td>
                <td className="px-6 py-4">
                  <Badge text={daysLeftStr} />
                </td>
                <td className="px-6 py-4 flex gap-4 items-center">
                  {rawDaysLeft <= 1 && (
                    <>
                      <button onClick={() => onRenew(user)} className="text-primary hover:text-blue-400 font-semibold transition-colors text-xs uppercase" title="Renew Plan">
                        Renew
                      </button>
                      <span className="text-slate-500 select-none mx-2 opacity-40">|</span>
                    </>
                  )}
                  <button 
                    onClick={() => sendWhatsAppReminder(user)}
                    className="p-1.5 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all shadow-sm"
                    title="Send WhatsApp Reminder"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </button>
                  <span className="text-slate-500 select-none mx-2 opacity-40">|</span>
                  <button onClick={() => { if(window.confirm('Are you sure you want to delete this user completely?')) onDelete(user._id) }} className="text-rose-500/70 hover:text-rose-500 font-semibold transition-colors text-xs uppercase" title="Delete User">
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
