import React from 'react';

const sendBirthdayWish = user => {
  const phoneNumber = `91${user.phone}`; // Assuming +91 for India

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentYear = today.getFullYear();
  const birthDate = new Date(user.birthdate);

  // Calculate days until birthday this year
  const birthdayThisYear = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
  if (birthdayThisYear < today) {
    birthdayThisYear.setFullYear(currentYear + 1);
  }
  const diffTime = birthdayThisYear.getTime() - today.getTime();
  const daysUntilBirthday = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let birthdayMessage = '';
  if (daysUntilBirthday === -1) {
    birthdayMessage = `🎂 Belated Happy Birthday ${user.name}! 🎈\n\nWe missed celebrating your special day yesterday, but better late than never! Wishing you a fantastic year ahead filled with health, happiness, and amazing fitness achievements.\n\nWarm belated birthday wishes from *Akhara Gym* team! 🏋️‍♂️💪`;
  } else if (daysUntilBirthday === 0) {
    birthdayMessage = `🎉 Happy Birthday ${user.name}! 🎂\n\nWishing you a fantastic birthday filled with joy, health, and success! May this year bring you even more strength and achievements.\n\nFrom all of us at *Akhara Gym* 🏋️‍♂️💪`;
  } else if (daysUntilBirthday === 1) {
    birthdayMessage = `🎈 Tomorrow is your special day, ${user.name}! 🎂\n\nWe're excited to celebrate your birthday with you! Get ready for an amazing year ahead filled with fitness goals achieved and personal bests.\n\n*Team Akhaba Gym* wishes you a wonderful birthday! 🏋️‍♂️🎉`;
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

const BirthdayList = ({ users }) => {
  if (!users || users.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-10">
        <p className="text-slate-500 text-sm">No birthdays coming up</p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {users.map((user) => {
        const daysText = user.daysUntilBirthday === -1 ? 'Yesterday' :
                        user.daysUntilBirthday === 0 ? 'Today' :
                        user.daysUntilBirthday === 1 ? 'Tomorrow' :
                        `In ${user.daysUntilBirthday} days`;

        return (
          <li key={user._id} className="flex justify-between items-center group/item hover:bg-slate-800/40 p-2 rounded-xl transition-all border border-transparent hover:border-slate-700/50">
            <div className="flex items-center gap-3">
              <button
                onClick={() => sendBirthdayWish(user)}
                className="p-1.5 bg-orange-500/10 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                title="Send Birthday Wish"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 6C13.1 6 14 5.1 14 4C14 2.9 13.1 2 12 2C10.9 2 10 2.9 10 4C10 5.1 10.9 6 12 6ZM8 8H16V12H8V8ZM4 14H20V16H18V20C18 21.1 17.1 22 16 22H8C6.9 22 6 21.1 6 20V16H4V14Z" />
                </svg>
              </button>
              <span className="text-sm font-medium text-slate-300 group-hover/item:text-white transition-colors cursor-default">{user.name}</span>
            </div>
            <div className="text-xs text-orange-400 font-medium bg-orange-500/10 px-2 py-1 rounded">
              {daysText}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default BirthdayList;