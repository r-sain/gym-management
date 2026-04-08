import React, { useState, useMemo } from 'react';
import Badge from './Badge';
import { calculateDaysLeft, formatDate } from '../utils/date';

const sendWhatsAppReminder = user => {
  const phoneNumber = `91${user.phone}`; // Assuming +91 for India
  const diffTime =
    new Date(user.plan?.endDate).getTime() - new Date().getTime();
  const rawDaysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let dayText = '';
  if (rawDaysLeft < 0) dayText = 'expired';
  else if (rawDaysLeft === 0) dayText = 'expiring today';
  else dayText = `expiring in ${rawDaysLeft} days`;

  const message = `Hi *${user.name}*, this is a reminder from *Akhara Gym*. Your membership is *${dayText}*. Please visit the gym to renew your plan.  Let's keep growing together!`;

  const encodedMessage = encodeURIComponent(message);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const waUrl = isMobile
    ? `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

  window.open(waUrl, '_blank');
};

const sendBirthdayWish = user => {
  const phoneNumber = `91${user.phone}`; // Assuming +91 for India

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentYear = today.getFullYear();
  const birthDate = new Date(user.birthdate);

  // Calculate days until birthday this year
  const birthdayThisYear = new Date(
    currentYear,
    birthDate.getMonth(),
    birthDate.getDate(),
  );
  const diffTime = birthdayThisYear.getTime() - today.getTime();
  const daysUntilBirthday = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let birthdayMessage = '';
  if (daysUntilBirthday === -1) {
    birthdayMessage = `🎂 Belated Happy Birthday ${user.name}! 🎈\n\nWe missed celebrating your special day yesterday, but better late than never! Wishing you a fantastic year ahead filled with health, happiness, and amazing fitness achievements.\n\nWarm belated birthday wishes from *Akhara Gym* team! 🏋️‍♂️💪`;
  } else if (daysUntilBirthday === 0) {
    birthdayMessage = `🎉 Happy Birthday ${user.name}! 🎂\n\nWishing you a fantastic birthday filled with joy, health, and success! May this year bring you even more strength and achievements.\n\nFrom all of us at *Akhara Gym* 🏋️‍♂️💪`;
  } else if (daysUntilBirthday === 1) {
    birthdayMessage = `🎈 Tomorrow is your special day, ${user.name}! 🎂\n\nWe're excited to celebrate your birthday with you! Get ready for an amazing year ahead filled with fitness goals achieved and personal bests.\n\n*Team Akhara Gym* wishes you a wonderful birthday! 🏋️‍♂️🎉`;
  } else {
    birthdayMessage = `🎂 Your birthday is coming up in ${daysUntilBirthday} days, ${user.name}! 🎈\n\nWe can't wait to celebrate this special occasion with you! Keep up the great work at the gym - you're inspiring us all!\n\nWarm birthday wishes from *Akhara Gym* team! 🏋️‍♂️💪`;
  }

  const encodedMessage = encodeURIComponent(birthdayMessage);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const waUrl = isMobile
    ? `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

  window.open(waUrl, '_blank');
};

const isBirthdaySoon = user => {
  if (!user.birthdate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentYear = today.getFullYear();
  const birthDate = new Date(user.birthdate);

  // Calculate birthday this year
  const birthdayThisYear = new Date(
    currentYear,
    birthDate.getMonth(),
    birthDate.getDate(),
  );

  const diffTime = birthdayThisYear.getTime() - today.getTime();
  let daysUntilBirthday = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysUntilBirthday < -1) {
    // Birthday was more than 1 day ago, check next year
    birthdayThisYear.setFullYear(currentYear + 1);
    const newDiffTime = birthdayThisYear.getTime() - today.getTime();
    daysUntilBirthday = Math.ceil(newDiffTime / (1000 * 60 * 60 * 24));
  }

  return daysUntilBirthday >= -1 && daysUntilBirthday <= 1;
};

const UserTable = ({ users, onRenew, onDelete, onViewProfile, onUpdateDue }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [editingDueId, setEditingDueId] = useState(null);
  const [editingDueAmount, setEditingDueAmount] = useState('');

  const handleDueSubmit = (e, userId) => {
    e.preventDefault();
    if (onUpdateDue) {
      onUpdateDue(userId, Number(editingDueAmount));
    }
    setEditingDueId(null);
  };

  const handleDueKeyDown = (e, userId) => {
    if (e.key === 'Escape') setEditingDueId(null);
  };

  const sortedUsers = useMemo(() => {
    let sortableItems = [...users];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === 'expiry' || sortConfig.key === 'status') {
          aValue = new Date(a.plan?.endDate).getTime();
          bValue = new Date(b.plan?.endDate).getTime();
        } else if (sortConfig.key === 'startDate') {
          aValue = new Date(a.plan?.startDate).getTime();
          bValue = new Date(b.plan?.startDate).getTime();
        } else if (sortConfig.key === 'payment') {
          aValue = new Date(a.lastPaymentDate || a.createdAt).getTime();
          bValue = new Date(b.lastPaymentDate || b.createdAt).getTime();
        } else if (sortConfig.key === 'due') {
          aValue = a.dueAmount || 0;
          bValue = b.dueAmount || 0;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [users, sortConfig]);

  const requestSort = key => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc')
      direction = 'desc';
    setSortConfig({ key, direction });
  };

  const getSortIcon = key => {
    if (sortConfig.key !== key)
      return (
        <span className="opacity-30 inline-block w-3 ml-1 text-[10px]">↕</span>
      );
    return sortConfig.direction === 'asc' ? (
      <span className="text-primary inline-block w-3 ml-1 text-sm font-black">
        ↑
      </span>
    ) : (
      <span className="text-primary inline-block w-3 ml-1 text-sm font-black">
        ↓
      </span>
    );
  };

  if (!users || users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400 bg-card/50 rounded-2xl border border-slate-700/50">
        <svg
          className="w-12 h-12 mb-4 text-slate-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          ></path>
        </svg>
        <p className="text-lg font-medium">No members found.</p>
        <p className="text-sm mt-1">
          Try to search for another name or add a new member.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-auto h-full bg-card rounded-2xl border border-slate-700/50 shadow-xl custom-scrollbar">
      <table className="w-full text-sm text-left text-slate-300">
        <thead className="sticky top-0 z-10 text-xs uppercase bg-slate-800/95 backdrop-blur-md text-slate-400 border-b border-slate-700/50 shadow-sm">
          <tr>
            <th scope="col" className="px-4 py-3">
              Name
            </th>
            <th scope="col" className="px-4 py-3">
              Phone
            </th>
            <th scope="col" className="px-4 py-3">
              Plan & Price
            </th>
            <th
              scope="col"
              className="px-4 py-3 cursor-pointer hover:text-white transition-colors text-right"
              onClick={() => requestSort('due')}
              title="Sort by Due Amount"
            >
              Due {getSortIcon('due')}
            </th>
            <th
              scope="col"
              className="px-4 py-3 cursor-pointer hover:text-white transition-colors"
              onClick={() => requestSort('payment')}
              title="Sort by Payment Date"
            >
              Payment {getSortIcon('payment')}
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-xs cursor-pointer hover:text-white transition-colors"
              onClick={() => requestSort('startDate')}
              title="Sort by Plan Start Date"
            >
              Plan Start {getSortIcon('startDate')}
            </th>
            <th
              scope="col"
              className="px-4 py-3 cursor-pointer hover:text-white transition-colors"
              onClick={() => requestSort('expiry')}
              title="Sort by Expiry"
            >
              Expiry {getSortIcon('expiry')}
            </th>
            <th
              scope="col"
              className="px-4 py-3 cursor-pointer hover:text-white transition-colors"
              onClick={() => requestSort('status')}
              title="Sort by Status"
            >
              Status {getSortIcon('status')}
            </th>
            <th scope="col" className="px-4 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {sortedUsers.map(user => {
            const daysLeftStr =
              user.daysLeft ||
              calculateDaysLeft(user.plan?.endDate, user.plan?.startDate);
            const diffTime =
              new Date(user.plan?.endDate).getTime() - new Date().getTime();
            const rawDaysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            const canRenew = rawDaysLeft <= 3;

            return (
              <tr
                key={user._id}
                className="hover:bg-slate-800/30 transition-colors duration-150 group"
              >
                <td className="px-4 py-3 font-medium text-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewProfile(user)}
                      className="flex items-center gap-2 hover:text-primary transition-colors text-left font-bold"
                      title="View Full Profile"
                    >
                      {user.name}
                    </button>
                    {isBirthdaySoon(user) && (
                      <button
                        onClick={() => sendBirthdayWish(user)}
                        className="flex items-center justify-center w-6 h-6 bg-orange-500/20 hover:bg-orange-500/30 rounded-full transition-all group/birthday"
                        title="Birthday! Click to send wishes"
                      >
                        <svg
                          className="w-4 h-4 text-orange-400 group-hover/birthday:text-orange-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12,6C13.11,6 14,5.1 14,4C14,3.62 13.9,3.27 13.71,2.97L12,0L10.29,2.97C10.1,3.27 10,3.62 10,4A2,2 0 0,0 12,6M16.6,16L15.53,14.92L14.45,16C13.15,17.29 10.87,17.3 9.56,16L8.5,14.92L7.4,16C6.75,16.64 5.88,17 4.96,17C4.23,17 3.56,16.77 3,16.39V21A1,1 0 0,0 4,22H20A1,1 0 0,0 21,21V16.39C20.44,16.77 19.77,17 19.04,17C18.12,17 17.25,16.64 16.6,16M18,9H13V7H11V9H6A3,3 0 0,0 3,12V13.54C3,14.62 3.88,15.5 4.96,15.5C5.5,15.5 6,15.3 6.34,14.93L8.5,12.8L10.61,14.93C11.35,15.67 12.64,15.67 13.38,14.93L15.5,12.8L17.65,14.93C18,15.3 18.5,15.5 19.03,15.5C20.11,15.5 21,14.62 21,13.54V12A3,3 0 0,0 18,9Z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-300">{user.phone}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded text-xs font-semibold border border-slate-700">
                    {user.plan?.type || '-'}
                  </span>
                  <div className="text-xs text-amber-400 mt-1.5 font-medium ml-1 flex items-center">
                    {(
                      user.currentPlanPrice ||
                      user.price ||
                      0
                    ).toLocaleString()}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-400 whitespace-nowrap relative text-right">
                  {editingDueId === user._id ? (
                    <form onSubmit={(e) => handleDueSubmit(e, user._id)} className="flex items-center justify-end gap-1">
                      <input
                        autoFocus
                        type="number"
                        min="0"
                        className="w-16 px-1.5 py-1 text-xs bg-slate-900 border border-primary rounded text-white focus:outline-none focus:ring-1 focus:ring-primary text-right"
                        value={editingDueAmount}
                        onChange={(e) => setEditingDueAmount(e.target.value)}
                        onBlur={(e) => handleDueSubmit(e, user._id)}
                        onKeyDown={(e) => handleDueKeyDown(e, user._id)}
                      />
                    </form>
                  ) : (
                    <div 
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setEditingDueId(user._id);
                        setEditingDueAmount(user.dueAmount || 0);
                      }}
                      className="cursor-pointer group flex items-center justify-end gap-1.5 min-w-[3rem]"
                      title="Click to edit due amount"
                    >
                      <span className={`text-xs font-bold ${user.dueAmount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {(user.dueAmount || 0).toLocaleString()}
                      </span>
                      <svg className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-400 whitespace-nowrap text-xs">
                  {formatDate(user.lastPaymentDate || user.createdAt)}
                </td>
                <td className="px-4 py-3 text-slate-400 whitespace-nowrap font-medium text-xs">
                  {formatDate(user.plan?.startDate)}
                </td>
                <td className="px-4 py-3 text-slate-400 whitespace-nowrap font-medium text-xs">
                  {formatDate(user.plan?.endDate)}
                </td>
                <td className="px-4 py-3">
                  <Badge text={daysLeftStr} />
                </td>
                <td className="px-4 py-3 flex gap-2 items-center text-xs">
                  {(() => {
                    const canRenew = rawDaysLeft <= 3;
                    return (
                      <button
                        disabled={!canRenew}
                        onClick={() => {
                          if (rawDaysLeft > 0) {
                            if (
                              window.confirm(
                                `This member still has ${rawDaysLeft} days left. Are you sure you want to renew now?`,
                              )
                            ) {
                              onRenew(user);
                            }
                          } else {
                            onRenew(user);
                          }
                        }}
                        className={`${
                          canRenew
                            ? 'text-primary hover:text-blue-400 font-semibold cursor-pointer'
                            : 'text-slate-600 cursor-not-allowed opacity-50'
                        } transition-colors uppercase`}
                        title={
                          canRenew
                            ? 'Renew Plan'
                            : `Too early to renew (Expires in ${rawDaysLeft} days)`
                        }
                      >
                        Renew
                      </button>
                    );
                  })()}
                  <span className="text-slate-500 select-none mx-2 opacity-20">
                    |
                  </span>
                  <button
                    disabled={!canRenew}
                    onClick={() => sendWhatsAppReminder(user)}
                    className={`p-1.5 rounded-lg transition-all shadow-sm ${
                      canRenew
                        ? 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white cursor-pointer'
                        : 'bg-slate-600/20 text-slate-500 cursor-not-allowed opacity-50'
                    }`}
                    title={
                      canRenew
                        ? 'Send WhatsApp Reminder'
                        : `Cannot send reminder (Expires in ${rawDaysLeft} days)`
                    }
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </button>
                  <span className="text-slate-500 select-none mx-2 opacity-40">
                    |
                  </span>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you want to delete this user completely?',
                        )
                      )
                        onDelete(user._id);
                    }}
                    className="text-rose-500/70 hover:text-rose-500 font-semibold transition-colors text-xs uppercase"
                    title="Delete User"
                  >
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
