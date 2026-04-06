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
                  <path d="M12,6C13.11,6 14,5.1 14,4C14,3.62 13.9,3.27 13.71,2.97L12,0L10.29,2.97C10.1,3.27 10,3.62 10,4A2,2 0 0,0 12,6M16.6,16L15.53,14.92L14.45,16C13.15,17.29 10.87,17.3 9.56,16L8.5,14.92L7.4,16C6.75,16.64 5.88,17 4.96,17C4.23,17 3.56,16.77 3,16.39V21A1,1 0 0,0 4,22H20A1,1 0 0,0 21,21V16.39C20.44,16.77 19.77,17 19.04,17C18.12,17 17.25,16.64 16.6,16M18,9H13V7H11V9H6A3,3 0 0,0 3,12V13.54C3,14.62 3.88,15.5 4.96,15.5C5.5,15.5 6,15.3 6.34,14.93L8.5,12.8L10.61,14.93C11.35,15.67 12.64,15.67 13.38,14.93L15.5,12.8L17.65,14.93C18,15.3 18.5,15.5 19.03,15.5C20.11,15.5 21,14.62 21,13.54V12A3,3 0 0,0 18,9Z" />
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